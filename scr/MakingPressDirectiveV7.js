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
  console.log(ajaxReturnData);
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
  // JsBarcode(".barcode").init();
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

  // fill each ajax value to display
  console.log(ajaxReturnData[0]);
  obj = ajaxReturnData[0];
  $.each(obj, function (key, value) {
    $("#" + key).html(value);
  });
  return;

  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    if ($(newTr).find("td").eq(1).html() == category2Name) {
      $(newTr)
        .addClass("selected-record")
        .attr("id", "category2__tr")
        .get(0)
        .scrollIntoView({
          behavior: "smooth",
        });
    }
    $(newTr).appendTo("#category2__table tbody");
  });

  makeBundleTable(targetId);
  makeWorkInformation(targetId);
  makeRackTable(targetId);
  getSelectData(targetId);
  makeDirectiveSelect(targetId);
  // input die number
  $("#die_number__input").val("");
  makeDieSelect();
  $("#die_number__select").val(targetTr.eq(4).text());
  // input press directive
  makePressDirectiveSelect(targetId);
});

function getPressDirection(targetId) {
  const filename = "./php/MakingPressDirective/SelSelDataV4.php";
  const sendData = {
    targetId: targetId,
  };

  myAjax.myAjax(filename, sendData);
  console.log(ajaxReturnData);
}
