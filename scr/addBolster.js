// 23/03/12 Fisrt day

// category　テーブルの編集モード
let summaryTableEditMode = false;
let ajaxReturnData;

// $("#delete__button").prop("disabled", true);

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
  let fileName;
  let sendData = new Object();

  // make summary table
  readSummaryTable();

  // load die dimension
  fileName = "./php/Die/SelDieDimension.php";
  sendData = {
    dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  ajaxReturnData.forEach(function (value) {
    $("<option>")
      .val(value["id"])
      .html(value["die_diamater"])
      .appendTo("#die_diamater__select");
  });
});

function readSummaryTable() {
  let fileName;
  let sendData = new Object();
  let number = 1;
  // read ng list and fill option
  fileName = "./php/Die/SelBolster2.php";
  sendData = {
    dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);

  $("#bolster__table tbody").empty();
  ajaxReturnData.forEach(function (trVal) {
    let newTr = $("<tr>");
    $("<td>").html(number).appendTo(newTr);
    Object.keys(trVal).forEach(function (tdVal, index) {
      if (index == 1) {
        // $("<td>").html(trVal[tdVal]).appendTo(newTr);
        let myTd = $("<td>");
        $("<input>").val(trVal[tdVal]).appendTo(myTd);
        myTd.appendTo(newTr);
      } else {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
      }
    });
    $(newTr).appendTo("#bolster__table tbody");
    number = number + 1;
  });
}

$(document).on("keyup", "#bolster__input", function () {
  $(this).val($(this).val().toUpperCase()); // 小文字を大文字に
  if (inputCheck($(this).val()) == false) {
    $(this).addClass("input-required");
  } else {
    $(this).removeClass("input-required");
  }
});

$(document).on("change", "#bolster__input", function () {
  if ($(this).val().length != 10) {
    $(this).addClass("input-required");
  } else {
    $(this).removeClass("input-required");
  }
  addNewButtonActivation();
});

function inputCheck(val) {
  let flag = true;
  let sampleInput = "B1234-5678";
  let complectVal;
  let regexp = /^B[0-9]{4}\-[0-9]{4}$/;

  complectVal = val + sampleInput.slice(val.length);
  return regexp.test(complectVal);
}

function addNewButtonActivation() {
  let flag = true;
  let inputElement = $(".save-data");
  inputElement.each(function () {
    if ($(this).css("background-color") != "rgb(255, 255, 255)") {
      flag = false;
    }
  });
  if (flag) {
    $("#add__button").prop("disabled", false);
  } else {
    $("#add__button").prop("disabled", true);
  }
}

$(document).on("change", "#die_diamater__select", function () {
  if ($(this).val() != 0) {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
  addNewButtonActivation();
});

function isNumber(val) {
  var regexp = new RegExp(/^[0-9]+(\.[0-9]+)?$/);
  return regexp.test(val);
}

$(document).on("click", "#bolster__table tbody tr", function () {
  // Make Ng table
  // display total qty
  // display total OK qty
  $("tr.selected-record").removeClass("selected-record");
  $(this).addClass("selected-record");
  $("input.selected-input").removeClass("selected-input");
  $(this).find("input").addClass("selected-input");
  $("#delete__button").prop("disabled", false);
});

$(document).on("click", "#add__button", function () {
  let inputData = new Object();

  inputData = getInputData();
  inputData.bolster__input = inputData.bolster__input + "-**";

  fileName = "./php/Die/InsBolster.php";
  sendData = inputData;
  myAjax.myAjax(fileName, sendData);
  // reLoad new table
  readSummaryTable();
  // colored new record
  $("#bolster__table tbody tr").eq(-1).addClass("selected-record");
  $("#bolster__table tbody tr").eq(-1).find("input").addClass("selected-input");
});

$(document).on("click", "#delete__button", function () {
  document.getElementById("delete__dialog").showModal();
});

$(document).on("click", "#dialog-cancel__button", function () {
  document.getElementById("delete__dialog").close();
});

$(document).on("click", "#dialog-delete__button", function () {
  let fileName = "./php/Die/DelBolster.php";
  let sendData = {
    id: Number($("tbody tr.selected-record").find("td").eq(1).text()),
  };
  myAjax.myAjax(fileName, sendData);
  readSummaryTable();
  $("#delete__button").prop("disabled", true);
  document.getElementById("delete__dialog").close();
});

function getInputData() {
  let inputData = new Object();
  // .save-dataを持っている要素から値を取り出す
  $(".save-data").each(function (index, element) {
    inputData[$(this).attr("id")] = $(this).val();
  });
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
