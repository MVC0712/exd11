// 削除確認ダイアログ
let memberDeleteDialog = document.getElementById("member-delete__dialog");
let codeDeleteDialog = document.getElementById("code-delete__dialog");
var memberEditMode = false;
var codeEditMode = false;

$(function () {
  // console.log("hello");
  ajaxSelMember();
  ajaxSelCode();
  // $("#member-test__button").remove();
  $("#member-test__button").remove();
});

function ajaxSelMember() {
  $.ajax({
    type: "POST",
    url: "./php/StaffAndCode/SelMember.php",
    dataType: "json",
    async: false,
    data: {
      die_number: "dummy",
    },
  })
    .done(function (data) {
      // console.log(data);
      // makeSummaryTable(data);
      makeMemberTable(data);
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function makeMemberTable(data) {
  $("#member__table tbody").empty();
  data.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("#member__table tbody");
  });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- input check from here   -------------------------
//     ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// -------------  input バリデーション -------------------
// staff name ====================================================
$(document).on("keyup", "#staff_name", function () {
  if ($(this).val().length > 3) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

// emploee number ====================================================
$(document).on("keyup", "#emploee_number", function () {
  var pattern = /^[1,2]\d{6}$/;
  var result;

  result = $(this).val().match(pattern);

  if (result) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});
// position ====================================================
$(document).on("change", "#position_id", function () {
  if (Number($(this).val()) != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});
// joining date ====================================================
$(document).on("change", "#joining_date", function () {
  if (Number($(this).val()) != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});
// common function cursol motion  ==========================
$(document).on("keydown", ".save-data", function (e) {
  let nextDom;
  nextDom = getNextTargetDom($(".save-data"), $(this).attr("id"));
  // console.log(nextDom);
  chkMoveNext(e, $(this), nextDom);
});

// -------------  カーソル移動  --------------------------
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
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//     ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
// ------------------------- input check to here   -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function chkMoveNext(e, thisDom, nextDom) {
  // thisDOM がcomplete-inputクラスなら改行キーでnextDomにフォーカスを移動する
  if (e.keyCode == 13 && thisDom.hasClass("complete-input")) {
    e.preventDefault(); // 入力をキャンセル。これをしないと、移動後、ボタンをクリックしてしまう
    $(nextDom).focus();
  }
}
// save button activation  ==========================
$(document).on("keyup", ".member__wrapper .save-data", function () {
  memberButtonActivation();
});

$(document).on("change", ".member__wrapper .save-data", function () {
  memberButtonActivation();
});

function memberButtonActivation() {
  if (memberEditMode) {
    // edit mode の時
    if (chechInputComplete($(".member__wrapper .input-required"))) {
      $("#member-update__button").prop("disabled", false);
    } else {
      $("#member-update__button").prop("disabled", true);
    }
  } else {
    // edit mode で無いとき
    if (chechInputComplete($(".member__wrapper .input-required"))) {
      $("#member-save__button").prop("disabled", false);
    } else {
      $("#member-save__button").prop("disabled", true);
    }
  }
}

function chechInputComplete(searchedWrapperDom) {
  let flag = true;

  $(searchedWrapperDom).each(function () {
    if (!$(this).hasClass("complete-input")) flag = false;
  });

  return flag;
}
// save button activation  end ==========================

// ====================================================
// =========== save button ============================
// ====================================================

$(document).on("click", "#member-save__button", function () {
  var temp = new Object();
  ajaxInsMember(getInputData());
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
  inputData["targetId"] = $("#member-selected__tr").find("td").eq(0).html();

  return inputData;
}

function ajaxInsMember(inputData) {
  $.ajax({
    type: "POST",
    url: "./php/StaffAndCode/InsMember.php",
    dataType: "json",
    // async: false,
    data: inputData,
  })
    .done(function (data) {
      // console.log(data);
      ajaxSelMember();
      clearMemberInputData(); // データの削除と背景色の設定
      $("#member-save__button").prop("disabled", true); // save ボタン非活性化
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function clearMemberInputData() {
  $(".member__wrapper .save-data")
    .val("")
    .removeClass("complete-input")
    .addClass("no-input");
  $("#leave_at").removeClass("no-input");
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Member Table ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#member__table tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    // tr に class を付与し、選択状態の background colorを付ける
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    // tr に id を付与する
    $("#member-selected__tr").removeAttr("id");
    $(this).attr("id", "member-selected__tr");
    ajaxSelSelMember($("#member-selected__tr").find("td").eq(0).html()); // 選択レコードのデータ読出
    memberEditMode = true;
  } else {
    // 選択レコードを再度クリックした時
    // 削除問い合わせダイアログ
    memberDeleteDialog.showModal();
  }
});

// deleteダイアログのキャンセルボタンが押されたとき
$(document).on("click", "#member-delete-dialog-cancel__button", function () {
  memberDeleteDialog.close();
});

// deleteダイアログの削除ボタンが押されたとき
$(document).on("click", "#member-delete-dialog-delete__button", function () {
  let targetId;
  targetId = $("#member-selected__tr").find("td").eq(0).text();
  ajaxMemberDelSelData(targetId);
  memberDeleteDialog.close();
});

function ajaxMemberDelSelData(targetId) {
  $.ajax({
    type: "POST",
    url: "./php/StaffAndCode/DelMemberSelData.php",
    dataType: "json",
    // async: false,
    data: {
      id: targetId,
    },
  })
    .done(function () {
      ajaxSelMember(); // summary tebale の読み出し
      $("#member-update__button").prop("disabled", true);
      clearMemberInputData(); // 入力枠の削除
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function ajaxSelSelMember(targetId) {
  $.ajax({
    type: "POST",
    url: "./php/StaffAndCode/SelSelMember.php",
    dataType: "json",
    // async: false,
    data: {
      targetId: targetId,
    },
  })
    .done(function (data) {
      fillReadMemberData(data);
      $("#member-update__button").prop("disabled", false);
      memberEditMode = true;
    })
    .fail(function (data) {
      alert("DB connect error");
      // console.log(data);
    });
}

function fillReadMemberData(data) {
  Object.keys(data).forEach(function (val) {
    $("#" + val).val(data[val]);
  });
  $(".member__wrapper .save-data")
    .removeClass("no-input")
    .addClass("complete-input");
}

// ====================================================
// =========== Update button ============================
// ====================================================

$(document).on("click", "#member-update__button", function () {
  ajaxUpdateMember(getInputData());
});

function ajaxUpdateMember(inputData) {
  $.ajax({
    type: "POST",
    url: "./php/StaffAndCode/UpdateMember.php",
    dataType: "json",
    async: false,
    data: inputData,
  })
    .done(function (data) {
      // console.log(data);
      ajaxSelMember();
      // clearInputData(); // データの削除と背景色の設定
      $("#member-update__button").prop("disabled", true); // save ボタン非活性化
      clearMemberInputData();
      memberEditMode = false;
    })
    .fail(function () {
      alert("DB connect error");
    });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++ Code Area ++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("keyup", "#quality_code", function () {
  var pattern = /^[1-9]\d{2}$/;

  if ($(this).val().match(pattern)) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});

function ajaxSelCode() {
  $.ajax({
    type: "POST",
    url: "./php/StaffAndCode/SelCode2.php",
    dataType: "json",
    async: false,
    data: "dummy",
  })
    .done(function (data) {
      fillTableBody(data);
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function fillTableBody(data) {
  $("#quality-code__table tbody").empty();
  data.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
    });
    $(newTr).appendTo("#quality-code__table tbody");
  });
}

$(document).on("change", "#quality-code__table input", function () {
  var updateData = new Object();

  updateData = {
    id: Number($(this).parent().parent().find("input")[0].value),
    columnNumber: $(this).parent().index(),
    value: $(this).val(),
  };
  ajaxUpdateQualityCode(updateData);
});

function ajaxUpdateQualityCode(updateData) {
  $.ajax({
    type: "POST",
    url: "./php/StaffAndCode/UpdateQualityCode.php",
    dataType: "json",
    async: false,
    data: updateData,
  })
    .done(function (data) {
      ajaxSelCode();
      // fillTableBody(data);
    })
    .fail(function () {
      alert("DB connect error");
    });
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// --------------------------- add record button  --------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#new_record__button", function () {
  ajaxInsNewRecord();
});

function ajaxInsNewRecord() {
  $.ajax({
    type: "POST",
    url: "./php/StaffAndCode/InsNewRecord.php",
    dataType: "json",
    async: false,
    data: "dummy",
  })
    .done(function (data) {
      ajaxSelCode();
    })
    .fail(function () {
      alert("DB connect error");
    });
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// --------------------------- delete record button  -----------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#delte_record__button", function () {
  var targetId = $("#selected_code__tr td:nth-child(1) input")[0].value;

  ajaxDeleteCode(targetId);
});

function ajaxDeleteCode(targetId) {
  $.ajax({
    type: "POST",
    url: "./php/StaffAndCode/DelCodeSelData.php",
    dataType: "json",
    // async: false,
    data: { id: targetId },
  })
    .done(function (data) {
      $(this).prop("disabled", true);
      ajaxSelCode();
    })
    .fail(function () {
      alert("DB connect error");
    });
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// --------------------------- Code Table ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#quality-code__table tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    // tr に class を付与し、選択状態の background colorを付ける
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    // tr に id を付与する
    $("#selected_code__tr").removeAttr("id");
    $(this).attr("id", "selected_code__tr");
    $("#delte_record__button").prop("disabled", false);
  } else {
    // 選択レコードを再度クリックした時
    // 削除問い合わせダイアログ
    deleteDialog.showModal();
  }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++ TEST BUTTON ++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#member-test__button", function () {
  console.log("hello");
});
