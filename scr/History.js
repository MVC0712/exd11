// 削除確認ダイアログ
let deleteDialog = document.getElementById("delete__dialog");
var ajaxReturnData;

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
  makeSummaryTable();
});

function makeSummaryTable() {
  var fileName = "./php/History/SelSummary.php";
  var sendData = {
    die_number: "%",
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#summary__table tbody"));
}

function fillTableBody(data, tbodyDom) {
  let checkLimit = new Object();
  let chekFlag = false;
  $(tbodyDom).empty();
  data.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal, index) {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    chekFlag = false;
    $(newTr).appendTo(tbodyDom);
  });
}

$(document).on("keyup", "#die-name__input", function () {
  console.log("hello");
  console.log($("#die-name__input").val());
  
  var fileName = "./php/History/SelSummary.php";
  var sendData = {
    die_number: $("#die-name__input").val() + "%",
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#summary__table tbody"));

});