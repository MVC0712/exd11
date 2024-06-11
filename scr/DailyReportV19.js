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
//
$(function () {
  makeStaffList("");
  makeSummaryTable();
  // console.log(ajaxReturnData);
  makeTable($("#summary__table"), ajaxSummaryTable);
});

function makeStaffList(inputValue) {
  const fileName = "./php/DailyReport/SelStaff.php";
  const sendData = {
    name_s: "%" + inputValue + "%",
  };
  myAjax.myAjax(fileName, sendData);
  $("#staff_id option").remove();
  $("#staff_id").append($("<option>").val(0).html("no"));
  ajaxReturnData.forEach(function (value) {
    $("#staff_id").append(
      $("<option>").val(value["id"]).html(value["staff_name"])
    );
  });
}

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
  makeWorkInformation(targetId);
  makeRackTable(targetId);
  getSelectData(targetId);
  // console.log(ajaxReturnData);
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

function makeWorkInformation(seletedId) {
  // let
  fileName = "./php/DailyReport/SelWorkInformation3.php";
  sendData = {
    id: seletedId,
  };
  myAjax.myAjax(fileName, sendData);
  fillWorkInformation(ajaxReturnData);
}

function fillWorkInformation(data) {
  $("#work-length__table tbody").empty();
  data.forEach(function (element, index) {
    var trDom = $("<tr>");
    Object.keys(element).forEach(function (key, index) {
      var val;
      if (index == 0) {
        // ビレット番号を No1, No2, ,,,とする
        val = "No." + element[key];
        trDom.append($("<th>").html(val));
      } else {
        // ビレット番号以外の処理 input.valueに値を格納する
        val = $("<input>").val(element[key]).addClass("need-clear");
        trDom.append($("<td>").html(val));
      }
    });
    $("#work-length__table tbody").append(trDom);
  });
}

function makeRackTable(targetId) {
  const fileName = "./php/DailyReport/SelRack2.php";
  sendData = {
    id: targetId,
  };
  myAjax.myAjax(fileName, sendData);
  $("#rack__table tbody").empty();
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      if (tdVal == "rack_number" || tdVal == "work_quantity") {
        $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
      } else {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
      }
    });
    $(newTr).appendTo("#rack__table tbody");
  });
}

function getSelectData(targetId) {
  const fileName = "./php/DailyReport/SelSelData19.php";
  const sendData = {
    targetId: targetId,
  };
  myAjax.myAjax(fileName, sendData);

  fillReadData(ajaxReturnData);
}

function fillReadData() {
  console.log(ajaxReturnData[0]);
  ajaxReturnData.forEach(function (element, index) {
    console.log(element);
    // $("#" + element).val()
  });
  // ajaxReturnData[0].forEach(function (element, index) {
  //   console.log(element);
  //   // $("#" + element).val()
  // });
  Object.keys(ajaxReturnData[0]).forEach(function (element) {
    // $("<td>").html(trVal[element]).appendTo(newTr);
    console.log(element + " : " + ajaxReturnData[0][element]);
    $("#" + element).val(ajaxReturnData[0][element]);
  });
}
