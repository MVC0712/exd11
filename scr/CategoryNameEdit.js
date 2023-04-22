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
  // make summary table
  // readSummaryTable();
  readCategory1Table();
  // $("#test__button").remove();
});

function readCategory1Table() {
  let fileName;
  let sendData = new Object();
  // read ng list and fill option
  fileName = "./php/ProductionNumber/SelCategory1V2.php";
  sendData = {
    dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  $("#category1__table tbody").empty();
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("#category1__table tbody");
  });
}

$(document).on("click", "#category1__table tbody tr", function () {
  let fileName;
  let sendData = new Object();
  $("#category1__table tbody tr.selected-record").removeClass(
    "selected-record"
  );
  $("#category1__tr").removeAttr("id");
  $(this).addClass("selected-record").attr("id", "category1__tr");

  fileName = "./php/ProductionNumber/SelCategory2V2.php";
  sendData = {
    targetId: $("#category1__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);

  // set category talbe
  $("#category2__table tbody").empty();
  if (ajaxReturnData.length == 0) {
    $("#category2__table tbody").append($("<tr>").append($("<td><td><td>")));
  } else {
    ajaxReturnData.forEach(function (trVal) {
      var newTr = $("<tr>");
      Object.keys(trVal).forEach(function (tdVal) {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
      });
      $(newTr).appendTo("#category2__table tbody");
    });
  }
  // copy category1 name
  console.log($(this).find("td").eq(1));
  console.log($(this).find("td").eq(1).text());
  console.log($(this).find("td").eq(0).text());
  $("#category1__text").val($(this).find("td").eq(1).text());
});

$(document).on("click", "#category2__table tbody tr", function () {
  $("#category2__table tbody tr.selected-record").removeClass(
    "selected-record"
  );
  $("#category2__tr").removeAttr("id");
  // $(this).removeClass("selected-record").removeAttr("id");
  $(this).addClass("selected-record").attr("id", "category2__tr");
});
