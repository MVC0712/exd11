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

$(document).on(
  "keyup",
  ".quality-code__wrapper textarea#description_vn",
  function () {
    if ($(this).val().length > 10) {
      $(this).removeClass("no-input").addClass("complete-input");
    } else {
      $(this).removeClass("complete-input").addClass("no-input");
    }
  }
);

$(document).on("keyup", ".quality-code__wrapper", function () {
  codeSaveButtonActivation();

  // if (chechInputComplete($(".quality-code__wrapper .input-required"))) {
  //   $("#code-save__button").prop("disabled", false);
  // } else {
  //   $("#code-save__button").prop("disabled", true);
  // }
});

$(document).on("click", "#code-save__button", function () {
  ajaxInsCode(getInputData2());
});

function ajaxInsCode(inputData) {
  $.ajax({
    type: "POST",
    url: "./php/StaffAndCode/InsCode.php",
    dataType: "json",
    // async: false,
    data: inputData,
  })
    .done(function (data) {
      ajaxSelCode();
      clearMemberInputData(); // データの削除と背景色の設定
      $("#code-save__button").prop("disabled", true); // save ボタン非活性化
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function clearMemberInputData() {
  $(".quality-code__wrapper .save-data")
    .val("")
    .removeClass("complete-input")
    .addClass("no-input");
  $("#description_jp").removeClass("no-input");
}

function getInputData2() {
  let inputData = new Object();
  let dt = new Date(); // 本日の日付を取得する
  inputData["created_at"] =
    dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();

  // .save-dataを持っている要素から値を取り出す
  $(".save-data").each(function (index, element) {
    inputData[$(this).attr("id")] = $(this).val();
  });
  if (inputData["leave-date__input"] == "") {
    inputData["leave-date__input"] = null;
  }
  // targetId を別途保存
  inputData["targetId"] = $("#code-selected__tr").find("td").eq(0).html();

  return inputData;
}

function ajaxSelCode() {
  $.ajax({
    type: "POST",
    url: "./php/StaffAndCode/SelCode.php",
    dataType: "json",
    async: false,
    data: "dummy",
  })
    .done(function (data) {
      makeCodeTable(data);
      // clearMemberInputData(); // データの削除と背景色の設定
      // $("#code-save__button").prop("disabled", true); // save ボタン非活性化
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function makeCodeTable(data) {
  $("#code__table tbody").empty();
  data.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("#code__table tbody");
  });
}

function codeSaveButtonActivation() {
  if (codeEditMode) {
    // edit mode の時
    if (chechInputComplete($(".quality-code__wrapper .input-required"))) {
      $("#code-update__button").prop("disabled", false);
    } else {
      $("#code-update__button").prop("disabled", true);
    }
  } else {
    // edit mode で無いとき
    if (chechInputComplete($(".quality-code__wrapper .input-required"))) {
      $("#code-save__button").prop("disabled", false);
    } else {
      $("#code-save__button").prop("disabled", true);
    }
  }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Code Table ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#code__table tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    // tr に class を付与し、選択状態の background colorを付ける
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    // tr に id を付与する
    $("#code-selected__tr").removeAttr("id");
    $(this).attr("id", "code-selected__tr");
    ajaxSelSelCode($("#code-selected__tr").find("td").eq(0).html()); // 選択レコードのデータ読出
    codeEditMode = true;
  } else {
    // 選択レコードを再度クリックした時
    // 削除問い合わせダイアログ
    codeDeleteDialog.showModal();
  }
});

function ajaxSelSelCode(targetId) {
  $.ajax({
    type: "POST",
    url: "./php/StaffAndCode/SelSelCode.php",
    dataType: "json",
    // async: false,
    data: {
      targetId: targetId,
    },
  })
    .done(function (data) {
      fillReadCodeData(data);
      $("#code-update__button").prop("disabled", false);
      codeEditMode = true;
    })
    .fail(function (data) {
      alert("DB connect error");
      // console.log(data);
    });
}

function fillReadCodeData(data) {
  Object.keys(data).forEach(function (val) {
    $("#" + val).val(data[val]);
  });
  $(".quality-code__wrapper .save-data")
    .removeClass("no-input")
    .addClass("complete-input");
}

// deleteダイアログのキャンセルボタンが押されたとき
$(document).on("click", "#code-delete-dialog-cancel__button", function () {
  codeDeleteDialog.close();
});

// deleteダイアログの削除ボタンが押されたとき
$(document).on("click", "#code-delete-dialog-delete__button", function () {
  let targetId;
  targetId = $("#code-selected__tr").find("td").eq(0).text();
  ajaxCodeDelSelData(targetId);
  codeDeleteDialog.close();
});

function ajaxCodeDelSelData(targetId) {
  // return false;
  $.ajax({
    type: "POST",
    url: "./php/StaffAndCode/DelCodeSelData.php",
    dataType: "json",
    // async: false,
    data: {
      id: targetId,
    },
  })
    .done(function () {
      console.log("ehllo");
      ajaxSelCode(); // summary tebale の読み出し
      $("#code-update__button").prop("disabled", true);
      // clearMemberInputData(); // 入力枠の削除
    })
    .fail(function () {
      alert("DB connect error");
    });
}

// ====================================================
// =========== Update button ============================
// ====================================================

$(document).on("click", "#code-update__button", function () {
  ajaxUpdateCode(getInputData2());
});

function ajaxUpdateCode(inputData) {
  $.ajax({
    type: "POST",
    url: "./php/StaffAndCode/UpdateCode.php",
    dataType: "json",
    async: false,
    data: inputData,
  })
    .done(function (data) {
      // console.log(data);
      ajaxSelCode();
      // clearInputData(); // データの削除と背景色の設定
      $("#code-update__button").prop("disabled", true); // save ボタン非活性化
      clearMemberInputData();
      codeEditMode = false;
    })
    .fail(function () {
      alert("DB connect error");
    });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++ TEST BUTTON ++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#member-test__button", function () {
  console.log("hello");
  ajaxSelCode();
});
