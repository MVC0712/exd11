var dieHoleNumber;

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

$(function () {});

$(document).on("input", "#die-number__input", function () {
  $(this).val($(this).val().toUpperCase());
});

$(document).on("keyup", "#die-number__input", function () {
  const filename = "./php/MakingPressDirective/SelDie.php";
  const sendData = {
    die_number: $(this).val() + "%",
  };
  var val;

  myAjax.myAjax(filename, sendData);

  $("#die-number__select").empty();
  ajaxReturnData.forEach(function (value) {
    $("<option>")
      .val(value["id"])
      .html(value["die_number"])
      .appendTo("#die-number__select");
  });
  val = $("#die-number__select option").length;
  $("#die-number__div").html(val + " dies");

  $("div.die-information").html("");
});

$(document).on("change", "#die-number__select", function () {
  getProductionNumber($("#die-number__select").val());
  makeSummaryTalbe($("#die-number__select").val());
});

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
  $("#die_hole_number__th").html("Profile Length (" + dieHoleNumber + "whole)");
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

  n = $("#nbn").html().slice(-1);
  console.log("n=" + n);

  myAjax.myAjax(filename, sendData);
  console.log(ajaxReturnData);
  console.log(ajaxReturnData["work_quantity"]);

  ajaxReturnData.forEach(function (val, index) {
    // console.log(index + ":" + val);
  });

  for (let i = 0; i < n; i++) {
    // console.log(i + ":" + ajaxReturnData[i]["work_quantity"]);
    firstProfileQtyeArray.push(Number(ajaxReturnData[i]["work_quantity"]));
  }
  console.log(firstProfileQtyeArray);
  firstProfileMin = Math.min(...firstProfileQtyeArray);
  firstProfileMax = Math.max(...firstProfileQtyeArray);
  console.log("min = " + firstProfileMin);
  console.log("max = " + firstProfileMax);
  $("#first_profile_quantity").html(firstProfileMin + " - " + firstProfileMax);

  for (let i = n; i < ajaxReturnData.length; i++) {
    // console.log(i + ":" + ajaxReturnData[i]["work_quantity"]);
    otherProfileQtyeArray.push(Number(ajaxReturnData[i]["work_quantity"]));
  }
  otherProfileMin = Math.min(...otherProfileQtyeArray);
  otherProfileMax = Math.max(...otherProfileQtyeArray);
  $("#other_profile_quantity").html(otherProfileMin + " - " + otherProfileMax);
}
