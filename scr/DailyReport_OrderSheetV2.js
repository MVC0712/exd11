const targetDirectory = "./";
var ajaxReturnData, ajaxSummaryTable;
var productionNumberTableValues = new Object();
var addNewDieName;
var savedMode;
let summaryTable = new Object();
let productionNumberTable = new Object();

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
  ajaxSelSummary();
});

function ajaxSelSummary() {
  const fileName = "./php/OrderSheet/SelSummarySubV2.php";
  const sendData = {
    die_number: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  ajaxSummaryTable = ajaxReturnData;
  makeTable(ajaxSummaryTable, $("#summary__table tbody"), "");
  // makeSummaryTable();
}

$(document).on("click", "#summary__table tbody tr", function () {
  const targetTr = $(this).find("td");
  const targetId = targetTr.eq(0).text();
  $("#summary__table tr.selected-record").removeClass("selected-record");
  $(this).addClass("selected-record");
});

$(document).on("keyup", "#priduction_number_sort", function () {
  var flag;
  $(this).val($(this).val().toUpperCase()); // 小文字を大文字に
  const text = $(this).val();

  // console.log(ajaxSummaryTable);

  makeTable(ajaxSummaryTable, $("#summary__table tbody"), text);
});

function makeTable(tableDataObj, targetDomObj, inputText) {
  var flag;
  targetDomObj.empty();

  tableDataObj.forEach(function (trVal) {
    flag = false;
    if (trVal["production_number"].includes(inputText, 0)) {
      var newTr = $("<tr>");
      if (trVal["production_quantity"] <= trVal["sum_packed_qty"]) {
        flag = true;
      }
      Object.keys(trVal).forEach(function (tdVal) {
        if (flag) {
          $("<td>").html(trVal[tdVal]).appendTo(newTr).addClass("packedOk");
        } else {
          $("<td>").html(trVal[tdVal]).appendTo(newTr);
        }
      });
      $(newTr).appendTo("#summary__table tbody");
    }
  });
}
