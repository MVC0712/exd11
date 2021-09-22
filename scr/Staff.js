// 削除確認ダイアログ
let deleteDialog = document.getElementById("delete__dialog");
// 編集モードの確認
let editMode = false;

$(function () {
  let sqlOrder = "m_staff.emploee_number";
  ajaxSelSummary(sqlOrder); // summary tebale の読み出し
  // 今日の日付の代入
  $("#date__input")
    // .val(fillToday())
    .removeClass("no-input")
    .addClass("complete-input")
    .focus();
  // ボタンの非活性化
  $("#save__button").prop("disabled", true);
  $("#update__button").prop("disabled", true);
  // test ボタンの表示
  $("#test__button").hide();
  // フォーカスの移動
  $("#name__input").focus();
});
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- input check from here   -------------------------
//     ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// discard ====================================================
$(document).on("keyup", "#name__input", function () {
  if (0 < $(this).val().length && $(this).val().length < 150) {
    $(this).removeClass("name__input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

// emploee number ====================================================
$(document).on("keyup", "#emploee-number__input", function () {
  // 7桁の数字に限定する
  if (
    $(this)
      .val()
      .match(/^\d{7}/g)
  ) {
    $(this).removeClass("name__input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

// position ====================================================
$(document).on("change", "#position__select", function () {
  if ($(this).val() != 0) {
    $(this).removeClass("name__input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

// leave date ====================================================
$(document).on("change", "#leave-date__input", function () {
  if ($(this).val() != 0) {
    $(this).removeClass("name__input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

$(document).on("keydown", "#leave-date__input", function (e) {
  console.log("hello");
  chkMoveNext(e, $(this), $("#save__button"));
});

// common function cursol motion  ==========================
$(document).on("keydown", ".main__wrapper .save-data", function (e) {
  let nextDom;
  nextDom = getNextTargetDom(
    $(".main__wrapper .save-data"),
    $(this).attr("id")
  );
  // console.log(nextDom);
  chkMoveNext(e, $(this), nextDom);
});
// ==========================================================
// check input completion  ==========================
// ==========================================================
$(document).on("keyup", ".main__wrapper .save-data", function () {
  let flag = true;

  $(".main__wrapper .save-data").each(function (index, element) {
    if (!$(this).hasClass("complete-input")) flag = false;
  });

  if (flag) {
    $("#save__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
  }
});

function getNextTargetDom(targetDom, thisIdName) {
  let nextIndexFlag = false;
  let nextTargetDom;

  targetDom.each(function (index, element) {
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

function chkMoveNext(e, thisDom, nextDom) {
  // thisDOM がcomplete-inputクラスなら改行キーでnextDomにフォーカスを移動する
  if (e.keyCode == 13 && thisDom.hasClass("complete-input")) {
    e.preventDefault(); // 入力をキャンセル。これをしないと、移動後、ボタンをクリックしてしまう
    $(nextDom).focus();
  }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//     ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
// ------------------------- input check to here   -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "#summary__table thead th", function () {
  let sqlOrder;
  sqlOrder = $(this).attr("id");
  ajaxSelSummary(sqlOrder);
});

function ajaxSelSummary(sqlOrder) {
  sqlOrder = "ORDER BY " + sqlOrder;
  $.ajax({
    type: "POST",
    url: "./php/Staff/SelSummary.php",
    dataType: "json",
    // async: false,
    data: {
      order: sqlOrder,
    },
  })
    .done(function (data) {
      makeSummaryTable(data);
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function makeSummaryTable(data) {
  let html = "";
  let leaveDate;

  data.forEach(function (element, index) {
    if (element["leave_at"] == null) {
      // leave_at が null の時、値を表示しない。
      leaveDate = "";
    } else {
      leaveDate = element["leave_at"];
    }
    html += "<tr><td>";
    html += element["id"] + "</td><td title = '" + element["id"] + "'>";
    html += element["staff_name"] + "</td><td>";
    html += element["emploee_number"] + "</td><td>";
    html += element["position"] + "</td><td>";
    html += leaveDate + "</td></tr>";
  });
  $("#summary__table tbody").empty();
  $("#summary__table tbody").append(html);
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Summary Table ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#summary__table tbody tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    // tr に class を付与し、選択状態の background colorを付ける
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    // tr に id を付与する
    $("#selected__tr").removeAttr("id");
    $(this).attr("id", "selected__tr");
    ajaxSelSelData($("#selected__tr").find("td").eq(0).html()); // 選択レコードのデータ読出
    editMode = true;

    // $("#save__button").prop("disabled", false);
    $("#update__button").prop("disabled", false);
    $("#print__button").prop("disabled", false);
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
    url: "./php/Staff/DelSelData.php",
    dataType: "json",
    // async: false,
    data: {
      id: targetId,
    },
  })
    .done(function () {
      let sqlOrder = "m_staff.emploee_number";
      ajaxSelSummary(sqlOrder); // summary tebale の読み出し
      $("#update__button").prop("disabled", true);
      // clearInputData(); // 入力枠の削除
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function ajaxSelSelData(targetId) {
  $.ajax({
    type: "POST",
    url: "./php/Staff/SelSelData.php",
    dataType: "json",
    async: false,
    data: {
      targetId: targetId,
    },
  })
    .done(function (data) {
      fillReadData(data);
    })
    .fail(function (data) {
      alert("DB connect error");
      // console.log(data)
    });
}

function fillReadData(data) {
  let targetDom;
  // --- html 要素への書き込み ----
  targetDom = $(".main__wrapper input");

  targetDom.eq(0).val(data[0]["staff_name"]);
  targetDom.eq(1).val(data[0]["emploee_number"]);
  targetDom.eq(3).val(data[0]["leave_at"]);

  // --- input select 要素への書き込み ----
  targetDom = $(".main__wrapper select");

  targetDom.eq(0).val(data[0]["position_id"]);
  // 背景色を変更すする
  $(".need-clear").removeClass("no-input").addClass("complete-input");
  // update ボタンの活性化
  $("#update__button").prop("disabled", false);
  return;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- save button ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "#save__button", function () {
  let inputData = new Object();

  inputData = getInputData();
  ajaxInsData(inputData);
});

function getInputData() {
  let inputData = new Object();
  let dt = new Date(); // 本日の日付を取得する
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
  if (inputData["leave-date__input"] == "") {
    inputData["leave-date__input"] = null;
  }
  // targetId を別途保存
  inputData["targetId"] = $("#selected__tr").find("td").eq(0).html();

  return inputData;
}

function ajaxInsData(inputData) {
  $.ajax({
    type: "POST",
    url: "./php/Staff/InsData.php",
    dataType: "json",
    // async: false,
    data: inputData,
  })
    .done(function (data) {
      // console.log(data);
      ajaxSelSummary("m_staff.emploee_number"); // summary tebale の読み出し
      // clearInputData(); // データの削除と背景色の設定
      // $("#save__button").prop("disabled", true); // save ボタン非活性化
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
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Update BUTTON  ----------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "#update__button", function () {
  let inputData = new Object();
  inputData = getInputData();
  console.log(inputData);
  ajaxUpdatePd(inputData);
});

function ajaxUpdatePd(inputData) {
  $.ajax({
    type: "POST",
    url: "./php/Staff/Update.php",
    dataType: "json",
    // async: false,
    data: inputData,
  })
    .done(function (data) {
      ajaxSelSummary("m_staff.emploee_number"); // summary tebale の読み出し
      clearInputData(); // データの削除と背景色の設定
      $("#update__button").prop("disabled", true); // save ボタン非活性化
      editMode = false;
    })
    .fail(function () {
      alert("DB connect error");
    });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- test button ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "#test__button", function () {
  let inputData = new Object();

  inputData = getInputData();
  console.log(inputData);
  ajaxInsData(inputData);
});
