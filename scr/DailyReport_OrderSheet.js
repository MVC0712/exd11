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

function timkiem() {
  var input, table, tr, td, td1, td2, filter, i, txtdata, txtdata1, txtdata2, txtdata3;
  input = document.getElementById("die_number__input");
  filter = input.value.toUpperCase();
  table = document.getElementById("summary__table");
  var tbody = table.getElementsByTagName("tbody")[0];
  var tr = tbody.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      td1 = tr[i].getElementsByTagName("td")[2];
      td2 = tr[i].getElementsByTagName("td")[3];
      td3 = tr[i].getElementsByTagName("td")[4];
      if (td||td1||td2) {
          txtdata = td.innerText;
          txtdata1 = td1.innerText;
          txtdata2 = td2.innerText;
          txtdata3 = td3.innerText;
          if (txtdata.toUpperCase().indexOf(filter) > -1||
              txtdata1.toUpperCase().indexOf(filter) > -1||
              txtdata2.toUpperCase().indexOf(filter) > -1||
              txtdata3.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
          } else {
              tr[i].style.display = "none";
          }
      }
  }
} 