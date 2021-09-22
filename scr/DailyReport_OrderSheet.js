$(function () {
  ajaxSelSummary();
});

function ajaxSelSummary() {
  $.ajax({
    type: "POST",
    url: "./php/OrderSheet/SelSummary.php",
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
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Summary Table ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#summary__table tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    // tr に class を付与し、選択状態の background colorを付ける
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    // tr に id を付与する
    $("#selected__tr").removeAttr("id");
    $(this).attr("id", "selected__tr");
  } else {
    let ordersheetId = $(this).find("td").eq(0).html();
    let ordersheetNumber = $(this).find("td").eq(1).html();
    let ordersheetQuantity = $(this).find("td").eq(5).html();
    // console.log(ordersheetId);
    // 選択レコードを再度クリックした時
    // Copy data to Master Page
    $(window.opener.document)
      .find("#directive_input__select")
      .empty()
      .append($("<option>").val("0").html("no"))
      .append($("<option>").val(ordersheetId).html(ordersheetNumber));
    // set ordersheet quantity
    $(window.opener.document)
      .find("#ordersheet-quantity")
      .html(ordersheetQuantity);

    open("about:blank", "_self").close(); // ウィンドウを閉じる
  }
});
