let deleteDialog = document.getElementById("delete__dialog");
let inputData = new Object();
let fileName;
let sendData = new Object();
let ajaxReturnData;

const myAjax = {
  myAjax: function (fileName, sendData) {
    $.ajax({
      type: "POST",
      url: "./php/"+fileName,
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

const getTwoDigits = (value) => value < 10 ? `0${value}` : value;
const getDateTime = (date) => {
    const day = getTwoDigits(date.getDate());
    const month = getTwoDigits(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = getTwoDigits(date.getHours());
    const mins = getTwoDigits(date.getMinutes());
    return `${year}-${month}-${day} ${hours}:${mins}:00`;
}
$(function () {
  var now = new Date();
  var MonthLastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  var MonthFirstDate = new Date(now.getFullYear(), (now.getMonth() + 12) % 12, 1);
  var formatDateComponent = function(dateComponent) {
    return (dateComponent < 10 ? '0' : '') + dateComponent;
  };

  var formatDate = function(date) {
    return date.getFullYear()  + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate()) ;
  };
  $("#export_start_date").val(formatDate(MonthFirstDate));
  $("#export_end_date").val(formatDate(MonthLastDate));
  makeProductionNumber();
  // makeSummaryTable();
  // makeStockTable2();
});
function makeProductionNumber() {
  var fileName = "SelProductionNumber.php";
  var sendData = {
    code_input: $("#production_number_input").val(),
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#production_number tbody"));
};
function makeSummaryTable() {
  var fileName = "SelSummary.php";
  var sendData = {
    start: $("#export_start_date").val(),
    end: $("#export_end_date").val(),
    code: $("#export_code").val(),
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#summary__table tbody"));
};
function fillTableBody(data, tbodyDom) {
  $(tbodyDom).empty();
  data.forEach(function(trVal) {
      let newTr = $("<tr>");
      Object.keys(trVal).forEach(function(tdVal, index) {
          $("<td>").html(trVal[tdVal]).appendTo(newTr);
      });
      $(newTr).appendTo(tbodyDom);
  });
};
$(document).on("click", "#import_table tbody tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    $("#selected__tr").removeAttr("id");
    $(this).attr("id", "selected__tr");
  } else {
    let impid = $(this).find("td:nth-child(1)").html();
    let lot_bun_mate_qty = $(this).find("td:nth-child(3)").html();
    let length = $(this).find("td:nth-child(4)").html();
      var newTr = $("<tr>");

      $("<td>").html(impid).appendTo(newTr);
      $("<td>").html(lot_bun_mate_qty).appendTo(newTr);
      $("<td>").html(length).appendTo(newTr);
      $("<td>").append(makeInput("")
        .removeClass("no-input number-input")
      ).appendTo(newTr);
      $("<td>").append($("<button class='remove'>RM</button>")).appendTo(newTr);
      $(newTr).appendTo("#add__table tbody");
      $(this).remove();
  }
  checkSave();
});
function makeInput(qty) {
  let targetDom = $("<input>");
  targetDom.attr("type", "text");
  targetDom.val(qty).addClass("no-input number-input");
  return targetDom;
}
function makeBilletLength(seletedId) {
  let targetDom = $("<select>");
  var length=[{
    "id": "1",
    "length": "1200",
  },{
    "id": "2",
    "length": "600",
  }];
  length.forEach(function(element) {
    if (element["id"] == seletedId) {
      $("<option>")
        .html(element["length"])
        .val(element["id"])
        .prop("selected", true)
        .appendTo(targetDom);
    } else {
      $("<option>")
        .html(element["length"])
        .val(element["id"])
        .appendTo(targetDom);
    }
  });
  return targetDom;
}
$(document).on("keyup", "#production_number_input", function() {
  makeProductionNumber();
});
$(document).on("change", "#export_date", function() {
  if ($(this).val() != "") {
      $(this).removeClass("no-input").addClass("complete-input");
  } else {
      $(this).removeClass("complete-input").addClass("no-input");
  }
  checkSave();
});
$(document).on("change", "#export_start_date", function() {
  makeSummaryTable()
});
$(document).on("change", "#export_end_date", function() {
  makeSummaryTable()
});
$(document).on("keyup", "#export_code", function() {
  makeSummaryTable()
});
function checkSave() {
  let check = true;
  if ($("#add__table tbody tr").length==0 || $("#export_date").val()=="") {
    check = false;
  }
  $("#add__table tbody input").each(function() {
    if ($(this).hasClass("no-input")) {
      check = false;
    }
  });
  if (check) {
    $("#save__button").attr("disabled", false);
  } else {
    $("#save__button").attr("disabled", true);
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
$(document).on("keyup", ".number-input", function() {
  if($.isNumeric($(this).val())){
      $(this).removeClass("no-input").addClass("complete-input");
  } else {
      $(this).removeClass("complete-input").addClass("no-input");
  }
  checkSave();
});
$(document).on("keyup", ".text-input", function() {
  if($(this).val()!=""){
      $(this).removeClass("no-input").addClass("complete-input");
  } else {
      $(this).removeClass("complete-input").addClass("no-input");
  }
  checkSave();
});
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
$(document).on("click", "#save__button", function () {
  var fileName = "InsData.php";
  tableData = getTableData($("#add__table tbody tr"))
    jsonData = JSON.stringify(tableData);
    var sendData = {
        data : jsonData,
        export_date : $("#export_date").val(),
    };
    console.log(sendData);
  myAjax.myAjax(fileName, sendData);
  makeSummaryTable();
  $("#add__table tbody tr").remove();
  $("#export_date").val("").removeClass("complete-input").addClass("no-input");
  checkSave();
  makeStockTable2();
});
$(document).on("click", "#add__table tbody tr", function (e) {
  if (!$(this).hasClass("add-record")) {
    $(this).parent().find("tr").removeClass("add-record");
    $(this).addClass("add-record");
    $("#add__tr").removeAttr("id");
    $(this).attr("id", "add__tr");
  } else {
      // $(this).remove();
  }
});
$(document).on("click", "#add__table tbody tr td button", function (e) {
  console.log($(this).parent().parent());
  if ($(this).parent().parent().hasClass("add-record")) {
    $(this).parent().parent().remove();
  }
});
$(document).on("click", "#summary__table tbody tr", function (e) {
  if (!$(this).hasClass("update-sel")) {
    $(this).parent().find("tr").removeClass("update-sel");
    $(this).addClass("update-sel");
    $("#update__tr").removeAttr("id");
    $(this).attr("id", "update__tr");
  } else {
  let pas = prompt("Please enter your Password", "********");
  if ((pas == '01910926') || (pas == '02216872')) {
      deleteDialog.showModal();
    } else {
      alert("Wrong pas");
    }
  }
});
$(document).on("click", "#delete-dialog-cancel__button", function () {
  deleteDialog.close();
});
$(document).on("click", "#delete-dialog-delete__button", function () {
  let fileName = "DeleteData.php";
  sendData = {
    targetId : $("#update__tr td:nth-child(1)").html(),
  };
  console.log(sendData);
  myAjax.myAjax(fileName, sendData);
  deleteDialog.close();
  makeSummaryTable();
});

function makeStockTable2() {
  var fileName = "SelStockSum.php";
  var sendData = {
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#sum"));

  var fileName = "SelStockTotal.php";
  var sendData = {
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#total"));

  var fileName = "SelStock.php";
  var sendData = {
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#stock_table tbody"));
};