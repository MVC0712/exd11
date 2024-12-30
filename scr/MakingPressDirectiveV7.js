const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0"); // 月は0から始まるので+1が必要
const dd = String(today.getDate()).padStart(2, "0");

const formattedDate = `${yyyy}-${mm}-${dd}`;
// console.log(formattedDate); // 例: "2024-12-27"

var dieHoleNumber;
var billetLength;

const elementToChange = [
  "#discard_thickness__input",
  "#billet-length__select",
  "#billet-other__input",
  "#billet_size__select",
];

const myAjax = {
  myAjax: function (fileName, sendData) {
    $.ajax({
      type: "POST",
      url: fileName,
      dataType: "json",
      data: sendData,
      async: false,
    })
      .done(function (data) {
        ajaxReturnData = data;
      })
      .fail(function () {
        alert("DB connect error");
      });
  },
};

// LANGUAGE CHANGE
$(document).on("click", "#language__mark", function () {
  const str = $("#language__mark").attr("src");
  const language = str.match(/\/([^.\/]+)\.\w+$/);
  const tileLettersObject = $("div.title__letters");
  let fileName;
  let sendData = new Object();

  fileName = "./php/ProductionNumber/SelTitleName.php";
  sendData = {
    dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);

  tileLettersObject.each(function () {
    let targetObj = $(this);
    ajaxReturnData.forEach(function (databaseLetters) {
      // console.log(targetObj.text() + "\n" + databaseLetters["english"]);
      switch (language[1]) {
        case "En":
          if (targetObj.text() == databaseLetters["english"]) {
            // console.log(
            //   databaseLetters["english"] + " : " + databaseLetters["vietnamese"]
            // );
            targetObj.text(databaseLetters["vietnamese"]);
            $("#language__mark").attr("src", "./img/Vn.png");
          }
          break;
        case "Vn":
          if (targetObj.text() == databaseLetters["vietnamese"]) {
            // console.log(
            //   databaseLetters["english"] + " : " + databaseLetters["vietnamese"]
            // );
            targetObj.text(databaseLetters["english"]);
            $("#language__mark").attr("src", "./img/En.png");
          }
          break;
      }
    });
  });
});

// Window Colose
$(document).on("mouseover", "#window_close__mark", function () {
  // console.log("hello");
  $("#window_close__mark").attr("src", "./img/close-2.png");
});

$(document).on("mouseout", "#window_close__mark", function () {
  // console.log("hello2");
  $("#window_close__mark").attr("src", "./img/close.png");
});

$(document).on("click", "#window_close__mark", function () {
  // open("about:blank", "_self").close(); // close window
  window.close();
});

$(function () {
  const filename = "./php/MakingPressDirective/SelMemberName.php";
  const sendData = {
    die_number: "dummy",
  };

  myAjax.myAjax(filename, sendData);

  const $select = $("#staff-name__select")
    .empty()
    .append($("<option>").val("0").html("-"));
  const options = ajaxReturnData.map((value) =>
    $("<option>").val(value["id"]).html(value["staff_name"])
  );
  $select.append(options);
});

$(document).on("input", "#die-number__input", function () {
  $(this).val($(this).val().toUpperCase());
});

$(document).on("keyup", "#die-number__input", function () {
  const $select = $("#die-number__select");
  const filename = "./php/MakingPressDirective/SelDie.php";
  const newOption = $("<option></option>").val("0").text("no");
  const sendData = {
    die_number: $(this).val() + "%",
  };

  myAjax.myAjax(filename, sendData);

  $select.empty().append(newOption);
  ajaxReturnData.forEach(function (value) {
    $("<option>").val(value["id"]).html(value["die_number"]).appendTo($select);
  });
  const val = $select.find("option").length;
  // $select
  //   .toggleClass("input-required", val === 0)
  //   .prop("selectedIndex", val ? 0 : -1);
  $("#die-number__div").html(val + " dies");

  $("div.die-information").html("");
  // select top die number and make summary talbe
  getProductionNumber($("#die-number__select").val());
  makeSummaryTalbe($("#die-number__select").val());

  // setFocusToTop();
});

$(document).on("change", "#die-number__select", function () {
  if ($(this).val() == 0) {
    $(this).addClass("input-required");
    $("#summary__table tbody").empty();
    return;
  }
  $(this).removeClass("input-required");
  getProductionNumber($("#die-number__select").val());
  makeSummaryTalbe($("#die-number__select").val());

  setFocusToTop();
});

// $(document).on("focus", "#die-number__select", function () {
//   console.log("hello");
//   $(this).click();
// });

function setFocusToTop() {
  var val = new Object();
  val = $("#summary__table tbody tr").first();

  val.trigger("click");
}

function getProductionNumber(dies_id) {
  const filename = "./php/MakingPressDirective/SelProductionNumber.php";
  const sendData = {
    dies_id: dies_id,
  };

  myAjax.myAjax(filename, sendData);

  $("#die_size__div").html("&phi;" + ajaxReturnData[0]["die_diamater"]);
  $("#production-number__div").html(ajaxReturnData[0]["production_number"]);
  $("#production-weight__div").html(ajaxReturnData[0]["specific_weight"]);
}

function makeSummaryTalbe(dies_id) {
  const filename = "./php/MakingPressDirective/SelSummaryV4.php";
  const sendData = {
    dies_id: dies_id,
  };
  myAjax.myAjax(filename, sendData);
  $("#summary__table tbody").empty();
  makeTable($("#summary__table"), ajaxReturnData);
}

// making table
function makeTable(targetId, sourceData) {
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    // (makeBarcode(trVal["die_postition"])).appendTo(newTr);
    $(newTr).appendTo(targetId);
  });
}

// when element is clicked
$(document).on("click", "#summary__table tbody tr", function () {
  let targetVal;
  let today = new Date();
  const targetTr = $(this).find("td");
  const targetId = targetTr.eq(0).text();
  $("#summary__table tr.selected-record").removeClass("selected-record");
  $(this).addClass("selected-record");

  getPressDirection(targetId);

  // fill each press condition data value to display
  console.log(ajaxReturnData[0]);
  obj = ajaxReturnData[0];
  $.each(obj, function (key, value) {
    $("#" + key).html(value);
  });
  // get die hole number and fill it by press_directive_id
  getHoleNumber(targetId);
  $("#die_hole_number__div").html(dieHoleNumber);
  // get last profile length
  getLastProfileQty(targetId);
});

function getPressDirection(targetId) {
  const filename = "./php/MakingPressDirective/SelSelDataV4.php";
  const sendData = {
    targetId: targetId,
  };
  myAjax.myAjax(filename, sendData);
}

function getHoleNumber(targetId) {
  const filename = "./php/DailyReport/SelHoleNumber.php";
  const sendData = {
    targetId: Number(targetId),
  };

  myAjax.myAjax(filename, sendData);

  dieHoleNumber = ajaxReturnData[0]["hole"];
}

function getLastProfileQty(targetId) {
  // targetId = 8184;
  var n, firstProfileMin, firstProfileMax, otherProfileMin, otherProfileMax;
  var keys;
  var firstProfileQtyeArray = [];
  var otherProfileQtyeArray = [];
  const filename = "./php/MakingPressDirective/SelProfileLength.php";
  const sendData = {
    targetId: targetId,
  };
  console.log("targetID = " + targetId);
  // get hole qty
  n = $("#nbn").html().slice(-1);
  // console.log("n=" + n);

  myAjax.myAjax(filename, sendData);
  if (ajaxReturnData.length == 0) {
    $("#last-press-comment__div").html("No Data");
    $("#first_profile_quantity").html("");
    $("#other_profile_quantity").html("");
  } else {
    const billetQty = Number(ajaxReturnData.length);
    $("#last-press-comment__div").html(billetQty + " Profiles");
    // if(ajaxReturnData.length)
    for (let i = 0; i < n; i++) {
      // console.log(i + ":" + ajaxReturnData[i]["work_quantity"]);
      firstProfileQtyeArray.push(Number(ajaxReturnData[i]["work_quantity"]));
    }
    firstProfileMin = Math.min(...firstProfileQtyeArray);
    firstProfileMax = Math.max(...firstProfileQtyeArray);
    $("#first_profile_quantity").html(
      firstProfileMin + " - " + firstProfileMax
    );

    for (let i = n; i < ajaxReturnData.length; i++) {
      otherProfileQtyeArray.push(Number(ajaxReturnData[i]["work_quantity"]));
    }
    otherProfileMin = Math.min(...otherProfileQtyeArray);
    otherProfileMax = Math.max(...otherProfileQtyeArray);
    $("#other_profile_quantity").html(
      otherProfileMin + " - " + otherProfileMax
    );
  }
}

// validation
$(document).on("blur", "#plan-press-date__input", function () {
  var dateValue;

  console.log("Hello");
  dateValue = $(this).val();
  console.log(dateValue);
});

$(document).on("change", "#plan-press-date__input", function () {
  var dateValue = $(this).val();
  // check input date
  if (dateValue) {
    var inputDate = new Date(dateValue);
    var today = new Date();
    var oneWeekAgo = new Date();
    var oneMonthLater = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    oneMonthLater.setMonth(today.getMonth() + 1);

    if (inputDate >= oneWeekAgo && inputDate <= oneMonthLater) {
      // correct
      $(this).removeClass("input-required");
    } else {
      // in-correct
      $(this).addClass("input-required");
    }
  }
});

$(document).on("keyup", "#discard_thickness__input", function () {
  var inputValue = $(this).val();
  if (inputValue >= 1 && inputValue <= 150) {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
});

$(document).on("change", "#press-type__select", function () {
  var inputValue = $(this).val();
  if (inputValue != "0") {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
});

$(document).on("keyup", "#ram_speed__input", function () {
  var inputValue = Number($(this).val());
  if (inputValue > 0 && inputValue <= 40) {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
});

$(document).on("change", "#billet-length__select", function () {
  const selectedValue = Number($(this).val());
  switch (selectedValue) {
    case 0:
      $(this).addClass("input-required").addClass("save-data");
      break;
    case 1:
      $(this).removeClass("input-required").removeClass("save-data");
      $("#billet-other__input")
        .prop("disabled", false)
        .addClass("input-required")
        .addClass("save-data");
      break;
    default:
      $(this).removeClass("input-required").addClass("save-data");
      $("#billet-other__input")
        .prop("disabled", true)
        .removeClass("input-required");
  }
});

$(document).on("keyup", "#billet-other__input", function () {
  var inputValue = Number($(this).val());
  if (inputValue >= 300 && inputValue <= 1200) {
    $(this).removeClass("input-required");
    $("#billet-length__select").val(inputValue);
    billetLength = $(this).val();
  } else {
    $(this).addClass("input-required");
    $("#billet-length__select").val("0");
    billetLength = null;
  }
});

$(document).on("keyup", "#billet-temp__input", function () {
  var inputValue = Number($(this).val());
  if (inputValue > 400 && inputValue < 550) {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
});

$(document).on("keyup", "#billet-temp__input", function () {
  var inputValue = Number($(this).val());
  if (inputValue > 400 && inputValue < 550) {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
});

$(document).on("change", "#billet_taper__select", function () {
  var inputValue = Number($(this).val());
  if (inputValue != -1) {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
});

$(document).on("change", "#billet_size__select", function () {
  var inputValue = Number($(this).val());
  if (inputValue != 0) {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
});

$(document).on("keyup", "#billet-qty__input", function () {
  var inputValue = Number($(this).val());
  if (inputValue > 0 && inputValue <= 100) {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
});

$(document).on("keyup", "#die-temp__input", function () {
  var inputValue = Number($(this).val());
  if (inputValue > 400 && inputValue < 550) {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
});

$(document).on("keyup", "#die-temp__input", function () {
  var inputValue = Number($(this).val());
  if (inputValue > 400 && inputValue < 550) {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
});

$(document).on("keyup", "#die-heat-time__input", function () {
  var inputValue = Number($(this).val());
  console.log(inputValue);
  if (inputValue >= 3 && inputValue <= 6) {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
});

$(document).on("keyup", "#stretch__input", function () {
  var inputValue = Number($(this).val());
  if (inputValue >= 0 && inputValue <= 2) {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
});

$(document).on("change", "#staff-name__select", function () {
  const inputValue = Number($(this).val());
  $(this).toggleClass("input-required", inputValue === 0);
});

$(document).on("change", "#nBn__select", function () {
  const inputValue = Number($(this).val());
  $(this).toggleClass("input-required", inputValue === 0);
});

$(document).on("change", "#machine-number__select", function () {
  const inputValue = Number($(this).val());
  $(this).toggleClass("input-required", inputValue === 0);
});

$(document).on("change", "#cooling__select", function () {
  const inputValue = Number($(this).val());
  $(this).toggleClass("input-required", inputValue === 0);
});

$(document).on("keyup", "#previous-press-note__textarea", function () {
  const inputValue = $(this).val().length;
  $(this).toggleClass("input-required", inputValue < 5);
});

$(document).on("keyup", "#first-profile__input", function () {
  const inputValue = $(this).val();
  const isNumeric = $.isNumeric(inputValue);
  const isValid = isNumeric && inputValue > 0 && inputValue < 100;

  $(this).toggleClass("input-required", !isValid);
});

$(document).on("keyup", "#other-profile__input", function () {
  const inputValue = $(this).val();
  const isNumeric = $.isNumeric(inputValue);
  const isValid = isNumeric && inputValue > 0 && inputValue < 100;

  $(this).toggleClass("input-required", !isValid);
});

$(document).on("click", "#save__button", function () {
  const inputValues = getAllInputValues();
  const deleteElements = $(".need-clear");
  const deleteUpperAreaElements = $("div.top__wrapper div.display__wrapper");
  const deleteLastPressCondition = $(
    "div.middle__wrapper div.pre_directive_input__wrapper"
  );
  const summaryTableBody = $("#summary__table tbody");
  // console.log(inputValues);

  fileName = "./php/MakingPressDirective/InsDataV7.php";
  sendData = inputValues;
  myAjax.myAjax(fileName, sendData);
  // delete input value and color
  deleteElements.val("").addClass("input-required");
  // delete inserted value
  deleteUpperAreaElements.html("");
  deleteLastPressCondition.html("");
  // delete summary table body
  summaryTableBody.empty();

  $(this).prop("disabled", true);
});

$(document).on("click", "#update__button", function () {
  var summaryTableBody = new Object();
  summaryTableBody = $("#summary__table tbody");
  // summaryTableBody = $("#summary__table");
  console.log($("#summary__table"));
  console.log($("#summary__table tbody"));
  summaryTableBody.empty();
});

function checkAllInputed() {
  const elementOfInputRequired = $(".save-data");
  const n = elementOfInputRequired.filter(".input-required").length;
  return n === 0;
}

function getAllInputValues() {
  var inputValues = new Object();
  const elementOfSaveData = $(".save-data");
  // inputValues = elementOfSaveData;
  // console.log(inputValues);
  $(".save-data").each(function (index, element) {
    inputValues[$(this).attr("id")] = $(this).val();
  });
  inputValues["created_at"] = formattedDate;

  return inputValues;
}

$(document).on("click", "#make-pdf__button", function () {
  const printContent = $("#content").html();
  const newWindow = window.open(
    "",
    "",
    "width=1200,height=900,left=250,location=no,titlebar=yes"
  );
  newWindow.document.write(`
          <!DOCTYPE html>
          <html lang="ja">
          <head>
            <meta charset="UTF-8">
            <title>印刷プレビュー</title>
          </head>
          <body>
            ${printContent}
          </body>
          </html>
        `);
  newWindow.document.close();
  newWindow.focus();
  setTimeout(() => {
    newWindow.print();
    newWindow.close();
  }, 500);
});

$(document).on("change", elementToChange, function () {
  getWorkLength();
});

$(document).on("keyup", elementToChange, function () {
  getWorkLength();
});

function getWorkLength() {
  const billetSize = Number($("#billet_size__select").val());
  const discardThickness = Number($("#discard_thickness__input").val());
  const productionWeight = Number($("#production-weight__div").html());
  const billetWeight =
    ((((billetSize * 2.54) ** 2 * Math.PI) / 4) * 2.7 * billetLength) / 10000;
  const discardWeight =
    ((((billetSize * 2.54 * 1.02) ** 2 * Math.PI) / 4) *
      2.7 *
      discardThickness) /
    10000;

  const profileLength = (billetWeight - discardWeight) / productionWeight;
  $("#production-length__div").html(profileLength.toFixed(1));
}

// check input complete

$(document).on("keyup change", "div.middle__wrapper", function () {
  const allInputed = checkAllInputed();
  $("#save__button").prop("disabled", !allInputed);
});
