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
  makeSummaryTable();
}

function makeSummaryTable() {
  let intQty;
  let data = ajaxReturnData;
  $("#summary__table tbody").empty();
  data.forEach(function (trVal) {
    var newTr = $("<tr>");
    trVal["production_quantity"] = String(trVal["production_quantity"]).replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g,
      "$1,"
    );

    Object.keys(data[0]).forEach(function (tdVal, index) {
      if (index == 5) {
        intQty = trVal[tdVal];
      }
      if (index != 7) {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
      } else {
        if (trVal[tdVal] >= intQty) {
          $("<td>").html(trVal[tdVal]).addClass("packedOk").appendTo(newTr);
        } else {
          $("<td>").html(trVal[tdVal]).appendTo(newTr);
        }
      }
    });
    $("#summary__table tbody").append($(newTr));
  });
}

$(document).on("click", "#summary__table tbody tr", function () {
  const targetTr = $(this).find("td");
  const targetId = targetTr.eq(0).text();
  $("#summary__table tr.selected-record").removeClass("selected-record");
  $(this).addClass("selected-record");
});
