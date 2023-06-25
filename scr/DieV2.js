const targetDirectory = "./";
let ajaxReturnData;
var productionNumberTableValues = new Object();

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
  let today = new Date();

  $("#arrival_date").val(makeYYYYMMDD(today)).removeClass("input-required");
  makeProductionNumberTalbe();
  makeSummaryTalbe();
  makeDieDiamaterSelect();
  makeBolsterSelect();
});

function makeDieDiamaterSelect() {
  fileName = "./php/Die/SelDiamater.php";
  sendData = {
    dieName: "%",
  };
  myAjax.myAjax(fileName, sendData);

  ajaxReturnData.forEach(function (value) {
    $("<option>")
      .val(value["id"])
      .html("&oslash;" + value["die_diamater"])
      .appendTo("#die_diamater__select");
  });
}

function makeBolsterSelect() {
  fileName = "./php/Die/SelBolster.php";
  sendData = {
    dieName: "%",
  };
  myAjax.myAjax(fileName, sendData);

  ajaxReturnData.forEach(function (value) {
    $("<option>")
      .val(value["id"])
      .html(value["bolster_name"])
      .appendTo("#bolster__select");
  });
}

function makeSummaryTalbe() {
  fileName = "./php/Die/SelSummaryV2.php";
  sendData = {
    dieName: "%",
  };
  myAjax.myAjax(fileName, sendData);
  // console.log(ajaxReturnData);
  ajaxReturnData.forEach(function (val) {
    if (val["die_diamater"] != null) {
      val["die_diamater"] = "&oslash" + val["die_diamater"];
    }
  });
  makeTable($("#summary__table"));
}

function makeProductionNumberTalbe() {
  fileName = "./php/Die/SelProductionNumber.php";
  sendData = {
    targetId: $("#category1__tr").find("td").eq(0).html(),
    production_number: "%",
  };
  // console.log(sendData);
  myAjax.myAjax(fileName, sendData);
  productionNumberTableValues = ajaxReturnData;
  ajaxReturnData.forEach(function (val) {
    if (val["category1"] != null && val["category1"].length >= 8) {
      val["category1"] = val["category1"].substring(0, 8) + "...";
    }
    if (val["category2"] != null && val["category2"].length >= 8) {
      val["category2"] = val["category2"].substring(0, 8) + "...";
    }
  });
  makeTable($("#production_number__table"));
}

function makeTable(targetId) {
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo(targetId);
  });
}

function makeYYYYMMDD(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
}

function makeYYYYMMDDtoDateObj(strDate) {
  var dateObj = new Date();

  return year + "-" + month + "-" + day;
}

$(document).on("keyup", "#production_number", function () {
  $(this).val($(this).val().toUpperCase()); // exchenge to Large letters
  var flag = true;
  if ($(this).val().length < 3) {
    flag = false;
  }
  exchageBackground($(this), flag);
  buttonActivaltion();
});

$(document).on("change", "select", function () {
  var flag = true;

  if ($(this).val() == 0) {
    flag = false;
  }
  exchageBackground($(this), flag);
  buttonActivaltion();
});

function exchageBackground(targetObj, flag) {
  if (flag) {
    targetObj.removeClass("input-required");
  } else {
    targetObj.addClass("input-required");
  }
}

$(document).on("input", "#arrival_date", function () {
  var flag = true;
  var inputDate = new Date($(this).val());
  var startDate = new Date("2020-1-1");
  var endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 3);

  if (inputDate >= startDate && inputDate <= endDate) {
    flag = true;
  } else {
    flag = false;
  }
  exchageBackground($(this), flag);
  buttonActivaltion();
});

$(document).on("keyup", "#whole__input", function () {
  var flag = true;
  var inputNumber = parseFloat($(this).val());
  if (Number.isInteger(inputNumber) && inputNumber >= 1 && inputNumber <= 6) {
    flag = true;
  } else {
    flag = false;
  }
  exchageBackground($(this), flag);
  buttonActivaltion();
});

$(document).on("click", "#summary__table tbody tr", function () {
  let targetVal;
  const targetTr = $(this).find("td");
  $("#summary__table tr.selected-record").removeClass("selected-record");
  $(this).addClass("selected-record");

  // Update button Activation
  $("#mode_display").html("Update Mode");
  // $("#update__button").hide();
  $("#update__button").prop("disabled", false);

  // Copy values
  $("#production_number").val(targetTr.eq(1).text());
  $("#die_diamater__select option").each(function () {
    if ($(this).text() == targetTr.eq(2).text()) {
      $("#die_diamater__select").val($(this).val());
    }
  });
  $("#bolster__select option").each(function () {
    if ($(this).text() == targetTr.eq(3).text()) {
      $("#bolster__select").val($(this).val());
    }
  });
  $("#arrival_date").val("20" + targetTr.eq(5).text());
  $("#whole__input").val(targetTr.eq(7).text());
  // Delete background color
  $("div.top__wrapper .input-required").removeClass("input-required");
  // Select "Production Number Table"
  selectProductionNumberTable();
});

function selectProductionNumberTable() {
  const targetPN = $("#summary__table .selected-record")
    .find("td")
    .eq(4)
    .text();

  $("#production_number__table tbody tr.selected-record").removeClass(
    "selected-record"
  );
  $("#production_number__table tbody tr").each(function () {
    if ($(this).find("td").eq(3).text() == targetPN) {
      $(this)
        .addClass("selected-record")
        .attr("id", "production_number__tr")
        .get(0)
        .scrollIntoView({
          behavior: "smooth",
        });
    }
  });
}

$(document).on("click", "#production_number__table tbody tr", function () {
  $("#production_number__table tr.selected-record").removeClass(
    "selected-record"
  );
  $(this).addClass("selected-record");
});

$(document).on("click", "#test__button", function () {
  console.log(inputCheck());
  buttonActivaltion();
});

function inputCheck() {
  var flag = true;
  var targetObj = new Object();

  targetObj = $(".save-data");
  targetObj.each(function () {
    if ($(this).hasClass("input-required")) {
      flag = false;
    }
  });
  return flag;
}

function buttonActivaltion() {
  var mode;

  if ($("#mode_display").html() === "Update Mode") {
    mode = "Update";
  } else {
    mode = "AddNew";
  }

  switch (mode) {
    case "Update":
      if (inputCheck()) {
        $("#update__button").prop("disabled", false);
      } else {
        $("#update__button").prop("disabled", true);
      }
      break;
    case "AddNew":
      if (inputCheck()) {
        $("#save__button").prop("disabled", false);
      } else {
        $("#save__button").prop("disabled", true);
      }
      break;
  }
}
