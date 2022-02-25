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

$(function () {
  ajaxSelOrderSheet();
  makeSummaryTableByOrderSheet();
  makeSummaryTable();
});

function ajaxSelOrderSheet() {
  var fileName = "./php/Import/SelOrderSheet.php";
  var sendData = {
    ordersheet_number: $("#ordersheet_number").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#ordersheet_number__select option").remove();
  $("#ordersheet_number__select").append($("<option>").val(0).html("NO select"));
  ajaxReturnData.forEach(function(value) {
      $("#ordersheet_number__select").append(
          $("<option>").val(value["id"]).html(value["ordersheet_number"])
      );
  });
};

$(document).on("keyup", "#ordersheet_number", function (e) {
  var fileName = "./php/Import/SelOrderSheet.php";
  var sendData = {
    ordersheet_number: $("#ordersheet_number").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#ordersheet_number__select option").remove();
  $("#ordersheet_number__select").append($("<option>").val(0).html("NO select"));
  ajaxReturnData.forEach(function(value) {
      $("#ordersheet_number__select").append(
          $("<option>").val(value["id"]).html(value["ordersheet_number"])
      );
  });
});

$(document).on("change", "#ordersheet_number__select", function (e) {
  if ($(this).val() != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
    $("#production_number").html('Production number');
  }
  go_check();
});

$(document).on("change", "#ordersheet_number__select", function (e) {
  var fileName = "./php/Import/SelProductionNumber.php";
  var sendData = {
    ordersheet_number_id: $("#ordersheet_number__select").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#production_number").html(ajaxReturnData[0]["production_number"]);
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- input check from here -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const getTwoDigits = (value) => value < 10 ? `0${value}` : value;
const getDateTime = (date) => {
    const day = getTwoDigits(date.getDate());
    const month = getTwoDigits(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = getTwoDigits(date.getHours());
    const mins = getTwoDigits(date.getMinutes());
    return `${year}-${month}-${day} ${hours}:${mins}:00`;
}

// date input
$(document).on("change", "#import_at", function() {
  var a= $("#import_at").val();
  b=new Date(a)
  c=getDateTime(b)
  console.log(c)
  if ($(this).val() != "") {
      $(this).removeClass("no-input").addClass("complete-input");
  } else {
      $(this).removeClass("complete-input").addClass("no-input");
  }
  go_check();
});

// quantity
$(document).on("keyup", "#quantity", function (e) {
  if ($(this).val() >= 1 && $(this).val() != "") {
    $(this).removeClass("no-input").addClass("complete-input");
    console.log(Number($(this).val()))
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  go_check();
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Summary Table ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function makeSummaryTableByOrderSheet() {
  var fileName = "./php/Import/SelSummaryByOrderSheet.php";
  var sendData = {
      dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#summary__table__ordersheet tbody"));
}

function makeSummaryTable() {
  var fileName = "./php/Import/SelSummary.php";
  var sendData = {
      dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#summary__table tbody"));
}

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

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Save Button -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function go_check() {
  if (($("#import_at").val() == "")|| 
      ($("#ordersheet_number__select").val() == 0)||
      ($("#quantity").val() <= 0)){
      $("#save__button").prop("disabled", true);
  } else {
      $("#save__button").prop("disabled", false);
  }
};

$(document).on("click", "#save__button", function() {
  var fileName = "./php/Import/InsImport.php";
  var sendObj = new Object();
  sendObj["import_at"] =getDateTime(new Date($("#import_at").val()));
  sendObj["ordersheet_number__select"] = $("#ordersheet_number__select").val();
  sendObj["quantity"] = $("#quantity").val();
  sendObj["note"] = $("#note").val();
  myAjax.myAjax(fileName, sendObj);
  console.log(sendObj)

  $("#save__button").prop("disabled", true);
  $("#delete__button").prop("disabled", true);
  $("#update__button").prop("disabled", true);
  $("#ordersheet_number__select").val(0);
  $("#ordersheet_number__select").removeClass("complete-input").addClass("no-input");
  $("#quantity").val("");
  $("#quantity").removeClass("complete-input").addClass("no-input");
  $("#note").val("");
  $("#import_at").val("");
  $("#import_at").removeClass("complete-input").addClass("no-input");
  $("#production_number").html('Production number');
  makeSummaryTableByOrderSheet();
  makeSummaryTable();
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- update button -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#summary__table tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    $("#selected__tr").removeAttr("id");
    $(this).attr("id", "selected__tr");    
    var fileName = "./php/Import/SelSelImport.php";
    var sendData = {
        id: $("#selected__tr").find("td").eq(0).html(),
    };
    myAjax.myAjax(fileName, sendData);
    console.log(ajaxReturnData);
    $("#ordersheet_number__select").val(ajaxReturnData[0].ordersheet_id);
    $("#ordersheet_number__select").removeClass("no-input").addClass("complete-input");
    $("#quantity").val(ajaxReturnData[0].quantity);
    $("#note").val(ajaxReturnData[0].note);
    $("#quantity").removeClass("no-input").addClass("complete-input");
    $("#import_at").val(ajaxReturnData[0].import_at);
    $("#import_at").removeClass("no-input").addClass("complete-input");
    $("#update__button").prop("disabled", false);

    var fileName = "./php/Import/SelProductionNumber.php";
    var sendData = {
      ordersheet_number_id: $("#ordersheet_number__select").val(),
    };
    myAjax.myAjax(fileName, sendData);
    $("#production_number").html(ajaxReturnData[0]["production_number"]);
    go_check();
    $("#delete__button").prop("disabled", false);
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
  var fileName = "./php/Import/DelSelData.php";
  var sendObj = new Object();
  sendObj["id"] = $("#summary__table #selected__tr").find("td").eq(0).html();
  console.log(sendObj.id);
  myAjax.myAjax(fileName, sendObj);
  deleteDialog.close();
  $("#save__button").prop("disabled", true);
  $("#delete__button").prop("disabled", true);
  $("#update__button").prop("disabled", true);
  $("#ordersheet_number__select").val(0);
  $("#ordersheet_number__select").removeClass("complete-input").addClass("no-input");
  $("#quantity").val("");
  $("#quantity").removeClass("complete-input").addClass("no-input");
  $("#note").val("");
  $("#import_at").val("");
  $("#import_at").removeClass("complete-input").addClass("no-input");
  $("#production_number").html('Production number');
  makeSummaryTableByOrderSheet();
  makeSummaryTable();
});

$(document).on("click", "#update__button", function() {
  var fileName = "./php/Import/UpdateImport.php";
  var sendObj = new Object();
  sendObj["import_at"] =getDateTime(new Date($("#import_at").val()));
  sendObj["ordersheet_number__select"] = $("#ordersheet_number__select").val();
  sendObj["quantity"] = $("#quantity").val();
  sendObj["note"] = $("#note").val();
  sendObj["id"] = $("#summary__table #selected__tr").find("td").eq(0).html();

  myAjax.myAjax(fileName, sendObj);
  console.log(sendObj)

  $("#save__button").prop("disabled", true);
  $("#update__button").prop("disabled", true);
  $("#delete__button").prop("disabled", true);
  $("#ordersheet_number__select").val(0);
  $("#ordersheet_number__select").removeClass("complete-input").addClass("no-input");
  $("#quantity").val("");
  $("#quantity").removeClass("complete-input").addClass("no-input");
  $("#note").val("");
  $("#import_at").val("");
  $("#import_at").removeClass("complete-input").addClass("no-input");
  $("#production_number").html('Production number');
  makeSummaryTableByOrderSheet();
  makeSummaryTable();
}); 

function timkiemkhuon() {
  var input, table, tr, td, td1, td2, filter, i, txtdata, txtdata1, txtdata2, txtdata3;
  input = document.getElementById("search_input");
  console.log(input)
  filter = input.value.toUpperCase();
  table = document.getElementById("summary__table");
  var tbody = table.getElementsByTagName("tbody")[0];
  var tr = tbody.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      td1 = tr[i].getElementsByTagName("td")[2];
      td2 = tr[i].getElementsByTagName("td")[3];
      td3 = tr[i].getElementsByTagName("td")[4];
      if (td||td1||td2) {
          txtdata = td.innerText;
          txtdata1 = td1.innerText;
          txtdata2 = td2.innerText;
          txtdata3 = td3.innerText;
          if (txtdata.toUpperCase().indexOf(filter) > -1||
              txtdata1.toUpperCase().indexOf(filter) > -1||
              txtdata2.toUpperCase().indexOf(filter) > -1||
              txtdata3.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
          } else {
              tr[i].style.display = "none";
          }
      }
  }
} 