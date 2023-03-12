// 23/03/12 Fisrt day

// category　テーブルの編集モード
let summaryTableEditMode = false;
let ajaxReturnData;

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
  let fileName;
  let sendData = new Object();
  let number = 1;
  // read ng list and fill option
  fileName = "./php/Die/SelBolster2.php";
  sendData = {
    dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);

  console.log(ajaxReturnData);

  $("#bolster__table tbody").empty();
  ajaxReturnData.forEach(function (trVal) {
    // console.log(trVal);
    var newTr = $("<tr>");
    $("<td>").html(number).appendTo(newTr);
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
      console.log(newTr);
    });
    console.log(newTr);
    $(newTr).appendTo("#bolster__table tbody");
  });

  return;
  $("#ng-code__select").empty();
  ajaxReturnData.forEach(function (value) {
    $("<option>")
      .val(value["id"])
      .html(value["description"])
      .appendTo("#ng-code__select");
  });

  // staff list option list
  setStaffList();
  // packing work recentry history
  setRecentryPackingWork();
  // packing history table
  setRecentBoxList();
});

$(document).on("click", "#bolster__table tbody tr", function () {
  // Make Ng table
  // display total qty
  // display total OK qty
  $("tr.selected-record").removeClass("selected-record");

  $(this).addClass("selected-record");
});
