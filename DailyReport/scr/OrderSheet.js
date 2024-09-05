$(function () {
    ajaxSelSummary();
  });
  
function ajaxSelSummary() {
  $.ajax({
    type: "POST",
    url: "./php/SelOrderSheetSum.php",
    dataType: "json",
    async: false,
    data: {
      search: $("#search").val(),
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
  $("#summary__table tbody").empty();
  data.forEach(function (trVal) {
    var newTr = $("<tr>");
    trVal["production_quantity"] = String(trVal["production_quantity"]).replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g,
      "$1,"
    );
    Object.keys(data[0]).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $("#summary__table tbody").append($(newTr));
  });
  // make_action();
}

$(document).on("click", "#summary__table tbody tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    $("#selected__tr").removeAttr("id");
    $(this).attr("id", "selected__tr");
  } else {
    let ordersheetId = $(this).find("td").eq(0).html();
    let ordersheetNumber = $(this).find("td").eq(1).html();
    let productionNumberId = $(this).find("td").eq(7).html();
    $(window.opener.document)
      .find("#ordersheet_id")
      .empty()
      .append($("<option>").val("0").html("no"))
      .append($("<option>").val(ordersheetId).html(ordersheetNumber));
    $(window.opener.document)
      .find("#production_number_id")
      .val(productionNumberId)
      .removeClass("no-input")
      .addClass("complete-input");
    open("about:blank", "_self").close();
  }
});