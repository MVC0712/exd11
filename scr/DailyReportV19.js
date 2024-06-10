const targetDirectory = "./";
var ajaxReturnData, ajaxSummaryTable;
var productionNumberTableValues = new Object();
var addNewDieName;
var savedMode;
let summaryTable = new Object();
let productionNumberTable = new Object();

let mfgselect = [
  {
    id: 1,
    mfg: "Dubai",
  },
  {
    id: 2,
    mfg: "VN",
  },
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

$(function () {
  makeSummaryTable();
  // console.log(ajaxReturnData);
  makeTable($("#summary__table"), ajaxSummaryTable);
});

function makeSummaryTable() {
  fileName = "./php/DailyReport/SelSummary19.php";
  sendData = {
    dieName: "%",
  };
  myAjax.myAjax(fileName, sendData);
  ajaxSummaryTable = ajaxReturnData;
}

function makeSubTables(targetId, fileName) {
  sendData = {
    dieName: "%",
  };
  myAjax.myAjax(fileName, sendData);
}

// when element is clicked
$(document).on("click", "#summary__table tbody tr", function () {
  let targetVal;
  let today = new Date();
  const targetTr = $(this).find("td");
  const targetId = targetTr.eq(0).text();
  $("#summary__table tr.selected-record").removeClass("selected-record");
  $(this).addClass("selected-record");
  console.log(targetId);
  console.log("Hello");

  makeBundleTable(targetId);
});

function makeBundleTable(targetId) {
  fileName = "./php/DailyReport/SelBundleV15.php";
  sendData = {
    id: targetId,
  };
  myAjax.myAjax(fileName, sendData);
  $("#bundle__table tbody").empty();
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      if (tdVal == "id") {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
      } else if (tdVal == "mfg") {
        $("<td>").append(makeMfg(trVal[tdVal])).appendTo(newTr);
      } else {
        $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
      }
    });
    $(newTr).appendTo("#bundle__table tbody");
  });
}

function makeMfg(seletedId) {
  let targetDom = $("<select>");
  $("<option>").html("No").val(0).appendTo(targetDom);
  mfgselect.forEach(function (element) {
    if (element["id"] == seletedId) {
      $("<option>")
        .html(element["mfg"])
        .val(element["id"])
        .prop("selected", true)
        .appendTo(targetDom);
    } else {
      $("<option>").html(element["mfg"]).val(element["id"]).appendTo(targetDom);
    }
  });
  return targetDom;
}
