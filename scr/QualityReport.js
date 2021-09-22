// 削除確認ダイアログ
let deleteDialog = document.getElementById("delete__dialog");
var lang = 1;

$(function () {
  // ajaxSelSummary(); // summary tebale の読み出し
  // 今日の日付の代入
  $("#press_date__input")
    .val(fillToday())
    .removeClass("no-input")
    .addClass("complete-input")
    .focus();
  // quality code のリスト作成
  ajaxSelCode();

  // 入力項目の非活性化
  // $("#directive__input").prop("disabled", true);
  // ボタンの非活性化
  $("#save__button").prop("disabled", true);
  $("#update__button").prop("disabled", true);
  // test ボタンの表示
  $("#test__button").remove();
  $("#test2__button").remove();
  $("#update__button").remove();
  $(".description_jp").hide();
  $(".description_cn").hide();

  $("thead > tr > td:nth-child(4)").show();
  $("thead > tr > td:nth-child(5)").hide();
  $("thead > tr > td:nth-child(6)").hide();
  $("#table__body > tr > td:nth-child(4)").show();
  $("#table__body > tr > td:nth-child(5)").hide();
  $("#table__body > tr > td:nth-child(6)").hide();
});

function fillToday() {
  // 本日の日付をyy-mm-dd形式で返す
  let dt = new Date();
  let y = dt.getFullYear();
  let m = ("00" + (dt.getMonth() + 1)).slice(-2);
  let d = ("00" + dt.getDate()).slice(-2);
  return y + "-" + m + "-" + d;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- input checking ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++ #press_date__input
$(document).on("keyup", "#press_date__input", function () {
  if (checkInputDate($(this).val())) {
    $(this).removeClass("no-input").addClass("complete-input");
    ajaxSelInputDies($(this).val());
    $("#ng__table tbody#table__body").empty();
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

$("#press_date__input").mousewheel(function (eo, delta, deltaX, deltaY) {
  let dt, y, m, d;
  switch (delta) {
    case -1:
      dt = addDate(+1);
      break;
    case 1:
      dt = addDate(-1);
      break;
  }
  y = dt.getFullYear();
  m = ("00" + (dt.getMonth() + 1)).slice(-2);
  d = ("00" + dt.getDate()).slice(-2);
  $(this).val(y + "-" + m + "-" + d);
  ajaxSelInputDies($(this).val());
  $("#ng__table tbody#table__body").empty();
});

function ajaxSelInputDies(strDate) {
  $.ajax({
    type: "POST",
    url: "./php/QualityReport/SelInputDies.php",
    dataType: "json",
    async: false,
    data: {
      press_date_at: strDate,
    },
  })
    .done(function (data) {
      makeDieSelect(data);
    })
    .fail(function () {
      alert("DB connect error");
      // console.alert("データベース接続異常");
    });
}

function makeDieSelect(data) {
  $("#dies_qty__display").html(data.length + " dies");
  $("#press_id").empty().append($("<option>").val(0).html("no"));
  data.forEach(function (value) {
    $("<option>")
      .val(value["id"])
      .html(value["die_number"])
      .appendTo("#press_id");
  });
}

function addDate(addVal) {
  var strDate = $("#press_date__input").val();
  var y = strDate.split("-")[0];
  var m = strDate.split("-")[1] - 1;
  var d = strDate.split("-")[2];
  // var newDate;
  var newDate = new Date(y, m, Number(d) + Number(addVal));
  // console.log(date);
  // newDate =
  // date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  return newDate;
}

function checkInputDate(strDate) {
  if (!strDate.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) return false;

  var y = strDate.split("-")[0];
  var m = strDate.split("-")[1] - 1;
  var d = strDate.split("-")[2];
  var date = new Date(y, m, d);
  if (date.getFullYear() != y || date.getMonth() != m || date.getDate() != d) {
    return false;
  }
  return true;
}
// +++++++++ #press_id ++++++++++++++++++++++++++++++++
$("#press_id").change(function () {
  if (!$(this).val()) return false;
  ajaxSelSelPress($(this).val());
});

function ajaxSelSelPress(targetId) {
  $.ajax({
    type: "POST",
    url: "./php/QualityReport/SelSelPress.php",
    dataType: "json",
    async: false,
    data: {
      id: targetId,
    },
  })
    .done(function (data) {
      fillData(data);
      $("#work_quantity").val(calWorkQty());
      ajaxSelNgQuantity($("#press_id").val());
    })
    .fail(function () {
      alert("DB connect error");
      // console.alert("データベース接続異常");
    });
}

function fillData(data) {
  Object.keys(data).forEach(function (val) {
    $("#" + val).val(data[val]);
  });
  // console.log(data);
  //
  $("#ok_works__display").html(data["counted_work_quantity"]);
}

function calWorkQty() {
  var inputBilletQty = Number($("#actual_billet_quantities").val());
  var _1stBilletWorkQty = Number($("#1st_billet_quantity").val());
  var _2ndBilletWorkQty = Number($("#2nd_billet_quantity").val());
  var val;

  if (inputBilletQty == 1) {
    val = _1stBilletWorkQty;
  } else if (inputBilletQty >= 2) {
    val = _1stBilletWorkQty + _2ndBilletWorkQty * (inputBilletQty - 1);
  }
  return val;
}

function ajaxSelCode() {
  $.ajax({
    type: "POST",
    url: "./php/QualityReport/SelCode.php",
    dataType: "json",
    async: false,
    data: {
      id: "dummy",
    },
  })
    .done(function (data) {
      makeQualitiList(data);
      // $("#work_quantity").val(calWorkQty());
    })
    .fail(function () {
      alert("DB connect error");
      // console.alert("データベース接続異常");
    });
}

function makeQualitiList(data) {
  data.forEach(function (value) {
    $("<option>")
      .val(value["id"])
      .html(value["quality_code"])
      .appendTo("#quality_code_id");
  });
}

// +++++++++ #counted ok works ++++++++++++++++++++++++++++++++
$(document).on("keyup", "#counted_work_quantity", function () {
  if (
    0 <= Number($(this).val()) &&
    Number($(this).val()) <= Number($("#work_quantity").val())
  ) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

$(document).on("change", "#counted_work_quantity", function () {
  if (!Number($(this).hasClass("complete-input")) || !$("#press_id").val()) {
    return false;
  }
  console.log("hello");
  ajaxUpdateOkWorks($(this).val());
  $("#ok_works__display").html($(this).val());
  $("#ngSumValue").html(calNgSum());
  calTotal();
});

function ajaxUpdateOkWorks(okWorks) {
  $.ajax({
    type: "POST",
    url: "./php/QualityReport/UpdateOkWorks.php",
    dataType: "json",
    // async: false,
    data: {
      id: $("#press_id").val(),
      counted_ok_works: okWorks,
    },
  })
    .done(function (data) {
      // console.log(data);
      // ajaxSelNgQuantity($("#press_id").val());
      // return false;
    })
    .fail(function () {
      alert("DB connect error");
    });
}

// +++++++++ #process #quality_code ++++++++++++++++++++++++++++++++
$("select").change(function () {
  if ($(this).val() != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  if (checkInputComplete()) {
    $("#save__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
  }
});
// +++++++++ ng quantity ++++++++++++++++++++++++++++++++
$("#ng_quantities").keyup(function () {
  if (Number($(this).val()) >= 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }

  if (checkInputComplete()) {
    $("#save__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
  }
});

// 必要入力箇所の入力が終わっているかチェック　終わっていればtrueを返す
function checkInputComplete() {
  let flag = true;

  $(".save-data").each(function (index, element) {
    if ($(this).hasClass("no-input")) {
      flag = false;
    }
  });
  return flag;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Save button ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#save__button", function () {
  ajaxInsInputData(getInputData());
});

function getInputData() {
  let inputDom;
  let dt = new Date();
  let inputData = new Object();

  // .save-dataを持っている要素から値を取り出す
  $(".save-data").each(function (index, element) {
    inputData[$(this).attr("id")] = Number($(this).val());
  });
  // 今日の日付を獲得する
  inputData["today"] =
    dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
  return inputData;
}

function ajaxInsInputData(inputData) {
  console.log(inputData);
  // return false;
  $.ajax({
    type: "POST",
    url: "./php/QualityReport/InsInputData.php",
    dataType: "json",
    // async: false,
    data: inputData,
  })
    .done(function (data) {
      // console.log(data);
      ajaxSelNgQuantity($("#press_id").val());
      $("#save__button").prop("disabled", true);
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function ajaxSelNgQuantity(targetId) {
  $.ajax({
    type: "POST",
    url: "./php/QualityReport/SelNgQuantity.php",
    dataType: "json",
    // async: false,
    data: {
      id: targetId,
    },
  })
    .done(function (data) {
      fillMakeNgTable(data);
      $("#ngSumValue").html(calNgSum());
      calTotal();
      clearInputData();
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function clearInputData() {
  $(".down__wrapper input")
    .val("")
    .removeClass("complete-input")
    .addClass("no-input");
  $(".down__wrapper select")
    .val("0")
    .removeClass("complete-input")
    .addClass("no-input");
}

function fillMakeNgTable(data) {
  $("tbody#table__body").empty();
  data.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("tbody#table__body");
  });
  $("thead > tr > td:nth-child(4)").show();
  $("thead > tr > td:nth-child(5)").hide();
  $("thead > tr > td:nth-child(6)").hide();
  $("#table__body > tr > td:nth-child(4)").show();
  $("#table__body > tr > td:nth-child(5)").hide();
  $("#table__body > tr > td:nth-child(6)").hide();
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- lang change button ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "#lang-change__button", function () {
  if (lang == 3) lang = 1;
  else lang = lang + 1;
  switch (lang) {
    case 1:
      $("thead > tr > td:nth-child(4)").show();
      $("thead > tr > td:nth-child(5)").hide();
      $("thead > tr > td:nth-child(6)").hide();
      $("#table__body > tr > td:nth-child(4)").show();
      $("#table__body > tr > td:nth-child(5)").hide();
      $("#table__body > tr > td:nth-child(6)").hide();
      break;
    case 2:
      $("thead > tr > td:nth-child(4)").hide();
      $("thead > tr > td:nth-child(5)").show();
      $("thead > tr > td:nth-child(6)").hide();
      $("#table__body > tr > td:nth-child(4)").hide();
      $("#table__body > tr > td:nth-child(5)").show();
      $("#table__body > tr > td:nth-child(6)").hide();
      break;
    case 3:
      $("thead > tr > td:nth-child(4)").hide();
      $("thead > tr > td:nth-child(5)").hide();
      $("thead > tr > td:nth-child(6)").show();
      $("#table__body > tr > td:nth-child(4)").hide();
      $("#table__body > tr > td:nth-child(5)").hide();
      $("#table__body > tr > td:nth-child(6)").show();
      break;
  }
});

function calNgSum() {
  var sum = 0;
  $("#table__body tr > td:nth-child(7)").each(function (index, val) {
    sum = sum + Number($(this).html());
  });
  return sum;
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- NG Table ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#table__body tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    // tr に class を付与し、選択状態の background colorを付ける
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    // tr に id を付与する
    $("#selected__tr").removeAttr("id");
    $(this).attr("id", "selected__tr");
    // ajaxSelSelData($("#selected__tr").find("td").eq(0).html()); // 選択レコードのデータ読出
    // $("#preview__button").attr("disabled", false);
    // editMode = true;
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
  targetId = $("#selected__tr td:nth-child(1)").html();
  // console.log(targetId);
  ajaxDelSelData(targetId);
  deleteDialog.close();
});

function ajaxDelSelData(targetId) {
  $.ajax({
    type: "POST",
    url: "./php/QualityReport/DelSelData.php",
    dataType: "json",
    // async: false,
    data: {
      id: targetId,
    },
  })
    .done(function (data) {
      // console.log(data);
      ajaxSelNgQuantity($("#press_id").val());
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function calTotal() {
  var totalValue;
  totalValue =
    Number($("#ok_works__display").html()) + Number($("#ngSumValue").html());
  // console.log(totalValue);
  $("#total_works__display").html(totalValue);

  if (totalValue != $("#work_quantity").val()) {
    $("#total_works__display").css("background-color", "rgb(255, 196, 147)");
  } else {
    $("#total_works__display").css("background-color", "white");
  }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- test button ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "#test__button", function () {
  calTotal();
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- test2 button ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "#test2__button", function () {
  $("thead > tr > td:nth-child(5)").hide();
  $("thead > tr > td:nth-child(6)").hide();
  $("#table__body > tr > td:nth-child(5)").hide();
  $("#table__body > tr > td:nth-child(6)").hide();
});
