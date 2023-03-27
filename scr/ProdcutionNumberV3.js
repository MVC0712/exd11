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
  console.log("hello");
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

$(document).on("keyup", "#production_name", function () {
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

function checkInput() {
  let flag = true;
  // console.log("hello");
  // console.log($(".save-data"));

  $(".save-data").each(function (index, element) {
    // console.log(element.attr(");
    // console.log($(element).attr("class"));
    // console.log($(element).hasClass("input-required"));
    if ($(element).hasClass("input-required")) {
      flag = false;
    }
  });
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
  myAjax.myAjax(fileName, sendData);

  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $("#category2__table tbody").empty();
    $(newTr).appendTo("#category2__table tbody");
  });
});

$(document).on("click", "#category2__table tbody tr", function () {
  $("#category2__table tbody tr.selected-record").removeClass(
    "selected-record"
  );
  $("#category2__tr").removeAttr("id");
  $(this).addClass("selected-record").attr("id", "categoryu__tr");
});
