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
  $.ajax({
    type: "POST",
    url: "./php/OrderSheet/SelSummarySubV2.php",
    dataType: "json",
    async: false,
    data: {
      die_number: "dummy",
    },
  })
    .done(function (data) {
      makeSummaryTable(data);
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function makeSummaryTable(data) {
  let intQty;
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
        // console.log(intQty);
      }
      if (index != 7) {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
      } else {
        // console.log(trVal[tdVal] + ":" + intQty);
        if (trVal[tdVal] <= intQty) {
          $("<td>").html(trVal[tdVal]).addClass("packedOk").appendTo(newTr);
          // console.log("OK");
        } else {
          $("<td>").html(trVal[tdVal]).appendTo(newTr);
        }
      }
    });
    $("#summary__table tbody").append($(newTr));
  });
  // make_action();
}

$(document).on("click", "#summary__table tbody tr", function () {
  const targetTr = $(this).find("td");
  const targetId = targetTr.eq(0).text();
  $("#summary__table tr.selected-record").removeClass("selected-record");
  $(this).addClass("selected-record");
});
