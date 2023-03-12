// 23/03/12 Edit
// category　テーブルの編集モード
let summaryTableEditMode = false;
// category　テーブルの更新モード
let summaryTableOverWriteMode = false;

let addNewMode = false;

// 削除確認ダイアログ
// let summaryDeleteDialog = document.getElementById("summary-delete__dialog");
// let category1DeleteDialog = document.getElementById("category1-delete__dialog");
// let category2DeleteDialog = document.getElementById("category2-delete__dialog");

$(function () {
  // ボタンの非活性化
  $("#update__button").prop("disabled", true);
  $("#addnew__button").prop("disabled", true);
  $("#test__button").remove();
  // test ボタンの表示

  ajaxSelDiamater(); // Set Diamater and Bolster List
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// -------------------------  Initial Reading Data -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function ajaxSelDiamater() {
  $.ajax({
    type: "POST",
    url: "./php/Die/SelDiamater.php",
    dataType: "json",
    // async: false,
    data: "dummy",
  })
    .done(function (data) {
      makeSelectDom(data, $("#die_diamater_id"), "die_diamater", "&phi; ");
      ajaxSelBolster();
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function ajaxSelBolster() {
  $.ajax({
    type: "POST",
    url: "./php/Die/SelBolster.php",
    dataType: "json",
    // async: false,
    data: "dummy",
  })
    .done(function (data) {
      makeSelectDom(data, $("#bolstar_id"), "bolster_name", "");
      ajaxSelSummary("");
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function ajaxSelSummary(dieName) {
  dieName = dieName + "%";
  $.ajax({
    type: "POST",
    url: "./php/Die/SelSummary.php",
    dataType: "json",
    // async: false,
    data: {
      dieName: dieName,
    },
  })
    .done(function (data) {
      // 金型数の表示
      $("#headerDisplay").html(data.length + " Dies");
      // making summary table
      makeSummaryTable(data);
      // Addnew button の活性化処理
      if (data.length) {
        addNewMode = false;
      } else {
        addNewMode = true;
      }
      enterAddNewMode();

      ajaxSelProductionNumber($("#production-filter__input").val()); // 品番表の作成
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
    html += element["die_number"] + "</td><td>";
    html += "&phi; " + element["die_diamater"] + "</td><td>";
    html += element["bolster_name"] + "</td><td>";
    html += element["production_number"] + "</td><td>";
    html += element["arrival_at"] + "</td><td>";
    html += element["updated_at"] + "</td></td>";
  });
  $("#summary__table tbody").empty();
  $("#summary__table tbody").append(html);
}

function makeSelectDom(data, targetDom, column_name, head_letters) {
  // select option をセットする関数
  $(targetDom).find("option").remove();
  $(targetDom).append($("<option>").val(0).html("No"));
  data.forEach(function (value) {
    $(targetDom).append(
      $("<option>")
        .val(value["id"])
        .html(head_letters + value[column_name])
    );
  });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Input Check From Here -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// die number ====================================================
$(document).on("keyup", "#die_number", function () {
  $(this).val($(this).val().toUpperCase()); // 小文字を大文字に

  if (!summaryTableOverWriteMode) {
    // 上書きモードでない時 summary テーブルの値を読み出す
    ajaxSelSummary($(this).val());
  }
  // 入力文字が2文字以上である事
  if ($(this).val().length > 1) {
    $(this).removeClass("no-input");
  } else {
    $(this).addClass("no-input");
  }
});

// Arrival Date ====================================================
$(document).on("change", "#arrival_at", function () {
  if ($(this).val() != "") {
    $(this).removeClass("no-input");
  } else {
    $(this).addClass("no-input");
  }
});

// Hole ====================================================
$(document).on("keyup", "#hole", function () {
  if (
    $(this).val() != "" &&
    !isNaN($(this).val()) &&
    1 <= Number($(this).val()) &&
    Number($(this).val()) <= 4
  ) {
    $(this).removeClass("no-input");
  } else {
    $(this).addClass("no-input");
  }
});

// Diamater and Bolster ====================================================
$(document).on("change", ".input__area select", function () {
  // console.log("hello");
  if ($(this).val() != 0) {
    $(this).removeClass("no-input");
  } else {
    $(this).addClass("no-input");
  }
});
// activalize add new button
// input 要素
$(document).on("keyup", "input", function () {
  inputCheck();
});
// activalize add new button
// select 要素
$(document).on("change", "select", function () {
  inputCheck();
});
// activalize add new button
// 品番table 要素
$(document).on("click", "#production__table", function () {
  inputCheck();
});

function inputCheck() {
  // 未入力があるときは中断
  if (!checkInputComplete()) {
    $("#addnew__button").prop("disabled", true);
    $("#update__button").prop("disabled", true);
    return true;
  }

  if (!summaryTableOverWriteMode) {
    // データを追加する時
    addNewButtonActivation();
  } else {
    // summary talbe データを修正する時
    $("#update__button").prop("disabled", false);
  }
}

function ajaxUpdateData() {}

function addNewButtonActivation() {
  if (
    checkInputComplete() && // 左側の入力が完了しているか否か
    addNewMode == true &&
    $("#production-number__tr").length // 品番テーブルを選んでいるか
  ) {
    $("#addnew__button").prop("disabled", false);
  } else {
    $("#addnew__button").prop("disabled", true);
  }
}

// Filter input ====================================================
$(document).on("keyup", "#production-filter__input", function () {
  $(this).val($(this).val().toUpperCase()); // 小文字を大文字に
  ajaxSelProductionNumber($(this).val());
});

function ajaxSelProductionNumber(production_number) {
  production_number = production_number + "%";
  $.ajax({
    type: "POST",
    url: "./php/Die/SelProductionNumber.php",
    dataType: "json",
    // async: false,
    data: {
      production_number: production_number,
    },
  })
    .done(function (data) {
      makeProductionNumberTable(data);
      // ajaxSelBolster();
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function makeProductionNumberTable(data) {
  let html = "";
  data.forEach(function (element) {
    html += "<tr><td>";
    html += element["id"] + "</td><td>";
    html += element["category1"] + "</td><td>";
    html += element["category2"] + "</td><td>";
    html += element["production_number"] + "</td><td>";
    html += element["linked_dies"] + "</td></tr>";
  });
  $("#production__table tbody").empty().append(html);
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Production Number Table -----------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#production__table tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    // tr に class と id を付与する
    $("#production-number__tr").removeAttr("id");
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record").attr("id", "production-number__tr");

    // ajaxSelSelData($("#selected__tr").find("td").eq(0).html()); // 選択レコードのデータ読出
    // editMode = true;

    // $("#save__button").prop("disabled", false);
    // $("#update__button").prop("disabled", false);
    // $("#print__button").prop("disabled", false);
  } else {
    // 削除問い合わせダイアログ
    // deleteDialog.showModal();
  }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// -------------------------   Web Page Mode    -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function enterAddNewMode() {
  if (!addNewMode) {
    // addnewモードでない
    $("#arrival_at").removeClass("no-input").val("");
    $("#hole").removeClass("no-input").val("");
    $("#die_diamater_id").removeClass("no-input").val(0);
    $("#bolstar_id").removeClass("no-input").val(0);
    $("#addnew__button").prop("disabled", true);
    $("#topTitle").html("Dies Page");
    return true;
  } else {
    // addnewモード
    $("#arrival_at").addClass("no-input");
    $("#hole").addClass("no-input");
    $("#die_diamater_id").addClass("no-input");
    $("#bolstar_id").addClass("no-input");
    // $("#addnew__button").prop("disabled", false);
    $("#topTitle").html("Add New Die");
  }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Input Check To Here   -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Add New Button   -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#addnew__button", function () {
  // console.log(getInputData());
  // return false;
  ajaxInsInputData(getInputData());
});

function ajaxInsInputData(inputData) {
  $.ajax({
    type: "POST",
    url: "./php/Die/InsInputData.php",
    dataType: "json",
    // async: false,
    data: inputData,
  })
    .done(function (data) {
      // ajaxSelCategory1();
      ajaxSelSummary("");
      clearInputData(); // 入力枠の内容の削除
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function getInputData() {
  let inputData = new Object();
  // .save-dataを持っている要素から値を取り出す
  $(".save-data").each(function (index, element) {
    inputData[$(this).attr("id")] = $(this).val();
  });
  inputData["production_number_id"] = $("#production-number__tr")
    .find("td")
    .eq(0)
    .html();
  inputData["targetId"] = $("#selected__tr").find("td").eq(0).html();
  // 今日の日付
  inputData["today"] = "20" + fillToday();

  return inputData;
}

function fillToday() {
  // 本日の日付をyy-mm-dd形式で返す
  let dt = new Date();
  return (
    dt.getFullYear() - 2000 + "-" + (dt.getMonth() + 1) + "-" + dt.getDate()
  );
}

// 必要入力箇所の入力が終わっているかチェック　終わっていればtrueを返す
function checkInputComplete() {
  let flag = true;
  // console.log($(".save-data"));
  $(".save-data").each(function (index, element) {
    if ($(element).hasClass("no-input")) {
      flag = false;
    }
  });
  // console.log(flag);
  return flag;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Summary Table   -------------------------
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
    summaryTableEditMode = true;
  } else {
    // 選択レコードを再度クリックした時
    // 削除問い合わせダイアログ
    summaryDeleteDialog.showModal();
  }
});

// deleteダイアログのキャンセルボタンが押されたとき
$(document).on("click", "#delete-dialog-cancel__button", function () {
  summaryDeleteDialog.close();
});

// deleteダイアログの削除ボタンが押されたとき
$(document).on("click", "#delete-dialog-delete__button", function () {
  ajaxDelSelData($("#selected__tr").find("td").eq(0).text());
  summaryDeleteDialog.close();
});

function ajaxDelSelData(targetId) {
  $.ajax({
    type: "POST",
    url: "./php/Die/DelSummary.php",
    dataType: "json",
    // async: false,
    data: {
      id: targetId,
    },
  })
    .done(function () {
      ajaxSelSummary(""); // summary tebale の読み出し
      $("#update__button").prop("disabled", true);
      clearInputData(); // 入力枠の内容の削除
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function clearInputData() {
  $("input.save-data").val("");
  $("input.need-clear").val("");
  $("select.need-clear")
    .val(0)
    .removeClass("complete-input")
    .addClass("no-input");
}

function ajaxSelSelData(targetId) {
  $.ajax({
    type: "POST",
    url: "./php/Die/SelSelData.php",
    dataType: "json",
    // async: false,
    data: {
      id: targetId,
    },
  })
    .done(function (data) {
      fillReadData(data[0]);
      summaryTableOverWriteMode = true;
      $("#update__button").prop("disabled", false);
    })
    .fail(function (data) {
      // alert("DB connect error");
      console.log(data);
    });
}

function fillReadData(data) {
  let targetDom;
  // input要素への値の代入
  $(".input__area input").eq(0).val(data["die_number"]);
  $(".input__area input").eq(1).val(data["arrival_at"]);
  $(".input__area input").eq(2).val(data["hole"]);
  $(".input__area input").eq(3).val(data["die_note"]);

  $(".input__area select").eq(0).val(data["die_diamater_id"]);
  $(".input__area select").eq(1).val(data["bolstar_id"]);

  $(".input__wrapper input").removeClass("no-input");
  $(".input__wrapper select").removeClass("no-input");

  markUpProductionNumber(data["production_number_id"]);
}

function markUpProductionNumber(targetId) {
  let targetDom;
  targetDom = $("#production__table tbody tr");
  targetDom.each(function (index, element) {
    if ($(element).find("td").eq(0).text() == targetId) {
      // $(element).addClass
      $(element).parent().find("tr").removeClass("selected-record");
      $(element).addClass("selected-record");
      // tr に id を付与する
      $("#production-number__tr").removeAttr("id");
      $(element).attr("id", "production-number__tr");
      // 選択した位置にスクロールする
      $("#production__table tbody").scrollTop(19 * index);
    }
  });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Update Button   -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#update__button", function () {
  let inputData = new Object();
  inputData = getInputData();
  console.log(inputData);
  ajaxUpdateData(inputData);
});

function ajaxUpdateData(inputData) {
  $.ajax({
    type: "POST",
    url: "./php/Die/UpdateData.php",
    dataType: "json",
    // async: false,
    data: inputData,
  })
    .done(function (data) {
      ajaxSelSummary(""); // テーブルの再表示
      $("#update__button").prop("disabled", true); // save ボタン非活性化
      summaryTableOverWriteMode = false;
      clearInputData(); // 入力枠の内容の削除
    })
    .fail(function () {
      alert("DB connect error");
    });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Test Button   -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#test__button", function () {
  targetId = 30;

  let temp;

  temp = $("#production__table tbody").scrollTop(19 * 3);
  console.log(temp);
});
