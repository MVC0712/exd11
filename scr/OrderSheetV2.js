let editMode = false;

// 削除確認ダイアログ
// let deleteDialog = document.getElementById("delete__dialog");

$(function () {
  $("#test__button").remove();
  ajaxSelSummary();
});

function ajaxSelSummary() {
  $.ajax({
    type: "POST",
    url: "./php/OrderSheet/SelSummaryV2.php",
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
  Diff_qty();
}

function makeSummaryTable(data) {
  $("#summary__table tbody").empty();
  data.forEach(function (trVal) {
    var newTr = $("<tr>");
    trVal["production_quantity"] = String(trVal["production_quantity"]).replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g,
      "$1,"
    );
    if (trVal["work_quantity"])
      trVal["work_quantity"] = String(trVal["work_quantity"]).replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        "$1,"
      );
    if (trVal["total_ok"])
      trVal["total_ok"] = String(trVal["total_ok"]).replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        "$1,"
      );
    Object.keys(data[0]).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $("#summary__table tbody").append($(newTr));
  });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- input check from here -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// order sheet nuumber :
$(document).on("keyup", "#ordersheet_number", function (e) {
  if ($(this).val().length > 3) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  chekInputButtonActivete();
});

// production number
$(document).on("focus", "#production_number", function (e) {
  ajaxSelProductionNumber($(this).val());
});

$(document).on("keyup", "#production_number", function (e) {
  ajaxSelProductionNumber($(this).val());
});

function ajaxSelProductionNumber(str) {
  str = str + "%";
  $.ajax({
    type: "POST",
    url: "./php/OrderSheet/SelProductionNumber.php",
    dataType: "json",
    async: false,
    data: {
      production_number: str,
    },
  })
    .done(function (data) {
      $("#production_number__select")
        .empty()
        .append($("<option>").val(0).html("no"));
      data.forEach(function (value) {
        $("<option>")
          .val(value["id"])
          .html(value["production_number"])
          .appendTo("#production_number__select");
      });
    })
    .fail(function () {
      alert("DB connect error");
    });
}
// production number select
$(document).on("change", "#production_number__select", function (e) {
  if ($(this).val() != 0 && $(this).val() != "") {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  chekInputButtonActivete();
});

// date input
$(document).on("change", "input[type='date']", function (e) {
  if ($(this).val() != 0 && $(this).val() != "") {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  chekInputButtonActivete();
});

// production qty
$(document).on("keyup", "#production_quantity", function (e) {
  if ($(this).val() > 1 && $(this).val() != "") {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  chekInputButtonActivete();
});

// カーソル移動
$(document).on("keydown", ".main__wrapper input", function (e) {
  chkMoveNext(
    e,
    $(this),
    getNextTargetIdName($(".main__wrapper input"), $(this).attr("id"))
  );
});

function getNextTargetIdName(targetObject, thisIdName) {
  let nextIndexFlag = false;
  let nextTargetDom;

  targetObject.each(function (index, element) {
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

$(".main__wrapper input").on("keyup", function () {
  chekInputButtonActivete();
});

// 必要入力箇所の入力が終わっているときsaveボタンを活性化する
function chekInputButtonActivete() {
  var flag = true;
  $(".save-data").each(function (index, element) {
    if ($(this).hasClass("no-input")) {
      flag = false;
    }
  });
  if (flag && editMode == false) {
    $("#save__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
  }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- input check to here -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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
    editMode = true;
  } else {
    // 選択レコードを再度クリックした時
    // 削除問い合わせダイアログ
    deleteDialog.showModal();
  }
});

function ajaxSelSelData(targetId) {
  $.ajax({
    type: "POST",
    url: "./php/OrderSheet/SelSelData.php",
    dataType: "json",
    // async: false,
    data: {
      targetId: targetId,
    },
  })
    .done(function (sqlData) {
      fillReadData(sqlData);
      // 背景色を変更すする
      $(".need-clear").removeClass("no-input").addClass("complete-input");
      editMode = true;
      $("#update__button").prop("disabled", false);
    })
    .fail(function (data) {
      alert("DB connect error");
      // console.log(data);
    });
}

function fillReadData(sqlData) {
  Object.keys(sqlData).forEach(function (data, index) {
    $("#" + data).val(sqlData[data]);
  });
  // production number の値は、selectで別途値を入れる
  $("#production_number").val("");
  $("#production_number__select")
    .empty()
    .append(
      $("<option>")
        .html(sqlData["production_number"])
        .val(sqlData["production_number_id"])
    );
}

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
    url: "./php/Ordersheet/DelSelData.php",
    dataType: "json",
    // async: false,
    data: {
      id: targetId,
    },
  })
    .done(function () {
      ajaxSelSummary(); // summary tebale の読み出し
      $("#update__button").prop("disabled", true);
      // clearInputData(); // 入力枠の削除
    })
    .fail(function () {
      alert("DB connect error");
    });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Save Button -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "#save__button", function () {
  // console.log(getInputData());
  ajaxInsInputData(getInputData());
});

function getInputData() {
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
  // targetId を別途保存
  inputData["targetId"] = $("#selected__tr").find("td").eq(0).html();
  // 配列のキーが無いと困るので

  return inputData;
}

function ajaxInsInputData(inputData) {
  $.ajax({
    type: "POST",
    url: "./php/OrderSheet/InsInputData.php",
    dataType: "json",
    async: false,
    data: inputData,
  })
    .done(function (data) {
      ajaxSelSummary();
      clearInputData();
    })
    .fail(function () {
      alert("DB connect error");
    });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- update button -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "#update__button", function () {
  console.log(getInputData());
  ajaxUpdateInputData(getInputData());
});

function ajaxUpdateInputData(inputData) {
  editMode = false;
  $("#update__button").prop("disabled", true);
  $.ajax({
    type: "POST",
    url: "./php/OrderSheet/UpdateInputData.php",
    dataType: "json",
    async: false,
    data: inputData,
  })
    .done(function (data) {
      ajaxSelSummary();
      clearInputData();
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
// ------------------------- check remain button -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#remain__button", function () {
  window.open(
    "./OrderSheetSub.html",
    null,
    "width=630, height=580, top=100,left=100, toolbar=yes,menubar=yes,scrollbars=no"
  );
  // window.open("./OrderSheetSub.html");
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- test button -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "#test__button", function () {
  clearInputData();
});

function Diff_qty() {
  var table, tr, td, tdod, tdok, txtod, txtok, i, diff;
  table = document.getElementById("summary__table");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    tdod = tr[i].getElementsByTagName("td")[5];
    tdok = tr[i].getElementsByTagName("td")[8];
    td = tr[i].getElementsByTagName("td")[10];
    var diff = 0;
    if (tdod) {
      txtod = Number(tdod.innerText.replace(",", ""));
      txtok = Number(tdok.innerText.replace(",", ""));
      diff = txtok - txtod;
      table.rows[i].insertCell(10);
      table.rows[i].cells[10].innerHTML = diff;
      if (diff > 0) {
        table.rows[i].cells[10].style.backgroundColor = "#ffbfc6";
      } else {
        table.rows[i].cells[10].style.backgroundColor = "#d1fff9";
      }
    }
  }
}
