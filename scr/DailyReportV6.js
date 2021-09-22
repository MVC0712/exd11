// 削除確認ダイアログ
let deleteDialog = document.getElementById("delete__dialog");

// 初期値
let cancelKeyupEvent = false;
let editMode = false;
let readNewFile = false;

$(function () {
  ajaxSelSummary(); // summary tebale の読み出し
  // 今日の日付の代入
  $("#date__input")
    .val(fillToday())
    .removeClass("no-input")
    .addClass("complete-input")
    .focus();

  // 入力項目の非活性化
  // $("#directive__input").prop("disabled", true);
  // ボタンの非活性化
  $("#save__button").prop("disabled", true);
  $("#update__button").prop("disabled", true);
  // test ボタンの表示
  $("#test__button").remove();
  $("#test2__button").remove();
});

function ajaxSelSummary(targetDate) {
  $.ajax({
    type: "POST",
    url: "./php/DailyReport/SelSummary.php",
    dataType: "json",
    async: false,
    data: {
      die_number: "dummy",
    },
  })
    .done(function (data) {
      // console.log(data);
      makeSummaryTable(data);
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function makeSummaryTable(data) {
  let html = "";
  data.forEach(function (element) {
    html += "<tr><td>";
    html += element["id"] + "</td><td>";
    html += element["press_date_at"].substr(5, 8) + "</td><td>";
    html += element["press_machine_no"] + "</td><td>";
    html += element["die_number"] + "</td><td>";
    html += element["dies_id"] + "</td><td>";
    html += element["pressing_type"] + "</td><td>";
    html += element["pressing_type_id"] + "</td><td>";
    html += element["is_washed_die"] + "</td><td>";
    html += element["is_washed_die_id"] + "</td><td>";
    html += element["billet_lot_number"] + "</td><td>";
    html += element["billet_size"] + "</td><td>";
    html += element["billet_length"] + "</td><td>";
    html += element["plan_billet_quantities"] + "</td><td>";
    html += element["actual_billet_quantities"] + "</td><td>";
    html += element["stop_cause"] + "</td><td>";
    html += element["press_start_at"].substr(0, 5) + "</td><td>";
    html += element["press_finish_at"].substr(0, 5) + "</td><td>";
    html += element["actual_ram_speed"] + "</td><td>";
    html += element["actual_die_temperature"] + "</td></tr>";
  });
  $("#summary__table tbody").empty();
  $("#summary__table tbody").append(html);
  // console.log(html);
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- input check from here -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//  order sheet number
$(document).on("focus", "#directive__input", function () {
  ajaxOrdersheetNumber($(this).val());
});

//  order sheet number
$(document).on("keyup", "#directive__input", function () {
  ajaxOrdersheetNumber($(this).val());
});

function ajaxOrdersheetNumber(str) {
  str = "%" + str + "%";
  $.ajax({
    type: "POST",
    url: "./php/DailyReport/SelOrdersheetNumber.php",
    dataType: "json",
    async: false,
    data: {
      ordersheet_number: str,
    },
  })
    .done(function (data) {
      // 戻り値が1の時はそのまま表示する
      if (data.length == 1) {
        $("#directive_input__select")
          .empty()
          .append(
            $("<option>").val(data[0]["id"]).html(data[0]["ordersheet_number"])
          );
        // 戻り値が1の時はそのまま表示する
      } else if (data.length != 0) {
        $("#directive_input__select")
          .empty()
          .append($("<option>").val(0).html("no"));
        data.forEach(function (value) {
          $("<option>")
            .val(value["id"])
            .html(value["ordersheet_number"])
            .appendTo("#directive_input__select");
        });
      }
    })
    .fail(function () {
      alert("DB connect error");
    });
}

//  Ordersheet Number
$(document).on("change", "#directive_input__select", function () {
  if ($(this).val() != 0) {
    $("#directive_input__select")
      .removeClass("no-input")
      .addClass("complete-input");
  } else {
    $("#directive_input__select")
      .removeClass("complete-input")
      .addClass("no-input");
  }
});

// date : 日付
$(document).on("focus", "#date__input", function () {
  if (editMode != true) {
    $("#date__input").val(fillToday());
  }
});

$(document).on("keydown", "#date__input", function (e) {
  setDate(e, $(this));
  chkMoveNext(e, $(this), $("#die__input"));
});

function setDate(e, targetDom) {
  // 日付入力枠にフォーカスがあるとき、カーソルキーの左右で日付値を変更する
  let dateLetters;
  let setDate;
  let displayDate;
  let today = new Date();
  today.setDate(today.getDate() - 1); // 日付を一つ少なくしておく

  dateLetters = targetDom.val().split("-");
  setDate =
    Number(dateLetters[0]) + 2000 + "/" + dateLetters[1] + "/" + dateLetters[2];
  let inputDay = new Date(setDate);

  if (e.keyCode == 37 || e.keyCode == 80) {
    // ←またはpが押されたとき
    event.preventDefault(); // 入力をキャンセル
    inputDay.setDate(inputDay.getDate() - 1);
  } else if (e.keyCode == 39 || e.keyCode == 78) {
    // →またはnが押されたとき
    event.preventDefault(); // 入力をキャンセル
    if (inputDay < today) {
      inputDay.setDate(inputDay.getDate() + 1);
    }
  } else if (e.keyCode == 9) {
    // Tabキーはキャンセルしない
  } else {
    event.preventDefault(); // 他の入力はキャンセル
  }

  displayDate =
    Number(inputDay.getFullYear()) -
    2000 +
    "-" +
    Number(inputDay.getMonth() + 1) +
    "-" +
    inputDay.getDate();
  targetDom.val(displayDate); // 日付を表示する

  targetDom.removeClass("no-input").addClass("complete-input"); // 背景色を入力済みに変更する
}

function fillToday() {
  // 本日の日付をyy-mm-dd形式で返す
  let dt = new Date();
  return (
    dt.getFullYear() - 2000 + "-" + (dt.getMonth() + 1) + "-" + dt.getDate()
  );
}

// Die Name
$(document).on("focus", "#die__input", function () {
  ajaxSelDie("");
});

$(document).on("keyup", "#die__input", function () {
  $(this).val($(this).val().toUpperCase()); // 小文字を大文字に
  ajaxSelDie($(this).val());
});

$(document).on("keydown", "#die__input", function (e) {
  if ($(this).val().length > 0 && e.keyCode == 13) {
    $("#die__select").focus();
  }
});

function ajaxSelDie(inputValue) {
  let deferred = new $.Deferred();
  inputValue = inputValue + "%";
  $.ajax({
    type: "POST",
    url: "./php/DailyReport/SelDieNumber.php",
    dataType: "json",
    // async: false,
    data: {
      die_number: inputValue,
    },
  })
    .done(function (data) {
      $("#number-of-die__display").html(data.length);
      $("#die__select option").remove();
      $("#die__select").append($("<option>").val(0).html("NO select"));
      data.forEach(function (value) {
        $("#die__select").append(
          $("<option>").val(value["id"]).html(value["die_number"])
        );
      });
    })
    .fail(function () {
      alert("DB connect error");
    })
    .always(function () {
      deferred.resolve();
    });
  return deferred;
}
// Die Select
$(document).on("keydown", "#die__select", function (e) {
  chkMoveNext(e, $(this), $("#is-washed__select"));
});

$(document).on("change", "#die__select", function () {
  if ($(this).val() != "0") {
    $(this).removeClass("no-input").addClass("complete-input");
    ajaxSelDirectiveDate($("#die__select").val());
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

function ajaxSelDirectiveDate(targetId) {
  $.ajax({
    type: "POST",
    url: "./php/DailyReport/SelDirective.php",
    dataType: "json",
    // async: false,
    data: {
      targetId: targetId,
    },
  })
    .done(function (data) {
      $("#press-directive__select option").remove();
      data.forEach(function (value) {
        $("#press-directive__select").append(
          $("<option>").val(value["id"]).html(value["plan_date_at"])
        );
      });
      if (data.length) {
        $("#press-directive__select")
          .removeClass("no-input")
          .addClass("complete-input");
      } else {
        $("#press-directive__select")
          .removeClass("complete-input")
          .addClass("no-input");
      }
    })
    .fail(function (data) {
      alert("DB connect error");
      console.log(data);
    });
}

// is Washed?
$(document).on("change", "#is-washed__select", function () {
  if ($(this).val() != 0)
    $(this).removeClass("no-input").addClass("complete-input");
  else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("keydown", "#is-washed__select", function (e) {
  chkMoveNext(e, $(this), $("#pressing-type__select"));
});

// Pressing type
$(document).on("change", "#pressing-type__select", function () {
  if ($(this).val() != 0)
    $(this).removeClass("no-input").addClass("complete-input");
  else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("keydown", "#pressing-type__select", function (e) {
  chkMoveNext(e, $(this), $("#billet-lot-number__input"));
  // マシンナンバーは　1を代入する
  $("#machine-number__select")
    .val(1)
    .removeClass("no-input")
    .addClass("complete-input");
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

$(document).on("keydown", "#billet-lot-number__input", function (e) {
  chkMoveNext(e, $(this), $("#billet-length__select"));
  $("#billet-size__select")
    .val("9")
    .removeClass("no-input")
    .addClass("complete-input");
});

// Billet Size
$(document).on("change", "#billet-size__select", function () {
  $(this).val($(this).val().toUpperCase());
  if ($(this).val() != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("keydown", "#billet-size__select", function (e) {
  chkMoveNext(e, $(this), $("#billet-length__select"));
});

// Billet Length
$(document).on("change", "#billet-length__select", function () {
  if ($(this).val() != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("keydown", "#billet-length__select", function (e) {
  chkMoveNext(e, $(this), $("#plan-billet-qty__input"));
});

function chkMoveNext(e, thisDom, nextDom) {
  // thisDOM がcomplete-inputクラスなら改行キーでnextDomにフォーカスを移動する
  if (e.keyCode == 13 && thisDom.hasClass("complete-input")) {
    e.preventDefault(); // 入力をキャンセル。これをしないと、移動後、ボタンをクリックしてしまう
    $(nextDom).focus();
  }
}

// Billet Plan Quantity
$(document).on("keydown", "#plan-billet-qty__input", function (e) {
  // 数字と tab と backspace は除く
  if (
    (48 <= e.keyCode && e.keyCode <= 57) ||
    e.keyCode == 8 ||
    e.keyCode == 9 ||
    e.keyCode == 13
  ) {
    // console.log("数字だな");
  } else {
    // console.log("数字ではない");
    e.preventDefault(); // 入力をキャンセル。これをしないと、移動後、ボタンをクリックしてしまう
  }
  chkMoveNext(e, $(this), $("#actual-billet-qty__input"));
});

$(document).on("keyup", "#plan-billet-qty__input", function () {
  if (!isNaN($(this).val()) && $(this).val().length != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else $(this).removeClass("complete-input").addClass("no-input");
});

// Billet Actual Quantity
$(document).on("keydown", "#actual-billet-qty__input", function (e) {
  // 数字と tab と backspace は除く
  if (
    (48 <= e.keyCode && e.keyCode <= 57) ||
    e.keyCode == 8 ||
    e.keyCode == 9 ||
    e.keyCode == 13
  ) {
    // console.log("数字だな");
  } else {
    // console.log("数字ではない");
    e.preventDefault(); // 入力をキャンセル。これをしないと、移動後、ボタンをクリックしてしまう
  }
  chkMoveNext(e, $(this), $("#stop-cause__input"));
});

$(document).on("keyup", "#actual-billet-qty__input", function () {
  if (!isNaN($(this).val()) && $(this).val().length != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else $(this).removeClass("complete-input").addClass("no-input");
});

// Stop Cause input
$(document).on("focus", "#stop-cause__input", function () {
  ajaxSelStop("");
});

$(document).on("keyup", "#stop-cause__input", function () {
  ajaxSelStop($(this).val());
});

$(document).on("keydown", "#stop-cause__input", function (e) {
  if ($(this).val().length > 0 && e.keyCode == 13) {
    $("#stop-cause__select").focus();
  } else if ($(this).val().length == 0 && e.keyCode == 13) {
    $("#press-start__input").focus();
  }
});

function ajaxSelStop(inputValue) {
  let deferred = new $.Deferred();
  inputValue = inputValue + "%";
  $.ajax({
    type: "POST",
    url: "./php/DailyReport/SelStop.php",
    dataType: "json",
    // async: false,
    data: {
      stop_code: inputValue,
    },
  })
    .done(function (data) {
      $("#stop-cause__select option").remove();
      $("#stop-cause__select").append($("<option>").val(1).html("no"));
      data.forEach(function (value) {
        $("#stop-cause__select").append(
          $("<option>").val(value["id"]).html(value["stop_code"])
        );
      });
    })
    .fail(function (data) {
      // alert("DB connect error");
      console.log(data);
    })
    .always(function () {
      deferred.resolve();
    });
  return deferred;
}

// Stop cause select
$(document).on("keydown", "#stop-cause__select", function (e) {
  chkMoveNext(e, $(this), $("#press-start__input"));
});

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

$(document).on("keydown", "#actual-ram-speed__input", function (e) {
  chkMoveNext(e, $(this), $("#actual-die-temp__input"));
});

// Actual Die Temp
$(document).on("keyup", "#actual-die-temp__input", function () {
  if (
    !isNaN($(this).val()) &&
    $(this).val().length != 0 &&
    400 <= $(this).val() &&
    $(this).val() <= 530
  ) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

$(document).on("keydown", "#actual-die-temp__input", function (e) {
  chkMoveNext(e, $(this), $("#name__input"));
});

// Name input
$(document).on("focus", "#name__input", function () {
  if ($(this).val() == "") {
    // ajaxSelStaff("");
  }
});

$(document).on("keyup", "#name__input", function () {
  ajaxSelStaff($(this).val());
});

$(document).on("keydown", "#name__input", function (e) {
  if ($(this).val().length > 0 && e.keyCode == 13) {
    $("#name__select").focus();
  }
});

function ajaxSelStaff(inputValue) {
  inputValue = "%" + inputValue + "%";
  $.ajax({
    type: "POST",
    url: "./php/DailyReport/SelStaff.php",
    dataType: "json",
    // async: false,
    data: {
      emploee_number: inputValue,
    },
  })
    .done(function (data) {
      $("#name__select option").remove();
      $("#name__select").append($("<option>").val(0).html("no"));
      data.forEach(function (value) {
        $("#name__select").append(
          $("<option>").val(value["id"]).html(value["staff_name"])
        );
      });
    })
    .fail(function (data) {
      // alert("DB connect error");
      console.log(data);
    });
}

// Name Select
$(document).on("keydown", "#name__select", function (e) {
  chkMoveNext(e, $(this), $("#press-directive__select"));
});

$(document).on("change", "#name__select", function () {
  if ($(this).val() != "0") {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

// container value の最後の入力　enter時のカーソル移動の定義
$(document).on("keydown", "#container_downside_dieside", function (e) {
  chkMoveNext(e, $(this), $("#no1_1000_ram_speed"));
});

// Attached File select
$("input#file-upload__input").on("change", function () {
  // 選択したファイル名を表示する
  var file = $(this).prop("files")[0];
  $("label").html(file.name);
  $("#preview__button").prop("disabled", false);
  readNewFile = true;
});

// =============================================================
// ram-values__table 共通
// =============================================================

// カーソル移動
$(document).on("keydown", "#ram-values__table input", function (e) {
  chkMoveNext(
    e,
    $(this),
    getNextTargetIdName(
      $("#ram-values__table input.save-data"),
      $(this).attr("id")
    )
  );
});

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

// #ram-values__tables work length
$(document).on("keyup", "#ram-values__table .work_length", function (e) {
  var val = $(this).val();
  var no1 = $(this).attr("id") == "no1_work_length";
  var no2 = $(this).attr("id") == "no2_work_length";

  if ((3 < val && val < 60) || (no2 && val == "")) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

// #ram-values__tables work quantity
$(document).on("keyup", "#ram-values__table .work_qty", function (e) {
  var val = $(this).val();
  var no1 = $(this).attr("id") == "no1_work_length";
  var no2 = $(this).attr("id") == "no2_work_length";

  if ((1 < val && val < 30) || (no2 && val == "")) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

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
//
$(document).on("keydown", "#no2_work_length", function (e) {
  chkMoveNext(e, $(this), $("#container_upside_stemside"));
});

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

// #入力値チェック
$(document).on("keyup", "#container-temperature__table input", function (e) {
  if (!isNaN($(this).val()) && 200 < $(this).val() && $(this).val() < 530) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- input check to here -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- SAVE BUTTON  ----------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "#save__button", function () {
  let inputData = new Object();

  inputData = getInputData();
  ajaxInsPd(inputData);
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
  }
  // 日付はYY-mm-dd形式なのでYYYY-mm-dd形式に変更
  inputData["date__input"] = "20" + inputData["date__input"];
  // targetId を別途保存
  inputData["targetId"] = $("#selected__tr").find("td").eq(0).html();
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

// 入力終わっているかチェック
// $(document).on("keyup", "div.main__wrapper", function () {
$(document).on("keyup", "input", function () {
  if (checkInputComplete() && editMode == false) {
    $("#save__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
  }
});

$(document).on("change", "div.main__wrapper select", function () {
  if (checkInputComplete() && editMode == false) {
    $("#save__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
  }
});

// 必要入力箇所の入力が終わっているかチェック　終わっていればtrueを返す
function checkInputComplete() {
  let flag = true;
  // console.log($(".save-data"));

  $(".save-data").each(function (index, element) {
    if ($(this).hasClass("no-input")) {
      flag = false;
    }
  });
  return flag;
}

function ajaxInsPd(inputData) {
  $.ajax({
    type: "POST",
    url: "./php/DailyReport/InsPd4.php",
    dataType: "json",
    // async: false,
    data: inputData,
  })
    .done(function (data) {
      // console.log(data);

      ajaxInsWorkValue(getWorkValue(data["id"])); // 押出長さなど保存

      ajaxSelSummary(); // テーブルの再表示
      clearInputData(); // データの削除と背景色の設定
      $("#save__button").prop("disabled", true); // save ボタン非活性化
      // 今日の日付の代入
      $("#date__input")
        .val(fillToday())
        .removeClass("no-input")
        .addClass("complete-input")
        .focus();
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function clearInputData() {
  $("input.save-data")
    .val("")
    .removeClass("complete-input")
    .addClass("no-input");
  $("input.need-clear").val("");
  $("select.need-clear")
    .val(0)
    .removeClass("complete-input")
    .addClass("no-input");
  // ビレット2本目情報は入力しなくてもいい。
  $("#ram-values__table tbody .not-required")
    .removeClass("no-input")
    .addClass("complete-input");
  // ファイル添付
  $("label").html("");
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Update BUTTON  ----------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "#update__button", function () {
  let inputData = new Object();
  inputData = getInputData();
  console.log(inputData);
  // return false;
  ajaxUpdatePd(inputData);
  readNewFile = false;
});

function ajaxUpdatePd(inputData) {
  $.ajax({
    type: "POST",
    url: "./php/DailyReport/UpdatePd3.php",
    dataType: "json",
    // async: false,
    data: inputData,
  })
    .done(function (data) {
      ajaxInsWorkValue(getWorkValue());
      ajaxSelSummary(); // テーブルの再表示
      clearInputData(); // データの削除と背景色の設定
      $("#update__button").prop("disabled", true); // save ボタン非活性化
      // 今日の日付の代入
      $("#date__input")
        .val(fillToday())
        .removeClass("no-input")
        .addClass("complete-input")
        .focus();
      editMode = false;
    })
    .fail(function () {
      alert("DB connect error");
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
    ajaxSelSelData($("#selected__tr").find("td").eq(0).html()); // 選択レコードのデータ読出
    $("#preview__button").attr("disabled", false);
    editMode = true;
  } else {
    // 選択レコードを再度クリックした時
    // 削除問い合わせダイアログ
    deleteDialog.showModal();
  }
});

// deleteダイアログのキャンセルボタンが押されたとき
$(document).on("click", "#delete-dialog-cancel__button", function () {
  deleteDialog.close();
});

// deleteダイアログの削除ボタンが押されたとき
$(document).on("click", "#delete-dialog-delete__button", function () {
  let targetId;
  targetId = $("#selected__tr").find("td").eq(0).text();
  ajaxDelSelData(targetId);
  deleteDialog.close();
});

function ajaxDelSelData(targetId) {
  $.ajax({
    type: "POST",
    url: "./php/DailyReport/DelSelData2.php",
    dataType: "json",
    // async: false,
    data: {
      id: targetId,
    },
  })
    .done(function () {
      ajaxSelSummary(); // summary tebale の読み出し
      $("#update__button").prop("disabled", true);
      clearInputData(); // 入力枠の削除
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function ajaxSelSelData(targetId) {
  $.ajax({
    type: "POST",
    url: "./php/DailyReport/SelSelData4.php",
    dataType: "json",
    // async: false,
    data: {
      targetId: targetId,
    },
  })
    .done(function (data) {
      fillReadData(data);
      ajaxSelWorkInformation($("#selected__tr").find("td").eq(0).html());
    })
    .fail(function (data) {
      alert("DB connect error");
      // console.log(data);
    });
}

function fillReadData(data) {
  let targetDom;
  // console.log(data);
  // input要素への値の代入
  targetDom = $(".input-blocks__wrapper input");

  targetDom.eq(1).val(data[0]["press_date_at"]);
  targetDom.eq(6).val(data[0]["billet_lot_number"]);
  targetDom.eq(9).val(data[0]["plan_billet_quantities"]);
  targetDom.eq(10).val(data[0]["actual_billet_quantities"]);
  targetDom.eq(11).val(data[0]["stop_code"]);
  targetDom.eq(12).val(data[0]["press_start_at"]);
  targetDom.eq(13).val(data[0]["press_finish_at"]);
  targetDom.eq(14).val(data[0]["actual_ram_speed"]);
  targetDom.eq(15).val(data[0]["actual_die_temperature"]);

  targetDom = $(".input-table__outer input");

  // console.log(targetDom);
  // return false;
  targetDom.eq(0).val(data[0]["container_upside_stemside_temperature"]);
  targetDom.eq(1).val(data[0]["container_upside_dieside_temperature"]);
  targetDom.eq(2).val(data[0]["container_downside_stemside_temperature"]);
  targetDom.eq(3).val(data[0]["container_downside_dieide_temperature"]);

  targetDom.eq(4).val(data[0]["no1_1000_ram_speed"]);
  targetDom.eq(5).val(data[0]["no1_1000_ram_pressure"]);
  targetDom.eq(6).val(data[0]["no1_1000_work_temperature"]);
  targetDom.eq(7).val(data[0]["no1_0200_ram_speed"]);
  targetDom.eq(8).val(data[0]["no1_0200_ram_pressure"]);
  targetDom.eq(9).val(data[0]["no1_0200_work_temperature"]);
  targetDom.eq(16).val(data[0]["no2_1000_ram_speed"]);
  targetDom.eq(17).val(data[0]["no2_1000_ram_pressure"]);
  targetDom.eq(18).val(data[0]["no2_1000_work_temperature"]);
  targetDom.eq(19).val(data[0]["no2_0200_ram_speed"]);
  targetDom.eq(20).val(data[0]["no2_0200_ram_pressure"]);
  targetDom.eq(21).val(data[0]["no2_0200_work_temperature"]);

  // select 要素への値の代入
  // option値が動的に変わるselectはoption値を代入する
  $("#die__select")
    .empty()
    .append($("<option>").html(data[0]["die_number"]).val(data[0]["dies_id"]));
  $("#stop-cause__select")
    .empty()
    .append(
      $("<option>")
        .html(data[0]["stop_code"])
        .val(data[0]["press_stop_cause_id"])
    );
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
        .val(data[0]["t_press.ordersheet_id"])
    );

  // label 要素にファイル名を代入する
  $("label").html(data[0]["press_directive_scan_file_name"]);
  // $("label").html("");
  // option値が静的な場合、value値だけ代入する
  $("#is-washed__select").val(data[0]["is_washed_die"]);
  $("#machine-number__select").val(data[0]["press_machine_no"]);
  $("#pressing-type__select").val(data[0]["press_machine_no"]);
  $("#billet-size__select").val(data[0]["billet_size"]);
  $("#billet-length__select").val(data[0]["billet_length"]);
  $("#name__select")
    .empty()
    .append($("<option>").html(data[0]["staff_name"]).val(data[0]["staff_id"]));

  // 背景色を変更すする
  $(".need-clear").removeClass("no-input").addClass("complete-input");
  // update ボタンの活性化
  $("#update__button").prop("disabled", false);
}

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

function ajaxSelWorkInformation(targetId) {
  // summary id の製品長さと取得製品数量を表示する
  $.ajax({
    type: "POST",
    url: "./php/DailyReport/SelWorkInformation.php",
    dataType: "json",
    // async: false,
    data: {
      id: targetId,
    },
  })
    .done(function (data) {
      fillWorkInformation(data[0]);
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function fillWorkInformation(data) {
  Object.keys(data).forEach(function (key) {
    $("#" + key).val(data[key]);
  });
}

function getWorkValue(id) {
  // #ram-values__tableから値を取り出す
  var workValue = new Object();
  $("#ram-values__table input.work-information").each(function (index, value) {
    workValue[$(this).attr("id")] = $(this).val();
  });

  if (id) {
    // 新規保存時は、idに値が入ってきている
    workValue["targetId"] = id;
  } else {
    // 更新時はsummary tableの値を参照する
    workValue["targetId"] = $("#selected__tr").find("td").eq(0).html();
  }

  return workValue;
}

function ajaxInsWorkValue(getWorkValue) {
  // summary id の製品長さと取得製品数量を表示する

  $.ajax({
    type: "POST",
    url: "./php/DailyReport/InsWorkInformation.php",
    dataType: "json",
    async: false,
    data: getWorkValue,
  })
    .done(function (data) {
      // console.log("Hello");
      // fillWorkInformation(data[0]);
    })
    .fail(function () {
      alert("DB connect error");
      // console.alert("データベース接続異常");
    });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- test button ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "#test__button", function () {
  let inputData = new Object();

  inputData = getInputData();
  console.log(inputData);
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- test2 button ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "#test2__button", function () {
  var workValue = getWorkValue();
  console.log(getWorkValue());
  ajaxInsWorkValue(getWorkValue());
});
