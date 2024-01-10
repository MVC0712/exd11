let editMode = false;
let deleteDialog = document.getElementById("delete__dialog");
const myAjax = {
  myAjax: function(fileName, sendData) {
      $.ajax({
              type: "POST",
              url: "./php/CutPosition/" + fileName,
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
  makeProductionNumber();
  makeSummaryTable();
});
$(document).on("keyup", "#production_number", function (e) {
	makeProductionNumber();
	makeSummaryTable();
});
function makeProductionNumber() {
  var fileName = "SelProductionNumber.php";
  var sendData = {
    production_number: $("#production_number").val(),
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#production__table tbody"));
};
function makeSummaryTable() {
	var fileName = "SelSummary.php";
	var sendData = {
	  production_number: $("#production_number").val(),
	};
	myAjax.myAjax(fileName, sendData);
	fillTableBody(ajaxReturnData, $("#summary__table tbody"));
};
function fillTableBody(data, tbodyDom) {
  $(tbodyDom).empty();
    data.forEach(function(trVal) {
      var newTr = $("<tr>");
      Object.keys(trVal).forEach(function(tdVal) {
		if ((tdVal == "production_number") || (tdVal == "id")) {
			$("<td>").html(trVal[tdVal]).appendTo(newTr);
		} else {
			$("<td>").append(makeInput(trVal[tdVal])).appendTo(newTr);
		}
      });
      $(newTr).appendTo(tbodyDom);
  });
};
function makeInput(qty) {
	let targetDom = $("<input>");
	targetDom.attr("type", "number");
	targetDom.val(qty);
	return targetDom;
  }
function checkSave() {
  if (!$("#production__table tbody tr").hasClass("selected-record")) {
    $("#save__button").prop("disabled", true);
  } else {
    $("#save__button").prop("disabled", false);
  }
};
// ------------------------- Summary Table ---------------------------------
$(document).on("click", "#summary__table tbody tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    $("#selected__tr").removeAttr("id");
    $(this).attr("id", "selected__tr");
  } else {
  }
});
$(document).on("click", "#production__table tbody tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    $("#selected__production_id").removeAttr("id");
    $(this).attr("id", "selected__production_id");
  } else {
  }
  checkSave();
});
// ------------------------- Save Button -------------------------
$(document).on("click", "#save__button", function () {
  var fileName = "InsData.php";
    var sendData = {
        h : $("#h").val(),
        a : $("#a").val(),
        b : $("#b").val(),
        c : $("#c").val(),
        d : $("#d").val(),
        e : $("#e").val(),
        f : $("#f").val(),
        i : $("#i").val(),
        k : $("#k").val(),
        end : $("#end").val(),
        production_number_id : $("#selected__production_id td:nth-child(1)").html(),
    };
  myAjax.myAjax(fileName, sendData);
  makeSummaryTable();
  clearInputData();
});

$(document).on("change", "#summary__table tbody tr td", function () {
  let sendData = new Object();
  let fileName;
  fileName = "UpdateData.php";
  sendData = {
    id : $("#selected__tr td:nth-child(1)").html(),
    h : $("#selected__tr td:nth-child(3) input").val(),
    a : $("#selected__tr td:nth-child(4) input").val(),
    b : $("#selected__tr td:nth-child(5) input").val(),
    c : $("#selected__tr td:nth-child(6) input").val(),
    d : $("#selected__tr td:nth-child(7) input").val(),
    e : $("#selected__tr td:nth-child(8) input").val(),
    f : $("#selected__tr td:nth-child(9) input").val(),
    i : $("#selected__tr td:nth-child(10) input").val(),
    k : $("#selected__tr td:nth-child(11) input").val(),
    end : $("#selected__tr td:nth-child(12) input").val(),
  };
  console.log(sendData);
  myAjax.myAjax(fileName, sendData);
  makeSummaryTable();
});
// ------------------------- update button -------------------------
function clearInputData() {
  $(".need-clear").val("");
}