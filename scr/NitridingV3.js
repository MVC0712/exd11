// 削除確認ダイアログ
let deleteDialog = document.getElementById("delete__dialog");
var ajaxReturnData;

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
  makeSummaryTable();
  // 入力項目の非活性化
  // $("#directive__input").prop("disabled", true);
  // ボタンの非活性化
  $("#save__button").prop("disabled", true);
  $("#update__button").prop("disabled", true);
  // test ボタンの表示
  $("#test__button").remove();
  $("#delete-record__button").remove();
});

function makeSummaryTable() {
  var fileName = "./php/Nitriding/SelSummaryV2.php";
  var sendData = {
    dummy: "dummy",
  };
  // 今日の日付の代入
  $("#nitriding_date_at").val(returnToday());
  // summary tebale の読み出し
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#summary__table tbody"));
}

function returnToday() {
  // 本日の日付をyy-mm-dd形式で返す
  var month;
  var dt = new Date();
  month = dt.getMonth() + 1;
  if (month < 9) month = "0" + month;

  return dt.getFullYear() + "-" + month + "-" + dt.getDate();
}

function fillTableBody(data, tbodyDom) {
  let checkLimit = new Object();
  let chekFlag = false;
  $(tbodyDom).empty();
  data.forEach(function (trVal) {
    checkLimit["length"] = trVal["after_nitriding_length"];
    checkLimit["die_diamater"] = trVal["die_diamater"];
    // 文字色を変更させる条件　規定値以上に押出している金型
    if (
      (trVal["after_nitriding_length"] > 3 && trVal["die_diamater"] <= 260) ||
      (trVal["after_nitriding_length"] > 2.5 && trVal["die_diamater"] >= 300) ||
      trVal["is_washed_die"] >= 5
    ) {
      chekFlag = true;
    }
    let newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal, index) {
      if (index == 3 || index == 5) {
        trVal[tdVal] = trVal[tdVal] + " km";
      }
      if (chekFlag) {
        $("<td>").html(trVal[tdVal]).addClass("nitriding").appendTo(newTr);
      } else {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
      }
    });
    chekFlag = false;
    $(newTr).appendTo(tbodyDom);
  });
}

function fillTableBodyHisotry(data, tbodyDom) {
  let checkLimit = new Object();
  let chekFlag = false;
  $(tbodyDom).empty();
  data.forEach(function (trVal) {
    let newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal, index) {
      // console.log(tdVal);
      if (tdVal == "profile_length") {
        trVal[tdVal] = trVal[tdVal] + " km";
      }
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    chekFlag = false;
    $(newTr).appendTo(tbodyDom);
  });
}

// summary table tr click
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// -------------------------   summary table tr click   -------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#summary__table tbody tr", function () {
  var fileName = "./php/Nitriding/SelSelSummary3.php";
  var sendData = new Object();
  if (!$(this).hasClass("selected-record")) {
    // tr に class を付与し、選択状態の background colorを付ける
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    // tr に id を付与する
    $("#summary__table__selected").removeAttr("id");
    $(this).attr("id", "summary__table__selected");
    // 選択金型の窒化履歴読み出し ajax の読み出し
    sendData = {
      id: $("#summary__table__selected").find("td").eq(0).html(),
    };
    myAjax.myAjax(fileName, sendData);
    fillTableBodyHisotry(ajaxReturnData, $("#hisotry__table tbody"));
  } else {
    // 選択レコードを再度クリックした時
    // 選択レコードの移動
    $("#nitriding__table tbody").append($(this).removeClass("selected-record"));
    $("#nitriding__button").prop("disabled", false);
  }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// -------------------------   history table tr click   -------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#hisotry__table tr", function () {
  var fileName = "./php/Nitriding/SelSelSummary.php";
  var sendData = new Object();
  var id = $(this).parent().parent().attr("id");

  if (!$(this).hasClass("selected-record")) {
    // tr に class を付与し、選択状態の background colorを付ける
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    // tr に id を付与する
    $("#history__table__selected").removeAttr("id");
    $(this).attr("id", "history__table__selected");
  } else {
    deleteDialog.showModal();
  }
});

// deleteダイアログのキャンセルボタンが押されたとき
$(document).on("click", "#delete-dialog-cancel__button", function () {
  deleteDialog.close();
});

// deleteダイアログの削除ボタンが押されたとき
$(document).on("click", "#delete-dialog-delete__button", function () {
  let fileName = "./php/Nitriding/DelHistory.php";
  let sendData = new Object();
  let targetId;
  targetId = $("#history__table__selected").find("td").eq(0).text();

  sendData = {
    id: targetId,
  };

  myAjax.myAjax(fileName, sendData);
  makeSummaryTable(); // summary table 再作成
  $("#hisotry__table tbody").empty();
  $("#nitriding__table tbody").empty();

  deleteDialog.close();
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// -------------------------   nitriding__table table tr click   -------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#nitriding__table tbody tr", function () {
  var fileName = "./php/Nitriding/SelSelSummary.php";
  var sendData = new Object();
  var tableId = $(this).parent().parent().attr("id");

  if (!$(this).hasClass("selected-record")) {
    // tr に class を付与し、選択状態の background colorを付ける
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    // tr に id を付与する
    $("#nitriding__table__selected").removeAttr("id");
    $(this).attr("id", "nitriding__table__selected");
    // 選択金型の窒化履歴読み出し ajax の読み出し
    sendData = {
      id: $("#nitriding__table__selected").find("td").eq(0).html(),
    };
    // myAjax.myAjax(fileName, sendData);
    // fillTableBody(ajaxReturnData, $("#hisotry__table tbody"));
  } else {
    // 選択レコードを再度クリックした時
    $("#summary__table tbody").prepend($(this).removeClass("selected-record"));
    if ($("#nitriding__table tbody tr").length == 0) {
      // レコード数が0になる場合、窒化ボタンを無効化する
      $("#nitriding__button").prop("disabled", true);
    }
  }
});

$(document).on("click", "#nitriding__button", function () {
  var fileName = "./php/Nitriding/InsNitriding.php";
  var sendObj = new Object();

  $("#nitriding__table tbody tr td:nth-child(1)").each(function (
    index,
    element
  ) {
    sendObj[index] = $(this).html();
  });
  sendObj["nitriding_date"] = $("#nitriding_date_at").val();
  myAjax.myAjax(fileName, sendObj);
  // 書き込み後の処理
  $("#nitriding__table tbody").empty();
  $("#nitriding_date_at").val(returnToday());
  makeSummaryTable();
});

function ajaxTest(array) {
  $.ajax({
    type: "POST",
    url: "./php/Nitriding/InsNitriding.php",
    dataType: "json",
    async: false,
    // data: { test: "dummy" },
    data: JSON.stringify(array),
    // data: JSON.stringify([32, 45, 54]),
  })
    .done(function (data) {
      // $("#rack__table tbody").empty();
      console.log(data);
    })
    .fail(function () {
      // alert("DB connect error");
    });
}

function timkiem() {
  var input, table, tr, td, td1, td2, filter, i, txtdata, txtdata1, txtdata2, txtdata3;
  input = document.getElementById("die_number__input");
  filter = input.value.toUpperCase();
  table = document.getElementById("summary__table");
  var tbody = table.getElementsByTagName("tbody")[0];
  var tr = tbody.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      td1 = tr[i].getElementsByTagName("td")[2];
      td2 = tr[i].getElementsByTagName("td")[3];
      td3 = tr[i].getElementsByTagName("td")[4];
      if (td||td1||td2) {
          txtdata = td.innerText;
          txtdata1 = td1.innerText;
          txtdata2 = td2.innerText;
          txtdata3 = td3.innerText;
          if (txtdata.toUpperCase().indexOf(filter) > -1||
              txtdata1.toUpperCase().indexOf(filter) > -1||
              txtdata2.toUpperCase().indexOf(filter) > -1||
              txtdata3.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
          } else {
              tr[i].style.display = "none";
          }
      }
  }
} 