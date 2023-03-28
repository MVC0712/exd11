// 23/03/26 Fisrt day

let summaryTableEditMode = false;
let ajaxReturnData;

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
  // make summary table
  readSummaryTable();
  readCategory1Table();
});

function readSummaryTable() {
  let fileName;
  let sendData = new Object();
  let number = 1;
  // read ng list and fill option
  fileName = "./php/ProductionNumber/SelSummaryV2.php";
  sendData = {
    dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);

  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("#summary__table tbody");
  });
  $("#summary__table_record").html(
    $("#summary__table tbody tr").length + " items"
  );
}

function readCategory1Table() {
  let fileName;
  let sendData = new Object();
  // read ng list and fill option
  fileName = "./php/ProductionNumber/SelCategory1V2.php";
  sendData = {
    dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  $("#category1__table tbody").empty();
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("#category1__table tbody");
  });
}

$(document).on("keyup", "#production_number", function () {
  $(this).val($(this).val().toUpperCase()); // 小文字を大文字に
  if ($(this).val().length > 3) {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
});

$(document).on("change", ".main__wrapper select", function () {
  if ($(this).val() != 0) {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
});

$(document).on("keyup", "#production_length", function () {
  if (isNumber($(this).val()) && 1 <= $(this).val() && $(this).val() <= 9) {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
});

$(document).on("keyup", "#circumscribed_circle", function () {
  if (isNumber($(this).val()) && 5 <= $(this).val() && $(this).val() <= 400) {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
});

$(document).on("keyup", "#specific_weight", function () {
  if (isNumber($(this).val()) && 0.5 <= $(this).val() && $(this).val() <= 40) {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
});

$(document).on("keyup", "#cross_section_area", function () {
  if (isNumber($(this).val()) && 2 <= $(this).val() && $(this).val() <= 8000) {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
});

$(document).on("keyup", "#packing_quantity", function () {
  if (isNumber($(this).val()) && 2 <= $(this).val() && $(this).val() <= 1000) {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
});

$(document).on("keyup", "#packing_row", function () {
  if (isNumber($(this).val()) && 2 <= $(this).val() && $(this).val() <= 500) {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
});

$(document).on("keyup", "#packing_column", function () {
  if (isNumber($(this).val()) && 2 <= $(this).val() && $(this).val() <= 500) {
    $(this).removeClass("input-required");
  } else {
    $(this).addClass("input-required");
  }
});

$(document).on("keyup", ".top__wrapper", function () {
  // console.log(checkInput());
  if (checkInput()) {
    $("#save__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
  }
});

$(document).on("change", ".top__wrapper", function () {
  // console.log(checkInput());
  if (checkInput()) {
    $("#save__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
  }
});

$(document).on("click", ".top__wrapper", function () {
  // console.log(checkInput());
  if (checkInput()) {
    $("#save__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
  }
});

function checkInput() {
  let flag = true;
  $(".save-data").each(function (index, element) {
    if ($(element).hasClass("input-required")) {
      flag = false;
    }
  });
  if ($(".top__wrapper table tbody tr.selected-record").length != 2) {
    flag = false;
  }
  return flag;
}

function isNumber(val) {
  let flag = true;

  if (isNaN(val)) {
    flag = false;
  }
  if (val == "") {
    flag = false;
  }
  return flag;
}

$(document).on("click", "#category1__table tbody tr", function () {
  let fileName;
  let sendData = new Object();
  $("#category1__table tbody tr.selected-record").removeClass(
    "selected-record"
  );
  $("#category1__tr").removeAttr("id");
  $(this).addClass("selected-record").attr("id", "category1__tr");

  fileName = "./php/ProductionNumber/SelCategory2V2.php";
  sendData = {
    targetId: $("#category1__tr").find("td").eq(0).html(),
  };
  console.log(sendData);
  myAjax.myAjax(fileName, sendData);

  $("#category2__table tbody").empty();
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("#category2__table tbody");
  });
});

$(document).on("click", "#category2__table tbody tr", function () {
  $("#category2__table tbody tr.selected-record").removeClass(
    "selected-record"
  );
  $("#category2__tr").removeAttr("id");
  $(this).addClass("selected-record").attr("id", "category2__tr");
});

$(document).on("click", "#save__button", function () {
  let fileName;
  let sendData = new Object();

  sendData = getInputData();
  fileName = "./php/ProductionNumber/InsInputData2.php";
  myAjax.myAjax(fileName, sendData);

  $("#summary__table tbody").empty();
  readSummaryTable();
});

$(document).on("click", "#test__button", function () {
  console.log("helo");
  let tableObj = new Object();
  let inputProductionNumber = "C2Q63A-AD141A20K";
  let tableProdcutionNumber;
  tableObj = $("#summary__table tbody tr");
  tableObj.each(function (index, element) {
    tableProdcutionNumber = $(element).find("td").eq(3).html();
    console.log($(element).find("td").eq(3).html());
    if ($(element).find("td").eq(3).html() == inputProductionNumber) {
      $(element).addClass("selected-record");
    }
  });
  tableObj.scrollTop(300);
  console.log(tableObj.scrollTop());
});

function getInputData() {
  let inputData = new Object();
  let category2 = $("#category2__tr").find("td").eq(0).html();
  let dt = new Date();
  // .save-dataを持っている要素から値を取り出す
  $("input.save-data").each(function (index, element) {
    inputData[$(this).attr("id")] = $(this).val();
  });
  $("select.save-data").each(function (index, element) {
    inputData[$(this).attr("id")] = $(this).val();
  });
  // 日付はYY-mm-dd形式なのでYYYY-mm-dd形式に変更
  // inputData["date__input"] = "20" + inputData["date__input"];
  // targetId を別途保存
  inputData["targetId"] = $("#summary__tr").find("td").eq(0).html();
  // production category2 id の取得
  inputData["production_category2_id"] = category2;
  // 今日の日付の取得
  inputData["updated_at"] =
    dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();

  return inputData;
}
