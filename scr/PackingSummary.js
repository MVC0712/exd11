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
  var fileName = "./php/PackingSummary/SelSummary.php";
  var sendData = {
    die_number: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  console.log(ajaxReturnData);

  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("#summary__table tbody");
  });
});

$(document).on("click", "#summary__table tbody tr", function (e) {
  // remove id and class and set id and class
  $("#selected__tr").removeAttr("id");
  $(this).parent().find("tr").removeClass("selected-record");
  $(this).addClass("selected-record").attr("id", "selected__tr");
  setSubTable();
});

function setSubTable() {
  var fileName = "./php/PackingSummary/SelSelBoxList.php";
  var sendData = {
    m_ordersheet_id: $("#selected__tr td:nth-child(1)").html(),
  };
  var total = 0;
  myAjax.myAjax(fileName, sendData);
  $("#sub__table tbody:nth-child(2)").empty();
  ajaxReturnData.forEach(function (trVal) {
    total = total + Number(trVal["work_qty"]);
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("#sub__table tbody:nth-child(2)");
  });
  $("#total_qty").html(total);
}

$(document).on("click", "#sub__table tbody tr", function (e) {
  // remove id and class and set id and class
  $("#sub__tr").removeAttr("id");
  $(this).parent().find("tr").removeClass("selected-record");
  $(this).addClass("selected-record").attr("id", "sub__tr");
});

$(document).on("click", "#box-history__button", function (e) {
  window.open("./PackingBoxNumberSummary.html");
});
