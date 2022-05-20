// 2021/09/10 start to edit
// 削除確認ダイアログ
let deleteDialog = document.getElementById("delete__dialog");

// 初期値
let ajaxReturnData;
let cancelKeyupEvent = false;
let cancelKeydownEvent = false;
let editMode = false;
let readNewFile = false;

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
  // test ボタンの表示
  $("#test__button").hide();
  setSummaryTable();
  ErrorCode();
  $("#machine-number__select").val(1).removeClass("no-input").addClass("complete-input");
});
// *****************************************************
// *****************************************************
// ************** input value check
// *****************************************************
// *****************************************************
// order sheet select
$(document).on("click", "#directive__input", function () {
  window.open(
    "./DailiReport_OrderSheet.html",
    null,
    "width=830, height=500,toolbar=yes,menubar=yes,scrollbars=no"
  );
});
// order sheet select
$(document).on("change", "#directive_input__select", function () {
  // after selection, set die list order by production number
  let fileName;
  let sendData = new Object();

  fileName = "./php/DailyReport/SelSelDieNumber.php";
  sendData = {
    m_ordersheet_id: $("#directive_input__select").val(),
  };
  myAjax.myAjax(fileName, sendData);

  $("#die__select option").remove();
  $("#die__select").append($("<option>").val(0).html("NO select"));
  ajaxReturnData.forEach(function(value) {
      $("#die__select").append(
          $("<option>").val(value.m_dies_id).html(value.die_number)
      );
  });
  $("#number-of-die__display").html(ajaxReturnData.length);
  $("#die__input").prop("disabled", true);

  $("#pressing-type__select")
    .val("3")
    .removeClass("no-input")
    .addClass("complete-input");
});
// press date
$(document).on("change", "#date__input", function () {
  $(this).removeClass("no-input").addClass("complete-input");
});
// Die Name
$(document).on("keyup", "#die__input", function () {
  let fileName = "./php/DailyReport/SelDieNumber.php";
  let sendData = {
    die_number: $(this).val() + "%",
  };
  myAjax.myAjax(fileName, sendData);
  $("#number-of-die__display").html(ajaxReturnData.length);
  $("#die__select option").remove();
  $("#die__select").append($("<option>").val(0).html("NO select"));
  ajaxReturnData.forEach(function (value) {
    $("#die__select").append(
      $("<option>").val(value["id"]).html(value["die_number"])
    );
  });
});
// Die Select
$(document).on("change", "#die__select", function () {
  if ($(this).val() != "0") {
    let fileName = "./php/DailyReport/SelDirective.php";
    let sendData = {
      targetId: $(this).val(),
    };
    myAjax.myAjax(fileName, sendData);
    $("#press-directive__select option").remove();
    // $("#press-directive__select").append($("<option>").val(0).html("NO select"));
    ajaxReturnData.forEach(function (value) {
      $("#press-directive__select").append(
        $("<option>").val(value["id"]).html(value["plan_date_at"])
      );
    });
    $(this).removeClass("no-input").addClass("complete-input");
    $("#press-directive__select")
      .removeClass("no-input")
      .addClass("complete-input");
  } else {
    $("#press-directive__select option").remove();
    $(this).removeClass("complete-input").addClass("no-input");
    $("#press-directive__select")
      .removeClass("complete-input")
      .addClass("no-input");
  }
});
// is Washed?
$(document).on("change", "#is-washed__select", function () {
  if ($(this).val() != 0)
    $(this).removeClass("no-input").addClass("complete-input");
  else $(this).removeClass("complete-input").addClass("no-input");
});
// Pressing type
$(document).on("change", "#pressing-type__select", function () {
  if ($(this).val() != 0)
    $(this).removeClass("no-input").addClass("complete-input");
  else $(this).removeClass("complete-input").addClass("no-input");
});
// Machine Number
$(document).on("change", "#machine-number__select", function () {
  if ($(this).val() != 0)
    $(this).removeClass("no-input").addClass("complete-input");
  else $(this).removeClass("complete-input").addClass("no-input");
});
// Billet Lot
$(document).on("keyup", "#billet-lot-number__input", function () {
  $(this).val($(this).val().toUpperCase()); 
  if ($(this).val() != 0)
    $(this).removeClass("no-input").addClass("complete-input");
  else $(this).removeClass("complete-input").addClass("no-input");
});
// Billet Size
$(document).on("change", "#billet-size__select", function () {
  $(this).val($(this).val().toUpperCase());
  if ($(this).val() != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else $(this).removeClass("complete-input").addClass("no-input");
});
// Billet Length
$(document).on("change", "#billet-length__select", function () {
  if ($(this).val() != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else $(this).removeClass("complete-input").addClass("no-input");
});
// Billet Plan Quantity
$(document).on("keyup", "#plan-billet-qty__input", function () {
  if (!isNaN($(this).val()) && $(this).val().length != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else $(this).removeClass("complete-input").addClass("no-input");
});
// Billet Actual Quantity
$(document).on("keyup", "#actual-billet-qty__input", function () {
  if (!isNaN($(this).val()) && $(this).val().length != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else $(this).removeClass("complete-input").addClass("no-input");
});
// Stop Cause input
$(document).on("focus", "#stop-cause__input", function () {
  makeStopList($(this).val());
});

$(document).on("keyup", "#stop-cause__input", function () {
  makeStopList($(this).val());
});

function makeStopList(inputValue) {
  let fileName = "./php/DailyReport/SelStop.php";
  let sendData = {
    stop_code: inputValue + "%",
  };
  myAjax.myAjax(fileName, sendData);
  $("#stop-cause__select option").remove();
  $("#stop-cause__select").append($("<option>").val(1).html("no"));
  ajaxReturnData.forEach(function (value) {
    $("#stop-cause__select").append(
      $("<option>").val(value["id"]).html(value["stop_code"])
    );
  });
}

// Stop cause select
$(document).on("change", "#stop-cause__select", function () {
  $(this).removeClass("no-input").addClass("complete-input");
});

// press start time
$(document).on("keyup", "#press-start__input", function () {
  if (checkTimeValue($(this).val()) || cancelKeyupEvent) {
    $(this).removeClass("no-input").addClass("complete-input");
    cancelKeyupEvent = false;
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

$(document).on("keydown", "#press-start__input", function (e) {
  if (e.keyCode == 13 && $("#press-start__input").hasClass("complete-input")) {
    $(this).val(addColon($(this).val()));
    cancelKeyupEvent = true;
    $("#press-finish__input").focus();
    return false;
  }
});

// press finish time
$(document).on("keyup", "#press-finish__input", function () {
  if (checkTimeValue($(this).val()) || cancelKeyupEvent) {
    $(this).removeClass("no-input").addClass("complete-input");
    cancelKeyupEvent = false;
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

$(document).on("keydown", "#press-finish__input", function (e) {
  if (e.keyCode == 13 && $("#press-start__input").hasClass("complete-input")) {
    $(this).val(addColon($(this).val()));
    cancelKeyupEvent = true;
    $("#actual-ram-speed__input").focus();
    return false;
  }
});

function addColon(inputValue) {
  // 3桁、または4桁の時刻値にコロンを挿入する
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

// Actual Ram Speed
$(document).on("keyup", "#actual-ram-speed__input", function () {
  if (
    !isNaN($(this).val()) &&
    $(this).val().length != 0 &&
    0 <= $(this).val() &&
    $(this).val() <= 20
  ) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

// Actual Die Temp
$(document).on("keyup", "#actual-die-temp__input", function () {
  if (
    !isNaN($(this).val()) &&
    $(this).val().length != 0 &&
    400 <= $(this).val() &&
    $(this).val() <= 500
  ) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

// Name input
$(document).on("focus", "#name__input", function () {
  makeNameList($(this).val());
});

$(document).on("keyup", "#name__input", function () {
  makeNameList($(this).val());
});

function makeNameList(inputValue) {
  let fileName = "./php/DailyReport/SelStaff.php";
  let sendData = {
    name_s: "%" + inputValue + "%",
  };
  myAjax.myAjax(fileName, sendData);
  $("#name__select option").remove();
  $("#name__select").append($("<option>").val(0).html("no"));
  ajaxReturnData.forEach(function (value) {
    $("#name__select").append(
      $("<option>").val(value["id"]).html(value["staff_name"])
    );
  });
}

// Name Select
$(document).on("focus", "#name__select", function () {
  makeNameList($("#name__input").val());
});

$(document).on("change", "#name__select", function () {
  if ($(this).val() != "0") {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});
// Directive select
$(document).on("change", "#press-directive__select", function (e) {
  if ($(this).val() != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else $(this).removeClass("complete-input").addClass("no-input");
});
// Attached File select
$("input#file-upload__input").on("change", function () {
  // 選択したファイル名を表示する
  var file = $(this).prop("files")[0];
  $("label").html(file.name);
  $("#preview__button").prop("disabled", false);
  readNewFile = true;
});

// Scrap_weght
$(document).on("keyup", "#scrap_weight__input", function () {
  if (
    !isNaN($(this).val()) &&
    $(this).val().length != 0 &&
    0 <= $(this).val() &&
    $(this).val() <= 2000
  ) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

// 1St length
$(document).on("keyup", "#first_actual_length", function () {
  if (
    !isNaN($(this).val()) &&
    $(this).val().length != 0 &&
    1500 <= $(this).val() &&
    $(this).val() <= 6600
  ) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

// ====================== filter items ====================
// Press type
$("#press-type-filter").on("change", function () {
  setSummaryTable();
});

// Die Name Fileter
$("#die-number-fileter").on("keyup", function () {
  setSummaryTable();
});
// Date fileter
$("#start-term").on("change", function () {
  setSummaryTable();
});
$("#end-term").on("change", function () {
  setSummaryTable();
});
// Profile length and quantity
$(document).on("keyup", "#work-length__table input", function () {
  if (
    0 < Number($(this).val()) &&
    Number($(this).val()) < 59 &&
    $(this).val() != ""
  ) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

// add error code
function ErrorCode() {
  var fileName = "./php/DailyReport/SelErrorCode.php";
  var sendData = {
      dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  $("#err_code option").remove();
  $("#err_code").append($("<option>").val(0).html("NO"));
  ajaxReturnData.forEach(function(value) {
      $("#err_code").append(
          $("<option>").val(value["id"]).html(value["err_code"]+" "+value["error_name"])
      );
  });
};

$(document).on("change", "#err_code", function() {
  if ($(this).val() != 0) {
      $(this).removeClass("no-input").addClass("complete-input");
  } else {
      $(this).removeClass("complete-input").addClass("no-input");
  }
  add_error_check();
});

$(document).on("keyup", "#err_start", function () {
  if (checkTimeValue($(this).val()) || cancelKeyupEvent) {
    $(this).removeClass("no-input").addClass("complete-input");
    cancelKeyupEvent = false;
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

$(document).on("keydown", "#err_start", function (e) {
  if ((e.keyCode == 13||e.keyCode == 9)&& $("#err_start").hasClass("complete-input")) {
    $(this).val(addColon($(this).val()));
    cancelKeyupEvent = true;
    add_error_check();
    $("#err_end").focus();
    return false;
  }
});

$(document).on("keyup", "#err_end", function () {
  if (checkTimeValue($(this).val()) || cancelKeyupEvent) {
    $(this).removeClass("no-input").addClass("complete-input");
    cancelKeyupEvent = false;
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

$(document).on("keydown", "#err_end", function (e) {
  if ((e.keyCode == 13||e.keyCode == 9)&& $("#err_end").hasClass("complete-input")) {
    $(this).val(addColon($(this).val()));
    cancelKeyupEvent = true;
    add_error_check();
    $("#err_note").focus();
    return false;
  }
});

function add_error_check() {
  if (($("#err_code").hasClass("no-input")) ||
      ($("#err_start").hasClass("no-input")) ||
      ($("#err_end").hasClass("no-input")) ||
      ($("#err_note").hasClass("no-input"))) {
      $("#add_error__button").prop("disabled", true);
  } else {
      $("#add_error__button").prop("disabled", false);
  }
};

$("#add_error__button").on("click", function () {
  switch ($(this).text()) {
    case "Save":
      $("<tr>")
        .append("<td></td>")
        .append($("<td>").append(ErrorCodeOption($("#err_code").val())))
        .append($("<td>").append($("<input>").val($("#err_start").val())))
        .append($("<td>").append($("<input>").val($("#err_end").val())))
        .append($("<td>").append($("<input>").val($("#err_note").val())))
        .appendTo("#error__table tbody");
      $(this).prop("disabled", true);
      $("#err_code").val("").focus().removeClass("complete-input").addClass("no-input");
      $("#err_start").val("").removeClass("complete-input").addClass("no-input");
      $("#err_end").val("").removeClass("complete-input").addClass("no-input");
      $("#err_note").val("");
    break;
    case "Add":
      let fileName;
      let sendData = new Object();
      fileName = "./php/DailyReport/AddError13.php";
      sendData = {
        press_id: $("#selected__tr td:nth-child(1)").text(),
        err_code: $("#err_code").val(),
        err_start: $("#err_start").val(),
        err_end: $("#err_end").val(),
        err_note: $("#err_note").val(),
      };
      myAjax.myAjax(fileName, sendData);
      makeErrorTable();
      $("#err_code").val("").removeClass("complete-input").addClass("no-input");
      $("#err_start").val("").removeClass("complete-input").addClass("no-input");
      $("#err_end").val("").removeClass("complete-input").addClass("no-input");
      $("#add_error__button").prop("disabled", true);
    break;
  }
});

function makeErrorTable() {
  fileName = "./php/DailyReport/SelError.php";
  sendData = {
    id: $("#selected__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#error__table tbody").empty();
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      if (tdVal == "error_code") {
        $("<td>")
            .append(ErrorCodeOption(trVal[tdVal]))
            .appendTo(newTr);
      } else if (tdVal == "id") {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
    } else {
      $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
    }   
    });
    $(newTr).appendTo("#error__table tbody");
  });
};

function ErrorCodeOption(seletedId) {
  let targetDom = $("<select>");

  fileName = "./php/DailyReport/SelErrorCode.php";
  sendData = {
      ng_code: "%",
  };
  myAjax.myAjax(fileName, sendData);
  ajaxReturnData.forEach(function(element) {
      if (element["err_code"] == seletedId) {
          $("<option>")
              .html(element["err_code"])
              .val(element["id"])
              .prop("selected", true)
              .appendTo(targetDom);
      } else {
          $("<option>")
              .html(element["err_code"])
              .val(element["id"])
              .appendTo(targetDom);
      }
  });
  return targetDom;
}

// add bundle no
$(document).on("keyup", "#bundle_no", function() {
  if (
    !isNaN($(this).val()) &&
    $(this).val().length != 0 &&
    0 <= $(this).val() &&
    $(this).val() <= 1000
  ) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  add_bundle_check();
});

$(document).on("keyup", "#quantity", function() {
  if (
    !isNaN($(this).val()) &&
    $(this).val().length != 0 &&
    0 <= $(this).val() &&
    $(this).val() <= 1000
  ) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  add_bundle_check();
});

$(document).on("keyup", "#lot_no", function() {
  $(this).val($(this).val().toUpperCase());
  if ($(this).val().length != 0) {
      $(this).removeClass("no-input").addClass("complete-input");
  } else {
      $(this).removeClass("complete-input").addClass("no-input");
  }
  add_bundle_check();
});

function add_bundle_check() {
  if (($("#bundle_no").hasClass("no-input")) ||
      ($("#quantity").hasClass("no-input")) ||
      ($("#lot_no").hasClass("no-input"))) {
      $("#add_bundle__button").prop("disabled", true);
  } else {
      $("#add_bundle__button").prop("disabled", false);
  }
};

$("#add_bundle__button").on("click", function () {
  switch ($(this).text()) {
    case "Save":
      $("<tr>")
        .append("<td></td>")
        .append($("<td>").append($("<input>").val($("#bundle_no").val())))
        .append($("<td>").append($("<input>").val($("#quantity").val())))
        .append($("<td>").append($("<input>").val($("#lot_no").val())))
        .appendTo("#bundle__table tbody");
      $(this).prop("disabled", true);
      $("#bundle_no").val("").focus().removeClass("complete-input").addClass("no-input");
      $("#quantity").val("").removeClass("complete-input").addClass("no-input");
      $("#lot_no").val("").removeClass("complete-input").addClass("no-input");
      break;
    case "Add":
      let fileName;
      let sendData = new Object();
      fileName = "./php/DailyReport/AddBundle13.php";
      sendData = {
        press_id: $("#selected__tr td:nth-child(1)").text(),
        bundle_no: $("#bundle_no").val(),
        quantity: $("#quantity").val(),
        lot_no: $("#lot_no").val(),
      };
      myAjax.myAjax(fileName, sendData);
      makeBundleTable();
      $("#bundle_no").val("").removeClass("complete-input").addClass("no-input");
      $("#quantity").val("").removeClass("complete-input").addClass("no-input");
      $("#lot_no").val("").removeClass("complete-input").addClass("no-input");
      $("#add_bundle__button").prop("disabled", true);
      break;
  }
});

function makeBundleTable() {
  fileName = "./php/DailyReport/SelBundle.php";
  sendData = {
    id: $("#selected__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#bundle__table tbody").empty();
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      if (tdVal == "id") {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
    } else {
      $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
    }   
    });
    $(newTr).appendTo("#bundle__table tbody");
  });
}

$(document).on("change", "#die__select", function() {
  if((editMode==false)&&($(this).val()!=0)){
    fileName = "./php/DailyReport/SelFromDirective.php";
    sendData = {
      id: $("#press-directive__select").val(),
    };
    myAjax.myAjax(fileName, sendData);
    console.log(ajaxReturnData);
    $("#pressing-type__select").val(ajaxReturnData[0]["pressing_type_id"]).removeClass("no-input").addClass("complete-input");
    $("#billet-size__select").val(ajaxReturnData[0]["billet_size"]).removeClass("no-input").addClass("complete-input");
    $("#billet-length__select").val(ajaxReturnData[0]["billet_length"]).removeClass("no-input").addClass("complete-input");
    $("#plan-billet-qty__input").val(ajaxReturnData[0]["billet_input_quantity"]).removeClass("no-input").addClass("complete-input");
    $("#actual-ram-speed__input").val(ajaxReturnData[0]["ram_speed"]).removeClass("no-input").addClass("complete-input");
  };
  if($("#die__select").val()==0){
    $("#pressing-type__select").val("").removeClass("complete-input").addClass("no-input");
    $("#billet-size__select").val("").removeClass("complete-input").addClass("no-input");
    $("#billet-length__select").val("").removeClass("complete-input").addClass("no-input");
    $("#plan-billet-qty__input").val("").removeClass("complete-input").addClass("no-input");
    $("#actual-ram-speed__input").val("").removeClass("complete-input").addClass("no-input");
  }
});

// *****************************************************
// *****************************************************
// ************** input value check  end
// *****************************************************
// *****************************************************

// =============================================================
// container-temperature__table 共通
// =============================================================
$(document).on("keydown", "#container-temperature__table input", function (e) {
  chkMoveNext(
    e,
    $(this),
    getNextTargetIdName(
      $("#container-temperature__table .save-data"),
      $(this).attr("id")
    )
  );
});

function chkMoveNext(e, thisDom, nextDom) {
  // thisDOM がcomplete-inputクラスなら改行キーでnextDomにフォーカスを移動する
  if (e.keyCode == 13 && thisDom.hasClass("complete-input")) {
    e.preventDefault(); // 入力をキャンセル。これをしないと、移動後、ボタンをクリックしてしまう
    $(nextDom).focus();
  }
}

function getNextTargetIdName(targetTable, thisIdName) {
  let nextIndexFlag = false;
  let nextTargetDom;

  targetTable.each(function (index, element) {
    if (nextIndexFlag == true) {
      nextTargetDom = $(element);
    }
    if ($(element).attr("id") == thisIdName) {
      nextIndexFlag = true;
    } else {
      nextIndexFlag = false;
    }
  });
  return nextTargetDom;
}

// #入力値チェック
$(document).on("keyup", "#container-temperature__table input", function (e) {
  if (!isNaN($(this).val()) && 200 < $(this).val() && $(this).val() < 530) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});
// =============================================================
// ram-values__table 共通
// =============================================================
// #ram speed
$(document).on("keyup", "#ram-values__table .ram_speed", function (e) {
  var val = $(this).val();
  var no2 =
    $(this).attr("id") == "no2_0200_ram_speed" ||
    $(this).attr("id") == "no2_1000_ram_speed";

  if ((0 < val && val < 30) || (no2 && val == "")) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

// #ram pressure
$(document).on("keyup", "#ram-values__table .ram_pressure", function (e) {
  var val = $(this).val();
  var no2 =
    $(this).attr("id") == "no2_0200_ram_pressure" ||
    $(this).attr("id") == "no2_1000_ram_pressure";

  if ((0 < val && val < 30) || (no2 && val == "")) {
    // if (!isNaN($(this).val()) && 0 < $(this).val() && $(this).val() < 30) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

// #work temperature
$(document).on("keyup", "#ram-values__table .work_temperature", function (e) {
  var val = $(this).val();
  var no2 =
    $(this).attr("id") == "no2_0200_work_temperature" ||
    $(this).attr("id") == "no2_1000_work_temperature";

  if ((200 < val && val < 600) || (no2 && val == "")) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

// =============================================================
// rack table start
// =============================================================
$("#racknumber__input").on("keydown", function (e) {
  var k = e.keyCode;
  var str = String(k);

  // keyCodeCheck(str);
  if (k === 13 && $(this).hasClass("complete-input")) {
    $("#rackqty__input").focus();
    return false;
  }
});

$("#racknumber__input").on("keyup", function () {
  if (cancelKeydownEvent) {
    cancelKeydownEvent = false;
    return false;
  }

  if (
    !isNaN($(this).val()) &&
    $(this).val() != "" &&
    0 < $(this).val() &&
    $(this).val() <= 100 &&
    checkDuplicateLackNumber()
  ) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

$("#rackqty__input").on("keydown", function (e) {
  var k = e.keyCode;
  var str = String(k);

  keyCodeCheck(str);
  // console.log("hello");
  if (k === 13) {
    $("#add-rack__button").focus();
    e.preventDefault();
    return false;
  }
  // console.log(checkRackInputComplete());
});

$("#rackqty__input").on("keyup", function (e) {
  if (
    !isNaN($(this).val()) &&
    $(this).val() != "" &&
    0 < $(this).val() 
    // && $(this).val() <= 100
  ) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  // activation of Save button
  if (checkRackInputComplete()) {
    $("#add-rack__button").prop("disabled", false);
  } else {
    $("#add-rack__button").prop("disabled", true);
  }
});

function checkRackInputComplete() {
  let flag = false;
  if (
    $("#racknumber__input").hasClass("complete-input") &&
    $("#rackqty__input").hasClass("complete-input")
  ) {
    flag = true;
  } else {
    flag = false;
  }
  return flag;
}

function checkDuplicateLackNumber() {
  var flag = true;
  var inputValue = $("#racknumber__input").val();
  $("#rack__table tbody tr td:nth-child(3)").each(function (index, value) {
    if (Number($(this).text()) == inputValue) {
      flag = false;
    }
  });
  return flag;
}

function keyCodeCheck(k) {
  var str = String(k);
  if (
    !(
      str.match(/[0-9]/) ||
      (37 <= k && k <= 40) ||
      k === 8 ||
      k === 46 ||
      k === 13
    )
  ) {
    return false;
  } else {
    return true;
  }
}

$("#add-rack__button").on("keydown", function (e) {
  // e.preventDefault(); // 入力をキャンセル。これをしないと、移動後、ボタンをクリックしてしまう
  // $(this).trigger("click");
  cancelKeydownEvent = true;
});

$("#add-rack__button").on("click", function () {
  let trNumber;
  let fileName;
  let sendData = new Object();
  let order_number;
  let rackNumberArr = [];
  switch ($(this).text()) {
    case "Save":
      trNumber = $("#rack__table tbody tr").length;
      $("<tr>")
        .append("<td></td>")
        .append("<td>" + (trNumber + 1) + "</td>")
        .append("<td>" + $("#racknumber__input").val() + "</td>")
        .append("<td>" + $("#rackqty__input").val() + "</td>")
        .appendTo("#rack__table tbody");
      $(this).prop("disabled", true);
      $("#racknumber__input")
        .val("")
        .focus()
        .removeClass("complete-input")
        .addClass("no-input");
      $("#rackqty__input")
        .val("")
        .removeClass("complete-input")
        .addClass("no-input");
      break;
    case "Add":
      $("#rack__table tbody tr td:nth-child(2)").each(function () {
        rackNumberArr.push(Number($(this).html()));
      });
      if (rackNumberArr.length != 0) {
        order_number = Math.max(...rackNumberArr) + 1;
      } else {
        order_number = 1;
      }
      fileName = "./php/DailyReport/InsUsingAgingRack.php";
      sendData = {
        t_press_id: $("#selected__tr td:nth-child(1)").text(),
        order_number: order_number,
        rack_number: $("#racknumber__input").val(),
        work_quantity: $("#rackqty__input").val(),
      };
      myAjax.myAjax(fileName, sendData);
      // ============= Fill Rack Data
      makeRackTable();
      // ============= reset input frame
      $("#racknumber__input")
        .val("")
        .removeClass("complete-input")
        .addClass("no-input");
      $("#rackqty__input")
        .val("")
        .removeClass("complete-input")
        .addClass("no-input");
      $("#add-rack__button").prop("disabled", true);
      break;
  }
});

$(document).on("click", "#rack__table tbody tr", function () {
  let deleteDialog = document.getElementById("delete-rack__dialog");
  if (!$(this).hasClass("selected-record")) {
    // tr に class を付与し、選択状態の background colorを付ける
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    // tr に id を付与する
    $("#rack_selected__tr").removeAttr("id");
    $(this).attr("id", "rack_selected__tr");
  } else {
    // clicked same record
    deleteDialog.showModal();
  }
});

$(document).on("click", "#delete-rack-cancel__button", function () {
  let deleteDialog = document.getElementById("delete-rack__dialog");
  deleteDialog.close();
});

$(document).on("click", "#delete-rack-delete__button", function () {
  let deleteDialog = document.getElementById("delete-rack__dialog");
  let sendData = new Object();
  let fileName;
  // delete selected record
  fileName = "./php/DailyReport/DelSelRackData.php";
  sendData = {
    t_using_aging_rack_id: $("#rack_selected__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  deleteDialog.close();
  // refill rack table
  makeRackTable();
});

function makeRackTable() {
  fileName = "./php/DailyReport/SelRack2.php";
  sendData = {
    id: $("#selected__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#rack__table tbody").empty();
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      if (tdVal == "rack_number" || tdVal == "work_quantity") {
        $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
      } else {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
      }
    });
    $(newTr).appendTo("#rack__table tbody");
  });
}

function renumberTableColumn() {
  $("#rack__table tbody tr td:nth-child(1)").each(function (index, val) {
    $(this).text(index + 1);
  });
}

$(document).on("change", "#rack__table tbody tr input", function () {
  let sendData = new Object();
  let fileName;
  fileName = "./php/DailyReport/UpdateUsingAgingRack.php";
  sendData = {
    id: $("#rack_selected__tr td:nth-child(1)").html(),
    rack_number: $("#rack_selected__tr td:nth-child(3) input").val(),
    work_quantity: $("#rack_selected__tr td:nth-child(4) input").val(),
  };
  console.log(sendData);
  myAjax.myAjax(fileName, sendData);
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- add row button ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "#add_row__button", function () {
  let trDom = $("<tr>");
  let recordNumber = Number($("#work-length__table tbody tr").length) + 1;

  trDom.append($("<th>").html("No." + recordNumber));
  for (i = 0; i < 2; ++i) {
    let tdDom;
    tdDom = $("<td>").append($("<input>").addClass("need-clear"));
    trDom.append(tdDom);
  }
  trDom.appendTo("#work-length__table");
});

function setSummaryTable() {
  let fileName = "./php/DailyReport/SelSummary13.php";
  let sendData = {
    die_number: $("#die-number-fileter").val() + "%",
    start_date: $("#start-term").val(),
    end_date: $("#end-term").val(),
    press_type: "%" + $("#press-type-filter").val() + "%",
  };
  myAjax.myAjax(fileName, sendData);

  $("#summary__table tbody").empty();
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      if (tdVal == "work_quantity") {
        $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
      } else {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
      }
    });
    $(newTr).appendTo("#summary__table tbody");
  });
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Summary Table ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#summary__table tbody tr", function (e) {
  let fileName = "./php/DailyReport/SelSelData13.php";
  let sendData;
  if (!$(this).hasClass("selected-record")) {
    // tr に class を付与し、選択状態の background colorを付ける
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    // tr に id を付与する
    $("#selected__tr").removeAttr("id");
    $(this).attr("id", "selected__tr");
    // =========== Fill data .prepare for myAjax
    sendData = {
      targetId: $("#selected__tr").find("td").eq(0).html(),
    };
    myAjax.myAjax(fileName, sendData);
    fillReadData(ajaxReturnData);
    // ==========  Fill Profile Data
    fileName = "./php/DailyReport/SelWorkInformation3.php";
    sendData = {
      id: $("#selected__tr").find("td").eq(0).html(),
    };
    myAjax.myAjax(fileName, sendData);
    fillWorkInformation(ajaxReturnData);
    // ============= Fill Rack Data
    makeRackTable();
    makeBundleTable();
    makeErrorTable();

    editMode = true;
    // button activation
    $("#update__button").prop("disabled", false);
    $("#preview__button").attr("disabled", false);
    // set aging rack table to edit mode
    $("#add-rack__button").text("Add");
    $("#add_error__button").text("Add");
    $("#add_bundle__button").text("Add");
    $("#racknumber__input").removeClass("complete-input").addClass("no-input");
    $("#rackqty__input").removeClass("complete-input").addClass("no-input");
  } else {
    // 選択レコードを再度クリックした時
    // 削除問い合わせダイアログ
    // deleteDialog.showModal();
  }
});

$(document).on("click", "#error__table tbody tr", function() {
  if (!$(this).hasClass("selected-record")) {
      $(this).parent().find("tr").removeClass("selected-record");
      $(this).addClass("selected-record");
      $("#error__selected").removeAttr("id");
      $(this).attr("id", "error__selected");
  } else {
      // $(this).removeClass("selected-record");
      // $(this).removeAttr("id");
  }
});

$(document).on("click", "#bundle__table tbody tr", function() {
  if (!$(this).hasClass("selected-record")) {
      $(this).parent().find("tr").removeClass("selected-record");
      $(this).addClass("selected-record");
      $("#bundle__selected").removeAttr("id");
      $(this).attr("id", "bundle__selected");
  } else {
      // $(this).removeClass("selected-record");
      // $(this).removeAttr("id");
  }
});

$(document).on("change", "#error__table tbody tr", function () {
  let sendData = new Object();
  let fileName;
  fileName = "./php/DailyReport/UpdateError.php";
  sendData = {
    id: $("#error__selected td:nth-child(1)").html(),
    error_code_id : $("#error__selected td:nth-child(2) select").val(),
    start_time: $("#error__selected td:nth-child(3) input").val(),
    end_time: $("#error__selected td:nth-child(4) input").val(),
    note: $("#error__selected td:nth-child(5) input").val(),
  };
  console.log(sendData);
  myAjax.myAjax(fileName, sendData);
});

$(document).on("change", "#bundle__table tbody tr input", function () {
  let sendData = new Object();
  let fileName;
  if (editMode) {
    fileName = "./php/DailyReport/UpdateBundle.php";
    sendData = {
      id: $("#bundle__selected td:nth-child(1)").html(),
      bundle: $("#bundle__selected td:nth-child(2) input").val(),
      quantity: $("#bundle__selected td:nth-child(3) input").val(),
      lot: $("#bundle__selected td:nth-child(4) input").val(),
    };
    console.log(sendData);
    myAjax.myAjax(fileName, sendData);
  }
});
// deleteダイアログのキャンセルボタンが押されたとき
$(document).on("click", "#delete-dialog-cancel__button", function () {
  deleteDialog.close();
});

// deleteダイアログの削除ボタンが押されたとき
$(document).on("click", "#delete-dialog-delete__button", function () {
  let fileName;
  let sendData;

  fileName = "./php/DailyReport/DelSelData3.php";
  sendData = {
    id: $("#selected__tr").find("td").eq(0).text(),
  };
  myAjax.myAjax(fileName, sendData);
  setSummaryTable();
  clearInputData(); // データの削除と背景色の設定
  $("#update__button").prop("disabled", true); // save ボタン非活性化
  editMode = false;

  deleteDialog.close();
});

function fillWorkInformation(data) {
  $("#work-length__table tbody").empty();
  data.forEach(function (element, index) {
    var trDom = $("<tr>");
    Object.keys(element).forEach(function (key, index) {
      var val;
      if (index == 0) {
        // ビレット番号を No1, No2, ,,,とする
        val = "No." + element[key];
        trDom.append($("<th>").html(val));
      } else {
        // ビレット番号以外の処理 input.valueに値を格納する
        val = $("<input>").val(element[key]).addClass("need-clear");
        trDom.append($("<td>").html(val));
      }
    });
    $("#work-length__table tbody").append(trDom);
  });
}

function fillReadData(data) {
  let targetDom = $(".input__wrapper input");
  // console.log(data);
  targetDom.eq(1).val(data[0]["press_date_at"]);
  // targetDom.eq(6).val(data[0]["billet_lot_number"]);
  targetDom.eq(8).val(data[0]["plan_billet_quantities"]);
  targetDom.eq(9).val(data[0]["actual_billet_quantities"]);
  // targetDom.eq(11).val(data[0]["stop_code"]);
  targetDom.eq(10).val(data[0]["press_start_at"]);
  targetDom.eq(11).val(data[0]["press_finish_at"]);
  targetDom.eq(12).val(data[0]["actual_ram_speed"]);
  targetDom.eq(13).val(data[0]["actual_die_temperature"]);

  targetDom = $("#container-temperature__table input");
  targetDom.eq(0).val(data[0]["container_upside_stemside_temperature"]);
  targetDom.eq(1).val(data[0]["container_upside_dieside_temperature"]);
  targetDom.eq(2).val(data[0]["container_downside_stemside_temperature"]);
  targetDom.eq(3).val(data[0]["container_downside_dieide_temperature"]);

  targetDom = $("#ram-values__table input");
  targetDom.eq(0).val(data[0]["no1_1000_ram_speed"]);
  targetDom.eq(1).val(data[0]["no1_1000_ram_pressure"]);
  targetDom.eq(2).val(data[0]["no1_1000_work_temperature"]);
  targetDom.eq(3).val(data[0]["no1_0200_ram_speed"]);
  targetDom.eq(4).val(data[0]["no1_0200_ram_pressure"]);
  targetDom.eq(5).val(data[0]["no1_0200_work_temperature"]);
  targetDom.eq(6).val(data[0]["no2_1000_ram_speed"]);
  targetDom.eq(7).val(data[0]["no2_1000_ram_pressure"]);
  targetDom.eq(8).val(data[0]["no2_1000_work_temperature"]);
  targetDom.eq(9).val(data[0]["no2_0200_ram_speed"]);
  targetDom.eq(10).val(data[0]["no2_0200_ram_pressure"]);
  targetDom.eq(11).val(data[0]["no2_0200_work_temperature"]);

  // select 要素への値の代入
  // option値が動的に変わるselectはoption値を代入する
  $("#die__select")
    .empty()
    .append($("<option>").html(data[0]["die_number"]).val(data[0]["dies_id"]));
  // $("#stop-cause__select")
  //   .empty()
  //   .append(
  //     $("<option>")
  //       .html(data[0]["stop_code"])
  //       .val(data[0]["press_stop_cause_id"])
  //   );
  $("#press-directive__select")
    .empty()
    .append(
      $("<option>")
        .html(data[0]["press_directive_plan_date_at"])
        .val(data[0]["press_directive_id"])
    );
  $("#directive_input__select")
    .empty()
    .append(
      $("<option>")
        .html(data[0]["ordersheet_number"])
        .val(data[0]["ordersheet_id"])
    );

  // label 要素にファイル名を代入する
  $("label").html(data[0]["press_directive_scan_file_name"]);
  // $("label").html("");
  // option値が静的な場合、value値だけ代入する
  $("#is-washed__select").val(data[0]["is_washed_die"]);
  $("#machine-number__select").val(data[0]["press_machine_no"]);
  $("#pressing-type__select").val(data[0]["pressing_type_id"]);
  $("#billet-size__select").val(data[0]["billet_size"]);
  $("#billet-length__select").val(data[0]["billet_length"]);
  $("#scrap_weight__input").val(data[0]["scrap_weight__input"]);
  $("#first_actual_length").val(data[0]["first_actual_length"]);
  $("#name__select")
    .empty()
    .append($("<option>").html(data[0]["staff_name"]).val(data[0]["staff_id"]));

  // 背景色を変更すする
  $(".need-clear").removeClass("no-input").addClass("complete-input");
}

// =========================================================
// =========================================================
// Save or Update Button Activation
// =========================================================
// =========================================================

// activate save button
$(document).on("keyup", ".left__wrapper", function () {
  if (checkIsDataInputed() && !editMode) {
    $("#save__button").prop("disabled", false);
  } else if (checkIsDataInputed() && editMode) {
    $("#update__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
    $("#update__button").prop("disabled", true);
  }
});

$(document).on("change", ".left__wrapper", function () {
  if (checkIsDataInputed() && !editMode) {
    $("#save__button").prop("disabled", false);
  } else if (checkIsDataInputed() && editMode) {
    $("#update__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
    $("#update__button").prop("disabled", true);
  }
});

$(document).on("change", "#work-length__table input", function () {
  if (checkIsDataInputed() && !editMode) {
    $("#save__button").prop("disabled", false);
  } else if (checkIsDataInputed() && editMode) {
    $("#update__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
    $("#update__button").prop("disabled", true);
  }
});

// All Value Is Inputed?
function checkIsDataInputed() {
  let flag = true;

  $(".save-data").each(function (index, element) {
    if ($(this).hasClass("no-input")) {
      flag = false;
      // console.log($(this));
    }
  });
  return flag;
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- SAVE BUTTON  ----------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#save__button", function () {
  let inputData = new Object();
  let fileName;
  let sendData = new Object();
  let targetId;

  // ======= Input Data ==================
  inputData = getInputData();
  console.log(inputData);
  fileName = "./php/DailyReport/InsPd13.php";
  sendData = inputData;
  myAjax.myAjax(fileName, sendData);
  targetId = ajaxReturnData["id"];
  // 1:get table data
  tableData = getTableData($("#rack__table tbody tr"));
  tableData.push(targetId);
  // 2:Insert into database
  fileName = "./php/DailyReport/InsUsedRack.php";
  sendData = JSON.stringify(tableData);
  myAjax.myAjax(fileName, sendData);
  // 1:get and adjust table data
  workInfrmationTable = getTableDataInput($("#work-length__table tbody tr"));
  sendTable = makeSendData(workInfrmationTable);
  sendTable.push(targetId);
  // 2:Insert into database
  fileName = "./php/DailyReport/InsWorkInformation3.php";
  sendData = JSON.stringify(sendTable);
  myAjax.myAjax(fileName, sendData);

  ErrorData = getTableData($("#error__table tbody tr"));
  ErrorData.push(targetId);
  fileName = "./php/DailyReport/InsError13.php";
  sendData = JSON.stringify(ErrorData);
  myAjax.myAjax(fileName, sendData);

  let BundleData = getTableData($("#bundle__table tbody tr"));
  BundleData.push(targetId);
  fileName = "./php/DailyReport/InsBundle13.php";
  sendData = JSON.stringify(BundleData);
  myAjax.myAjax(fileName, sendData);

  setSummaryTable();

  clearInputData(); // データの削除と背景色の設定
  $("#save__button").prop("disabled", true); // save ボタン非活性化
  $("#die__input").prop("disabled", false); // enable die_input frame
  readNewFile = false;
});

function clearInputData() {
  $(".save-data").removeClass("complete-input").addClass("no-input");
  $("input.need-clear").val("");
  $("select.need-clear").val("");
  $("#directive_input__select").empty().removeClass("no-input");

  // ファイル添付
  $("label").html("");
  // table クリア
  $("#rack__table tbody").empty();
  $("#work-length__table tbody").empty();
  $("#error__table tbody").empty();
  $("#bundle__table tbody").empty();
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Update BUTTON  ----------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "#update__button", function () {
  let tableData = [];
  let inputData = new Object();
  let workInfrmationTable = [];
  let sendTable = [];
  let fileName;
  let sendData = new Object();

  // ========Input data============
  inputData = getInputData();
  fileName = "./php/DailyReport/UpdatePd13.php";
  sendData = inputData;
  myAjax.myAjax(fileName, sendData);
  // ========Table Data:Rack information===========
  // // 1:get table data
  // tableData = getTableData($("#rack__table tbody tr"));
  // tableData.push(Number($("#selected__tr td:nth-child(1)").text()));
  // // 2:Insert into database
  // fileName = "./php/DailyReport/UpdateUsedRack.php";
  // sendData = JSON.stringify(tableData);
  // myAjax.myAjax(fileName, sendData);
  // ========Table Data:Work information===========
  // 1:get and adjust table data
  workInfrmationTable = getTableDataInput($("#work-length__table tbody tr"));
  sendTable = makeSendData(workInfrmationTable);
  sendTable.push($("#selected__tr").find("td").eq(0).html());
  // 2:Insert into database
  fileName = "./php/DailyReport/InsWorkInformation3.php";
  sendData = JSON.stringify(sendTable);
  myAjax.myAjax(fileName, sendData);
  // ========= reload summury table
  setSummaryTable();
  clearInputData(); // データの削除と背景色の設定
  $("#save__button").prop("disabled", true); // save ボタン非活性化

  readNewFile = false;
});

function getInputData() {
  let inputDom;
  let inputData = new Object();
  // 今日の日付の取得
  let dt = new Date();
  inputData["created_at"] =
    dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();

  if ($(".save-data").hasClass("complete-input")) {
    // .save-dataを持っている要素から値を取り出す
    $("input.save-data").each(function (index, element) {
      inputData[$(this).attr("id")] = $(this).val();
    });
    $("select.save-data").each(function (index, element) {
      inputData[$(this).attr("id")] = $(this).val();
    });
  } else {
    $("input.save-data_new").each(function (index, element) {
      inputData[$(this).attr("id")] = $(this).val();
    });
    $("select.save-data_new").each(function (index, element) {
      inputData[$(this).attr("id")] = $(this).val();
    });
  }
  // 日付はYY-mm-dd形式なのでYYYY-mm-dd形式に変更
  inputData["date__input"] = inputData["date__input"];
  // targetId を別途保存
  inputData["targetId"] = $("#selected__tr").find("td").eq(0).html();
  // order_sheet
  inputData["ordersheet_id"] = $("#directive_input__select").val();
  // ファイルを選択しているとき
  if ($("#file-upload__input").prop("files")[0]) {
    // ファイルを選択している
    // console.log("hello");
    // console.log(ajaxFileUpload());
    inputData["press_directive_scan_file_name"] = ajaxFileUpload();
  } else {
    inputData["press_directive_scan_file_name"] = $("#file_name").html();
  }
  // 配列のキーが無いと困るので

  return inputData;
}

function ajaxFileUpload() {
  var formdata = new FormData($("#file-upload__form").get(0));
  var fileName;

  $.ajax({
    url: "./php/DailyReport/FileUpload.php",
    type: "POST",
    data: formdata,
    cache: false,
    contentType: false,
    processData: false,
    dataType: "html",
    async: false,
  })
    .done(function (data, textStatus, jqXHR) {
      // なぜか受渡しないと、上手く値が入らない。
      fileName = data;
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      alert("fail");
    });
  return fileName;
}

function getTableData(tableTrObj) {
  var tableData = [];
  tableTrObj.each(function (index, element) {
    var tr = [];
    $(this)
      .find("td")
      .each(function (index, element) {
        tr.push(Number($(this).text()));
      });
    tableData.push(tr);
  });
  return tableData;
}

function getTableDataInput(tableTrObj) {
  var tableData = [];
  tableTrObj.each(function (index, element) {
    var tr = [];
    $(this)
      .find("td")
      .each(function (index, element) {
        if ($(this).find("input").length) {
          tr.push($(this).find("input").val());
        } else {
          tr.push("");
        }
      });
    tableData.push(tr);
  });
  return tableData;
}

function makeSendData(workInfrmationTable) {
  // webのテーブルの値を (billetNumber, workNumber, workLength, workQty) 形式の
  // 配列にして返す
  sendTable = [];
  workInfrmationTable.forEach(function (element, index) {
    sendTable.push([index + 1, 1, element[0], element[1]]);
  });
  return sendTable;
}

// =========================================================
// =========================================================
// PDF Preview Button
// =========================================================
// =========================================================
$(document).on("click", "#preview__button", function () {
  switch (readNewFile) {
    case true:
      window.open("./DailyReportSub02.html");
      break;
    case false:
      window.open("./DailyReportSub01.html");
      break;
  }
});

// ==================== test button =======================
$(document).on("click", "#test__button", function () {
  console.log(getTableData($("#bundle__table tbody tr")));
  console.log(getTableData($("#error__table tbody tr")));
  // console.log($("#work-length__table tbody tr"));
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
}