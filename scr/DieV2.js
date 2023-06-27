const targetDirectory = "./";
var ajaxReturnData;
var productionNumberTableValues = new Object();
var addNewDieName;
var savedMode;

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

$(function () {
  let today = new Date();

  $("#arrival_date").val(makeYYYYMMDD(today)).removeClass("input-required");
  makeProductionNumberTalbe();
  makeSummaryTalbe();
  makeDieDiamaterSelect();
  makeBolsterSelect();

  // blink mode letters
  setInterval(blinkText(), 3000);
});

// テキストを点滅させる
function blinkText() {
  $("#mode_display").toggleClass("blink-animation");
}

function makeDieDiamaterSelect() {
  fileName = "./php/Die/SelDiamater.php";
  sendData = {
    dieName: "%",
  };
  myAjax.myAjax(fileName, sendData);

  ajaxReturnData.forEach(function (value) {
    $("<option>")
      .val(value["id"])
      .html("&oslash;" + value["die_diamater"])
      .appendTo("#die_diamater__select");
  });
}

function makeBolsterSelect() {
  fileName = "./php/Die/SelBolster.php";
  sendData = {
    dieName: "%",
  };
  myAjax.myAjax(fileName, sendData);

  ajaxReturnData.forEach(function (value) {
    $("<option>")
      .val(value["id"])
      .html(value["bolster_name"])
      .appendTo("#bolster__select");
  });
}

function makeSummaryTalbe() {
  fileName = "./php/Die/SelSummaryV2.php";
  sendData = {
    dieName: "%",
  };
  myAjax.myAjax(fileName, sendData);
  // console.log(ajaxReturnData);
  ajaxReturnData.forEach(function (val) {
    if (val["die_diamater"] != null) {
      val["die_diamater"] = "&oslash" + val["die_diamater"];
    }
  });
  makeTable($("#summary__table"));
}

function makeProductionNumberTalbe() {
  const fileName = "./php/Die/SelProductionNumber.php";
  var sendData = new Object();
  sendData = {
    targetId: $("#category1__tr").find("td").eq(0).html(),
    production_number: "%",
  };
  // console.log(sendData);
  myAjax.myAjax(fileName, sendData);
  productionNumberTableValues = ajaxReturnData;
  ajaxReturnData.forEach(function (val) {
    if (val["category1"] != null && val["category1"].length >= 8) {
      val["category1"] = val["category1"].substring(0, 8) + "...";
    }
    if (val["category2"] != null && val["category2"].length >= 8) {
      val["category2"] = val["category2"].substring(0, 8) + "...";
    }
  });
  makeTable($("#production_number__table"));
}

function makeTable(targetId) {
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo(targetId);
  });
}

function makeYYYYMMDD(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
}

function makeYYYYMMDDtoDateObj(strDate) {
  var dateObj = new Date();

  return year + "-" + month + "-" + day;
}

$(document).on("keyup", "#die_number", function () {
  // Set Mode "NewAdd Mode" or "Edit Mode"
  if ($("#mode_display").html() === "") {
    $("#mode_display").html("New Add Mode");
  }
  // exchenge to Large letters
  $(this).val($(this).val().toUpperCase());

  var flag = true;
  if ($(this).val().length < 3) {
    flag = false;
  }
  exchageBackground($(this), flag);
  buttonActivaltion();
});

$(document).on("change", "select", function () {
  var flag = true;

  if ($(this).val() == 0) {
    flag = false;
  }
  exchageBackground($(this), flag);
  buttonActivaltion();
});

function exchageBackground(targetObj, flag) {
  if (flag) {
    targetObj.removeClass("input-required");
  } else {
    targetObj.addClass("input-required");
  }
}

$(document).on("input", "#arrival_date", function () {
  var flag = true;
  var inputDate = new Date($(this).val());
  var startDate = new Date("2020-1-1");
  var endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 3);

  if (inputDate >= startDate && inputDate <= endDate) {
    flag = true;
  } else {
    flag = false;
  }
  exchageBackground($(this), flag);
  buttonActivaltion();
});

$(document).on("keyup", "#whole__input", function () {
  var flag = true;
  var inputNumber = parseFloat($(this).val());
  if (Number.isInteger(inputNumber) && inputNumber >= 1 && inputNumber <= 6) {
    flag = true;
  } else {
    flag = false;
  }
  exchageBackground($(this), flag);
  buttonActivaltion();
});

$(document).on("click", "#summary__table tbody tr", function () {
  let targetVal;
  const targetTr = $(this).find("td");
  $("#summary__table tr.selected-record").removeClass("selected-record");
  $(this).addClass("selected-record");

  // Update button Activation
  $("#mode_display").html("Update Mode");
  // $("#update__button").hide();
  $("#update__button").prop("disabled", false);

  // Copy values
  $("#die_number").val(targetTr.eq(1).text());
  $("#die_diamater__select option").each(function () {
    if ($(this).text() == targetTr.eq(2).text()) {
      $("#die_diamater__select").val($(this).val());
    }
  });
  $("#bolster__select option").each(function () {
    if ($(this).text() == targetTr.eq(3).text()) {
      $("#bolster__select").val($(this).val());
    }
  });
  $("#arrival_date").val("20" + targetTr.eq(5).text());
  $("#whole__input").val(targetTr.eq(7).text());
  // Delete background color
  $("div.top__wrapper .input-required").removeClass("input-required");
  // Select "Production Number Table"
  selectProductionNumberTable();
});

$(document).on(
  "click",
  "#summary__table tbody tr.selected-record",
  function () {
    console.log("hello");

    fileName = "./php/ProductionNumber/SelEmploeeNumber.php";
    sendData = {
      dummy: "dummy",
    };
    // console.log(sendData);
    myAjax.myAjax(fileName, sendData);
    document.getElementById("delete__dialog").showModal();
    $("#emploee_number").val("");
    $("#dialog-delete__button").attr("disabled", true);
  }
);

// Dialog
$(document).on("click", "#dialog-cancel__button", function () {
  document.getElementById("delete__dialog").close();
  // $("#update__button").prop("disabled", true);
});

function selectProductionNumberTable() {
  const targetPN = $("#summary__table .selected-record")
    .find("td")
    .eq(4)
    .text();

  $("#production_number__table tbody tr.selected-record").removeClass(
    "selected-record"
  );
  $("#production_number__table tbody tr").each(function () {
    if ($(this).find("td").eq(3).text() == targetPN) {
      $(this)
        .addClass("selected-record")
        .attr("id", "production_number__tr")
        .get(0)
        .scrollIntoView({
          behavior: "smooth",
        });
    }
  });
}

$(document).on("click", "#production_number__table tbody tr", function () {
  $("#production_number__table tr.selected-record").removeClass(
    "selected-record"
  );
  $(this).addClass("selected-record");
  buttonActivaltion();
});

function inputCheck() {
  var flag = true;
  var targetObj = new Object();

  targetObj = $(".save-data");
  targetObj.each(function () {
    if ($(this).hasClass("input-required")) {
      flag = false;
    }
  });
  return flag;
}

function buttonActivaltion() {
  var mode;
  // check selection of production table

  if ($("#production_number__table .selected-record").length == 0) {
    return;
  }
  if ($("#mode_display").html() === "Update Mode") {
    mode = "Update";
  } else {
    mode = "AddNew";
  }

  switch (mode) {
    case "Update":
      if (inputCheck()) {
        $("#update__button").prop("disabled", false);
      } else {
        $("#update__button").prop("disabled", true);
      }
      break;
    case "AddNew":
      if (inputCheck()) {
        $("#save__button").prop("disabled", false);
      } else {
        $("#save__button").prop("disabled", true);
      }
      break;
  }
}

$(document).on("click", "#test__button", function () {
  $("#summary__table tbody").empty();
});

$(document).on("click", "#save__button", function () {
  var savedMode = $("#mode_display").text();
  var saveData = new Object();
  const fileName = "./php/Die/InsDie.php";

  saveData = getSaveData();
  addNewDieName = $("#die_number").val();

  if (checkDieNameDuplication()) {
    // when die name duplicated
    $("#mode_display").text("Die Name Wrong").addClass("redLetters");
    setTimeout(function () {
      $("#mode_display").text(savedMode).removeClass("redLetters");
    }, 10000);
  } else {
    // when die name normal
    myAjax.myAjax(fileName, saveData);
  }
  $("#summary__table tbody").empty();
  makeSummaryTalbe();
  moveSelectorToNewDie(saveData);
});

function moveSelectorToNewDie(saveData) {
  var targetObj = new Object();
  console.log("hello");

  targetObj = $("#summary__table tbody tr");
  targetObj.each(function () {
    if ($(this).find("td").eq(1).text() == saveData["die_number"]) {
      $(this)
        .addClass("selected-record")
        .attr("id", "production_number__tr")
        .get(0)
        .scrollIntoView({
          behavior: "smooth",
        });
    }
  });
}

function getSaveData() {
  var saveData = new Object();
  var targetObj = new Object();
  const today = new Date();

  targetObj = $(".save-data");
  targetObj.each(function () {
    saveData[$(this).prop("id")] = $(this).val();
  });
  saveData["production_number_id"] = $(
    "#production_number__table .selected-record"
  )
    .find("td")
    .eq(0)
    .text();
  saveData["today"] = makeYYYYMMDD(today);
  return saveData;
}

function checkDieNameDuplication() {
  var flag = false;
  var dieName = $("#die_number").val();
  var targetObj = $("#summary__table tbody tr");
  targetObj.each(function () {
    // console.log($(this).find("td").eq(0).text());
    if ($(this).find("td").eq(1).text() == dieName) {
      flag = true;
    }
  });

  return flag;
}
