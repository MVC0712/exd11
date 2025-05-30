let deleteDialog = document.getElementById("delete__dialog");
let editMode = false;
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

  var a = (new Date());
  var b = formatDate(MonthLastDate);
  var c = formatDate(new Date());

  $("#plan_start").val(c);
  $("#plan_end").val(formatDate(new Date(a.setDate(a.getDate() + 10))))
  selStaff();
  makeSummaryTable();
});
function selStaff() {
  var fileName = "./php/CheckBillet/SelStaff.php";
  var sendData = {
    staff: $("#staff_name").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#staff_name__select option").remove();
  $("#staff_name__select").append($("<option>").val(0).html("NO select"));
  ajaxReturnData.forEach(function(value) {
      $("#staff_name__select").append(
          $("<option>").val(value["id"]).html(value["staff_name"])
      );
  });
};
$(document).on("keyup", "#staff_name", function (e) {
  var fileName = "./php/CheckBillet/SelStaff.php";
  var sendData = {
    staff: $("#staff_name").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#staff_name__select option").remove();
  $("#staff_name__select").append($("<option>").val(0).html("NO select"));
  ajaxReturnData.forEach(function(value) {
      $("#staff_name__select").append(
          $("<option>").val(value["id"]).html(value["staff_name"])
      );
  });
});
$(document).on("change", "#staff_name__select", function (e) {
  if ($(this).val() != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  go_check();
});
$(document).on("change", "#check_at", function (e) {
  if ($(this).val() != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  go_check();
});
$(document).on("change", "#plan_start", function (e) {
  if ($(this).val() != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  makeSummaryTable();
});
$(document).on("change", "#plan_end", function (e) {
  if ($(this).val() != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  makeSummaryTable();
});

$(document).on("keyup", "#input__table tbody input", function (e) {
  if ($(this).val() >= 0 && $(this).val() != "") {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  go_check();
});
function checkInputTable() {
  let check = false;
  $("#input__table tbody input").each(function() {
    if ($(this).hasClass("no-input")) {
      check = true;
    }
  });
  return check;
}
function go_check() {
  if (($("#check_at").val() == "")|| 
      ($("#staff_name__select").val() == 0)||
      checkInputTable()){
      $("#save__button").prop("disabled", true);
  } else {
      $("#save__button").prop("disabled", false);
  }
};

function makeSummaryTable() {
  var fileName = "./php/CheckBillet/SelSummaryV3.php";
  var sendData = {
      dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#summary__table tbody"));

  makeLastBillet();
  makePlanBillet();
  makeUsedBillet();
  makeOrderBillet();
  orderQuantity();
};

function makeLastBillet() {
  var fileName = "./php/CheckBillet/SelLastBilletV2.php";
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
  $("#ht6N01A-1200").text(ajaxReturnData[0].A6N01A2281200);
  $("#ht6N01A-600").text(ajaxReturnData[0].A6N01A228600);
};

function makeUsedBillet() {
  var fileName = "./php/CheckBillet/SelUsedBilletV2.php";
  var sendData = {
      start : $("#plan_start").val(),
      end : $("#plan_end").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#tt6061-1200").text(ajaxReturnData[0].A60612281200);
  $("#tt6061-600").text(ajaxReturnData[0].A6061228600);
  $("#tt6063-1200").text(ajaxReturnData[0].A60632281200);
  $("#tt6063-600").text(ajaxReturnData[0].A6063228600);
  $("#tt6N01-1200").text(ajaxReturnData[0].A6N012281200);
  $("#tt6N01-600").text(ajaxReturnData[0].A6N01228600);
  $("#tt6N01A-1200").text(ajaxReturnData[0].A6N01A2281200);
  $("#tt6N01A-600").text(ajaxReturnData[0].A6N01A228600);
};

function makePlanBillet() {
  var fileName = "./php/CheckBillet/SelPlanBilletV2.php";
  var sendData = {
      start : $("#plan_start").val(),
      end : $("#plan_end").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#pl6061-1200").text(ajaxReturnData[0].A60612281200);
  $("#pl6061-600").text(ajaxReturnData[0].A6061228600);
  $("#pl6063-1200").text(ajaxReturnData[0].A60632281200);
  $("#pl6063-600").text(ajaxReturnData[0].A6063228600);
  $("#pl6N01-1200").text(ajaxReturnData[0].A6N012281200);
  $("#pl6N01-600").text(ajaxReturnData[0].A6N01228600);
  $("#pl6N01A-1200").text(ajaxReturnData[0].A6N01A2281200);
  $("#pl6N01A-600").text(ajaxReturnData[0].A6N01A228600);
};

function makeOrderBillet() {
  $("#od6061-1200").html(orderQuantity($("#pl6061-1200").html() - $("#ht6061-1200").html()));
  $("#od6061-600").html(orderQuantity($("#pl6061-600").html() - $("#ht6061-600").html()));
  $("#od6063-1200").html(orderQuantity($("#pl6063-1200").html() - $("#ht6063-1200").html()));
  $("#od6063-600").html(orderQuantity($("#pl6063-600").html() - $("#ht6063-600").html()));
  $("#od6N01-1200").html(orderQuantity($("#pl6N01-1200").html() - $("#ht6N01-1200").html()));
  $("#od6N01-600").html(orderQuantity($("#pl6N01-600").html() - $("#ht6N01-600").html()));
  $("#od6N01A-1200").html(orderQuantity($("#pl6N01A-1200").html() - $("#ht6N01A-1200").html()));
  $("#od6N01A-600").html(orderQuantity($("#pl6N01A-600").html() - $("#ht6N01A-600").html()));
};

function orderQuantity(number) {
  if(number>0){
    odd_part = number % 7;
    if (odd_part==0) {
      console.log(number);
      return number;
    } else {
      console.log(Math.ceil(number / 7) * 7);
      return Math.ceil(number / 7) * 7;
    }
  } else {
    return 0;
  }
};
function fillTableBody(data, tbodyDom) {
  $(tbodyDom).empty();
  data.forEach(function(trVal) {
      let newTr = $("<tr>");
      Object.keys(trVal).forEach(function(tdVal, index) {
          $("<td>").html(trVal[tdVal]).appendTo(newTr);
      });
      $(newTr).appendTo(tbodyDom);
  });
};
$(document).on("click", "#summary__table tbody tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    $("#selected__tr").removeAttr("id");
    $(this).attr("id", "selected__tr");
  } else {
    let pas = prompt("Please enter your Password", "********");
    if (pas == '01910926') {
      deleteDialog.showModal();
    } else {
      alert("Wrong pas");
    }
  }
});
$(document).on("click", "#delete-dialog-cancel__button", function () {
  deleteDialog.close();
});
$(document).on("click", "#delete-dialog-delete__button", function () {
  var fileName = "./php/CheckBillet/DelRecord.php";
  var sendData = {
    targetId : $("#selected__tr td:nth-child(1)").html(),
  };
  myAjax.myAjax(fileName, sendData);
  deleteDialog.close();
  makeSummaryTable();
});

$(document).on("click", "#save__button", function() {
  var fileName = "./php/CheckBillet/InsCheckBilletV3.php";
  var sendObj = new Object();
  sendObj["staff_id"] = $("#staff_name__select").val();
  sendObj["check_at"] =$("#check_at").val();
  sendObj["vl6061_1200"] = $("#vl6061_1200").val();
  sendObj["vl6061_600"] = $("#vl6061_600").val();
  sendObj["vl6063_1200"] = $("#vl6063_1200").val();
  sendObj["vl6063_600"] = $("#vl6063_600").val();
  sendObj["vl6N01_1200"] = $("#vl6N01_1200").val();
  sendObj["vl6N01_600"] = $("#vl6N01_600").val();
  sendObj["vl6N01A_1200"] = $("#vl6N01A_1200").val();
  sendObj["vl6N01A_600"] = $("#vl6N01A_600").val();

  sendObj["vl6061_1200_vn"] = $("#vl6061_1200_vn").val();
  sendObj["vl6061_600_vn"] = $("#vl6061_600_vn").val();
  sendObj["vl6063_1200_vn"] = $("#vl6063_1200_vn").val();
  sendObj["vl6063_600_vn"] = $("#vl6063_600_vn").val();
  sendObj["vl6N01A_1200_vn"] = $("#vl6N01A_1200_vn").val();
  sendObj["vl6N01A_600_vn"] = $("#vl6N01A_600_vn").val();
  myAjax.myAjax(fileName, sendObj);
  console.log(sendObj)

  $("#save__button").prop("disabled", true);
  $(".need-clear").each(function() {
    $(this).val("");
    $(this).removeClass("complete-input").addClass("no-input");
  });
  makeSummaryTable();
});