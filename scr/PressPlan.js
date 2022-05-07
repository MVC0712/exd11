let editMode = false;
let deleteDialog = document.getElementById("delete__dialog");
const myAjax = {
  myAjax: function(fileName, sendData) {
      $.ajax({
              type: "POST",
              url: fileName,
              dataType: "json",
              data: sendData,
              async: false,
          })
          .done(function(data) {
              ajaxReturnData = data;
          })
          .fail(function() {
              alert("DB connect error");
          });
  },
};

$(function() {
  var now = new Date();
  var MonthLastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  var MonthFirstDate = new Date(now.getFullYear(), (now.getMonth() + 12) % 12, 1);
  var formatDateComponent = function(dateComponent) {
    return (dateComponent < 10 ? '0' : '') + dateComponent;
  };

  var formatDate = function(date) {
    return date.getFullYear()  + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate()) ;
  };

  // var a = formatDate(MonthFirstDate);
  // var b = formatDate(MonthLastDate);
  // $("#plan_start").val(formatDate(MonthFirstDate));
  // $("#plan_end").val(formatDate(MonthLastDate));

  var a = (new Date());
  var b = formatDate(MonthLastDate);
  var c = formatDate(new Date());

  $("#plan_start").val(c);
  $("#plan_end").val(formatDate(new Date(a.setDate(a.getDate() + 10))))

  makeSummaryTable();
  var fileName = "./php/PressPlan/SelProductionNumber.php";
  var sendData = {
    production_number: $(this).val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#production_number__select")
  .empty()
  .append($("<option>").val(0).html("No select"));
  ajaxReturnData.forEach(function (value) {
    $("<option>")
      .val(value["id"])
      .html(value["production_number"])
      .appendTo("#production_number__select");
  });
});

function makeSummaryTable() {
  var fileName = "./php/PressPlan/SelSummary.php";
  var sendData = {
    start : $("#plan_start").val(),
    end : $("#plan_end").val(),
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#summary__table tbody"));
  makeLastBillet();
  makePlanBillet();
  makeUsedBillet();
  makeOrderBillet();
  orderQuantity();
}
function makeLastBillet() {
  var fileName = "./php/CheckBillet/SelLastBillet.php";
  var sendData = {
      dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  $("#ht6061-1200").text(ajaxReturnData[0].A60612281200);
  $("#ht6061-600").text(ajaxReturnData[0].A6061228600);
  $("#ht6063-1200").text(ajaxReturnData[0].A60632281200);
  $("#ht6063-600").text(ajaxReturnData[0].A6063228600);
  $("#ht6N01-1200").text(ajaxReturnData[0].A6N012281200);
  $("#ht6N01-600").text(ajaxReturnData[0].A6N01228600);
};

function makeUsedBillet() {
  var fileName = "./php/CheckBillet/SelUsedBillet.php";
  var sendData = {
      start : $("#plan_start").val(),
      end : $("#plan_end").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#tt6061-1200").html(ajaxReturnData[0].A6061_228_1200);
  $("#tt6061-600").html(ajaxReturnData[0].A6061_228_600);
  $("#tt6063-1200").html(ajaxReturnData[0].A6063_228_1200);
  $("#tt6063-600").html(ajaxReturnData[0].A6063_228_600);
  $("#tt6N01-1200").html(ajaxReturnData[0].A6N01_228_1200);
  $("#tt6N01-600").html(ajaxReturnData[0].A6N01_228_600);
};

function makePlanBillet() {
  var fileName = "./php/CheckBillet/SelPlanBillet.php";
  var sendData = {
      start : $("#plan_start").val(),
      end : $("#plan_end").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#pl6061-1200").html(ajaxReturnData[0].A6061_228_1200);
  $("#pl6061-600").html(ajaxReturnData[0].A6061_228_600);
  $("#pl6063-1200").html(ajaxReturnData[0].A6063_228_1200);
  $("#pl6063-600").html(ajaxReturnData[0].A6063_228_600);
  $("#pl6N01-1200").html(ajaxReturnData[0].A6N01_228_1200);
  $("#pl6N01-600").html(ajaxReturnData[0].A6N01_228_600);
};

function makeOrderBillet() {
  $("#od6061-1200").html(orderQuantity($("#pl6061-1200").html() - $("#ht6061-1200").html()));
  $("#od6061-600").html(orderQuantity($("#pl6061-600").html() - $("#ht6061-600").html()));
  $("#od6063-1200").html(orderQuantity($("#pl6063-1200").html() - $("#ht6063-1200").html()));
  $("#od6063-600").html(orderQuantity($("#pl6063-600").html() - $("#ht6063-600").html()));
  $("#od6N01-1200").html(orderQuantity($("#pl6N01-1200").html() - $("#ht6N01-1200").html()));
  $("#od6N01-600").html(orderQuantity($("#pl6N01-600").html() - $("#ht6N01-600").html()));
};

function orderQuantity(number) {
  if(number>0){
    odd_part = number % 7;
    if (odd_part==0) {
      // console.log(number);
      return number;
    } else {
      // console.log(Math.ceil(number / 7) * 7);
      return Math.ceil(number / 7) * 7;
    }
  } else {
    return 0;
  }
};
function fillTableBody(data, tbodyDom) {
  $(tbodyDom).empty();
    data.forEach(function(trVal) {
      var newTr = $("<tr>");
      Object.keys(trVal).forEach(function(tdVal) {
          if (tdVal == "dies_id") {
              $("<td>").append(makeDieNumberSel(trVal[tdVal], trVal.production_number_id)).appendTo(newTr);
          } else if (tdVal == "plan_date") {
              $("<td>")
                  .append(makeDatePlan(trVal[tdVal])).appendTo(newTr);
          } else if (tdVal == "quantity") {
              $("<td>")
                  .append(makeInput(trVal[tdVal])).appendTo(newTr);
          } else {
              $("<td>").html(trVal[tdVal]).appendTo(newTr);
          }
      });
      $(newTr).appendTo(tbodyDom);
  });
}

function makeDieNumberSel(seletedId, id) {
  let targetDom = $("<select>");

  fileName = "./php/PressPlan/SelDieNumber.php";
  sendData = {
    production_number_id: id,
  };
  myAjax.myAjax(fileName, sendData);

  ajaxReturnData.forEach(function(element) {
      if (element["id"] == seletedId) {
          $("<option>")
              .html(element["die_number"])
              .val(element["id"])
              .prop("selected", true)
              .appendTo(targetDom);
      } else {
          $("<option>")
              .html(element["die_number"])
              .val(element["id"])
              .appendTo(targetDom);
      }
  });
  return targetDom;
}
function makeDatePlan(datePlan) {
  let targetDom = $("<input>");
  targetDom.attr("type", "date");
  targetDom.val(datePlan);
  return targetDom;
}
function makeInput(qty) {
  let targetDom = $("<input>");
  targetDom.attr("type", "text");
  targetDom.val(qty);
  return targetDom;
}
// ------------------------- input check from here -------------------------
$(document).on("keyup", "#production_number", function (e) {
  var fileName = "./php/PressPlan/SelProductionNumber.php";
  var sendData = {
    production_number: $(this).val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#production_number__select")
  .empty()
  .append($("<option>").val(0).html("No select"));
  ajaxReturnData.forEach(function (value) {
    $("<option>")
      .val(value["id"])
      .html(value["production_number"])
      .appendTo("#production_number__select");
  });
});
$(document).on("change", "#production_number__select", function (e) {
  if ($(this).val() != 0 && $(this).val() != "") {
    $(this).removeClass("no-input").addClass("complete-input");

    var fileName = "./php/PressPlan/SelDieNumber.php";
    var sendData = {
      production_number_id : $(this).val(),
    };
    myAjax.myAjax(fileName, sendData);
    $("#die_number__select")
    .empty()
    .append($("<option>").val(0).html("No select"));
    ajaxReturnData.forEach(function (value) {
      $("<option>")
        .val(value["id"])
        .html(value["die_number"])
        .appendTo("#die_number__select");
    });
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  checkSave();
});

$(document).on("change", "#die_number__select", function (e) {
  if ($(this).val() != 0 && $(this).val() != "") {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  checkSave();
});

$(document).on("change", "#press_date_at", function (e) {
  if ($(this).val() != 0 && $(this).val() != "") {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  checkSave();
});

$(document).on("keyup", "#quantity", function (e) {
  if ($(this).val() >= 1 && $(this).val() != "") {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  checkSave();
});

function checkSave() {
  var flag = true;
  $(".save-data").each(function (index, element) {
    if ($(this).hasClass("no-input")) {
      flag = false;
    }
  });
  if (flag == true) {
    $("#save__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
  }
};
$(document).on("change", "#plan_start", function (e) {
  makeSummaryTable();
});
$(document).on("change", "#plan_end", function (e) {
  makeSummaryTable();
});
// ------------------------- Summary Table ---------------------------------
$(document).on("click", "#summary__table tbody tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    $("#selected__tr").removeAttr("id");
    $(this).attr("id", "selected__tr");
    $("#selected__tr td:nth-child(3) input").attr("id", "selected__date");
  } else if ($(this).hasClass("selected-record")) {
    deleteDialog.showModal();
  }
});

$(document).on("click", "#delete-dialog-cancel__button", function () {
  deleteDialog.close();
});

$(document).on("click", "#delete-dialog-delete__button", function () {
  var fileName = "./php/PressPlan/DelPlan.php";
  var sendData = {
    targetId : $("#selected__tr td:nth-child(1)").html(),
  };
  myAjax.myAjax(fileName, sendData);
  deleteDialog.close();
  makeSummaryTable();
});

// ------------------------- Save Button -------------------------
$(document).on("click", "#save__button", function () {
  var fileName = "./php/PressPlan/InsPressPlan.php";
  var sendData = {
    production_number_id: $("#production_number__select").val(),
    die_number_id: $("#die_number__select").val(),
    date_plan: $("#press_date_at").val(),
    quantity: $("#quantity").val(),
  };
  console.log(sendData);
  myAjax.myAjax(fileName, sendData);
  makeSummaryTable();
  clearInputData();
});

$(document).on("change", "#summary__table tbody tr td", function () {
  let sendData = new Object();
  let fileName;
  fileName = "./php/PressPlan/UpdateInputData.php";
  sendData = {
    targetId : $("#selected__tr td:nth-child(1)").html(),
    // production_number_id : $("#selected__tr td:nth-child(3) select").val(),
    die_number_id : $("#selected__tr td:nth-child(5) select").val(),
    date_plan : $("#selected__date").val(),
    quantity : $("#selected__tr td:nth-child(6) input").val(),
  };
  console.log(sendData);
  myAjax.myAjax(fileName, sendData);
  makeSummaryTable();
});
// ------------------------- update button -------------------------
function clearInputData() {
  $("input.save-data")
    .val("")
    .removeClass("complete-input")
    .addClass("no-input");
  $("input.need-clear").val("");
  $("select.save-data")
    .val(0)
    .removeClass("complete-input")
    .addClass("no-input");
}

$(document).on("click", "#test__button", function () {
  
});