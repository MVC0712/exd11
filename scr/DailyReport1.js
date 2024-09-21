// 2021/09/10 start to edit
// 削除確認ダイアログ
let deleteDialog = document.getElementById("delete__dialog");
let deletePressDialog = document.getElementById("delete_press_dialog");

// 初期値
let ajaxReturnData;
let cancelKeyupEvent = false;
let cancelKeydownEvent = false;
let editMode = false;
let readNewFile = false;

let mfgselect = [{
  id: 1,
  mfg: "Dubai"
},{
  id: 2,
  mfg: "VN"
}]

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
  // ErrorCode();
  $("#press_machine_no").val(1).removeClass("no-input").addClass("complete-input");
});
// *****************************************************
// *****************************************************
// ************** input value check
// *****************************************************
// *****************************************************
// order sheet select
$(document).on("click", "#directive__input", function () {
  window.open(
    "./DailiReport1_OrderSheet.html",
    null,
    "width=830, height=500,toolbar=yes,menubar=yes,scrollbars=no"
  );
});
// order sheet select
$(document).on("change", "#ordersheet_id", function () {
  // after selection, set die list order by production number
  let fileName;
  let sendData = new Object();

  fileName = "./php/DailyReport1/SelSelDieNumber.php";
  sendData = {
    m_ordersheet_id: $("#ordersheet_id").val(),
  };
  myAjax.myAjax(fileName, sendData);

  $("#dies_id option").remove();
  $("#dies_id").append($("<option>").val(0).html("NO select"));
  ajaxReturnData.forEach(function(value) {
      $("#dies_id").append(
          $("<option>").val(value.m_dies_id).html(value.die_number)
      );
  });
  $("#number-of-die__display").html(ajaxReturnData.length);
  $("#die__input").prop("disabled", true);

  $("#pressing_type_id").val("3").removeClass("no-input").addClass("complete-input");
});
// press date
$(document).on("change", "#press_date_at", function () {
  $(this).removeClass("no-input").addClass("complete-input");
});
// Die Name
$(document).on("keyup", "#die__input", function () {
  let fileName = "./php/DailyReport1/SelDieNumber.php";
  let sendData = {
    die_number: $(this).val() + "%",
  };
  myAjax.myAjax(fileName, sendData);
  $("#number-of-die__display").html(ajaxReturnData.length);
  $("#dies_id option").remove();
  $("#dies_id").append($("<option>").val(0).html("NO select"));
  ajaxReturnData.forEach(function (value) {
    $("#dies_id").append(
      $("<option>").val(value["id"]).html(value["die_number"])
    );
  });
});
// Die Select
$(document).on("change", "#dies_id", function () {
  if ($(this).val() != "0") {
    let fileName = "./php/DailyReport1/SelDirective.php";
    let sendData = {
      targetId: $(this).val(),
    };
    myAjax.myAjax(fileName, sendData);
    $("#press_directive_id option").remove();
    // $("#press_directive_id").append($("<option>").val(0).html("NO select"));
    ajaxReturnData.forEach(function (value) {
      $("#press_directive_id").append(
        $("<option>").val(value["id"]).html(value["plan_date_at"])
      );
    });
    $(this).removeClass("no-input").addClass("complete-input");
    $("#press_directive_id").removeClass("no-input").addClass("complete-input");

    fileName = "./php/DailyReport1/SelProductionNumber.php";
    sendData = {
      targetId: $(this).val(),
    };
    myAjax.myAjax(fileName, sendData);
    $("#init_production_number").val(ajaxReturnData[0].production_number)
  } else {
    $("#press_directive_id option").remove();
    $(this).removeClass("complete-input").addClass("no-input");
    $("#press_directive_id").removeClass("complete-input").addClass("no-input");
  }
});
// is Washed?
$(document).on("change", "#is_washed_die", function () {
  if ($(this).val() != 0)
    $(this).removeClass("no-input").addClass("complete-input");
  else $(this).removeClass("complete-input").addClass("no-input");
});
// Pressing type
$(document).on("change", "#pressing_type_id", function () {
  if ($(this).val() != 0)
    $(this).removeClass("no-input").addClass("complete-input");
  else $(this).removeClass("complete-input").addClass("no-input");
});
// Machine Number
$(document).on("change", "#press_machine_no", function () {
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
  let fileName = "./php/DailyReport1/SelStop.php";
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
$(document).on("keyup", "#press_start_at", function () {
  if (checkTimeValue($(this).val()) || cancelKeyupEvent) {
    $(this).removeClass("no-input").addClass("complete-input");
    cancelKeyupEvent = false;
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

$(document).on("keydown", "#press_start_at", function (e) {
  if (e.keyCode == 13 && $("#press_start_at").hasClass("complete-input")) {
    $(this).val(addColon($(this).val()));
    cancelKeyupEvent = true;
    $("#press_finish_at").focus();
    return false;
  }
});

// press finish time
$(document).on("keyup", "#press_finish_at", function () {
  if (checkTimeValue($(this).val()) || cancelKeyupEvent) {
    $(this).removeClass("no-input").addClass("complete-input");
    cancelKeyupEvent = false;
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

$(document).on("keydown", "#press_finish_at", function (e) {
  if (e.keyCode == 13 && $("#press_start_at").hasClass("complete-input")) {
    $(this).val(addColon($(this).val()));
    cancelKeyupEvent = true;
    $("#actual_ram_speed").focus();
    return false;
  }
});

$(document).on("keyup", "#die_heating_start", function () {
  if (checkTimeValue($(this).val()) || cancelKeyupEvent) {
    $(this).removeClass("no-input").addClass("complete-input");
    cancelKeyupEvent = false;
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

$(document).on("keydown", "#die_heating_start", function (e) {
  if (e.keyCode == 13 && $("#die_heating_start").hasClass("complete-input")) {
    $(this).val(addColon($(this).val()));
    cancelKeyupEvent = true;
    $("#die_heating_finished").focus();
    return false;
  }
});
$(document).on("keyup", "#die_heating_finished", function () {
  if (checkTimeValue($(this).val()) || cancelKeyupEvent) {
    $(this).removeClass("no-input").addClass("complete-input");
    cancelKeyupEvent = false;
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

$(document).on("keydown", "#die_heating_finished", function (e) {
  if (e.keyCode == 13 && $("#die_heating_finished").hasClass("complete-input")) {
    $(this).val(addColon($(this).val()));
    cancelKeyupEvent = true;
    $("#actual_die_temperature").focus();
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
$(document).on("keyup", "#actual_ram_speed", function () {
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
$(document).on("keyup", "#actual_die_temperature", function () {
  if (
    !isNaN($(this).val()) &&
    $(this).val().length != 0 &&
    400 <= $(this).val() &&
    $(this).val() <= 510
  ) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

// Actual Diering Temp
$(document).on("keyup", "#diering_temp", function () {
  if (
    !isNaN($(this).val()) &&
    $(this).val().length != 0 &&
    200 <= $(this).val() &&
    $(this).val() <= 510
  ) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

// Actual Bolster Temp
$(document).on("keyup", "#bolter_temp", function () {
  if (
    !isNaN($(this).val()) &&
    $(this).val().length != 0 &&
    0 <= $(this).val() &&
    $(this).val() <= 510
  ) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

// Actual billet Temp
$(document).on("keyup", "#billet_temp", function () {
  if (
    !isNaN($(this).val()) &&
    $(this).val().length != 0 &&
    200 <= $(this).val() &&
    $(this).val() <= 510
  ) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});
$(document).on("keyup", "#container_upside_stemside_temperature", function () {
  if (!isNaN($(this).val()) && 200 < $(this).val() && $(this).val() < 530) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});
$(document).on("keyup", "#container_downside_stemside_temperature", function () {
  if (!isNaN($(this).val()) && 200 < $(this).val() && $(this).val() < 530) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});
$(document).on("keyup", "#container_upside_dieside_temperature", function () {
  if (!isNaN($(this).val()) && 200 < $(this).val() && $(this).val() < 530) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});
$(document).on("keyup", "#container_downside_dieide_temperature", function () {
  if (!isNaN($(this).val()) && 200 < $(this).val() && $(this).val() < 530) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});
// Name input
$(document).on("focus", "#name__input", function () {````
  makeNameList($(this).val());
});

$(document).on("keyup", "#name__input", function () {
  makeNameList($(this).val());
});

function makeNameList(inputValue) {
  let fileName = "./php/DailyReport1/SelStaff.php";
  let sendData = {
    name_s: "%" + inputValue + "%",
  };
  myAjax.myAjax(fileName, sendData);
  $("#staff_id option").remove();
  $("#staff_id").append($("<option>").val(0).html("no"));
  ajaxReturnData.forEach(function (value) {
    $("#staff_id").append(
      $("<option>").val(value["id"]).html(value["staff_name"])
    );
  });
}

// Name Select
$(document).on("focus", "#staff_id", function () {
  makeNameList($("#name__input").val());
});

$(document).on("change", "#staff_id", function () {
  if ($(this).val() != "0") {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});
// Directive select
$(document).on("change", "#press_directive_id", function (e) {
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

$(document).on("change", "#billet_size", function (e) {
  if ($(this).val() != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else $(this).removeClass("complete-input").addClass("no-input");
});
$(document).on("change", "#billet_length", function (e) {
  if ($(this).val() != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else $(this).removeClass("complete-input").addClass("no-input");
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
    Number($(this).val()) <= 400 &&
    $(this).val() != ""
  ) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  if (checkIsDataInputed() && !editMode) {
    $("#save__button").prop("disabled", false);
  } else if (checkIsDataInputed() && editMode) {
    $("#update__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
    $("#update__button").prop("disabled", true);
  }
});

// add error code
function ErrorCode() {
  var fileName = "./php/DailyReport1/SelErrorCode.php";
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
      fileName = "./php/DailyReport1/AddError13.php";
      sendData = {
        press_id: $("#selected__tr td:nth-child(1)").text(),
        err_code: $("#err_code").val(),
        err_start: $("#err_start").val(),
        err_end: $("#err_end").val(),
        err_note: $("#err_note").val(),
      };
      myAjax.myAjax(fileName, sendData);
      // makeErrorTable();
      $("#err_code").val("").removeClass("complete-input").addClass("no-input");
      $("#err_start").val("").removeClass("complete-input").addClass("no-input");
      $("#err_end").val("").removeClass("complete-input").addClass("no-input");
      $("#add_error__button").prop("disabled", true);
    break;
  }
});

function makeErrorTable() {
  fileName = "./php/DailyReport1/SelError.php";
  sendData = {
    id: $("#selected__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#error__table tbody").empty();
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      if (tdVal == "id") {
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

  fileName = "./php/DailyReport1/SelErrorCode.php";
  sendData = {
      ng_code: "%",
  };
  myAjax.myAjax(fileName, sendData);
  ajaxReturnData.forEach(function(element) {
      if (element["id"] == seletedId) {
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
$(document).on("change", "#bundle_no", function() {
  if (!isNaN($(this).val()) &&
    $(this).val().length != 0 &&
    0 <= $(this).val() &&
    $(this).val() <= 1000
  ) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  makeQuantity($(this).val(), $("#lot_no").val());
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
  makeBundleSel($(this).val(), $("#bundle_no").val());
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

$(document).on("keyup", ".ram", function() {
  if (!isNaN($(this).val()) &&
    $(this).val().length != 0 &&
    0 <= $(this).val() &&
    $(this).val() <= 1000
  ) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  add_ram_check();
});
function add_ram_check() {
  if (($("#ram_no").hasClass("no-input")) ||
      ($("#ram_1000_spd").hasClass("no-input")) ||
      ($("#ram_1000_prs").hasClass("no-input")) ||
      ($("#ram_1000_temp").hasClass("no-input")) ||
      ($("#ram_200_spd").hasClass("no-input")) ||
      ($("#ram_200_prs").hasClass("no-input")) ||
      ($("#ram-values__table tbody tr td input").hasClass("no-input")) ||
      ($("#ram_200_temp").hasClass("no-input"))) {
      $("#add_ram_data").prop("disabled", true);
  } else {
      $("#add_ram_data").prop("disabled", false);
  }
};

$("#add_bundle__button").on("click", function () {
  switch ($(this).text()) {
    case "Save":
      $("<tr>")
        .append("<td></td>")
        .append($("<td>").append($("<input>").val($("#lot_no").val())))
        .append($("<td>").append(makeBundle($("#lot_no").val())))
        .append($("<td>").append($("<input>").val($("#quantity").val())))
        .append($("<td>").append(makeMfg($("#mfg").val())))
        .appendTo("#bundle__table tbody");
      $(this).prop("disabled", true);
      $("#bundle_no").val("").focus().removeClass("complete-input").addClass("no-input");
      $("#quantity").val("").removeClass("complete-input").addClass("no-input");
      $("#lot_no").val("").removeClass("complete-input").addClass("no-input");
      break;
    case "Add":
      let fileName;
      let sendData = new Object();
      fileName = "./php/DailyReport1/AddBundle15.php";
      sendData = {
        press_id: $("#selected__tr td:nth-child(1)").text(),
        bundle_no: $("#bundle_no").val(),
        quantity: $("#quantity").val(),
        lot_no: $("#lot_no").val(),
        mfg: $("#mfg").val(),
      };
      myAjax.myAjax(fileName, sendData);
      makeBundleTable();
      $("#bundle_no").val(0).removeClass("complete-input").addClass("no-input");
      $("#quantity").val("").removeClass("complete-input").addClass("no-input");
      $("#lot_no").val("").removeClass("complete-input").addClass("no-input");
      $("#add_bundle__button").prop("disabled", true);
      break;
  }
  if (checkIsDataInputed() && !editMode) {
    $("#save__button").prop("disabled", false);
  } else if (checkIsDataInputed() && editMode) {
    $("#update__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
    $("#update__button").prop("disabled", true);
  }
});
$("#add_ram_data").on("click", function () {
  switch ($(this).text()) {
    case "Save":
      $("<tr>")
        .append("<td></td>")
        .append($("<td>").html($("#ram_no").val()))
        .append($("<td>").append($("<input>").val($("#ram_1000_spd").val())))
        .append($("<td>").append($("<input>").val($("#ram_1000_prs").val())))
        .append($("<td>").append($("<input>").val($("#ram_1000_temp").val()).addClass("work_temperature")))
        .append($("<td>").append($("<input>").val($("#ram_200_spd").val())))
        .append($("<td>").append($("<input>").val($("#ram_200_prs").val())))
        .append($("<td>").append($("<input>").val($("#ram_200_temp").val()).addClass("work_temperature")))
        .appendTo("#ram-values__table tbody");
      $(this).prop("disabled", true);
      $("#ram_no").val("").focus().removeClass("complete-input").addClass("no-input");
      $("#ram_1000_spd").val("").removeClass("complete-input").addClass("no-input");
      $("#ram_1000_prs").val("").removeClass("complete-input").addClass("no-input");
      $("#ram_1000_temp").val("").removeClass("complete-input").addClass("no-input");
      $("#ram_200_spd").val("").removeClass("complete-input").addClass("no-input");
      $("#ram_200_prs").val("").removeClass("complete-input").addClass("no-input");
      $("#ram_200_temp").val("").removeClass("complete-input").addClass("no-input");
      break;
    case "Add":
      let fileName;
      let sendData = new Object();
      fileName = "./php/DailyReport1/AddRamData.php";
      sendData = {
        press_id: $("#selected__tr td:nth-child(1)").text(),
        number: $("#ram_no").val(),
        ram_1000_speed: $("#ram_1000_spd").val(),
        ram_1000_pressure: $("#ram_1000_prs").val(),
        work_1000_temperature: $("#ram_1000_temp").val(),
        ram_200_speed: $("#ram_200_spd").val(),
        ram_200_pressure: $("#ram_200_prs").val(),
        work_200_temperature: $("#ram_200_temp").val(),
      };
      myAjax.myAjax(fileName, sendData);
      makeRamTable();
      $(this).prop("disabled", true);
      $("#ram_no").val("").focus().removeClass("complete-input").addClass("no-input");
      $("#ram_1000_spd").val("").removeClass("complete-input").addClass("no-input");
      $("#ram_1000_prs").val("").removeClass("complete-input").addClass("no-input");
      $("#ram_1000_temp").val("").removeClass("complete-input").addClass("no-input");
      $("#ram_200_spd").val("").removeClass("complete-input").addClass("no-input");
      $("#ram_200_prs").val("").removeClass("complete-input").addClass("no-input");
      $("#ram_200_temp").val("").removeClass("complete-input").addClass("no-input");
      break;
  }
  if (checkIsDataInputed() && !editMode) {
    $("#save__button").prop("disabled", false);
  } else if (checkIsDataInputed() && editMode) {
    $("#update__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
    $("#update__button").prop("disabled", true);
  }
});

function makeMfg(seletedId) {
  let targetDom = $("<select>");
  $("<option>").html("No").val(0).appendTo(targetDom);
  mfgselect.forEach(function(element) {
      if (element["id"] == seletedId) {
        $("<option>")
            .html(element["mfg"])
            .val(element["id"])
            .prop("selected", true)
            .appendTo(targetDom);
      } else {
        $("<option>")
            .html(element["mfg"])
            .val(element["id"])
            .appendTo(targetDom);
      }
  });
  return targetDom;
};
function makeBundle(lot, seletedId) {
  fileName = "./php/DailyReport1/SelBundleByLot.php";
  sendData = {
    lot
  };
  myAjax.myAjax(fileName, sendData);
  let targetDom = $("<select>");
  $("<option>").html("No").val(0).appendTo(targetDom);
  ajaxReturnData.forEach(function(element) {
      if (element["id"] == seletedId) {
        $("<option>")
            .html(element["bundle"])
            .val(element["id"])
            .prop("selected", true)
            .appendTo(targetDom);
      } else {
        $("<option>")
            .html(element["bundle"])
            .val(element["id"])
            .appendTo(targetDom);
      }
  });
  return targetDom;
};
function makeBundleSel(lot) {
  fileName = "./php/DailyReport1/SelBundleByLot.php";
  sendData = {
    lot
  };
  myAjax.myAjax(fileName, sendData);
  $("#bundle_no > option").remove();
  $("#bundle_no").append($("<option>").val(0).html("NO"));
  ajaxReturnData.forEach(function(element) {
    $("<option>").html(element["bundle"]).val(element["id"]).appendTo("#bundle_no");
  });
};
function makeQuantity(id) {
  fileName = "./php/DailyReport1/SelQuantity.php";
  sendData = {
    id: id
  };
  myAjax.myAjax(fileName, sendData);
  $("#quantity").val(ajaxReturnData[0].quantity).removeClass("no-input").addClass("complete-input");;
};
function makeBundleTable() {
  fileName = "./php/DailyReport1/SelBundleV151.php";
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
    } else if (tdVal == "mfg") {
      $("<td>").append(makeMfg(trVal[tdVal])).appendTo(newTr);
    } else {
      $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
    }   
    });
    $(newTr).appendTo("#bundle__table tbody");
  });
}
function makeRamTable() {
  fileName = "./php/DailyReport1/SelRam.php";
  sendData = {
    id: $("#selected__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#ram-values__table tbody").empty();
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
    if (tdVal == "id") {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    } else if (tdVal == "number") {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    } else {
      $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
    }   
    });
    $(newTr).appendTo("#ram-values__table tbody");
  });
}
$(document).on("change", "#dies_id", function() {
  if((editMode==false)&&($(this).val()!=0)){
    fileName = "./php/DailyReport1/SelForPrintPage.php";
    sendData = {
      targetId: $("#press_directive_id").val(),
    };
    myAjax.myAjax(fileName, sendData);
    console.log(ajaxReturnData);

    // var die_number = ajaxReturnData[0].die_number;
		// var production_number = ajaxReturnData[0].production_number;
		// var plan_date_at = ajaxReturnData[0].plan_date_at;
		var pressing_type_id = ajaxReturnData[0].pressing_type_id;
    $("#pressing_type_id").val(pressing_type_id);
		var press_lengthth = calPressLength(ajaxReturnData[0].billet_size, ajaxReturnData[0].billet_length, ajaxReturnData[0].specific_weight, ajaxReturnData[0].hole, ajaxReturnData[0].discard_thickness) + "m";
		$("#init_length").val(press_lengthth);
    var production_length = Math.round(Number(ajaxReturnData[0].production_length)*1000) + "mm";
    var aging = ajaxReturnData[0].aging;
    $("#init_aging_type").val(aging);
    var material = ajaxReturnData[0].material;
		var specific_weight = ajaxReturnData[0].specific_weight + "kg/m";
    $("#init_specific_weight").val(specific_weight);
		var ratio =  Math.round(ajaxReturnData[0].ratio,2);
    $("#init_ratio").val(ratio);
		var nbn = ajaxReturnData[0].nbn + "*" + ajaxReturnData[0].hole;
    $("#init_press_type").val(nbn);
		var previous_press_note = ajaxReturnData[0].previous_press_note;
		var staff_name = ajaxReturnData[0].staff_name;
    var issue_date = ajaxReturnData[0].issue_date;
		var plan_pressing_time = ajaxReturnData[0].plan_pressing_time;
		var billet_input_quantity = ajaxReturnData[0].billet_input_quantity + "billet";
		var billet_length = ajaxReturnData[0].billet_length + "mm";
		var discard_thickness = ajaxReturnData[0].discard_thickness + "mm";
    $("#init_press_discard").val(discard_thickness);
    var ram_speed = ajaxReturnData[0].ram_speed + "mm/s";
    $("#init_ram_speed").val(ram_speed);
		var work_speed2 = ajaxReturnData[0].work_speed2 + "m/min";
		var work_speed = ajaxReturnData[0].work_speed + "m/min";
		var billet_temperature = ajaxReturnData[0].billet_temperature + "°C";
		var billet_taper_heating = ajaxReturnData[0].billet_taper_heating + "°C/m-";
    var billet_t = billet_temperature + "-" + billet_taper_heating;
    $("#init_billet_plan").val(billet_t + billet_input_quantity);
		var die_temperature = ajaxReturnData[0].die_temperature + "°C";
    $("#init_die_temp").val(die_temperature);
    var die_heating_time = ajaxReturnData[0].die_heating_time + "h";
    $("#init_die_heating_time").val(die_heating_time);
		var stretch_ratio = ajaxReturnData[0].stretch_ratio + "%";
		var cooling_type = ajaxReturnData[0].cooling_type;
    $("#init_cooling_type").val(cooling_type);
		var billet_size = ajaxReturnData[0].billet_size + "'";
    $("#init_billet_material").val(material + "-" + billet_size + "-" + billet_length);
		var bolster_name = ajaxReturnData[0].bolster_name;
    $("#init_bolster").val(bolster_name);
    var die_diamater = ajaxReturnData[0].die_diamater;
		var die_ring = "DR" + ajaxReturnData[0].bolster_name.substring(1, 3) + die_diamater/10;
    $("#init_diering").val(die_ring);
    var value_l = ajaxReturnData[0].value_l;
		var value_m = ajaxReturnData[0].value_m;
		var value_n = ajaxReturnData[0].value_n;
    var cut = value_m + "-" + value_n;
		var hole = ajaxReturnData[0].hole;
		var press_machine = ajaxReturnData[0].press_machine;
    $("#press_machine_no").val(press_machine);
		var die_note = ajaxReturnData[0].die_note;
		var plan_note = ajaxReturnData[0].plan_note;
    $("#init_press_note").val(die_note + "-" + plan_note);

		
		var prsTimePL = Math.round(Number(calPressLength(ajaxReturnData[0].billet_size, ajaxReturnData[0].billet_length, ajaxReturnData[0].specific_weight, ajaxReturnData[0].hole, ajaxReturnData[0].discard_thickness))*Number(ajaxReturnData[0].billet_input_quantity)/Number(ajaxReturnData[0].work_speed) + 10+5) + "min";
    $("#init_press_time").val(prsTimePL);
    let pullerF;
    if(ajaxReturnData[0].specific_weight >= 20) {
        pullerF = 140;
    } else if((12 <= ajaxReturnData[0].specific_weight) && (ajaxReturnData[0].specific_weight < 20)) {
        pullerF = 120;
    } else if((5 <= ajaxReturnData[0].specific_weight) && (ajaxReturnData[0].specific_weight < 12)) {
        pullerF = 90;
    } else if((3 <= ajaxReturnData[0].specific_weight) && (ajaxReturnData[0].specific_weight < 5)) {
        pullerF = 70;
    } else if(ajaxReturnData[0].specific_weight < 3) {
        pullerF = 50;
    }
    $("#init_puller_force").val(pullerF);

    $("#pressing_type_id").val(ajaxReturnData[0]["pressing_type_id"]).removeClass("no-input").addClass("complete-input");
    $("#billet_size").val(ajaxReturnData[0]["billet_size"]).removeClass("no-input").addClass("complete-input");
    $("#billet_length").val(ajaxReturnData[0]["billet_length"]).removeClass("no-input").addClass("complete-input");
    $("#actual_ram_speed").val(ajaxReturnData[0]["ram_speed"]).removeClass("no-input").addClass("complete-input");
  };
  if($("#dies_id").val()==0){
    $("#pressing_type_id").val("").removeClass("complete-input").addClass("no-input");
    $("#billet_size").val("").removeClass("complete-input").addClass("no-input");
    $("#billet_length").val("").removeClass("complete-input").addClass("no-input");
    $("#actual_ram_speed").val("").removeClass("complete-input").addClass("no-input");
  }
});
function calPressLength(billetSize, billetLength, specificWeight, whole, discard) {
  let workLength;
  let billetWeight;
  let containerDimension;
  let inputMaterialWeight;

  if (billetSize == 9) {
      billetWeight = 132.3;
      containerDimension = 237;
  } else if (billetSize == 12) {
      billetWeight = 235;
      containerDimension = 312;
  } else if (billetSize == 14) {
      billetWeight = 320;
      containerDimension = 366;
  }
  inputMaterialWeight =
      billetWeight * (billetLength / 1200) -
      (((containerDimension ** 2 / 4) *
              3.142 *
              discard) /
          10 ** 6) *
      2.7;
  workLength = inputMaterialWeight / specificWeight;
  workLength = workLength / whole;
  workLength = Math.round(workLength * 10) / 10;
  workLength = workLength.toFixed(1);

  return workLength;
}
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

  if ((0 < val && val < 60) || (no2 && val == "")) {
    // if (!isNaN($(this).val()) && 0 < $(this).val() && $(this).val() < 30) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

// #work temperature
$(document).on("keyup", ".work_temperature", function (e) {
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
    $(this).val() <= 200 &&
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
      fileName = "./php/DailyReport1/InsUsingAgingRack.php";
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
  checkSum();
  checkBilletQty();
  if (checkIsDataInputed() && !editMode) {
    $("#save__button").prop("disabled", false);
  } else if (checkIsDataInputed() && editMode) {
    $("#update__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
    $("#update__button").prop("disabled", true);
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
  if (checkIsDataInputed() && !editMode) {
    $("#save__button").prop("disabled", false);
  } else if (checkIsDataInputed() && editMode) {
    $("#update__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
    $("#update__button").prop("disabled", true);
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
  fileName = "./php/DailyReport1/DelSelRackData.php";
  sendData = {
    t_using_aging_rack_id: $("#rack_selected__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  deleteDialog.close();
  // refill rack table
  makeRackTable();
  checkSum();
  checkBilletQty();
  if (checkIsDataInputed() && !editMode) {
    $("#save__button").prop("disabled", false);
  } else if (checkIsDataInputed() && editMode) {
    $("#update__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
    $("#update__button").prop("disabled", true);
  }
});

function renumberTableColumn() {
  $("#rack__table tbody tr td:nth-child(1)").each(function (index, val) {
    $(this).text(index + 1);
  });
}

$(document).on("change", "#rack__table tbody tr input", function () {
  let sendData = new Object();
  let fileName;
  fileName = "./php/DailyReport1/UpdateUsingAgingRack.php";
  sendData = {
    id: $("#rack_selected__tr td:nth-child(1)").html(),
    rack_number: $("#rack_selected__tr td:nth-child(3) input").val(),
    work_quantity: $("#rack_selected__tr td:nth-child(4) input").val(),
  };
  console.log(sendData);
  myAjax.myAjax(fileName, sendData);
  checkSum();
  checkBilletQty();
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- add row button ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "#add_row__button", function () {
  let trDom = $("<tr>");
  let recordNumber = Number($("#work-length__table tbody tr").length) + 1;

  trDom.append($("<th>").html("No." + recordNumber));
  // for (i = 0; i < 2; ++i) {
    let tdDom;
    tdDom = $("<td>").append($("<input>").val($("#length_exd").val()).addClass("need-clear"));
    trDom.append(tdDom);
    tdDom = $("<td>").append($("<input>").val($("#quantity_cut").val()).addClass("need-clear"));
    trDom.append(tdDom);
  // }
  trDom.appendTo("#work-length__table");
  checkSum();
  checkBilletQty();
  if (checkIsDataInputed() && !editMode) {
    $("#save__button").prop("disabled", false);
  } else if (checkIsDataInputed() && editMode) {
    $("#update__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
    $("#update__button").prop("disabled", true);
  }
});

function setSummaryTable() {
  let fileName = "./php/DailyReport1/SelSummary14.php";
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
  special_note();
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Summary Table ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#summary__table tbody tr", function (e) {
  let fileName = "./php/DailyReport1/SelSelData144.php";
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
    fileName = "./php/DailyReport1/SelWorkInformation3.php";
    sendData = {
      id: $("#selected__tr").find("td").eq(0).html(),
    };
    myAjax.myAjax(fileName, sendData);
    fillWorkInformation(ajaxReturnData);
    // ============= Fill Rack Data
    makeRackTable();
    makeBundleTable();
    makeRamTable();
    // makeErrorTable();

    editMode = true;
    // button activation
    $("#update__button").prop("disabled", false);
    $("#preview__button").attr("disabled", false);
    // set aging rack table to edit mode
    $("#add-rack__button").text("Add");
    // $("#add_error__button").text("Add");
    $("#add_bundle__button").text("Add");
    $("#add_ram_data").text("Add");
    $("#racknumber__input").removeClass("complete-input").addClass("no-input");
    $("#rackqty__input").removeClass("complete-input").addClass("no-input");
  } else {
    let pas = prompt("Please enter your Password", "********");
    if ((pas == '01910926') || (pas == '02216872')) {
      deletePressDialog.showModal();
    } else {
      alert("Wrong pas");
    }
  }
  checkSum();
  checkBilletQty();



  fileName = "./php/DailyReport1/SelForPrintPage.php";
    sendData = {
      targetId: $("#press_directive_id").val(),
    };
    myAjax.myAjax(fileName, sendData);
    console.log(ajaxReturnData);

    // var die_number = ajaxReturnData[0].die_number;
		var production_number = ajaxReturnData[0].production_number;
    $("#init_production_number").val(production_number);
		// var plan_date_at = ajaxReturnData[0].plan_date_at;
		var pressing_type_id = ajaxReturnData[0].pressing_type_id;
    $("#pressing_type_id").val(pressing_type_id);
		var press_lengthth = calPressLength(ajaxReturnData[0].billet_size, ajaxReturnData[0].billet_length, ajaxReturnData[0].specific_weight, ajaxReturnData[0].hole, ajaxReturnData[0].discard_thickness) + "m";
		$("#init_length").val(press_lengthth);
    var production_length = Math.round(Number(ajaxReturnData[0].production_length)*1000) + "mm";
    var aging = ajaxReturnData[0].aging;
    $("#init_aging_type").val(aging);
    var material = ajaxReturnData[0].material;
		var specific_weight = ajaxReturnData[0].specific_weight + "kg/m";
    $("#init_specific_weight").val(specific_weight);
		var ratio =  Math.round(ajaxReturnData[0].ratio,2);
    $("#init_ratio").val(ratio);
		var nbn = ajaxReturnData[0].nbn + "*" + ajaxReturnData[0].hole;
    $("#init_press_type").val(nbn);
		var previous_press_note = ajaxReturnData[0].previous_press_note;
		var staff_name = ajaxReturnData[0].staff_name;
    var issue_date = ajaxReturnData[0].issue_date;
		var plan_pressing_time = ajaxReturnData[0].plan_pressing_time;
		var billet_input_quantity = ajaxReturnData[0].billet_input_quantity + " billet";
		var billet_length = ajaxReturnData[0].billet_length + "mm";
		var discard_thickness = ajaxReturnData[0].discard_thickness + "mm";
    $("#init_press_discard").val(discard_thickness);
    var ram_speed = ajaxReturnData[0].ram_speed + "mm/s";
    $("#init_ram_speed").val(ram_speed);
		var work_speed2 = ajaxReturnData[0].work_speed2 + "m/min";
		var work_speed = ajaxReturnData[0].work_speed + "m/min";
		var billet_temperature = ajaxReturnData[0].billet_temperature + "°C";
		var billet_taper_heating = ajaxReturnData[0].billet_taper_heating + "°C/m -- ";
    var billet_t = billet_temperature + "-" + billet_taper_heating;
    $("#init_billet_plan").val(billet_t + billet_input_quantity);
		var die_temperature = ajaxReturnData[0].die_temperature + "°C";
    $("#init_die_temp").val(die_temperature);
    var die_heating_time = ajaxReturnData[0].die_heating_time + "h";
    $("#init_die_heating_time").val(die_heating_time);
		var stretch_ratio = ajaxReturnData[0].stretch_ratio + "%";
		var cooling_type = ajaxReturnData[0].cooling_type;
    $("#init_cooling_type").val(cooling_type);
		var billet_size = ajaxReturnData[0].billet_size + "'";
    $("#init_billet_material").val(material + "-" + billet_size + "-" + billet_length);
		var bolster_name = ajaxReturnData[0].bolster_name;
    $("#init_bolster").val(bolster_name);
    var die_diamater = ajaxReturnData[0].die_diamater;
		var die_ring = "DR" + ajaxReturnData[0].bolster_name.substring(1, 3) + die_diamater/10;
    $("#init_diering").val(die_ring);
    var value_l = ajaxReturnData[0].value_l;
		var value_m = ajaxReturnData[0].value_m;
		var value_n = ajaxReturnData[0].value_n;
    var cut = value_m + "-" + value_n;
		var hole = ajaxReturnData[0].hole;
		var press_machine = ajaxReturnData[0].press_machine;
    $("#press_machine_no").val(press_machine);
		var die_note = ajaxReturnData[0].die_note;
		var plan_note = ajaxReturnData[0].plan_note;
    $("#init_press_note").val(die_note + "-" + plan_note);

		
		var prsTimePL = Math.round(Number(calPressLength(ajaxReturnData[0].billet_size, ajaxReturnData[0].billet_length, ajaxReturnData[0].specific_weight, ajaxReturnData[0].hole, ajaxReturnData[0].discard_thickness))*Number(ajaxReturnData[0].billet_input_quantity)/Number(ajaxReturnData[0].work_speed) + 10+5) + "min";
    $("#init_press_time").val(prsTimePL);
    let pullerF;
    if(ajaxReturnData[0].specific_weight >= 20) {
        pullerF = 140;
    } else if((12 <= ajaxReturnData[0].specific_weight) && (ajaxReturnData[0].specific_weight < 20)) {
        pullerF = 120;
    } else if((5 <= ajaxReturnData[0].specific_weight) && (ajaxReturnData[0].specific_weight < 12)) {
        pullerF = 90;
    } else if((3 <= ajaxReturnData[0].specific_weight) && (ajaxReturnData[0].specific_weight < 5)) {
        pullerF = 70;
    } else if(ajaxReturnData[0].specific_weight < 3) {
        pullerF = 50;
    }
    $("#init_puller_force").val(pullerF);
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
$(document).on("click", "#ram-values__table tbody tr", function() {
  if (!$(this).hasClass("selected-record")) {
      $(this).parent().find("tr").removeClass("selected-record");
      $(this).addClass("selected-record");
      $("#ram__selected").removeAttr("id");
      $(this).attr("id", "ram__selected");
  } else {
      // $(this).removeClass("selected-record");
      // $(this).removeAttr("id");
  }
});
$(document).on("dblclick", "#ram-values__table tbody tr", function() {
  let deleteDialog = document.getElementById("delete_ram_data_dialog");
  if ($(this).hasClass("selected-record") && ($("#summary__table tbody tr").hasClass("selected-record"))) {
    deleteDialog.showModal();
  } else {
    $(this).remove()
  }
});
$(document).on("click", "#delete_ram_data_cancle", function () {
  let deleteDialog = document.getElementById("delete_ram_data_dialog");
  deleteDialog.close();
});

$(document).on("click", "#delete_ram_data", function () {
  let deleteDialog = document.getElementById("delete_ram_data_dialog");
  let sendData = new Object();
  let fileName;
  fileName = "./php/DailyReport1/DelRamData.php";
  sendData = {
    id: $("#ram__selected").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  deleteDialog.close();
  makeRamTable();
  if (checkIsDataInputed() && !editMode) {
    $("#save__button").prop("disabled", false);
  } else if (checkIsDataInputed() && editMode) {
    $("#update__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
    $("#update__button").prop("disabled", true);
  }
});


$(document).on("change", "#error__table tbody tr", function () {
  let sendData = new Object();
  let fileName;
  fileName = "./php/DailyReport1/UpdateError.php";
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

$(document).on("change", "#bundle__table tbody tr", function () {
  let sendData = new Object();
  let fileName;
  if (editMode) {
    fileName = "./php/DailyReport1/UpdateBundleV15.php";
    sendData = {
      id: $("#bundle__selected td:nth-child(1)").html(),
      bundle: $("#bundle__selected td:nth-child(2) input").val(),
      quantity: $("#bundle__selected td:nth-child(3) input").val(),
      lot: $("#bundle__selected td:nth-child(4) input").val(),
      mfg: $("#bundle__selected td:nth-child(5) select").val(),
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

  fileName = "./php/DailyReport1/DelSelData3.php";
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

function makeRackTable() {
  fileName = "./php/DailyReport1/SelRack2.php";
  sendData = {
    id: $("#selected__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#rack__table tbody").empty();
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      if ($("#summary__table tbody tr").hasClass("selected-record")) {
        if (tdVal == "rack_number" || tdVal == "work_quantity") {
          $("<td>").append($("<input>").val(trVal[tdVal]).attr('disabled', true)).appendTo(newTr);
        } else {
          $("<td>").html(trVal[tdVal]).appendTo(newTr);
        }
      } else {
        if (tdVal == "rack_number" || tdVal == "work_quantity") {
          $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
        } else {
          $("<td>").html(trVal[tdVal]).appendTo(newTr);
        }
      }
    });
    $(newTr).appendTo("#rack__table tbody");
  });
}

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
  $("#press_date_at").val(data[0]["press_date_at"]);
  // targetDom.eq(6).val(data[0]["billet_lot_number"]);
  targetDom.eq(8).val(data[0]["plan_billet_quantities"]);
  targetDom.eq(9).val(data[0]["actual_billet_quantities"]);
  // targetDom.eq(11).val(data[0]["stop_code"]);
  targetDom.eq(10).val(data[0]["press_start_at"]);
  $("#press_start_at").val(data[0]["press_start_at"]);
  targetDom.eq(11).val(data[0]["press_finish_at"]);
  $("#press_finish_at").val(data[0]["press_finish_at"]);
  targetDom.eq(12).val(data[0]["actual_ram_speed"]);
  $("#actual_ram_speed").val(data[0]["actual_ram_speed"]);
  targetDom.eq(13).val(data[0]["actual_die_temperature"]);
  $("#actual_die_temperature").val(data[0]["actual_die_temperature"]);
  targetDom.eq(14).val(data[0]["diering_temp"]);
  $("#diering_temp").val(data[0]["diering_temp"]);
  $("#bolter_temp").val(data[0]["bolter_temp"]);
  $("#billet_temp").val(data[0]["billet_temp"]);
  $("#die_heating_start").val(data[0]["die_heating_start"]);
  $("#die_heating_finished").val(data[0]["die_heating_finished"]);
  $("#billet_size").val(data[0]["billet_size"]);
  $("#billet_length").val(data[0]["billet_length"]);

  targetDom = $("#container-temperature__table input");
  targetDom.eq(0).val(data[0]["container_upside_stemside_temperature"]);
  targetDom.eq(1).val(data[0]["container_upside_dieside_temperature"]);
  targetDom.eq(2).val(data[0]["container_downside_stemside_temperature"]);
  targetDom.eq(3).val(data[0]["container_downside_dieide_temperature"]);

  $("#container_upside_stemside_temperature").val(data[0]["container_upside_stemside_temperature"]);
  $("#container_upside_dieside_temperature").val(data[0]["container_upside_dieside_temperature"]);
  $("#container_downside_stemside_temperature").val(data[0]["container_downside_stemside_temperature"]);
  $("#container_downside_dieide_temperature").val(data[0]["container_downside_dieide_temperature"]);

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

  $("#dies_id").empty().append($("<option>").html(data[0]["die_number"]).val(data[0]["dies_id"]));
  $("#press_directive_id").empty().append($("<option>").html(data[0]["press_directive_plan_date_at"]).val(data[0]["press_directive_id"]));
  $("#ordersheet_id").empty().append($("<option>").html(data[0]["ordersheet_number"]).val(data[0]["ordersheet_id"]));

  $("label").html(data[0]["press_directive_scan_file_name"]);
  $("#is_washed_die").val(data[0]["is_washed_die"]);
  $("#press_machine_no").val(data[0]["press_machine_no"]);
  $("#pressing_type_id").val(data[0]["pressing_type_id"]);
  $("#billet-size__select").val(data[0]["billet_size"]);
  $("#billet-length__select").val(data[0]["billet_length"]);
  // $("#scrap_weight__input").val(data[0]["scrap_weight__input"]);
  $("#first_actual_length").val(data[0]["first_actual_length"]);
  $("#special_note").val(data[0]["special_note"]);
  $("#staff_id").empty().append($("<option>").html(data[0]["staff_name"]).val(data[0]["staff_id"]));

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

$(document).on("change", "#rack__table input", function () {
  if (checkIsDataInputed() && !editMode) {
    $("#save__button").prop("disabled", false);
  } else if (checkIsDataInputed() && editMode) {
    $("#update__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
    $("#update__button").prop("disabled", true);
  }
});

$(document).on("change", ".mid__wrapper", function () {
  if (checkIsDataInputed() && !editMode) {
    $("#save__button").prop("disabled", false);
  } else if (checkIsDataInputed() && editMode) {
    $("#update__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
    $("#update__button").prop("disabled", true);
  }
});

$(document).on("change", ".right__wrapper", function () {
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
  flag = (checkSum() && checkBilletQty());
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
  fileName = "./php/DailyReport1/InsData.php";
  sendData = inputData;
  myAjax.myAjax(fileName, sendData);
  targetId = ajaxReturnData["id"];
  // 1:get table data
  tableData = getTableData($("#rack__table tbody tr"));
  tableData.push(targetId);
  // 2:Insert into database
  fileName = "./php/DailyReport1/InsUsedRack.php";
  sendData = JSON.stringify(tableData);
  myAjax.myAjax(fileName, sendData);
  // 1:get and adjust table data
  workInfrmationTable = getTableDataInput($("#work-length__table tbody tr"));
  sendTable = makeSendData(workInfrmationTable);
  sendTable.push(targetId);
  // 2:Insert into database
  fileName = "./php/DailyReport1/InsWorkInformation3.php";
  sendData = JSON.stringify(sendTable);
  myAjax.myAjax(fileName, sendData);

  // ErrorData = getTableData($("#error__table tbody tr"));
  // ErrorData.push(targetId);
  // fileName = "./php/DailyReport1/InsError13.php";
  // sendData = JSON.stringify(ErrorData);
  // myAjax.myAjax(fileName, sendData);

  let BundleData = getTableData($("#bundle__table tbody tr"));
  BundleData.push(targetId);
  fileName = "./php/DailyReport1/InsBundle15.php";
  sendData = JSON.stringify(BundleData);
  myAjax.myAjax(fileName, sendData);

  let RamData = getTableData($("#ram-values__table tbody tr"));
  RamData.push(targetId);
  fileName = "./php/DailyReport1/InsRam.php";
  sendData = JSON.stringify(RamData);
  myAjax.myAjax(fileName, sendData);

  setSummaryTable();
  
  clearInputData(); // データの削除と背景色の設定
  // $("#special_note").removeClass("no-input").addClass("complete-input");
  $("#save__button").prop("disabled", true); // save ボタン非活性化
  $("#die__input").prop("disabled", false); // enable die_input frame
  readNewFile = false;
});

function clearInputData() {
  $(".save-data").removeClass("complete-input").addClass("no-input");
  $("input.need-clear").val("");
  $("select.need-clear").val("");
  $("#ordersheet_id").empty().removeClass("no-input");

  // ファイル添付
  $("label").html("");
  // table クリア
  $("#rack__table tbody").empty();
  $("#work-length__table tbody").empty();
  $("#error__table tbody").empty();
  $("#bundle__table tbody").empty();
  $("#special_note").removeClass("no-input").addClass("complete-input");
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
  fileName = "./php/DailyReport1/UpdatePrsData.php";
  sendData = inputData;
  myAjax.myAjax(fileName, sendData);
  // ========Table Data:Rack information===========
  // // 1:get table data
  // tableData = getTableData($("#rack__table tbody tr"));
  // tableData.push(Number($("#selected__tr td:nth-child(1)").text()));
  // // 2:Insert into database
  // fileName = "./php/DailyReport1/UpdateUsedRack.php";
  // sendData = JSON.stringify(tableData);
  // myAjax.myAjax(fileName, sendData);
  // ========Table Data:Work information===========
  // 1:get and adjust table data
  // workInfrmationTable = getTableDataInput($("#work-length__table tbody tr"));
  // sendTable = makeSendData(workInfrmationTable);
  // sendTable.push($("#selected__tr").find("td").eq(0).html());
  // 2:Insert into database
  // fileName = "./php/DailyReport1/InsWorkInformation3.php";
  // sendData = JSON.stringify(sendTable);
  // myAjax.myAjax(fileName, sendData);
  // ========= reload summury table
  setSummaryTable();
  clearInputData(); // データの削除と背景色の設定
  $("#save__button").prop("disabled", true); // save ボタン非活性化
  $("#update__button").prop("disabled", true)
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
  inputData["press_date_at"] = inputData["press_date_at"];
  // targetId を別途保存
  inputData["targetId"] = $("#selected__tr").find("td").eq(0).html();
  // order_sheet
  inputData["ordersheet_id"] = $("#ordersheet_id").val();
  // ファイルを選択しているとき
  // if ($("#file-upload__input").prop("files")[0]) {
  //   // ファイルを選択している
  //   // console.log("hello");
  //   // console.log(ajaxFileUpload());
  //   inputData["press_directive_scan_file_name"] = ajaxFileUpload();
  // } else {
  //   inputData["press_directive_scan_file_name"] = $("#file_name").html();
  // }
  // 配列のキーが無いと困るので

  return inputData;
}

function ajaxFileUpload() {
  var formdata = new FormData($("#file-upload__form").get(0));
  var fileName;

  $.ajax({
    url: "./php/DailyReport1/FileUpload.php",
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
function special_note() {
  var tablett, trtt, tdtt, itt, tt;
  tablett = document.getElementById("summary__table");
  trtt = tablett.getElementsByTagName("tr");
  for (itt = 1; itt < trtt.length; itt++) {
    tdtt = trtt[itt].getElementsByTagName("td")[21];
    var aaa = tdtt.innerText;
    if (aaa != "") {
      $(trtt[itt]).css("color", "red");
    }
  }
};

function checkSum() {
  return true;
var tt1 = 0;
if($("#add-rack__button").text()=="Save") {
  $("#rack__table tbody tr").each(function () {
    tt1 += Number((this).getElementsByTagName("td")[3].innerText);
  });
} else {
  $("#rack__table tbody tr").each(function () {
    tt1 += Number((this).getElementsByTagName("td")[3].getElementsByTagName("input")[0].value);
  });
}
$("#tt1").html(tt1);
// $("#rack__table tbody tr").each(function () {
//   tt1 += Number((this).getElementsByTagName("td")[3].getElementsByTagName("input")[0].value);
// });
// $("#tt1").html(tt1);
var tt2 = 0;
$("#work-length__table tbody tr").each(function () {
  tt2 += Number((this).getElementsByTagName("td")[1].getElementsByTagName("input")[0].value);
});
$("#tt2").html(tt2);
if (tt1==tt2) return true; else return false;
};

function checkBilletQty() {
  var ttb = 0;
  $("#bundle__table tbody tr").each(function () {
    ttb += Number((this).getElementsByTagName("td")[3].getElementsByTagName("input")[0].value);
  });
  return true;
  $("#ttb").html(ttb);
  if ($("#actual-billet-qty__input").val()==ttb) return true; else return false;
  };
  
$("#download_data").on("click", function () {
  let fileName;
  let sendData = new Object();
  fileName = "./php/DailyReport1/DownloadSummary.php";
  sendData = {
    die_number: $("#die-number-fileter").val(),
    start_date: $("#start-term").val(),
    end_date: $("#end-term").val(),
    press_type: $("#press-type-filter").val(),
  };
  myAjax.myAjax(fileName, sendData);
  downloadFile();
});

function downloadFile() {
  // 指定したファイル名のファイルをダウンロードする。
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = "prsdt.csv";
  a.href = "./../../../diereport/ex0.11/download/prsdt.csv";

  a.click();
  a.remove();
}

$(document).on("click", "#delete_press_cancel", function () {
  deletePressDialog.close();
});
$(document).on("click", "#delete_press", function () {
  let fileName = "DelPressData.php";
  sendData = {
    press_id: $("#selected__tr").find("td").eq(0).html(),
  };
  console.log(sendData);
  myAjax.myAjax(fileName, sendData);
  deletePressDialog.close();
  setSummaryTable();
});