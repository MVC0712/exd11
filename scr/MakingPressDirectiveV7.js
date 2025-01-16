const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0"); // 月は0から始まるので+1が必要
const dd = String(today.getDate()).padStart(2, "0");

const formattedDate = `${yyyy}-${mm}-${dd}`;
// console.log(formattedDate); // 例: "2024-12-27"

var dieHoleNumber;
var billetLength;
var modeValue;

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
    $("#make-pdf__button").prop("disabled", true);
    return;
  }
  $(this).removeClass("input-required");
  getProductionNumber($("#die-number__select").val());
  makeSummaryTalbe($("#die-number__select").val());
  $("#make-pdf__button").prop("disabled", false);

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

  if (!ajaxReturnData.length) {
    return;
  }

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
  const elementInput = $("div.middle__wrapper div.directive_input__wrapper");
  const targetTr = $(this).find("td");
  const targetId = targetTr.eq(0).text();
  const filename = "./php/MakingPressDirective/SelSelDataV4.php";
  const sendData = {
    targetId: targetId,
  };
  var obj;

  $("#summary__table tr.selected-record").removeClass("selected-record");
  $("#selected__tr").removeAttr("id");

  $(this).addClass("selected-record").attr("id", "selected__tr");
  myAjax.myAjax(filename, sendData);
  // fill  press condition data value to display
  obj = ajaxReturnData[0];
  // console.log(obj);

  // fill html part
  $.each(obj, function (key, value) {
    $("#" + key).html(value);
  });
  // fill selection part
  $("#press-type__select").val(obj["pressing_type_id"]);
  $("#billet_size__select").val(obj["billet_size"]);
  $("#billet_taper__select").val(obj["billet_taper_heating"]);
  $("#staff-name__select").val(obj["staff_id"]);
  $("#nBn__select").val(obj["nbn_id"]);
  $("#machine-number__select").val(obj["press_machine"]);
  $("#cooling__select").val(obj["cooling_id"]);
  // fill input part
  elementInput.each(function () {
    const $this = $(this); // 先に$(this)をキャッシュしておく
    const inputVal = $this.find("div.pre_directive_input__wrapper div").html();
    $this.find("input").val(inputVal); // 再度のDOMアクセスを避ける
  });
  $("#first-profile__input").val(obj["first_profile_quantity"]);
  $("#other-profile__input").val(obj["other_profile_quantity"]);
  // get die hole number and fill it by press_directive_id
  getHoleNumber(targetId);
  $("#die_hole_number__div").html(dieHoleNumber);
  // get last profile length
  getLastProfileQty(targetId);
  // change back ground color
  $("div.middle__wrapper input").removeClass("input-required");
  $("div.middle__wrapper select").removeClass("input-required");
  $("div.middle__wrapper textarea").removeClass("input-required");
  $("#billet-length__select").addClass("input-required");
  $("#previous-press-note__textarea").addClass("input-required");
  // activate update button
  modeValue = "update";
  $("#update__button").prop("disabled", false);
});

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

  dateValue = $(this).val();
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
    case 0: // when select "-"
      $(this).addClass("input-required").addClass("save-data");
      break;
    case 1: // when select other billet length
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
      billetLength = $(this).val();
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
    "div.middle__wrapper div.pre_directive_input__wrapper div"
  );
  const summaryTableBody = $("#summary__table tbody");

  inputValues["billet-length__select"] = inputValues["billet-other__input"];
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
  const elementTest = $("div.middle__wrapper div.directive_input__wrapper");
  elementTest.each(function () {
    const $this = $(this); // 先に$(this)をキャッシュしておく
    const inputVal = $this.find("div.pre_directive_input__wrapper div").html();
    $this.find("input").val(inputVal); // 再度のDOMアクセスを避ける
  });
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
  makeNewPage();
});

function makeNewPage() {
  // 読み込むHTMLファイルのパス
  // const htmlFilePath = "../exd11/PressDSPDF.html";
  const htmlFilePath = "../ex0.11/PressDSPDF.html"; // in SMC

  const replacements = getPrintData();
  // return;
  $.get(htmlFilePath, function (htmlContent) {
    let processedContent = htmlContent;
    for (const [key, value] of Object.entries(replacements)) {
      processedContent = processedContent.replace(key, value);
    }
    // 新しいウィンドウを開く
    const newWindow = window.open(
      "",
      "_blank",
      "width=1200,height=900, left=250, location = no , titlebar=yes"
    );
    // console.log(plan_date_at);
    // 新しいウィンドウにHTMLを挿入
    newWindow.document.write(processedContent);
    // ドキュメントの書き込みを終了
    newWindow.document.close();
  }).fail(function () {
    alert("HTMLファイルの読み込みに失敗しました。");
  });
}

function getPrintData() {
  const fileName = "./php/MakingPressDirective/SelForPrintPageV6.php";
  const sendData = {
    targetId: $("#selected__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  console.log(ajaxReturnData[0]);
  const readDataValues = ajaxReturnData[0];
  const printDataValues = new Object();

  const planDateAt = convertDateFormat(readDataValues["plan_date_at"]);
  const issueDateAt = convertDateFormat(readDataValues["issue_date"]);
  const ratioValue = Number(readDataValues["ratio"].toFixed(1));
  const prsTimePL = Math.round(
    (Number(
      calPressLength(
        ajaxReturnData[0].billet_size,
        ajaxReturnData[0].billet_length,
        ajaxReturnData[0].specific_weight,
        ajaxReturnData[0].hole
      )
    ) *
      Number(ajaxReturnData[0].billet_input_quantity)) /
      Number(ajaxReturnData[0].work_speed) +
      10 +
      5
  );

  // const a = calPressLength(
  //   ajaxReturnData[0].billet_size,
  //   ajaxReturnData[0].billet_length,
  //   ajaxReturnData[0].specific_weight,
  //   ajaxReturnData[0].hole
  // );

  let pullerF;
  if (readDataValues.specific_weight >= 20) {
    pullerF = 140;
  } else if (
    12 <= readDataValues.specific_weight &&
    readDataValues.specific_weight < 20
  ) {
    pullerF = 120;
  } else if (
    5 <= readDataValues.specific_weight &&
    readDataValues.specific_weight < 12
  ) {
    pullerF = 90;
  } else if (
    3 <= readDataValues.specific_weight &&
    readDataValues.specific_weight < 5
  ) {
    pullerF = 70;
  } else if (readDataValues.specific_weight < 3) {
    pullerF = 50;
  }

  printDataValues["${die_number}"] = readDataValues["die_number"];
  printDataValues["${production_number}"] = readDataValues["production_number"];
  // printDataValues["${planed_at}"] = readDataValues["plan_date_at"];
  printDataValues["${planed_at}"] = planDateAt;
  printDataValues["${pressing_type}"] = readDataValues["pressing_type"];
  printDataValues["${press_length}"] = readDataValues["press_length"];

  printDataValues["${production_length}"] = readDataValues["production_length"];
  printDataValues["${material}"] = readDataValues["material"];
  printDataValues["${specific_weight}"] =
    readDataValues["specific_weight"] + " kg/m";
  // printDataValues["${ratio}"] = readDataValues["ratio"];
  printDataValues["${ratio}"] = ratioValue;
  printDataValues["${nbn}"] = readDataValues["nbn"];
  printDataValues["${previous_press_note}"] =
    readDataValues["${previous_press_note}"];
  printDataValues["${staff_name}"] = readDataValues["staff_name"];
  // printDataValues["issue_date"] = readDataValues["issue_date"];
  printDataValues["${issue_date}"] = issueDateAt;
  printDataValues["${prsTimePL}"] = prsTimePL + " min";
  printDataValues["${billet_input_quantity}"] =
    readDataValues["billet_input_quantity"];
  printDataValues["${billet_length}"] = readDataValues["billet_length"] + " mm";
  printDataValues["${discard_thickness}"] = readDataValues["discard_thickness"];
  printDataValues["${ram_speed}"] = readDataValues["ram_speed"];
  printDataValues["${work_spped2}"] = readDataValues["work_speed2"];
  printDataValues["${work_speed}"] = readDataValues["work_speed"];
  printDataValues["${billet_t}"] =
    readDataValues["billet_temperature"] +
    "&#8451;" +
    "-" +
    readDataValues["billet_taper_heating"] +
    "&#8451;";
  printDataValues["${die_temperature}"] = readDataValues["die_temperature"];
  printDataValues["${die_heating_time}"] = readDataValues["die_heating_time"];
  printDataValues["${stretch_ratio}"] = readDataValues["stretch_ratio"];
  printDataValues["${cooling_type}"] = readDataValues["cooling_type"];
  printDataValues["${billet_size}"] = readDataValues["billet_size"];
  printDataValues["${bolster_name}"] = readDataValues["bolster_name"];
  printDataValues["${aging}"] = readDataValues["aging"];
  printDataValues["${die_ring}"] =
    "DR" +
    readDataValues.bolster_name.substring(1, 3) +
    readDataValues.die_diamater / 10;
  printDataValues["${pullerF}"] = pullerF;
  printDataValues["${press_machine}"] = readDataValues["press_machine"];
  printDataValues["${die_note}"] = readDataValues["die_note"];
  printDataValues["${h}"] =
    readDataValues["h"] === null ? "" : readDataValues["h"];
  printDataValues["${a}"] =
    readDataValues["a"] === null ? "" : readDataValues["a"];
  printDataValues["${b}"] =
    readDataValues["b"] === null ? "" : readDataValues["b"];
  printDataValues["${c}"] =
    readDataValues["c"] === null ? "" : readDataValues["c"];
  printDataValues["${d}"] =
    readDataValues["d"] === null ? "" : readDataValues["d"];
  printDataValues["${e}"] =
    readDataValues["e"] === null ? "" : readDataValues["e"];
  printDataValues["${f}"] =
    readDataValues["f"] === null ? "" : readDataValues["f"];
  printDataValues["${i}"] =
    readDataValues["i"] === null ? "" : readDataValues["i"];
  printDataValues["${k}"] =
    readDataValues["k"] === null ? "" : readDataValues["k"];
  printDataValues["${end}"] =
    readDataValues["end"] === null ? "" : readDataValues["end"];

  printDataValues["${plan_note}"] = readDataValues["plan_note"];
  printDataValues["${makeTable()}"] = makeProfileTable();

  // console.log(printDataValues);
  return printDataValues;
}

function calPressLength(billetSize, billetLength, specificWeight, whole) {
  let workLength;
  let billetWeight;
  let containerDimension;
  let inputMaterialWeight;

  if (billetSize == 9) {
    billetWeight = 132.3;
    containerDimension = 237;
  } else if (billetSize == 12) {
    billetWeight = 235;
    containerDimension = 312;
  } else if (billetSize == 14) {
    billetWeight = 320;
    containerDimension = 366;
  }
  inputMaterialWeight =
    billetWeight * (billetLength / 1200) -
    (((containerDimension ** 2 / 4) *
      3.142 *
      $("#discard_thickness__input").val()) /
      10 ** 6) *
      2.7;

  workLength = inputMaterialWeight / specificWeight;
  workLength = workLength / whole;
  workLength = Math.round(workLength * 10) / 10;
  workLength = workLength.toFixed(1);

  return workLength;
}

function convertDateFormat(dateStr) {
  var parts = dateStr.split("-");
  var yy = parts[0].slice(2); // 年の部分をyyに変換
  var mm = parts[1];
  var dd = parts[2];
  return yy + "-" + mm + "-" + dd;
}

function makeProfileTable() {
  var tbd = ``;
  var tr = ``;
  var trC = `<tbody style="height: 100%; overflow: hidden;">`;
  for (i = 1; i <= 58; ++i) {
    tr = `<tr style="height: 14.8px">
                <td style="width: 10px; font-size: 8px;">${i}</td>
                <td style="width: 37px;"></td>
                <td style="width: 35px;"></td>
                <td style="width: 40px;"></td>
                <td style="width: 35px;"></td>
                <td style="width: 35px;"></td>
                <td style="width: 30px;"></td>
                <td style="width: 55px;"></td>
                <td style="width: 55px; text-align: center;">:</td>
                <td style="width: 35px;"></td>
                <td style="width: 17px;"></td>
                <td style="width: 17px;"></td>
                <td style="width: 17px;"></td>
                <td style="width: 17px;"></td>
                <td style="width: 17px;"></td>
            </tr>`;
    tbd += tr;
  }
  return trC + tbd + "</tbody>";
}

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
