let deleteDialog = document.getElementById("delete__dialog");
let confirmDialog = document.getElementById("confirm_delete__dialog");
var editMode = "NO";

const myAjax = {
  myAjax: function (fileName, sendData) {
    $.ajax({
      type: "POST",
      url: "./php/Aging/" + fileName,
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
  ajaxSelAgingRack(); // no aging rack list
  ajaxSelAgingHitory(); // aginged rack list
  $("#aging_date").val(fillToday());
  buttonActivation();
  $("#test__button").remove();
});

function fillToday() {
  var month;
  var dt = new Date();
  month = dt.getMonth() + 1;
  if (month < 9) month = "0" + month;

  return dt.getFullYear() + "-" + month + "-" + dt.getDate();
}

function ajaxSelAgingRack() {
  var fileName = "SelAgingRackV3.php";
  var sendData = {
    // start : $("#plan_start").val(),
    // end : $("#plan_end").val(),
    // die_number : $("#die_number").val(),
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#not_aging__table tbody"));
}

function ajaxSelAgingHitory() {
  var fileName = "SelAgingHistoryV4.php";
  var sendData = {

  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#history__table tbody"));
}

function fillTableBody(data, tbodyDom) {
  $(tbodyDom).empty();
    data.forEach(function(trVal) {
      var newTr = $("<tr>");
      Object.keys(trVal).forEach(function(tdVal) {
		$("<td>").html(trVal[tdVal]).appendTo(newTr);
      });
      $(newTr).appendTo(tbodyDom);
  });
};

$(document).on("click", "#history__table tbody tr", function () {
  if (!$(this).hasClass("selected-record")) {
    var aging_id = $(this).find("td")[5].innerText;
    $("#history__table tbody tr").each(function (index, val) {
      if ($(this).find("td")[5].innerText == aging_id) {
        $(this).addClass("selected-record");
      } else {
        $(this).removeClass("selected-record");
      }
    });
    editMode = "UPDATE_AGING";
    buttonActivation();
    $("#aging_date").val(
      $("#history__table .selected-record").eq(0).find("td").eq(6).html()
    );
    $("#hardness").val(
      $("#history__table .selected-record").eq(0).find("td").eq(7).html()
    );
    $("#start_at").val(
      $("#history__table .selected-record").eq(0).find("td").eq(8).html()
    );
    $("#aging_type").val(
      $("#history__table .selected-record").eq(0).find("td").eq(9).html()
    );
  } else {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    clearInput();
    editMode = "REMOVE_AGING";
    buttonActivation();
  }
});

$(document).on("click", "#not_aging__table tbody tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    $("#not_aging__table__selected").removeAttr("id");
    $(this).attr("id", "not_aging__table__selected");
  } else {
    $("#plan_aging__table tbody").append($(this).removeClass("selected-record"));
  }
  editMode = "NEW_AGING";
  buttonActivation();
});

$(document).on("click", "#plan_aging__table tbody tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    $("#plan_aging__table__selected").removeAttr("id");
    $(this).attr("id", "plan_aging__table__selected");
  } else {
    $("#not_aging__table tbody").append($(this).removeClass("selected-record"));
  }
  editMode = "ADD_AGING";
  buttonActivation();
});

$(document).on("click", "tbody", function () {
  if (
    $("#not_aging__table__selected").length &&
    $("#history__table .selected-record").length
  ) {
    editMode = "ADD_AGING";
    buttonActivation();
  }
});

$(document).on("click", "#save__button", function () {
  var fileName = "InsAgingV4.php";
  var sendData = new Object();
    $("#plan_aging__table tbody tr td:nth-child(1)").each(function(
        index,
        element
    ) {
        sendData[index] = $(this).html();
    });
  sendData["aging_date"] = $("#aging_date").val();
  sendData["start_at"] = $("#start_at").val();
  sendData["hardness"] = $("#hardness").val();
  sendData["aging_type"] = $("#aging_type").val();
  sendData["created_at"] = fillToday();
  myAjax.myAjax(fileName, sendData);
  ajaxSelAgingRack();
  ajaxSelAgingHitory();
  $("#plan_aging__table tbody").empty();
  editMode = "NO";
  buttonActivation();
});

$(document).on("click", "#update__button", function () {
  var fileName = "UpdateAgingV4.php";
  var sendData = {
    id: $("#history__table .selected-record").eq(0).find("td").eq(5).html(),
    aging_date: $("#aging_date").val(),
    start_at: $("#start_at").val(),
    hardness: $("#hardness").val(),
    aging_type: $("#aging_type").val(),
    update_at: fillToday(),
  };
  myAjax.myAjax(fileName, sendData);
  ajaxSelAgingRack();
  ajaxSelAgingHitory();
  clearInput();
  editMode = "NO";
  buttonActivation();
});

$(document).on("click", "#add-aging__button", function () {
  var fileName = "UpdateAddAging.php";
  var sendData = {
    using_aging_rack_id: $("#not_aging__table__selected")
      .find("td")
      .eq(0)
      .html(),
    aging_id: $("#history__table tbody tr.selected-record")
      .eq(0)
      .find("td")
      .eq(5)
      .html(),
  };
  myAjax.myAjax(fileName, sendData);
  ajaxSelAgingRack();
  ajaxSelAgingHitory();
  clearInput();
  editMode = "NO";
  buttonActivation();
});

$(document).on("click", "#remove-aging__button", function () {
    var fileName = "UpdateRemoveAgingV3.php";
    var sendData = {
      id : $("#history__table tbody .selected-record")
        .find("td")
        .eq(0)
        .html()
    };
    myAjax.myAjax(fileName, sendData);
    ajaxSelAgingRack();
    ajaxSelAgingHitory();
    clearInput();
    editMode = "NO";
    buttonActivation();
});

function buttonActivation() {
  switch (editMode) {
    case "NO":
      $("#save__button").prop("disabled", true);
      $("#update__button").prop("disabled", true);
      $("#add-aging__button").prop("disabled", true);
      $("#remove-aging__button").prop("disabled", true);
      break;
    case "NEW_AGING":
      $("#save__button").prop("disabled", false);
      $("#update__button").prop("disabled", true);
      $("#add-aging__button").prop("disabled", true);
      $("#remove-aging__button").prop("disabled", true);
      break;
    case "UPDATE_AGING":
      $("#save__button").prop("disabled", true);
      $("#update__button").prop("disabled", false);
      $("#add-aging__button").prop("disabled", true);
      $("#remove-aging__button").prop("disabled", true);
      break;
    case "ADD_AGING":
      console.log("add_aging");
      $("#save__button").prop("disabled", true);
      $("#update__button").prop("disabled", true);
      $("#add-aging__button").prop("disabled", false);
      $("#remove-aging__button").prop("disabled", true);
      break;
    case "REMOVE_AGING":
      $("#save__button").prop("disabled", true);
      $("#update__button").prop("disabled", true);
      $("#add-aging__button").prop("disabled", true);
      $("#remove-aging__button").prop("disabled", false);
      break;
  }
};

function clearInput() {
  $(".down__block input").val("");
  $("#aging_date").val(fillToday());
}