let editMode = false;
// let deleteDialog = document.getElementById("delete__dialog");
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

  makeSummaryTable();
});

function makeSummaryTable() {
  var fileName = "./php/PackPlan/SelSummary.php";
  var sendData = {
    start : $("#plan_start").val(),
    end : $("#plan_end").val(),
    die_number : $("#die_number").val(),
  };
  console.log(sendData);
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#summary__table tbody"));
}
function fillTableBody(data, tbodyDom) {
  $(tbodyDom).empty();
    data.forEach(function(trVal) {
      var newTr = $("<tr>");
      Object.keys(trVal).forEach(function(tdVal) {
          if ((tdVal == "pack_plan_date")||(tdVal == "aging_date")||(tdVal == "hardness_date")) {
              $("<td>")
                  .append(makeDatePlan(trVal[tdVal])).appendTo(newTr);
          } else if ((tdVal == "pack_quantity")||(tdVal == "pack_note")) {
              $("<td>")
                  .append(makeInput(trVal[tdVal])).appendTo(newTr);
          } else {
              $("<td>").html(trVal[tdVal]).appendTo(newTr);
          }
      });
      $(newTr).appendTo(tbodyDom);
  });
};

function makeDieNumberSel(seletedId, id) {
  let targetDom = $("<select>");

  fileName = "./php/PackPlan/SelDieNumber.php";
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
$(document).on("keyup", "#die_number", function (e) {
  makeSummaryTable();
});
$(document).on("change", "#plan_start", function (e) {
  makeSummaryTable();
});
$(document).on("change", "#plan_end", function (e) {
  makeSummaryTable();
});
$(document).on("click", "#summary__table tbody tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).parent().find("tr").removeClass("same-date");
    $("#selected__tr td:nth-child(3)").removeAttr("id");
    $(this).addClass("selected-record");
    $("#selected__tr").removeAttr("id");
    $(this).attr("id", "selected__tr");
    $("#selected__tr td:nth-child(3)").attr("id", "selected__date");
    var plDate = $("#selected__date").text();
    console.log(plDate);
    $("#summary__table tbody tr").each(function (index, element) {
      // console.log($(element).find("td:nth-child(3)").text());
      if ($(element).find("td:nth-child(3)").text() == plDate) {
        $(this).addClass("same-date");
      } else {
        $(this).removeClass("same-date");
      }
    });
  } else {
    // deleteDialog.showModal();
  }
});
// ------------------------- Save Button -------------------------
$(document).on("change", "#summary__table tbody tr td", function () {
  let sendData = new Object();
  let fileName;
  fileName = "./php/PackPlan/UpdateInputData.php";
  sendData = {
    targetId : $("#selected__tr td:nth-child(1)").html(),
    aging_date : $("#selected__tr td:nth-child(7) input").val(),
    hardness_date : $("#selected__tr td:nth-child(8) input").val(),
    pack_date : $("#selected__tr td:nth-child(9) input").val(),
    pack_quantity : $("#selected__tr td:nth-child(11) input").val(),
    pack_note : $("#selected__tr td:nth-child(12) input").val(),
  };
  console.log(sendData);
  myAjax.myAjax(fileName, sendData);
  // makeSummaryTable();
});