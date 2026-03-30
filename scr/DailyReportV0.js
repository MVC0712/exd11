// 2021/09/10 start to edit
// 削除確認ダイアログ
let deleteDialog = document.getElementById("delete__dialog");

// 初期値
let ajaxReturnData;
let cancelKeyupEvent = false;
let cancelKeydownEvent = false;
let editMode = false;
let readNewFile = false;

let mfgselect = [
  {
    id: 1,
    mfg: "Dubai",
  },
  {
    id: 2,
    mfg: "VN",
  },
];

let inspselect = [
  {
    id: 1,
    insp: "OK",
  },
  {
    id: 2,
    insp: "NG",
  },
];

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
  $("#machine-number__select").val(0);
  $("#billet-size__select").val(0);
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
  ajaxReturnData.forEach(function (value) {
    $("#die__select").append(
      $("<option>").val(value.m_dies_id).html(value.die_number)
    );
  });
  $("#number-of-die__display").html(ajaxReturnData.length);
  $("#die__input").prop("disabled", true);
});
// press date
$(document).on("change", "#date__input", function () {
  $(this).removeClass("no-input").addClass("complete-input");
  updateAddButtonText();
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
  updateAddButtonText();
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
    const startVal = addColon($(this).val());
    const finishVal = $("#press-finish__input").val();
    $(this).val(startVal);
    const $tbody = $("#time__table tbody");
    cancelKeyupEvent = true;
    let found700 = false;

    // Duyệt các dòng để kiểm tra có dòng nào có code = 700 không
    $tbody.find("tr").each(function () {
      const codeVal = $(this).find("td:eq(1) input").val();
      if (codeVal == 700) {
        found700 = true;
        $(this).remove(); // Xóa dòng nếu trùng code 700
      }
    });

    // Sau khi kiểm tra và (có thể) xóa dòng cũ → thêm dòng mới
    $("<tr>")
      .append("<td></td>")
      .append($("<td>").append($("<input>").val(700))) // code
      .append($("<td>").append($("<input>").val(startVal))) // start
      .append($("<td>").append($("<input>").val(finishVal))) // finish
      .append("<td></td>")
      .appendTo($tbody);

    $("#press-finish__input").focus();

    // Gán giá trị
    $("#Code").val("300");
    $("#time_start").val(startVal);

    // Xóa class no-input, thêm class complete-input cho 2 ô
    $("#Code, #time_start").removeClass("no-input").addClass("complete-input");
    return false;
  }
  updateExtrusionTime();
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
  if (
    e.key === "Enter" &&
    $("#press-start__input").hasClass("complete-input")
  ) {
    e.preventDefault();
    cancelKeyupEvent = true;

    // Chuẩn hóa định dạng giờ
    const finishVal = addColon($(this).val());
    const startVal = $("#press-start__input").val();
    $(this).val(finishVal);

    const $tbody = $("#time__table tbody");
    let found700 = false;

    // Duyệt các dòng để kiểm tra có dòng nào có code = 700 không
    $tbody.find("tr").each(function () {
      const codeVal = $(this).find("td:eq(1) input").val();
      if (codeVal == 700) {
        found700 = true;
        $(this).remove(); // Xóa dòng nếu trùng code 700
      }
    });

    // Sau khi kiểm tra và (có thể) xóa dòng cũ → thêm dòng mới
    $("<tr>")
      .append("<td></td>")
      .append($("<td>").append($("<input>").val(700))) // code
      .append($("<td>").append($("<input>").val(startVal))) // start
      .append($("<td>").append($("<input>").val(finishVal))) // finish
      .append("<td></td>")
      .appendTo($tbody);

    // Chuyển focus
    $("#actual-ram-speed__input").focus();

    return false;
  }
  updateExtrusionTime();
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
    $(this).val() <= 510
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
$("#press-machine-filter").on("change", function () {
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
  var fileName = "./php/DailyReport/SelErrorCode.php";
  var sendData = {
    dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  $("#err_code option").remove();
  $("#err_code").append($("<option>").val(0).html("NO"));
  ajaxReturnData.forEach(function (value) {
    $("#err_code").append(
      $("<option>")
        .val(value["id"])
        .html(value["err_code"] + " " + value["error_name"])
    );
  });
}

$(document).on("change", "#err_code", function () {
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
  if (
    (e.keyCode == 13 || e.keyCode == 9) &&
    $("#err_start").hasClass("complete-input")
  ) {
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
  if (
    (e.keyCode == 13 || e.keyCode == 9) &&
    $("#err_end").hasClass("complete-input")
  ) {
    $(this).val(addColon($(this).val()));
    cancelKeyupEvent = true;
    add_error_check();
    $("#err_note").focus();
    return false;
  }
});

function add_error_check() {
  if (
    $("#err_code").hasClass("no-input") ||
    $("#err_start").hasClass("no-input") ||
    $("#err_end").hasClass("no-input") ||
    $("#err_note").hasClass("no-input")
  ) {
    $("#add_error__button").prop("disabled", true);
  } else {
    $("#add_error__button").prop("disabled", false);
  }
}

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
      $("#err_code")
        .val("")
        .focus()
        .removeClass("complete-input")
        .addClass("no-input");
      $("#err_start")
        .val("")
        .removeClass("complete-input")
        .addClass("no-input");
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
      // makeErrorTable();
      $("#err_code").val("").removeClass("complete-input").addClass("no-input");
      $("#err_start")
        .val("")
        .removeClass("complete-input")
        .addClass("no-input");
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
      if (tdVal == "id") {
        $("<td>").append(ErrorCodeOption(trVal[tdVal])).appendTo(newTr);
      } else if (tdVal == "id") {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
      } else {
        $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
      }
    });
    $(newTr).appendTo("#error__table tbody");
  });
}

function ErrorCodeOption(seletedId) {
  let targetDom = $("<select>");

  fileName = "./php/DailyReport/SelErrorCode.php";
  sendData = {
    ng_code: "%",
  };
  myAjax.myAjax(fileName, sendData);
  ajaxReturnData.forEach(function (element) {
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
$(document).on("keyup", "#bundle_no", function () {
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

$(document).on("keyup", "#quantity", function () {
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

$(document).on("keyup", "#lot_no", function () {
  $(this).val($(this).val().toUpperCase());
  if ($(this).val().length != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  add_bundle_check();
});

function add_bundle_check() {
  if (
    $("#bundle_no").hasClass("no-input") ||
    $("#quantity").hasClass("no-input") ||
    $("#lot_no").hasClass("no-input")
  ) {
    $("#add_bundle__button").prop("disabled", true);
  } else {
    $("#add_bundle__button").prop("disabled", false);
  }
}

$("#add_bundle__button").on("click", function () {
  switch ($(this).text()) {
    case "Save":
      $("<tr>")
        .append("<td></td>")
        .append($("<td>").append($("<input>").val($("#bundle_no").val())))
        .append($("<td>").append($("<input>").val($("#quantity").val())))
        .append($("<td>").append($("<input>").val($("#lot_no").val())))
        .append($("<td>").append(makeMfg($("#mfg").val())))
        .append($("<td>").append(makeInsp($("#insp").val())))
        .append($("<td>").append($("<input>").val($("#note_billet").val())))
        .appendTo("#bundle__table tbody");
      $(this).prop("disabled", true);
      $("#bundle_no")
        .val("")
        .focus()
        .removeClass("complete-input")
        .addClass("no-input");
      $("#quantity").val("").removeClass("complete-input").addClass("no-input");
      $("#lot_no").val("").removeClass("complete-input").addClass("no-input");
      break;
    case "Add":
      let fileName;
      let sendData = new Object();
      fileName = "./php/DailyReport/AddBundle16.php";
      sendData = {
        press_id: $("#selected__tr td:nth-child(1)").text(),
        bundle_no: $("#bundle_no").val(),
        quantity: $("#quantity").val(),
        lot_no: $("#lot_no").val(),
        mfg: $("#mfg").val(),
        insp: $("#insp").val(),
        note: $("#note_billet").val(),
      };
      myAjax.myAjax(fileName, sendData);
      makeBundleTable();
      $("#bundle_no")
        .val("")
        .removeClass("complete-input")
        .addClass("no-input");
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
function makeMfg(selectedId) {
  let targetDom = $("<select>");
  $("<option>").html("No").val(0).appendTo(targetDom);

  mfgselect.forEach(function (element) {
    $("<option>")
      .html(element.mfg)
      .val(element.id)
      .prop("selected", element.id == selectedId)
      .appendTo(targetDom);
  });

  return targetDom;
}

function makeInsp(selectedId) {
  let targetDom = $("<select>");
  $("<option>").html("No").val(0).appendTo(targetDom);

  inspselect.forEach(function (element) {
    $("<option>")
      .html(element.insp)
      .val(element.id)
      .prop("selected", element.id == selectedId)
      .appendTo(targetDom);
  });

  return targetDom;
}
function makeBundleTable() {
  fileName = "./php/DailyReport/SelBundleV16.php";
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
      } else if (tdVal == "insp") {
        $("<td>").append(makeInsp(trVal[tdVal])).appendTo(newTr);
      } else {
        $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
      }
    });
    $(newTr).appendTo("#bundle__table tbody");
  });
}

$(document).on("change", "#die__select", function () {
  if (editMode == false && $(this).val() != 0) {
    fileName = "./php/DailyReport/SelFromDirectiveV1.php";
    sendData = {
      id: $("#press-directive__select").val(),
    };
    myAjax.myAjax(fileName, sendData);
    console.log(ajaxReturnData);
    $("#pressing-type__select")
      .val(ajaxReturnData[0]["pressing_type_id"])
      .removeClass("no-input")
      .addClass("complete-input");
    $("#billet-size__select")
      .val(ajaxReturnData[0]["billet_size"])
      .removeClass("no-input")
      .addClass("complete-input")
      .trigger("change"); // Kích hoạt event change thủ công
    $("#billet-length__select")
      .val(ajaxReturnData[0]["billet_length"])
      .removeClass("no-input")
      .addClass("complete-input");
    $("#plan-billet-qty__input")
      .val(ajaxReturnData[0]["billet_input_quantity"])
      .removeClass("no-input")
      .addClass("complete-input");
    $("#actual-ram-speed__input")
      .val(ajaxReturnData[0]["ram_speed"])
      .removeClass("no-input")
      .addClass("complete-input");
    $("#stretch-ratio__input")
      .val(ajaxReturnData[0]["stretch_ratio"])
      .removeClass("no-input")
      .addClass("complete-input");
  }
  if ($("#die__select").val() == 0) {
    $("#pressing-type__select")
      .val("")
      .removeClass("complete-input")
      .addClass("no-input");
    $("#billet-size__select")
      .val(ajaxReturnData[0]["billet_size"])
      .removeClass("no-input")
      .addClass("complete-input");
    $("#billet-length__select")
      .val("")
      .removeClass("complete-input")
      .addClass("no-input");
    $("#plan-billet-qty__input")
      .val("")
      .removeClass("complete-input")
      .addClass("no-input");
    $("#actual-ram-speed__input")
      .val("")
      .removeClass("complete-input")
      .addClass("no-input");
    $("#stretch-ratio__input")
      .val("")
      .removeClass("complete-input")
      .addClass("no-input");
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

  if ((0 < val && val < 60) || (no2 && val == "")) {
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
    $(this).val() <= 1000 &&
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
  fileName = "./php/DailyReport/DelSelRackData.php";
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
  fileName = "./php/DailyReport/UpdateUsingAgingRack.php";
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
  tdDom = $("<td>").append(
    $("<input>").val($("#length_exd").val()).addClass("need-clear")
  );
  trDom.append(tdDom);
  tdDom = $("<td>").append(
    $("<input>").val($("#quantity_cut").val()).addClass("need-clear")
  );
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
  let fileName = "./php/DailyReport/SelSummary14.php";
  let sendData = {
    die_number: $("#die-number-fileter").val() + "%",
    start_date: $("#start-term").val(),
    end_date: $("#end-term").val(),
    press_type: "%" + $("#press-type-filter").val() + "%",
    press_machine: "%" + $("#press-machine-filter").val() + "%",
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
  let fileName = "./php/DailyReport/SelSelData22.php";
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
    makeTimeTable();
    updateExtrusionTime();
    makePullTable();
    SumPullTime();
    makeCutTable();
    SumCutTime();
    SumAllTimes();
    // makeErrorTable();

    editMode = true;
    // button activation
    $("#update__button").prop("disabled", false);
    $("#preview__button").attr("disabled", false);
    // set aging rack table to edit mode
    $("#add-rack__button").text("Add");
    // $("#add_error__button").text("Add");
    $("#add_bundle__button").text("Add");
    $("#add_time__button").text("Add");
    $("#add_pull__button").text("Add");
    $("#add_cut__button").text("Add");
    $("#racknumber__input").removeClass("complete-input").addClass("no-input");
    $("#rackqty__input").removeClass("complete-input").addClass("no-input");
  } else {
    // 選択レコードを再度クリックした時
    // 削除問い合わせダイアログ
    // deleteDialog.showModal();
  }
  checkSum();
  checkBilletQty();
});

$(document).on("click", "#error__table tbody tr", function () {
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

$(document).on("click", "#bundle__table tbody tr", function () {
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
    error_code_id: $("#error__selected td:nth-child(2) select").val(),
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
    fileName = "./php/DailyReport/UpdateBundleV16.php";
    sendData = {
      id: $("#bundle__selected td:nth-child(1)").html(),
      bundle: $("#bundle__selected td:nth-child(2) input").val(),
      quantity: $("#bundle__selected td:nth-child(3) input").val(),
      lot: $("#bundle__selected td:nth-child(4) input").val(),
      mfg: $("#bundle__selected td:nth-child(5) select").val(),
      insp: $("#bundle__selected td:nth-child(6) select").val(),
      note: $("#bundle__selected td:nth-child(7) input").val(),
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
      if ($("#summary__table tbody tr").hasClass("selected-record")) {
        if (tdVal == "rack_number" || tdVal == "work_quantity") {
          $("<td>")
            .append($("<input>").val(trVal[tdVal]).attr("disabled", true))
            .appendTo(newTr);
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
  // targetDom.eq(6).val(data[0]["billet_lot_number"]);
  targetDom.eq(9).val(data[0]["plan_billet_quantities"]);
  targetDom.eq(10).val(data[0]["actual_billet_quantities"]);
  // targetDom.eq(11).val(data[0]["stop_code"]);
  targetDom.eq(11).val(data[0]["press_start_at"]);
  targetDom.eq(12).val(data[0]["press_finish_at"]);
  targetDom.eq(13).val(data[0]["actual_ram_speed"]);
  targetDom.eq(14).val(data[0]["actual_die_temperature"]);

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
  targetDom.eq(12).val(data[0]["no3_1000_ram_speed"]);
  targetDom.eq(13).val(data[0]["no3_1000_ram_pressure"]);
  targetDom.eq(14).val(data[0]["no3_1000_work_temperature"]);
  targetDom.eq(15).val(data[0]["no3_0200_ram_speed"]);
  targetDom.eq(16).val(data[0]["no3_0200_ram_pressure"]);
  targetDom.eq(17).val(data[0]["no3_0200_work_temperature"]);
  targetDom.eq(18).val(data[0]["no4_1000_ram_speed"]);
  targetDom.eq(19).val(data[0]["no4_1000_ram_pressure"]);
  targetDom.eq(20).val(data[0]["no4_1000_work_temperature"]);
  targetDom.eq(21).val(data[0]["no4_0200_ram_speed"]);
  targetDom.eq(22).val(data[0]["no4_0200_ram_pressure"]);
  targetDom.eq(23).val(data[0]["no4_0200_work_temperature"]);
  targetDom.eq(24).val(data[0]["no5_1000_ram_speed"]);
  targetDom.eq(25).val(data[0]["no5_1000_ram_pressure"]);
  targetDom.eq(26).val(data[0]["no5_1000_work_temperature"]);
  targetDom.eq(27).val(data[0]["no5_0200_ram_speed"]);
  targetDom.eq(28).val(data[0]["no5_0200_ram_pressure"]);
  targetDom.eq(29).val(data[0]["no5_0200_work_temperature"]);

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
  // $("#scrap_weight__input").val(data[0]["scrap_weight__input"]);
  $("#first_actual_length").val(data[0]["first_actual_length"]);
  $("#stretch-ratio__input").val(data[0]["stretch_ratio"]);
  $("#special_note").val(data[0]["special_note"]);
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
  flag = checkSum() && checkBilletQty();
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
  fileName = "./php/DailyReport/InsPd22.php";
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

  // ErrorData = getTableData($("#error__table tbody tr"));
  // ErrorData.push(targetId);
  // fileName = "./php/DailyReport/InsError13.php";
  // sendData = JSON.stringify(ErrorData);
  // myAjax.myAjax(fileName, sendData);

  let BundleData = getTableData($("#bundle__table tbody tr"));
  BundleData.push(targetId);
  fileName = "./php/DailyReport/InsBundle16.php";
  sendData = JSON.stringify(BundleData);
  myAjax.myAjax(fileName, sendData);

  let TimeData = getTableData($("#time__table tbody tr"));
  let targetDate = $("#date__input").val(); // Lấy ngày từ input, giữ nguyên định dạng gốc

  for (let i = 0; i < TimeData.length; i++) {
    TimeData[i].push(targetDate); // Thêm ngày vào cuối mỗi dòng
  }
  TimeData.push(targetId);
  fileName = "./php/DailyReport/InsTime.php";
  sendData = JSON.stringify(TimeData);
  myAjax.myAjax(fileName, sendData);

  let PullData = getTableData($("#pull__table tbody tr"));
  PullData.push(targetId);
  fileName = "./php/DailyReport/InsPull.php";
  sendData = JSON.stringify(PullData);
  myAjax.myAjax(fileName, sendData);

  let CutData = getTableData($("#cut__table tbody tr"));
  CutData.push(targetId);
  fileName = "./php/DailyReport/InsCut.php";
  sendData = JSON.stringify(CutData);
  myAjax.myAjax(fileName, sendData);

  setSummaryTable();
  setSummaryTimeTable();

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
  $("#directive_input__select").empty().removeClass("no-input");

  // ファイル添付
  $("label").html("");
  // table クリア
  $("#rack__table tbody").empty();
  $("#work-length__table tbody").empty();
  $("#error__table tbody").empty();
  $("#bundle__table tbody").empty();
  $("#time__table tbody").empty();
  $("#pull__table tbody").empty();
  $("#cut__table tbody").empty();
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
  fileName = "./php/DailyReport/UpdatePd22.php";
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
  //update date time_table
  let TimeData = getTableData($("#time__table tbody tr"));
  let targetDate = $("#date__input").val();

  for (let i = 0; i < TimeData.length; i++) {
    TimeData[i].push(targetDate);
  }

  // Nếu không cần targetId, bỏ dòng này
  // TimeData.push(targetId);

  fileName = "./php/DailyReport/updateTimeDate.php"; // file PHP update ngày
  sendData = JSON.stringify(TimeData);
  myAjax.myAjax(fileName, sendData);
  // ========= reload summury table
  setSummaryTable();
  clearInputData(); // データの削除と背景色の設定
  $("#save__button").prop("disabled", true); // save ボタン非活性化
  $("#update__button").prop("disabled", true);
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
}

function checkSum() {
  var tt1 = 0;
  if ($("#add-rack__button").text() == "Save") {
    $("#rack__table tbody tr").each(function () {
      tt1 += Number(this.getElementsByTagName("td")[3].innerText);
    });
  } else {
    $("#rack__table tbody tr").each(function () {
      tt1 += Number(
        this.getElementsByTagName("td")[3].getElementsByTagName("input")[0]
          .value
      );
    });
  }
  $("#tt1").html(tt1);
  // $("#rack__table tbody tr").each(function () {
  //   tt1 += Number((this).getElementsByTagName("td")[3].getElementsByTagName("input")[0].value);
  // });
  // $("#tt1").html(tt1);
  var tt2 = 0;
  $("#work-length__table tbody tr").each(function () {
    tt2 += Number(
      this.getElementsByTagName("td")[1].getElementsByTagName("input")[0].value
    );
  });
  $("#tt2").html(tt2);
  if (tt1 == tt2) return true;
  else return false;
}

function checkBilletQty() {
  var ttb = 0;
  $("#bundle__table tbody tr").each(function () {
    ttb += Number(
      this.getElementsByTagName("td")[2].getElementsByTagName("input")[0].value
    );
  });
  $("#ttb").html(ttb);
  if ($("#actual-billet-qty__input").val() == ttb) return true;
  else return false;
}

$("#download_data").on("click", function () {
  let fileName;
  let sendData = new Object();
  fileName = "./php/DailyReport/DownloadSummaryV0.php";
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

// add time

$(document).on("change", "#Code", function () {
  if ($(this).val() === "0") {
    $(this).removeClass("complete-input").addClass("no-input");
  } else {
    $(this).removeClass("no-input").addClass("complete-input");
  }
  add_time_check();
});
$(document).on("keyup", "#time_start", function () {
  if (checkTimeValue($(this).val()) || cancelKeyupEvent) {
    $(this).removeClass("no-input").addClass("complete-input");
    cancelKeyupEvent = false;
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  add_time_check();
});
$(document).on("keydown", "#time_start", function (e) {
  if (e.keyCode == 13 && $("#time_start").hasClass("complete-input")) {
    $(this).val(addColon($(this).val()));
    cancelKeyupEvent = true;
    $("#time_end").focus();
    return false;
  }
  add_time_check();
});
$(document).on("keyup", "#time_end", function () {
  if (checkTimeValue($(this).val()) || cancelKeyupEvent) {
    $(this).removeClass("no-input").addClass("complete-input");
    cancelKeyupEvent = false;
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  add_time_check();
});
$(document).on("keydown", "#time_end", function (e) {
  if (e.keyCode == 13 && $("#time_end").hasClass("complete-input")) {
    $(this).val(addColon($(this).val()));
    cancelKeyupEvent = true;
    $("#time_note").focus();
    return false;
  }
  add_time_check();
});
function add_time_check() {
  if (
    $("#Code").hasClass("no-input") ||
    $("#time_start").hasClass("no-input") ||
    $("#time_end").hasClass("no-input")
  ) {
    $("#add_time__button").prop("disabled", true);
  } else {
    $("#add_time__button").prop("disabled", false);
  }
}

$("#add_time__button").on("click", function () {
  let fileName;
  let sendData = {};

  switch ($(this).text()) {
    case "Save":
      $("<tr>")
        .append("<td></td>")
        .append($("<td>").append($("<input>").val($("#Code").val())))
        .append($("<td>").append($("<input>").val($("#time_start").val())))
        .append($("<td>").append($("<input>").val($("#time_end").val())))
        .append($("<td>").append($("<input>").val($("#time_note").val())))
        .appendTo("#time__table tbody");
      $(this).prop("disabled", true);
      $("#Code").val("").removeClass("complete-input").addClass("no-input");
      $("#time_start")
        .val("")
        .removeClass("complete-input")
        .addClass("no-input");
      $("#time_end").val("").removeClass("complete-input").addClass("no-input");
      $("#time_note")
        .val("")
        .removeClass("complete-input")
        .addClass("no-input");
      break;

    case "Add":
      fileName = "./php/DailyReport/AddTime.php";
      sendData = {
        press_id: $("#selected__tr td:nth-child(1)").text(),
        Code: $("#Code").val(),
        time_start: $("#time_start").val(),
        time_end: $("#time_end").val(),
        time_note: $("#time_note").val(),
        time_date: $("#date__input").val(),
      };
      myAjax.myAjax(fileName, sendData);
      makeTimeTable();
      setSummaryTimeTable();
      $("#Code").val("").removeClass("complete-input").addClass("no-input");
      $("#time_start")
        .val("")
        .removeClass("complete-input")
        .addClass("no-input");
      $("#time_end").val("").removeClass("complete-input").addClass("no-input");
      $("#time_note")
        .val("")
        .removeClass("complete-input")
        .addClass("no-input");
      $(this).prop("disabled", true);
      break;

    case "Add Log":
      fileName = "./php/DailyReport/AddLogTime.php";
      sendData = {
        Code: $("#Code").val(),
        time_start: $("#time_start").val(),
        time_end: $("#time_end").val(),
        time_note: $("#time_note").val(),
        time_date: $("#date__input").val(),
      };
      myAjax.myAjax(fileName, sendData);
      setSummaryTimeTable();
      $("#Code").val("").removeClass("complete-input").addClass("no-input");
      $("#time_start")
        .val("")
        .removeClass("complete-input")
        .addClass("no-input");
      $("#time_end").val("").removeClass("complete-input").addClass("no-input");
      $("#time_note")
        .val("")
        .removeClass("complete-input")
        .addClass("no-input");
      $(this).prop("disabled", true);
      break;

    case "Update":
      if (editMode) {
        fileName = "./php/DailyReport/UpdateTime.php";
        sendData = {
          id: $("#time__selected td:nth-child(1)").html(),
          time_start: $("#time__selected td:nth-child(3) input").val(),
          time_end: $("#time__selected td:nth-child(4) input").val(),
        };
        console.log("Updating data:", sendData);
        myAjax.myAjax(fileName, sendData);

        // Sau khi update xong, reset nút về trạng thái ban đầu
        $(this).text("Save").prop("disabled", true);
      }
      break;

    default:
      // Không làm gì
      break;
  }

  // Cập nhật trạng thái nút Save/Update theo dữ liệu và editMode
  if (checkIsDataInputed() && !editMode) {
    $("#add_time__button").text("Save").prop("disabled", false);
  } else if (checkIsDataInputed() && editMode) {
    $("#add_time__button").text("Update").prop("disabled", false);
  } else {
    $("#add_time__button").prop("disabled", true);
  }
});

function makeTimeTable() {
  fileName = "./php/DailyReport/SelTime.php";
  sendData = {
    id: $("#selected__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#time__table tbody").empty();
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      if (tdVal == "id") {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
      } else {
        $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
      }
    });
    $(newTr).appendTo("#time__table tbody");
  });
}

// add time stretch

$(document).on("keyup", "#pull_no1, #pull_no2", function () {
  const pullNo1Val = $("#pull_no1").val().trim();
  const pullNo2Val = $("#pull_no2").val().trim();

  const isPositiveInteger = (val) => /^[1-9]\d*$/.test(val);

  // Kiểm tra ô #pull_no1
  if (this.id === "pull_no1") {
    if (isPositiveInteger(pullNo1Val)) {
      $(this).removeClass("no-input").addClass("complete-input");
    } else {
      $(this).removeClass("complete-input").addClass("no-input");
    }

    // Khi pull_no1 thay đổi, kiểm tra lại pull_no2
    $("#pull_no2").trigger("keyup");
  }

  // Kiểm tra ô #pull_no2
  if (this.id === "pull_no2") {
    if (
      isPositiveInteger(pullNo2Val) &&
      isPositiveInteger(pullNo1Val) &&
      parseInt(pullNo2Val) >= parseInt(pullNo1Val)
    ) {
      $(this).removeClass("no-input").addClass("complete-input");
    } else {
      $(this).removeClass("complete-input").addClass("no-input");
    }
  }
  add_pull_check();
});

$(document).on("keyup", "#pull_start", function () {
  if (checkTimeValue($(this).val()) || cancelKeyupEvent) {
    $(this).removeClass("no-input").addClass("complete-input");
    cancelKeyupEvent = false;
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  add_pull_check();
});
$(document).on("keydown", "#pull_start", function (e) {
  if (e.keyCode == 13 && $("#pull_start").hasClass("complete-input")) {
    $(this).val(addColon($(this).val()));
    cancelKeyupEvent = true;
    $("#pull_end").focus();
    return false;
  }
});
$(document).on("keyup", "#pull_end", function () {
  if (checkTimeValue($(this).val()) || cancelKeyupEvent) {
    $(this).removeClass("no-input").addClass("complete-input");
    cancelKeyupEvent = false;
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  add_pull_check();
});
$(document).on("keydown", "#pull_end", function (e) {
  if (e.keyCode == 13 && $("#pull_end").hasClass("complete-input")) {
    $(this).val(addColon($(this).val()));
    cancelKeyupEvent = true;
    $("#add_pull__button").focus();
    return false;
  }
});

$(document).on("change", "#pull_date", function () {
  $(this).removeClass("no-input").addClass("complete-input");
  add_pull_check();
});

function add_pull_check() {
  if (
    $("#pull_date").hasClass("no-input") ||
    $("#pull_no1").hasClass("no-input") ||
    $("#pull_no2").hasClass("no-input") ||
    $("#pull_start").hasClass("no-input") ||
    $("#pull_end").hasClass("no-input")
  ) {
    $("#add_pull__button").prop("disabled", true);
  } else {
    $("#add_pull__button").prop("disabled", false);
  }
}

$("#add_pull__button").on("click", function () {
  switch ($(this).text()) {
    case "Save":
      const newTr = $("<tr>");
      newTr.append("<td></td>");
      newTr.append($("<td>").append($("<input>").val($("#pull_date").val())));
      newTr.append($("<td>").append($("<input>").val($("#pull_no1").val())));
      // Cột mũi tên →
      $("<td>")
        .css({
          "text-align": "center",
          "vertical-align": "middle",
          "font-weight": "bold",
          color: "green",
        })
        .html("→")
        .appendTo(newTr);
      newTr.append($("<td>").append($("<input>").val($("#pull_no2").val())));
      newTr.append($("<td>").append($("<input>").val($("#pull_start").val())));
      newTr.append($("<td>").append($("<input>").val($("#pull_end").val())));
      newTr.appendTo("#pull__table tbody");
      SumPullTime();
      $(this).prop("disabled", true);
      $("#pull_no1").val("").removeClass("complete-input").addClass("no-input");
      $("#pull_no2").val("").removeClass("complete-input").addClass("no-input");
      $("#pull_start")
        .val("")
        .removeClass("complete-input")
        .addClass("no-input");
      $("#pull_end").val("").removeClass("complete-input").addClass("no-input");
      break;
    case "Add":
      let fileName;
      let sendData = new Object();
      fileName = "./php/DailyReport/AddPull.php";
      sendData = {
        press_id: $("#selected__tr td:nth-child(1)").text(),
        pull_date: $("#pull_date").val(),
        pull_no1: $("#pull_no1").val(),
        pull_no2: $("#pull_no2").val(),
        pull_start: $("#pull_start").val(),
        pull_end: $("#pull_end").val(),
      };
      myAjax.myAjax(fileName, sendData);
      makePullTable();
      SumPullTime();
      setSummaryPullTable();
      $("#pull_no1").val("").removeClass("complete-input").addClass("no-input");
      $("#pull_no2").val("").removeClass("complete-input").addClass("no-input");
      $("#pull_start")
        .val("")
        .removeClass("complete-input")
        .addClass("no-input");
      $("#pull_end").val("").removeClass("complete-input").addClass("no-input");
      $("#add_pull__button").prop("disabled", true);
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

function makePullTable() {
  fileName = "./php/DailyReport/SelPull.php";
  sendData = {
    id: $("#selected__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#pull__table tbody").empty();

  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");

    Object.keys(trVal).forEach(function (key) {
      if (key === "id") {
        $("<td>").html(trVal[key]).appendTo(newTr);
      } else if (key === "pull_no1") {
        // Tạo td pull_no1
        $("<td>").append($("<input>").val(trVal[key])).appendTo(newTr);
        // Thêm cột chứa mũi tên →
        $("<td>")
          .css({
            "text-align": "center",
            "vertical-align": "middle",
            "font-weight": "bold",
            color: "green",
          })
          .html("→")
          .appendTo(newTr);
      } else if (key === "pull_no2") {
        // Ở đây tạo input pull_no2 bình thường
        $("<td>").append($("<input>").val(trVal[key])).appendTo(newTr);
      } else {
        $("<td>").append($("<input>").val(trVal[key])).appendTo(newTr);
      }
    });

    newTr.appendTo("#pull__table tbody");
  });
}

// add time cut

$(document).on("keyup", "#cut_no1, #cut_no2", function () {
  const cutNo1Val = $("#cut_no1").val().trim();
  const cutNo2Val = $("#cut_no2").val().trim();

  const isPositiveInteger = (val) => /^[1-9]\d*$/.test(val);

  // Kiểm tra ô #cut_no1
  if (this.id === "cut_no1") {
    if (isPositiveInteger(cutNo1Val)) {
      $(this).removeClass("no-input").addClass("complete-input");
    } else {
      $(this).removeClass("complete-input").addClass("no-input");
    }

    // Khi cut_no1 thay đổi, kiểm tra lại cut_no2
    $("#cut_no2").trigger("keyup");
  }

  // Kiểm tra ô #cut_no2
  if (this.id === "cut_no2") {
    if (
      isPositiveInteger(cutNo2Val) &&
      isPositiveInteger(cutNo1Val) &&
      parseInt(cutNo2Val) >= parseInt(cutNo1Val)
    ) {
      $(this).removeClass("no-input").addClass("complete-input");
    } else {
      $(this).removeClass("complete-input").addClass("no-input");
    }
  }
  add_cut_check();
});
$(document).on("keyup", "#cut_start", function () {
  if (checkTimeValue($(this).val()) || cancelKeyupEvent) {
    $(this).removeClass("no-input").addClass("complete-input");
    cancelKeyupEvent = false;
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  add_cut_check();
});
$(document).on("keydown", "#cut_start", function (e) {
  if (e.keyCode == 13 && $("#cut_start").hasClass("complete-input")) {
    $(this).val(addColon($(this).val()));
    cancelKeyupEvent = true;
    $("#cut_end").focus();
    return false;
  }
});
$(document).on("keyup", "#cut_end", function () {
  if (checkTimeValue($(this).val()) || cancelKeyupEvent) {
    $(this).removeClass("no-input").addClass("complete-input");
    cancelKeyupEvent = false;
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  add_cut_check();
});
$(document).on("keydown", "#cut_end", function (e) {
  if (e.keyCode == 13 && $("#cut_end").hasClass("complete-input")) {
    $(this).val(addColon($(this).val()));
    cancelKeyupEvent = true;
    $("#add_cut__button").focus();
    return false;
  }
});

$(document).on("change", "#cut_date", function () {
  $(this).removeClass("no-input").addClass("complete-input");
  add_cut_check();
});

function add_cut_check() {
  if (
    $("#cut_date").hasClass("no-input") ||
    $("#cut_no1").hasClass("no-input") ||
    $("#cut_no2").hasClass("no-input") ||
    $("#cut_start").hasClass("no-input") ||
    $("#cut_end").hasClass("no-input")
  ) {
    $("#add_cut__button").prop("disabled", true);
  } else {
    $("#add_cut__button").prop("disabled", false);
  }
}

$("#add_cut__button").on("click", function () {
  switch ($(this).text()) {
    case "Save":
      const newCutTr = $("<tr>");
      newCutTr.append("<td></td>");
      newCutTr.append($("<td>").append($("<input>").val($("#cut_date").val())));
      newCutTr.append($("<td>").append($("<input>").val($("#cut_no1").val())));
      $("<td>")
        .css({
          "text-align": "center",
          "vertical-align": "middle",
          "font-weight": "bold",
          color: "green",
        })
        .html("→")
        .appendTo(newCutTr);
      newCutTr.append($("<td>").append($("<input>").val($("#cut_no2").val())));
      newCutTr.append(
        $("<td>").append($("<input>").val($("#cut_start").val()))
      );
      newCutTr.append($("<td>").append($("<input>").val($("#cut_end").val())));
      newCutTr.appendTo("#cut__table tbody");
      SumCutTime?.();
      $(this).prop("disabled", true);
      $("#cut_no1").val("").removeClass("complete-input").addClass("no-input");
      $("#cut_no2").val("").removeClass("complete-input").addClass("no-input");
      $("#cut_start")
        .val("")
        .removeClass("complete-input")
        .addClass("no-input");
      $("#cut_end").val("").removeClass("complete-input").addClass("no-input");
      break;
    case "Add":
      let fileName;
      let sendData = {};
      fileName = "./php/DailyReport/AddCut.php";
      sendData = {
        press_id: $("#selected__tr td:nth-child(1)").text(),
        cut_date: $("#cut_date").val(),
        cut_no1: $("#cut_no1").val(),
        cut_no2: $("#cut_no2").val(),
        cut_start: $("#cut_start").val(),
        cut_end: $("#cut_end").val(),
      };
      myAjax.myAjax(fileName, sendData);
      makeCutTable();
      SumCutTime();
      setSummaryCutTable();
      $("#cut_no1").val("").removeClass("complete-input").addClass("no-input");
      $("#cut_no2").val("").removeClass("complete-input").addClass("no-input");
      $("#cut_start")
        .val("")
        .removeClass("complete-input")
        .addClass("no-input");
      $("#cut_end").val("").removeClass("complete-input").addClass("no-input");
      $("#add_cut__button").prop("disabled", true);
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

function makeCutTable() {
  fileName = "./php/DailyReport/SelCut.php";
  sendData = {
    id: $("#selected__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#cut__table tbody").empty();

  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");

    Object.keys(trVal).forEach(function (key) {
      if (key === "id") {
        $("<td>").html(trVal[key]).appendTo(newTr);
      } else if (key === "cut_no1") {
        $("<td>").append($("<input>").val(trVal[key])).appendTo(newTr);
        $("<td>")
          .css({
            "text-align": "center",
            "vertical-align": "middle",
            "font-weight": "bold",
            color: "green",
          })
          .html("→")
          .appendTo(newTr);
      } else if (key === "cut_no2") {
        $("<td>").append($("<input>").val(trVal[key])).appendTo(newTr);
      } else {
        $("<td>").append($("<input>").val(trVal[key])).appendTo(newTr);
      }
    });

    newTr.appendTo("#cut__table tbody");
  });
}

// tính thời gian đùn
function parseTimeToSeconds(timeStr) {
  timeStr = timeStr.substring(0, 5);
  const [h, m] = timeStr.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 3600 + m * 60;
}

function getDefaultDuration() {
  const startVal = $("#press-start__input").val() || "";
  const finishVal = $("#press-finish__input").val() || "";

  const startSec = parseTimeToSeconds(startVal);
  const finishSec = parseTimeToSeconds(finishVal);

  if (startSec === null || finishSec === null) return 0;

  return finishSec >= startSec ? finishSec - startSec : 0;
}

function getTableDuration() {
  let totalSeconds = 0;
  let rows = $("#time__table tbody tr");
  if (rows.length === 0) return 0;

  rows.each(function () {
    let code =
      $(this).find("td").eq(1).find("input").val() ||
      $(this).find("#Code").text();

    // Nếu code là 200 hoặc 300 thì bỏ qua dòng này
    if (code == "200" || code == "300") return;

    let start = $(this).find("td").eq(2).find("input").val() || "";
    let end = $(this).find("td").eq(3).find("input").val() || "";

    if (start && end) {
      const startSec = parseTimeToSeconds(start);
      const endSec = parseTimeToSeconds(end);

      if (startSec !== null && endSec !== null && endSec >= startSec) {
        totalSeconds += endSec - startSec;
      }
    }
  });

  return totalSeconds;
}

function formatSecondsToHourMinute(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  let result = "";

  if (hours === 0 && minutes === 0) result = "0";
  else {
    result += hours * 60 + minutes;
  }

  return result.trim();
}

function updateExtrusionTime() {
  const formattedResult = formatSecondsToHourMinute(getDefaultDuration());
  $("#tg_dun").html("Extrusion time: " + formattedResult + " min");
  return getDefaultDuration();
}

//tính thời gian kéo
function SumPullTime() {
  let totalMinutes = 0;
  let rows = $("#pull__table tbody tr");

  if (rows.length === 0) {
    // Bảng rỗng, giữ nguyên text mặc định
    $("#tg_pull").text("Stretching time");
    return 0;
  }

  rows.each(function () {
    // Lấy giá trị start, end từ input trong cột 6, 7 (index 5, 6)
    let start = $(this).find("td").eq(5).find("input").val();
    let end = $(this).find("td").eq(6).find("input").val();

    if (start && end) {
      // Lấy 5 ký tự đầu HH:mm (bỏ giây nếu có)
      start = start.substring(0, 5);
      end = end.substring(0, 5);

      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);

      if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) {
        return; // nếu sai format, bỏ qua dòng này
      }

      let startMinutes = (sh * 60 + sm) * 60;
      let endMinutes = (eh * 60 + em) * 60;

      totalMinutes += endMinutes - startMinutes;
    }
  });

  // Hiển thị kết quả kèm "minutes"
  const formattedResult = formatSecondsToHourMinute(totalMinutes);
  $("#tg_pull").html("Stretching time: " + formattedResult + " min");
  return totalMinutes;
}

// tính thời gian cắt
function SumCutTime() {
  let totalMinutes = 0;
  let rows = $("#cut__table tbody tr");

  if (rows.length === 0) {
    // Bảng rỗng, giữ nguyên text mặc định
    $("#tg_cut").text("Cutting time");
    return 0;
  }

  rows.each(function () {
    // Lấy giá trị start, end từ input trong cột 6, 7 (index 5, 6)
    let start = $(this).find("td").eq(5).find("input").val();
    let end = $(this).find("td").eq(6).find("input").val();

    if (start && end) {
      // Lấy 5 ký tự đầu HH:mm (bỏ giây nếu có)
      start = start.substring(0, 5);
      end = end.substring(0, 5);

      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);

      if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) {
        return; // nếu sai format, bỏ qua dòng này
      }

      let startMinutes = (sh * 60 + sm) * 60;
      let endMinutes = (eh * 60 + em) * 60;

      totalMinutes += endMinutes - startMinutes;
    }
  });

  // Hiển thị kết quả kèm "minutes"
  const formattedResult = formatSecondsToHourMinute(totalMinutes);
  $("#tg_cut").html("Cutting time: " + formattedResult + " min");
  return totalMinutes;
}

function SumAllTimes() {
  // Ép kiểu và fallback về 0 nếu giá trị không hợp lệ
  const time1 = Number(updateExtrusionTime()) || 0;
  const time2 = Number(SumCutTime()) || 0;
  const time3 = Number(SumPullTime()) || 0;

  console.log("time1:", time1);
  console.log("time2:", time2);
  console.log("time3:", time3);

  const total = time1 + time2 + time3;
  const formattedResult = formatSecondsToHourMinute(total);

  $("#total_time").text("Total: " + formattedResult + " min");
}

//điều kiện chọn chiều dài billet
$(document).ready(function () {
  $("#billet-size__select").on("change", function () {
    const billetValue = $(this).val();

    // Xử lý lọc machine-number__select ở đây
    const machineSelect = $("#machine-number__select");

    // Lưu lại các option gốc (nên lưu ngoài event để không tạo lại mỗi lần)
    // Để demo mình viết tạm ở đây
    const originalOptions = machineSelect.data("originalOptions");
    if (!originalOptions) {
      machineSelect.data(
        "originalOptions",
        machineSelect.find("option").clone()
      );
    }

    machineSelect.empty();

    // Luôn thêm option mặc định
    const defaultOption = machineSelect
      .data("originalOptions")
      .filter('[value="0"]')
      .clone();
    machineSelect.append(defaultOption);

    if (billetValue === "12" || billetValue === "14") {
      const option2 = machineSelect
        .data("originalOptions")
        .filter('[value="2"]')
        .clone();
      machineSelect.append(option2);
    } else if (billetValue === "9") {
      const option1 = machineSelect
        .data("originalOptions")
        .filter('[value="1"]')
        .clone();
      const option3 = machineSelect
        .data("originalOptions")
        .filter('[value="3"]')
        .clone();
      machineSelect.append(option1).append(option3);
    } else {
      machineSelect.data("originalOptions").each(function () {
        if (this.value !== "0") {
          machineSelect.append($(this).clone());
        }
      });
    }

    machineSelect.val("0"); // reset về mặc định
  });
});

function updateAddButtonText() {
  let dateInput = $("#date__input");
  let dieSelect = $("#die__select");
  let addButton = $("#add_time__button");

  if (dateInput.hasClass("complete-input") && dieSelect.hasClass("no-input")) {
    addButton.text("Add Log");
  } else {
    addButton.text("Save"); // Hoặc text mặc định bạn muốn khi không thỏa điều kiện
  }
}

//SUMMARY TABLE
function diffInMinutes(startTime, endTime) {
  // startTime, endTime là chuỗi "HH:mm"
  let [sh, sm] = startTime.split(":").map(Number);
  let [eh, em] = endTime.split(":").map(Number);
  return eh * 60 + em - (sh * 60 + sm);
}

function setSummaryTimeTable() {
  let fileName = "./php/DailyReport/SelSummaryTime.php";
  let startDate = $("#start-term-ex").val();
  let endDate = $("#end-term-ex").val();

  let sendData = {
    "start-term-ex": startDate || "",
    "end-term-ex": endDate || "",
  };

  $.ajax({
    url: fileName,
    type: "POST",
    data: sendData,
    dataType: "json",
    success: function (data) {
      $("#summary_time__table tbody").empty();
      data.forEach((row) => {
        let tr = $("<tr>");
        tr.append($("<td>").text(row.id));
        tr.append($("<td>").text(row.press_id));
        tr.append($("<td>").text(row.time_date || "")); // Hiện rỗng nếu null
        tr.append($("<td>").text(row.die_number));
        tr.append($("<td>").text(row.dies_id));
        tr.append($("<td>").text(row.production_number));
        tr.append($("<td>").text(row.production_number_id));
        tr.append($("<td>").text(row.pressing_type));
        tr.append($("<td>").text(row.pressing_type_id));
        tr.append($("<td>").text(row.Code));
        tr.append($("<td>").text(row.time_start));
        tr.append($("<td>").text(row.time_end));

        let duration = "";
        if (row.time_start && row.time_end) {
          let diff = diffInMinutes(row.time_start, row.time_end);
          duration = diff + " min";
        }
        tr.append($("<td>").text(duration));

        tr.append($("<td>").text(row.time_note || ""));
        tr.appendTo("#summary_time__table tbody");
      });
    },
    error: function (xhr, status, error) {
      console.error("Lỗi AJAX:", error);
    },
  });
}

$("#start-term-ex").on("change", function () {
  setSummaryTimeTable();
});
$("#end-term-ex").on("change", function () {
  setSummaryTimeTable();
});
// Gọi lần đầu khi load trang
$(document).ready(function () {
  setSummaryTimeTable();
  setSummaryPullTable();
  setSummaryCutTable();
});

//SUMMARY PULL TABLE
function setSummaryPullTable() {
  let fileName = "./php/DailyReport/SelSummaryPull.php";
  let startDate = $("#start-term-pull").val();
  let endDate = $("#end-term-pull").val();

  let sendData = {
    "start-term-pull": startDate || "",
    "end-term-pull": endDate || "",
  };

  $.ajax({
    url: fileName,
    type: "POST",
    data: sendData,
    dataType: "json",
    success: function (data) {
      $("#summary_pull__table tbody").empty();
      data.forEach((row) => {
        let tr = $("<tr>");
        tr.append($("<td>").text(row.id));
        tr.append($("<td>").text(row.press_id));
        tr.append($("<td>").text(row.pull_date));
        tr.append($("<td>").text(row.die_number));
        tr.append($("<td>").text(row.dies_id));
        tr.append($("<td>").text(row.production_number));
        tr.append($("<td>").text(row.production_number_id));
        tr.append($("<td>").text(row.pull_no1));
        tr.append($("<td>").text(row.pull_no2));
        tr.append($("<td>").text(row.pull_start));
        tr.append($("<td>").text(row.pull_end));

        let duration = "";
        if (row.pull_start && row.pull_end) {
          let diff = diffInMinutes(row.pull_start, row.pull_end);
          duration = diff + " min";
        }
        tr.append($("<td>").text(duration));
        tr.appendTo("#summary_pull__table tbody");
      });
    },
    error: function (xhr, status, error) {
      console.error("Lỗi AJAX:", error);
    },
  });
}

$("#start-term-pull").on("change", function () {
  setSummaryPullTable();
});
$("#end-term-pull").on("change", function () {
  setSummaryPullTable();
});

//SUMMARY CUT TABLE
function setSummaryCutTable() {
  let fileName = "./php/DailyReport/SelSummaryCut.php";
  let startDate = $("#start-term-cut").val();
  let endDate = $("#end-term-cut").val();

  let sendData = {
    "start-term-cut": startDate || "",
    "end-term-cut": endDate || "",
  };

  $.ajax({
    url: fileName,
    type: "POST",
    data: sendData,
    dataType: "json",
    success: function (data) {
      $("#summary_cut__table tbody").empty();
      data.forEach((row) => {
        let tr = $("<tr>");
        tr.append($("<td>").text(row.id));
        tr.append($("<td>").text(row.press_id));
        tr.append($("<td>").text(row.cut_date));
        tr.append($("<td>").text(row.die_number));
        tr.append($("<td>").text(row.dies_id));
        tr.append($("<td>").text(row.production_number));
        tr.append($("<td>").text(row.production_number_id));
        tr.append($("<td>").text(row.cut_no1));
        tr.append($("<td>").text(row.cut_no2));
        tr.append($("<td>").text(row.cut_start));
        tr.append($("<td>").text(row.cut_end));

        let duration = "";
        if (row.cut_start && row.cut_end) {
          let diff = diffInMinutes(row.cut_start, row.cut_end);
          duration = diff + " min";
        }
        tr.append($("<td>").text(duration));
        tr.appendTo("#summary_cut__table tbody");
      });
    },
    error: function (xhr, status, error) {
      console.error("Lỗi AJAX:", error);
    },
  });
}

$("#start-term-cut").on("change", function () {
  setSummaryCutTable();
});
$("#end-term-cut").on("change", function () {
  setSummaryCutTable();
});

//KIỂM TRA THỜI GIAN KẾT THÚC KHÔNG ĐƯỢC NHỎ HƠN THỜI GIAN BẮT ĐẦU
function checkTimeOrder(startSelector, finishSelector, targetSelector) {
  const startTime = $(startSelector).val();
  const finishTime = $(finishSelector).val();

  const $target = $(targetSelector);

  if (startTime && finishTime) {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [finishHour, finishMin] = finishTime.split(":").map(Number);

    const startTotal = startHour * 60 + startMin;
    const finishTotal = finishHour * 60 + finishMin;

    if (finishTotal > startTotal) {
      $target.removeClass("no-input").addClass("complete-input");
    } else {
      $target.removeClass("complete-input").addClass("no-input");
    }
  } else {
    // Nếu thiếu 1 trong 2 input, xem là không hợp lệ
    $target.removeClass("complete-input").addClass("no-input");
  }
}
$("#press-start__input, #press-finish__input").on("change", function () {
  checkTimeOrder(
    "#press-start__input",
    "#press-finish__input",
    "#press-finish__input"
  );
});

$("#time_start, #time_end").on("change", function () {
  checkTimeOrder("#time_start", "#time_end", "#time_end");
});

$("#pull_start, #pull_end").on("change", function () {
  checkTimeOrder("#pull_start", "#pull_end", "#pull_end");
});

$("#cut_start, #cut_end").on("change", function () {
  checkTimeOrder("#cut_start", "#cut_end", "#cut_end");
});

// DOWNLOAD TIME SUMMARY
$("#download_time__button").on("click", function () {
  let fileName = "./php/DailyReport/DownloadSummaryTime.php";

  // Lấy giá trị input
  let startDate = $("#start-term-ex").val();
  let endDate = $("#end-term-ex").val();

  // Nếu rỗng thì gán chuỗi rỗng
  if (!startDate) startDate = "";
  if (!endDate) endDate = "";

  let sendData = {
    start_date: startDate,
    end_date: endDate,
  };

  myAjax.myAjax(fileName, sendData);
  downloadFileExtrusion();
});

// DOWNLOAD stretch TIME SUMMARY
$("#download_pull__button").on("click", function () {
  let fileName = "./php/DailyReport/DownloadSummaryPull.php";

  // Lấy giá trị input
  let startDate = $("#start-term-pull").val();
  let endDate = $("#end-term-pull").val();

  // Nếu rỗng thì gán chuỗi rỗng
  if (!startDate) startDate = "";
  if (!endDate) endDate = "";

  let sendData = {
    start_date: startDate,
    end_date: endDate,
  };

  myAjax.myAjax(fileName, sendData);
  downloadFilePull();
});

// DOWNLOAD cut TIME SUMMARY
$("#download_cut__button").on("click", function () {
  let fileName = "./php/DailyReport/DownloadSummaryCut.php";

  // Lấy giá trị input
  let startDate = $("#start-term-cut").val();
  let endDate = $("#end-term-cut").val();

  // Nếu rỗng thì gán chuỗi rỗng
  if (!startDate) startDate = "";
  if (!endDate) endDate = "";

  let sendData = {
    start_date: startDate,
    end_date: endDate,
  };

  myAjax.myAjax(fileName, sendData);
  downloadFileCut();
});

function downloadFileExtrusion() {
  // 指定したファイル名のファイルをダウンロードする。
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = "prsdt_extrusion.csv";
  a.href = "./../../../diereport/ex0.11/download/prsdt_extrusion.csv";

  a.click();
  a.remove();
}
function downloadFilePull() {
  // 指定したファイル名のファイルをダウンロードする。
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = "prsdt_stretch.csv";
  a.href = "./../../../diereport/ex0.11/download/prsdt_stretch.csv";

  a.click();
  a.remove();
}
function downloadFileCut() {
  // 指定したファイル名のファイルをダウンロードする。
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = "prsdt_cut.csv";
  a.href = "./../../../diereport/ex0.11/download/prsdt_cut.csv";

  a.click();
  a.remove();
}

//gắn class no-input cho ô note trong bundle table
const inspSelect = document.getElementById("insp");
const noteInput = document.getElementById("note_billet");

function updateNoteInputClasses() {
  if (inspSelect.value === "2") {
    // Nếu chọn NG thì mặc định thêm no-input
    noteInput.classList.add("no-input");
    noteInput.classList.remove("complete-input");
  } else {
    // Nếu không chọn NG thì xóa hết class điều kiện
    noteInput.classList.remove("no-input", "complete-input");
  }
  add_bundle_check();
}

// Khi thay đổi select
inspSelect.addEventListener("change", () => {
  updateNoteInputClasses();
});

// Khi nhập liệu vào input
noteInput.addEventListener("keyup", () => {
  if (noteInput.value.trim() !== "") {
    // Nếu khác rỗng, bỏ no-input, thêm complete-input
    noteInput.classList.remove("no-input");
    noteInput.classList.add("complete-input");
  } else {
    // Nếu rỗng, thêm lại no-input nếu select là 2 (NG), xóa complete-input
    if (inspSelect.value === "2") {
      noteInput.classList.add("no-input");
    }
    noteInput.classList.remove("complete-input");
  }
  add_bundle_check();
});

// Thiết lập trạng thái lúc trang load xong
window.addEventListener("DOMContentLoaded", () => {
  updateNoteInputClasses();
});

$(document).on("click", "#time__table tbody tr", function () {
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    $("#time__selected").removeAttr("id");
    $(this).attr("id", "time__selected");
  } else {
    // $(this).removeClass("selected-record");
    // $(this).removeAttr("id");
  }
});
$(document).on("change", "#time__table tbody tr", function () {
  $("#add_time__button").text("Update").prop("disabled", false);
});
