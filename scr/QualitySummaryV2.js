let ajaxReturnData;

const isNumber = function (value) {
  return typeof value === "number" && isFinite(value);
};

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
  makeSummaryTable();
});

function makeSummaryTable() {
  var fileName;
  var sendData = new Object();
  var totalData = new Object();
  totalData["actual_billet_quantities"] = 0;

  fileName = "./php/QualitySummary/SelSummaryV2.php";
  sendData = {
    die_number: "%",
  };
  myAjax.myAjax(fileName, sendData);
  // table initialize
  $("#v_fix_tbl tbody").empty();
  $("#table_d tbody").empty();
  ajaxReturnData.forEach(function (trVal, i) {
    var newTr = $("<tr>"),
      dataTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal, index) {
      // making table
      // index < 4 ===> fixed column   index >= 4 ====> scroll data
      if (index < 4) {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
      } else {
        $("<td>").html(trVal[tdVal]).appendTo(dataTr);
      }
      // making total field
      // first initialize object value
      if (i == 0) {
        totalData[tdVal] = 0;
      }
      // trVal[tdVal]が数値型の時だけ、加算する。
      if (isNumber(Number(trVal[tdVal]))) {
        totalData[tdVal] = totalData[tdVal] + Number(trVal[tdVal]);
      }
    });
    $(newTr).appendTo("#v_fix_tbl tbody");
    $(dataTr).appendTo("#table_d tbody");
  });
  fillTotalValue(totalData);
}

function fillTotalValue(totalData) {
  Object.keys(totalData).forEach(function (value, index) {
    $("#" + value).html(totalData[value]);
  });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// -------------------------  color table record   -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#table_d tr", function () {
  $("body .selected__tr").removeClass("selected__tr");
  $(this).addClass("selected__tr");
  // get current row number
  $("#v_fix_tbl tr").eq($(this).index()).addClass("selected__tr");
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// -------------------------  filter function     -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// order sheet nuumber :

// -------- press type button display --------------
$(document).on("click", ".pressing-type__div", function () {
  if ($(this).hasClass("active__button")) {
    $(this).removeClass("active__button").addClass("non-active__button");
  } else {
    $(this).removeClass("non-active__button").addClass("active__button");
  }
});

// -------- process filter or die name filter  --------------
$(document).on("click", "#process-filter", function () {
  $(this).find(".disabled-mode").removeClass("disabled-mode");
  $("#dies-filter input").addClass("disabled-mode").val("");
});

$(document).on("click", "#dies-filter", function () {
  $(this).find(".disabled-mode").removeClass("disabled-mode");
  $("#process-filter input").addClass("disabled-mode").val("");
  $("#process-filter select").addClass("disabled-mode").val("0");
});

// -------- process filter or die name filter  --------------
$(document).on("click", "#process-filter", function () {
  $(this).find(".disabled-mode").removeClass("disabled-mode");
  $("#dies-filter input").addClass("disabled-mode").val("");
});

// -------- press type filtering              --------------
$(document).on("click", ".button__wrapper .pressing-type__div", function () {
  tableFilter();
});

// -------- Die Number Filtering          --------------
$(document).on("keyup", "#die_number__input", function () {
  $(this).val($(this).val().toUpperCase()); // 小文字を大文字に
  tableFilter();
});

$(document).on("change", "#dies-filter input[type='date']", function () {
  // when both value was inputed call filter function
  if (!checkDateInput()) return false;
  tableFilter();
});

function checkDateInput() {
  let flag = true;
  // when both value was inputed call filter function
  $("#dies-filter input[type='date']").each(function () {
    if ($(this).val() == "") {
      flag = false;
    }
  });
  return flag;
}

function tableFilter() {
  let str = setFilterStr();

  $("#table_d tr").each(function (index, element) {
    if (checkPressType($(this), str) && checkDieName($(this), index)) {
      $(this).removeClass("no-display");
      $("#v_fix_tbl tr").eq(index).removeClass("no-display");
    } else {
      $(this).addClass("no-display");
      $("#v_fix_tbl tr").eq(index).addClass("no-display");
    }
  });
}

function checkDieName(targetDom, index) {
  // die name filter -------------
  let flag = true;
  let string = $("#v_fix_tbl tr").eq(index).find("td").eq(2).html();
  let pattern = $("#die_number__input").val();
  let pressDate = Number(
    $("#v_fix_tbl tr").eq(index).find("td").eq(3).html().replace(/-/g, "")
  );
  let startDate = Number($("#start__date").val().replace(/-/g, ""));
  let endDate = Number($("#end__date").val().replace(/-/g, ""));
  // when disable mode , it always return ture
  if ($("#die_number__input").hasClass("disabled-mode")) {
    return true;
  }

  if (!string.indexOf(pattern)) {
    flag = true;
  } else {
    flag = false;
  }
  // when date filter is requested
  if (checkDateInput() && flag) {
    if (startDate < pressDate && pressDate < endDate) {
      flag = true;
    } else {
      flag = false;
    }
  }

  return flag;
}

function checkPressType(targetDom, str) {
  let mystr;
  let myregex = new RegExp();
  let result;
  mystr = targetDom.find("td").eq(2).html();
  myregex = RegExp(str);
  result = mystr.match(myregex);

  return result;
}

function setFilterStr() {
  let str = "";
  if ($("#test_press").parent().hasClass("active__button")) {
    str = "〇";
  }
  if ($("#masproduction_test_press1").parent().hasClass("active__button")) {
    if (str.length) {
      str = str + "|◎";
    } else {
      str = "◎";
    }
  }
  if ($("#masproduction").parent().hasClass("active__button")) {
    if (str.length) {
      str = str + "|●";
    } else {
      str = "●";
    }
  }
  return str;
}
