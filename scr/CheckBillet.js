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

  var a = formatDate(MonthFirstDate);
  var b = formatDate(MonthLastDate);

  $("#plan_start").val(formatDate(MonthFirstDate));
  $("#plan_end").val(formatDate(MonthLastDate));
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

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- input check from here -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Summary Table ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function makeSummaryTable() {
  var fileName = "./php/CheckBillet/SelSummary.php";
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
}

$(document).on("click", "#summary__table tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    $("#selected__tr").removeAttr("id");
    $(this).attr("id", "selected__tr");    
    // var fileName = "./php/CheckBillet/SelSelExport.php";
    // var sendData = {
    //     id: $("#selected__tr").find("td").eq(0).html(),
    // };
    // myAjax.myAjax(fileName, sendData);
    // console.log(ajaxReturnData);
  } else {
    // deleteDialog.showModal();
  }
});

$(document).on("click", "#delete__button", function () {
  deleteDialog.showModal();
});

$(document).on("click", "#delete-dialog-cancel__button", function () {
  deleteDialog.close();
});

$(document).on("click", "#delete-dialog-delete__button", function () {
  var fileName = "./php/CheckBillet/DelSelData.php";
  var sendObj = new Object(); 
  sendObj["id"] = $("#summary__table #selected__tr").find("td").eq(0).html();
  console.log(sendObj.id);
  myAjax.myAjax(fileName, sendObj);
  deleteDialog.close();
  $("#save__button").prop("disabled", true);
  $("#delete__button").prop("disabled", true);
  $("#update__button").prop("disabled", true);
  $("#production_number__select").val(0);
  $("#production_number__select").removeClass("complete-input").addClass("no-input");
  $("#quantity").val("");
  $("#quantity").removeClass("complete-input").addClass("no-input");
  $("#note").val("");
  $("#export_at").val("");
  $("#export_at").removeClass("complete-input").addClass("no-input");
  $("#production_number").html('Production number');
  makeSummaryTableByOrderSheet();
  makeSummaryTable();
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Save Button -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#save__button", function() {
  var fileName = "./php/CheckBillet/InsCheckBillet.php";
  var sendObj = new Object();
  sendObj["staff_id"] = $("#staff_name__select").val();
  sendObj["check_at"] =$("#check_at").val();
  sendObj["vl6061_1200"] = $("#vl6061_1200").val();
  sendObj["vl6061_600"] = $("#vl6061_600").val();
  sendObj["vl6063_1200"] = $("#vl6063_1200").val();
  sendObj["vl6063_600"] = $("#vl6063_600").val();
  sendObj["vl6N01_1200"] = $("#vl6N01_1200").val();
  sendObj["vl6N01_600"] = $("#vl6N01_600").val();
  myAjax.myAjax(fileName, sendObj);
  console.log(sendObj)

  $("#save__button").prop("disabled", true);
  // loop thought all class need-clear and clear it
  $(".need-clear").each(function() {
    $(this).val("");
    $(this).removeClass("complete-input").addClass("no-input");
  });
  makeSummaryTable();
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- update button -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#update__button", function() {
  var fileName = "./php/CheckBillet/UpdateExport.php";
  var sendObj = new Object();
  sendObj["export_at"] =getDateTime(new Date($("#export_at").val()));
  sendObj["production_number__select"] = $("#production_number__select").val();
  sendObj["quantity"] = $("#quantity").val();
  sendObj["note"] = $("#note").val();
  sendObj["id"] = $("#summary__table #selected__tr").find("td").eq(0).html();

  myAjax.myAjax(fileName, sendObj);
  console.log(sendObj)

  $("#save__button").prop("disabled", true);
  $("#update__button").prop("disabled", true);
  $("#delete__button").prop("disabled", true);
  $("#production_number__select").val(0);
  $("#production_number__select").removeClass("complete-input").addClass("no-input");
  $("#quantity").val("");
  $("#quantity").removeClass("complete-input").addClass("no-input");
  $("#note").val("");
  $("#export_at").val("");
  $("#export_at").removeClass("complete-input").addClass("no-input");
  $("#production_number").html('Production number');
  makeSummaryTableByOrderSheet();
  makeSummaryTable();
}); 
