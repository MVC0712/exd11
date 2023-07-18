var ordersheetTableData;
var productionNumberTableData;

$(function () {
  readSummaryTable();
  readProductionNumberTable();
  makeProductionNumberToSelect();
});

function readSummaryTable() {
  let fileName;
  let sendData = new Object();
  let number = 1;
  // read ng list and fill option
  fileName = "./php/OrderSheet/SelSummaryV5.php";
  sendData = {
    dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  $("#summary__table tbody").empty();
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal, index) {
      var text = trVal[tdVal];
      switch (index) {
        case 9: // "OK-Ord" Value
          if (parseInt(text) < 0) {
            $("<td>").html(text).addClass("mainus-value").appendTo(newTr);
          } else {
            $("<td>").html(text).addClass("plus-value").appendTo(newTr);
          }
          break;
        case 11:
          if (parseInt(text) < 0) {
            $("<td>").html(text).addClass("mainus-value").appendTo(newTr);
          } else {
            $("<td>").html(text).addClass("plus-value").appendTo(newTr);
          }
          break;
        default:
          $("<td>").html(text).appendTo(newTr);
          break;
      }
    });
    $(newTr).appendTo("#summary__table tbody");
  });
  $("#summary__table_record").html(
    $("#summary__table tbody tr").length + " items"
  );
}

$(document).on("click", "#summary__table tbody tr", function () {
  let targetVal;
  let today = new Date();
  const targetTr = $(this).find("td");
  const selecedtId = parseInt(targetTr.eq(0).text());
  const arrivalDate = targetTr.eq(5).text();
  // first make select option
  readProductionNumberTable();
  makeProductionNumberToSelect();
  // addClass "selected-record"
  $("#summary__table tr.selected-record").removeClass("selected-record");
  $(this).addClass("selected-record");

  // when ordersheet data has not read, read table
  if (!ordersheetTableData) {
    fileName = "./php/OrderSheet/SelSummarySub2.php";
    sendData = {
      dummy: "dummy",
    };
    myAjax.myAjax(fileName, sendData);
    ordersheetTableData = ajaxReturnData;
  }
  // copy data to input element
  ordersheetTableData.forEach(function (value) {
    // console.log(value);
    if (value["id"] == selecedtId) {
      console.log(value);
      $("#ordersheet_number")
        .removeClass("input-required")
        .val(value["ordersheet_number"]);
      $("#input_production_number")
        .removeClass("input-required")
        .val(value["production_number"]);
      $("#production_number")
        .val(value["production_numbers_id"])
        .removeClass("input-required");
      $("#issue_at").removeClass("input-required").val(value["issue_date_at"]);
      $("#delivery_at")
        .removeClass("input-required")
        .val(value["delivery_date_at"]);
      $("#production_qunatity")
        .removeClass("input-required")
        .val(value["production_quantity"]);
      $("#note").removeClass("input-required").val(value["note"]);
    }
  });
  $("#mode_display").text("Edit Mode");
});

function readProductionNumberTable() {
  let fileName;
  let sendData = new Object();

  if (!ordersheetTableData) {
    fileName = "./php/OrderSheet/SelProductionNumberV2.php";
    sendData = {
      dummy: "dummy",
    };
    myAjax.myAjax(fileName, sendData);
    productionNumberTableData = ajaxReturnData;
  }
}

function makeProductionNumberToSelect() {
  // var mySelect = $("<select>").append($("<option>").val(0).html("no"));
  var targetObj = $("#production_number");
  targetObj.empty().append($("<option>").val(0).html("no"));

  productionNumberTableData.forEach(function (recordData) {
    targetObj.append(
      $("<option>").val(recordData.id).html(recordData.production_number)
    );
  });
  // targetTd.empty().append(mySelect);
}

$(document).on("keyup", "#input_production_number", function () {
  const targetObj = $(this);
  // var newProductionNumberTableData = new Object();
  var strIndex;
  var selectObj = $("#production_number");
  selectObj.empty().append($("<option>").val(0).html("no"));

  // requery option list by inputed letters
  $(this).val($(this).val().toUpperCase()); // 小文字を大文字に

  productionNumberTableData.forEach(function (value, index) {
    strIndex = value["production_number"].indexOf(targetObj.val());
    if (strIndex != -1) {
      selectObj.append(
        $("<option>").val(value["id"]).html(value["production_number"])
      );
    }
  });
});

$(document).on("click", "#test__button", function () {
  // test button
  console.log(ordersheetTableData);

  $("#production_number").val("122");
});
