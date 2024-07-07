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

// Window Colose
$(document).on("mouseover", "#window_close__mark", function () {
  $("#window_close__mark").attr("src", "./img/close-2.png");
});

$(document).on("mouseout", "#window_close__mark", function () {
  $("#window_close__mark").attr("src", "./img/close.png");
});

$(document).on("click", "#window_close__mark", function () {
  window.close();
});

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
  makeTable(
    ajaxSummaryTable,
    $("#summary__table tbody"),
    "production_number",
    ""
  );
  // makeSummaryTable();
}

$(document).on("click", "#summary__table tbody tr", function () {
  const targetTr = $(this).find("td");
  const ordersheetId = targetTr.eq(0).html();
  const ordersheetNumber = targetTr.eq(1).html();
  const ordersheetPN = targetTr.eq(4).html();

  if ($(this).hasClass("selected-record")) {
    // window.close();
  }

  $("#summary__table tr.selected-record").removeClass("selected-record");
  $(this).addClass("selected-record");

  // Copy data to Master Page
  $(window.opener.document)
    .find("#order_number__select")
    .empty()
    .append($("<option>").val(ordersheetId).html(ordersheetNumber));
  $(window.opener.document)
    .find("#production_number__value")
    .html(ordersheetPN);

  makeProductionNumberOption(ordersheetPN);
});

function makeProductionNumberOption(ordesheetPN) {
  var targetDom = $(window.opener.document).find("#die_number__select");
  var optionList;
  var i = 0;
  const fileName = "./php/OrderSheet/SelDieName.php";
  const sendData = {
    die_number: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  optionList = ajaxReturnData;
  targetDom.find("option").remove();
  targetDom.append($("<option>").val(0).html("-"));

  optionList.forEach(function (element, index) {
    if (element["production_number"] == ordesheetPN) {
      targetDom.append(
        $("<option>").val(element["id"]).html(element["die_number"])
      );
      i = i + 1;
    }
  });
  $(window.opener.document).find("#number_of_die").text(i);
}

$(document).on("keyup", "#order-number__sort", function () {
  var flag;
  $(this).val($(this).val().toUpperCase()); // 小文字を大文字に
  const text = $(this).val();
  makeTable(
    ajaxSummaryTable,
    $("#summary__table tbody"),
    "ordersheet_number",
    text
  );
});

$(document).on("keyup", "#priduction_number_sort", function () {
  var flag;
  $(this).val($(this).val().toUpperCase()); // 小文字を大文字に
  const text = $(this).val();
  makeTable(
    ajaxSummaryTable,
    $("#summary__table tbody"),
    "production_number",
    text
  );
});

function makeTable(tableDataObj, targetDomObj, filterColumnName, inputText) {
  var flag;
  targetDomObj.empty();
  tableDataObj.forEach(function (trVal) {
    flag = false;
    if (trVal[filterColumnName].includes(inputText, 0)) {
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

  $("#summary__table_record").text(
    $("#summary__table tbody tr").length + "items"
  );
}
