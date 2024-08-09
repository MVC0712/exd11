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
  fileName = "./php/OrderSheet/SelSummaryV53.php";
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
          if (parseInt(text) > 0) {
            $("<td>").html(text).addClass("plus-value").appendTo(newTr);
          } else {
            $("<td>").html(text).addClass("").appendTo(newTr);
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

function CheckOrderSheetNumber(ordersheetnumber) {
  var fileName = "./php/OrderSheet/CheckOrderSheetNumber.php";
  var sendData = {
    ordersheetnumber
  };
  myAjax.myAjax(fileName, sendData);
  return ajaxReturnData.length
}

var ExcelToJSON = function() {
  this.parseExcel = function(file) {
    var reader = new FileReader();

    reader.onload = function(e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {
        type: 'binary',
        cellDates: true,
        cellNF: false,
        cellText: false
      });
      const options = {
        raw: false, 
        dateNF: 'yyyy-mm-dd',
      };
      workbook.SheetNames.forEach(function(sheetName) {
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName], options);
        var productList = JSON.parse(JSON.stringify(XL_row_object));
        var rows = $('#excel_table tbody');
        for (i = 0; i < productList.length; i++) {
          var columns = Object.values(productList[i])
          if ((makeProductionNumberId(columns[1]) != "KTT") || (CheckOrderSheetNumber(columns[0]) == 0)) {
            rows.append(`
              <tr>
                <td>${columns[0].replace( /\s/g, '')}</td>
                <td>${columns[1].replace( /\s/g, '')}</td>
                <td>${makeProductionNumberId(columns[1].replace( /\s/g, ''))}</td>
                <td><input type="date" value="${columns[2].replace( /\s/g, '')}"</td>
                <td><input type="date" value="${columns[3].replace( /\s/g, '')}"</td>
                <td><input type="number" value="${columns[4].replace( /\s/g, '')}"</td>
                <td><input type="text" value="${columns[5].replace( /\s/g, '')}"</td>
                <td><button class="remove_button">X</button></td>
              </tr>
            `);
          } else {
            alert(columns[0] + " đã tồn tại! Hoặc " + columns[1] + " không tồn tại!");
          }
        }
      })
      go_check();
    };
    reader.onerror = function(ex) {
      console.log(ex);
    };

    reader.readAsBinaryString(file);
  };
};

function handleFileSelect(evt) {
  var files = evt.target.files;
  var xl2json = new ExcelToJSON();
  xl2json.parseExcel(files[0]);
};

document.getElementById('fileupload').addEventListener('change', handleFileSelect, false);

$(document).on("click", "#form", function() {
  const a = document.createElement("a");
  document.body.appendChild(a);

  a.download = "ImportOrderSheet.xlsx";
  a.href = "../../../diereport/ex0.11/py/ImportOrderSheet.xlsx";

  a.click();
  a.remove();
});

function makeProductionNumberId(pro) {
  fileName = "./php/OrderSheet/SelProductionNumberId.php";
  sendData = {
    pro: pro,
  };
  myAjax.myAjax(fileName, sendData);
  return ajaxReturnData.length == 1 ? ajaxReturnData[0].idd: "KTT";
};

$(document).on("click", "#add__button", function() {
  var newTr = $("<tr>");
  $("<td>").html($("#ordersheet_number__select").val()).appendTo(newTr);
  $("<td>").html(makeOrderSheetNumber($("#ordersheet_number__select").val())).appendTo(newTr);
  $("<td>").html($("#production_number").text()).appendTo(newTr);
  $("<td>").append(makeDateInput($("#import_at").val())).appendTo(newTr);
  $("<td>").append(makeInput($("#quantity").val())).appendTo(newTr);
  $("<td>").append("<button class='remove_button'>X</button>").appendTo(newTr);
  $(newTr).appendTo("#excel_table tbody");

  $("#ordersheet_number__select").val(0);
  $("#ordersheet_number__select").removeClass("complete-input").addClass("no-input");
  $("#quantity").val("");
  $("#quantity").removeClass("complete-input").addClass("no-input");
  $("#note").val("");
  $("#import_at").val("");
  $("#import_at").removeClass("complete-input").addClass("no-input");
  $("#production_number").html('Production number');
  $("#add__button").prop("disabled", true);
  go_check();
});
$(document).on("click", "#excel_table tbody tr", function (e) {
  if (!$(this).hasClass("add-record")) {
    $(this).parent().find("tr").removeClass("add-record");
    $(this).addClass("add-record");
    $("#add__tr").removeAttr("id");
    $(this).attr("id", "add__tr");
  } else {
      // $(this).remove();
  }
  go_check();
});
$(document).on("click", "#excel_table tbody tr td button", function (e) {
  console.log($(this).parent().parent());
  if ($(this).parent().parent().hasClass("add-record")) {
    $(this).parent().parent().remove();
  }
  go_check();
});

function go_check() {
  if ($("#excel_table tbody tr").length == 0){
      $("#save__button").prop("disabled", true);
  } else {
      $("#save__button").prop("disabled", false);
  }
};

function add_check() {
  if (($("#import_at").val() == "")|| 
      ($("#ordersheet_number__select").val() == 0)||
      ($("#quantity").val() <= 0)){
      $("#add__button").prop("disabled", true);
  } else {
      $("#add__button").prop("disabled", false);
  }
};
function getTableData(tableTrObj) {
  var tableData = [];
  tableTrObj.each(function (index, element) {
    var tr = [];
    $(this)
      .find("td")
      .each(function (index, element) {
        if ($(this).find("input").length) {
          tr.push($(this).find("input").val());
        } else if ($(this).find("select").length) {
          tr.push($(this).find("select").val());
        } else {
          tr.push($(this).html());
        }
      });
    tableData.push(tr);
  });
  return tableData;
};
$(document).on("click", "#save__button", function() {
  var fileName = "./php/OrderSheet/InsOrderSheetV3.php";
  tableData = getTableData($("#excel_table tbody tr"));
  jsonData = JSON.stringify(tableData);
  var sendData = {
      data : jsonData,
  };
  console.log(sendData);
  myAjax.myAjax(fileName, sendData);
  $("#excel_table tbody").empty();

  readSummaryTable();
});