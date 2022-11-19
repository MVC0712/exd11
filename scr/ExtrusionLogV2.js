let editMode = false;
let cancelKeyupEvent;
let deleteDialog = document.getElementById("delete__dialog");
const myAjax = {
  myAjax: function(fileName, sendData) {
      $.ajax({
              type: "POST",
              url: fileName,
              dataType: "json",
              data: sendData,
              async: false,
          })
          .done(function(data) {
              ajaxReturnData = data;
          })
          .fail(function() {
              alert("DB connect error");
          });
  },
};

$(function() {
  var formatDateComponent = function(dateComponent) {
    return (dateComponent < 10 ? '0' : '') + dateComponent;
  };

  var formatDate = function(date) {
    return date.getFullYear()  + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate()) ;
  };
  var now = new Date();
  var MonthFirstDate = new Date(now.getFullYear(), (now.getMonth() + 12) % 12, 1);
  var a = new Date();
  var c = formatDate(new Date());

  $("#plan_start").val(formatDate(MonthFirstDate));
  $("#input_date").val(c);
  $("#plan_end").val(formatDate(new Date(a.setDate(a.getDate() + 14))))
  makeDieSelect();
  makePrstypeSelect();
  makeSummaryTable();
  makeCodetable();
});

function makeSummaryTable() {
  var fileName = "./php/ExtrusionLog/SelSummaryV2.php";
  var sendData = {
    start : $("#plan_start").val(),
    end : $("#plan_end").val(),
    prs_type_search : $("#prs_type_search").val(),
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#summary__table tbody"));
};
function makeCodetable() {
  let targetDom = $("<select>");
  fileName = "./php/ExtrusionLog/SelCode2Row.php";
  sendData = {
    code_search: $("#code_search").val()
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody2Row(ajaxReturnData, $("#code__table tbody"));
};
function fillTableBody(data, tbodyDom) {
  $(tbodyDom).empty();
    data.forEach(function(trVal) {
      var newTr = $("<tr>");
      Object.keys(trVal).forEach(function(tdVal) {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
      });
      $(newTr).appendTo(tbodyDom);
  });
};
function fillTableBody2Row(data, tbodyDom) {
  $(tbodyDom).empty();
  data.forEach(function(trVal, index) {
    var newTr = $("<tr>");
  if (index % 2 == 0) {
    Object.keys(trVal).forEach(function(tdVal) {
      if (tdVal == "code") {
        $("<td>").html(trVal[tdVal]).attr('rowspan',2).appendTo(newTr);
      } else if (tdVal == "o") {
        $("<td>").html(trVal[tdVal]).css("display", "none").appendTo(newTr);
      } else {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
      }
    });
  } else {
    Object.keys(trVal).forEach(function(tdVal) {
      if ((tdVal == "code") || (tdVal == "o")) {
        $("<td>").html(trVal[tdVal]).css("display", "none").appendTo(newTr);
      } else {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
      }
    });
  }
  $(newTr).appendTo(tbodyDom);
});
};
function makeDieSelect() {
  fileName = "./php/ExtrusionLog/SelDieNumber.php";
  sendData = {
    input_date : $("#input_date").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#die-number__select > option").remove();
  $("#die-number__select").append($("<option>").val(0).html("No select"));
  ajaxReturnData.forEach(function(value) {
      $("#die-number__select").append(
          $("<option>").val(value["id"]).html(value["die_number"])
      );
  });
};
function makePrstypeSelect() {
  fileName = "./php/ExtrusionLog/SelPrsType.php";
  sendData = {
  };
  myAjax.myAjax(fileName, sendData);
  $("#prs_type_search > option").remove();
  $("#prs_type_search").append($("<option>").val(0).html("No"));
  ajaxReturnData.forEach(function(value) {
      $("#prs_type_search").append(
          $("<option>").val(value["id"]).html(value["pressing_type"])
      );
  });
};
$(document).on("change", "#input_date", function () {
  makeDieSelect();
});
$(document).on("keyup", "#code_search", function () {
  makeCodetable();
});
$(document).on("click", "#add__button", function () {
  var newTr = $("<tr>");
      $("<td>").html(1).appendTo(newTr);
      $("<td>").append(makeDieNumberSel($("#die-number__select").val())).appendTo(newTr);
      // $("<td>").append(makePressingTypeSel().prop('disabled', true)).appendTo(newTr);
      $("<td>").append(makePressingTypeSel()).appendTo(newTr);
      $("<td>").append($("<input>").attr("type", "text").addClass("code-search"))
              .append(makeCodeSel("").addClass("no-input code-input")).appendTo(newTr);
      // $("<td>").append(makeTime("").addClass("no-input time-input")).appendTo(newTr);
      $("<td>").append(makeInput("").addClass("no-input time-input")).appendTo(newTr);
      $("<td>").append(makeInput("").addClass("no-input time-input")).appendTo(newTr);
      $("<td>").append(makeInput("")).appendTo(newTr);
      $(newTr).appendTo("#add__table tbody");
      checkSave()
});

function makeDieNumberSel(seletedId) {
  let targetDom = $("<select>");
  fileName = "./php/ExtrusionLog/SelDieNumber.php";
  sendData = {
    input_date : $("#input_date").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("<option>").html("----").val(0).appendTo(targetDom);
  ajaxReturnData.forEach(function(element) {
      if (element["id"] == seletedId) {
          $("<option>")
              .html(element["die_number"])
              .val(element["id"])
              .prop("selected", true)
              .appendTo(targetDom);
      } else {
          $("<option>")
              .html(element["die_number"])
              .val(element["id"])
              .appendTo(targetDom);
      }
  });
  return targetDom;
};
function makePressingTypeSel() {
  if ($("#die-number__select").val() != 0) {
    fileName = "./php/ExtrusionLog/SelPressingTypeByDataId.php";
    sendData = {
      input_date : $("#input_date").val(),
      dies_id : $("#die-number__select").val(),
    };
    myAjax.myAjax(fileName, sendData);
    if (ajaxReturnData.length != 0) {
      var selected = ajaxReturnData[0]["pressing_type_id"];
    } else {
      var selected = 0;
    }
  }
  let targetDom = $("<select>");
  $("<option>").html("----").val(0).appendTo(targetDom);
    fileName = "./php/ExtrusionLog/SelPressingType.php";
    sendData = {
      input_date : $("#input_date").val(),
      dies_id : $("#die-number__select").val(),
    };
    myAjax.myAjax(fileName, sendData);
    ajaxReturnData.forEach(function(element) {
      if (element["id"] == selected) {
          $("<option>")
              .html(element["pressing_type"])
              .val(element["id"])
              .prop("selected", true)
              .appendTo(targetDom);
      } else {
          $("<option>")
              .html(element["pressing_type"])
              .val(element["id"])
              .appendTo(targetDom);
      }
  });
  return targetDom;
};
function makeCodeSel(seletedId) {
  let targetDom = $("<select>");
  fileName = "./php/ExtrusionLog/SelCode.php";
  sendData = {
  };
  myAjax.myAjax(fileName, sendData);
  $("<option>").html("----").val(0).appendTo(targetDom);
  ajaxReturnData.forEach(function(element) {
      if (element["id"] == seletedId) {
        $("<option>")
            .html(element["code"])
            .val(element["id"])
            .prop("selected", true)
            .appendTo(targetDom);
      } else {
        $("<option>")
            .html(element["code"])
            .val(element["id"])
            .appendTo(targetDom);
      }
  });
  return targetDom;
};

function makeDate(date) {
  let targetDom = $("<input>");
  targetDom.attr("type", "date");
  targetDom.val(date);
  return targetDom;
}
function makeTime(time) {
  let targetDom = $("<input>");
  targetDom.attr("type", "time");
  targetDom.val(time);
  return targetDom;
}
function makeInput(input) {
  let targetDom = $("<input>");
  targetDom.attr("type", "text");
  targetDom.val(input);
  return targetDom;
}
$(document).on("change", ".code-input", function () {
  if ($(this).val() != 0)
    $(this).removeClass("no-input").addClass("complete-input");
  else $(this).removeClass("complete-input").addClass("no-input");
  checkSave();
});
// $(document).on("change", ".time-input", function () {
//   if ($(this).val() != "")
//     $(this).removeClass("no-input").addClass("complete-input");
//   else $(this).removeClass("complete-input").addClass("no-input");
//   checkSave();
// });
$(document).on("keyup", ".time-input", function () {
  if (checkTimeValue($(this).val()) || cancelKeyupEvent) {
    $(this).removeClass("no-input").addClass("complete-input");
    cancelKeyupEvent = false;
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  checkSave();
});
$(document).on("keydown", ".time-input", function (e) {
  if (e.keyCode == 13 && $(this).hasClass("complete-input")) {
    $(this).val(addColon($(this).val()));
    cancelKeyupEvent = true;
    return false;
  }
  checkSave();
});
function addColon(inputValue) {
  let returnVal;
  switch (inputValue.length) {
    case 3:
      returnVal = inputValue.substr(0, 1) + ":" + inputValue.substr(1, 2);
      break;
    case 4:
      returnVal = inputValue.substr(0, 2) + ":" + inputValue.substr(2, 2);
      break;
  }
  return returnVal;
}

function checkTimeValue(inputValue) {
  // 0:00 ~ 23:59 までに入っているか否か、判断する
  let flag = false;
  if (inputValue.substr(0, 1) == "1" && inputValue.length == 4) {
    // 1で始まる4桁時刻
    if (
      0 <= Number(inputValue.substr(1, 1)) &&
      Number(inputValue.substr(1, 1)) <= 9 &&
      0 <= Number(inputValue.substr(2, 2)) &&
      Number(inputValue.substr(2, 2) <= 59)
    ) {
      flag = true;
    } else {
      flag = false;
    }
  } else if (inputValue.substr(0, 1) == "2" && inputValue.length == 4) {
    // 2で始まる4桁時刻
    if (
      0 <= Number(inputValue.substr(1, 1)) &&
      Number(inputValue.substr(1, 1)) <= 3 &&
      0 <= Number(inputValue.substr(2, 2)) &&
      Number(inputValue.substr(2, 2) <= 59)
    ) {
      flag = true;
    } else {
      flag = false;
    }
  } else if (
    0 <= Number(inputValue.substr(0, 1)) &&
    Number(inputValue.substr(0, 1)) <= 9 &&
    inputValue.length == 3
  ) {
    // 3~9で始まる3桁時刻
    if (
      0 <= Number(inputValue.substr(1, 2)) &&
      Number(inputValue.substr(1, 2) <= 59)
    ) {
      flag = true;
    } else {
      flag = false;
    }
  } else {
    flag = false;
  }
  return flag;
}
$(document).on("change", "#plan_start", function (e) {
  makeSummaryTable();
});
$(document).on("change", "#plan_end", function (e) {
  makeSummaryTable();
});
$(document).on("change", "#prs_type_search", function (e) {
  makeSummaryTable();
});
function checkSave() {
  let check = true;
  if ($("#add__table tbody tr").length==0) {
    check = false;
  };
  $("#add__table tbody input").each(function() {
    if ($(this).hasClass("no-input")) {
      check = false;
    }
  });
  $("#add__table tbody select").each(function() {
    if ($(this).hasClass("no-input")) {
      check = false;
    }
  });
  if (check) {
    $("#save__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
  }
};
// $(document).on("click", "#summary__table tbody tr", function (e) {
//   if (!$(this).hasClass("selected-record")) {
//     $(this).parent().find("tr").removeClass("selected-record");
//     $(this).parent().find("tr").removeClass("same-date");
//     $(this).addClass("selected-record");
//     $("#selected__tr").removeAttr("id");
//     $(this).attr("id", "selected__tr");
//     $("#selected__tr td:nth-child(3) input").attr("id", "selected__date");
//   } else {
//     // deleteDialog.showModal();
//   }
// });
$(document).on("click", "#add__table tbody tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    $("#add__tr").removeAttr("id");
    $(this).attr("id", "add__tr");
  } else {
    // $(this).remove();
  }
  checkSave();
});
$(document).keyup(function(e) {
  var code = e.keyCode || e.which;
  if (code == '9') {
    $(document).on("focus", "#add__table tbody tr", function (e) {
        if (!$(this).hasClass("selected-record")) {
          $(this).parent().find("tr").removeClass("selected-record");
          $(this).addClass("selected-record");
          $("#add__tr").removeAttr("id");
          $(this).attr("id", "add__tr");
        }
    }); 
  }
});

$(document).on("keyup", "#add__table tbody tr td .code-search", function () {
  let sendData = new Object();
  let fileName;
  fileName = "./php/ExtrusionLog/SelCodeSearch.php";
  sendData = {
    code_search : $(this).val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#add__tr td:nth-child(4) select > option").remove();
  $("<option>").html("----").val(0).appendTo("#add__tr td:nth-child(4) select");
  ajaxReturnData.forEach(function(element) {
    $("<option>").html(element["code"]).val(element["id"]).appendTo("#add__tr td:nth-child(4) select");
  });
});
function getTableDataInput(tableTrObj) {
  var tableData = [];
  tableTrObj.each(function (index, element) {
    var tr = [];
    $(this).find("td")
      .each(function (index, element) {
          if ($(this).find("select").length) {
              tr.push($(this).find("select").val());
          } else if ($(this).find("input").length) {
              tr.push($(this).find("input").val());
          } else {
              tr.push($(this).html());
          }
      });
      tableData.push(tr);
  });
  return tableData;
};

$(document).on("click", "#delete-dialog-cancel__button", function () {
  deleteDialog.close();
});

$(document).on("click", "#delete-dialog-delete__button", function () {
  var fileName = "./php/ExtrusionLog/DelPlan.php";
  var sendData = {
    targetId : $("#selected__tr td:nth-child(1)").html(),
  };
  myAjax.myAjax(fileName, sendData);
  deleteDialog.close();
  makeSummaryTable();
});
// ------------------------- Save Button -------------------------
$(document).on("click", "#save__button", function () {
  var fileName = "./php/ExtrusionLog/InsExtrusionLogV2.php";
  tableData = getTableDataInput($("#add__table tbody tr"))
    jsonData = JSON.stringify(tableData);
    var sendData = {
        data : jsonData,
        input_date : $("#input_date").val(),
        machine_number : $("#machine_number").val(),
    };
    console.log(sendData);
  myAjax.myAjax(fileName, sendData);
  makeSummaryTable();
  clearInputData();
});

function clearInputData() {
  $("#add__table tbody tr").remove();
}

$(document).on("click", "#download_excel", function() {
  ajaxMakeDlFile("ExtrusionLog");
});
function ajaxMakeDlFile(phpFileName) {
  $.ajax({
    type: "POST",
    url: "./php/DownLoad/" + phpFileName + ".php",
    dataType: "json",
    data: {
      file_name: phpFileName,
      start : $("#plan_start").val(),
      end : $("#plan_end").val(),
    }}).done(function(data) {
      downloadFile(phpFileName + ".csv");
  }).fail(function(data) {
      alert("call php program error 255");
  });
}

function downloadFile(downloadFileName) {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = downloadFileName;
  a.href = "./download/" + downloadFileName;

  a.click();
  a.remove();
}