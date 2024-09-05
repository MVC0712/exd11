let deleteDialog = document.getElementById("delete__dialog");
let inputData = new Object();
let fileName;
let sendData = new Object();
let ajaxReturnData;
let from_import = false;
let from_import_data = "";

const myAjax = {
  myAjax: function (fileName, sendData) {
    $.ajax({
      type: "POST",
      url: "./php/"+fileName,
      dataType: "json",
      data: sendData,
      async: false,
    })
      .done(function (data) {
        ajaxReturnData = data;
      })
      .fail(function (err) {
        alert(err.responseText);
      });
  },
};

const getTwoDigits = (value) => value < 10 ? `0${value}` : value;
const getDateTime = (date) => {
    const day = getTwoDigits(date.getDate());
    const month = getTwoDigits(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = getTwoDigits(date.getHours());
    const mins = getTwoDigits(date.getMinutes());
    return `${year}${month}${day}${hours}${mins}00`;
}
makeSummaryTable()
selStaffDrawing();
selStaffCutting();
SelDrawingType();
SelProductionNumber();
SelStatus();

function SelDrawingType() {
  var fileName = "SelDrawingType.php";
  var sendData = {

  };
  myAjax.myAjax(fileName, sendData);
  $("#drawing_type_id option").remove();
  $("#drawing_type_id").append($("<option>").val(0).html("NO"));
  ajaxReturnData.forEach(function(value) {
      $("#drawing_type_id").append(
          $("<option>").val(value["id"]).html(value["drawing_type"])
      );
  });
  ajaxReturnData.forEach(function(value) {
    $("#production_type_filter").append($("<option>").val(0).html("NO"));
    $("#production_type_filter").append(
        $("<option>").val(value["id"]).html(value["drawing_type"])
    );
});
};
function selStaffDrawing() {
  var fileName = "SelStaff.php";
  var sendData = {
    staff: $("#staff").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#staff_id option").remove();
  $("#staff_id").append($("<option>").val(0).html("NO"));
  ajaxReturnData.forEach(function(value) {
      $("#staff_id").append(
          $("<option>").val(value["id"]).html(value["name"])
      );
  });
};
function selStaffCutting() {
  var fileName = "SelStaff.php";
  var sendData = {
    staff: $("#staff_cut").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#cutting_staff_id option").remove();
  $("#cutting_staff_id").append($("<option>").val(0).html("NO"));
  ajaxReturnData.forEach(function(value) {
      $("#cutting_staff_id").append(
          $("<option>").val(value["id"]).html(value["name"])
      );
  });
};
function SelProductionNumber() {
  var fileName = "SelProductionNumber.php";
  var sendData = {
    production_number: $("#production_number").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#production_number_id option").remove();
  $("#production_number_id").append($("<option>").val(0).html("NO"));
  ajaxReturnData.forEach(function(value) {
      $("#production_number_id").append(
          $("<option>").val(value["id"] + "-" + value["ex_production_numbers_id"]).html(value["production_number"])
      );
  });
  SelDies();
  SelPlugs();
};
function separateString(deviceString, position) {
  const deviceParts = deviceString.split("-");
  return deviceParts[position - 1];
};
function SelDies() {
  if($("#production_number_id").val() != 0) {
    var fileName = "SelDies.php";
    var sendData = {
      die_number: $("#die_number").val(),
      ex_production_numbers_id: separateString($("#production_number_id").val(), 2),
    };
    console.log(sendData)
    myAjax.myAjax(fileName, sendData);
    $("#die_number_id option").remove();
    $("#die_number_id").append($("<option>").val(0).html("NO"));
    ajaxReturnData.forEach(function(value) {
        $("#die_number_id").append(
            $("<option>").val(value["id"]).html(value["die_number"])
        );
    });
  }
};
function SelPlugs() {
  if($("#production_number_id").val() != 0) {
    var fileName = "SelPlugs.php";
    var sendData = {
      plug_number: $("#plug_number").val(),
      ex_production_numbers_id: separateString($("#production_number_id").val(), 2),
    };
    myAjax.myAjax(fileName, sendData);
    $("#plug_number_id option").remove();
    $("#plug_number_id").append($("<option>").val(0).html("NO"));
    ajaxReturnData.forEach(function(value) {
        $("#plug_number_id").append(
            $("<option>").val(value["id"]).html(value["plug_number"])
        );
    });
  }
};
function SelStatus() {
  var fileName = "SelStatus.php";
  var sendData = {
  };
  myAjax.myAjax(fileName, sendData);
  $("#die_status_id option").remove();
  $("#die_status_id").append($("<option>").val(0).html("NO"));
  ajaxReturnData.forEach(function(value) {
      $("#die_status_id").append(
          $("<option>").val(value["id"]).html(value["status"])
      );
  });
  $("#plug_status_id option").remove();
  $("#plug_status_id").append($("<option>").val(0).html("NO"));
  ajaxReturnData.forEach(function(value) {
      $("#plug_status_id").append(
          $("<option>").val(value["id"]).html(value["status"])
      );
  });
};

$(document).on("change", "#press_date", function() {
  if ($(this).val() != "") {
    makePressSelect();
  } else {
  }
});
function makePressSelect() {
  var fileName = "SelPress.php";
  var sendData = {
    press_date: $("#press_date").val(),
    production_number_id: separateString($("#production_number_id").val(), 2),
  };
  myAjax.myAjax(fileName, sendData);
  $("#press_id option").remove();
  $("#press_id").append($("<option>").val(0).html("NO"));
  ajaxReturnData.forEach(function(value) {
      $("#press_id").append(
          $("<option>").val(value["id"]).html(value["die_number"])
      );
  });
  $("#select_rack_table tbody").empty();
};
$(document).on("change", "#press_id", function() {
  if ($(this).val() != 0) {
    makePressTable();
  } else {
  }
});
$(document).on("keyup", "#production_number", function() {
  SelProductionNumber();
});
$(document).on("change", "#production_number_id", function() {
  SelDies();
  SelPlugs();
});
$(document).on("keyup", "#die_number", function() {
  SelDies();
});
$(document).on("keyup", "#plug_number", function() {
  SelPlugs();
});
$(document).on("keyup", "#staff", function() {
  selStaffDrawing();
});
$(document).on("keyup", "#staff_cut", function() {
  selStaffCutting();
});
function makePressTable() {
  var fileName = "SelRack.php";
  var sendData = {
    press_id: $("#press_id").val(),
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#select_rack_table tbody"));
};
function selRackByDrawing() {
  var fileName = "SelRackByDrawing.php";
  var sendData = {
    drawing_id: $("#selected__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#input_rack_table tbody"));
};
function selCutByDrawing() {
  var fileName = "SelCutByDrawing.php";
  var sendData = {
    drawing_id: $("#selected__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#profile_cut_table tbody"));
};
$(document).on("click", "#select_rack_table tbody tr", function() {
  if (!$(this).hasClass("selected-record")) {
      $(this).parent().find("tr").removeClass("selected-record");
      $(this).addClass("selected-record");
      $("#rack_selected").removeAttr("id");
      $(this).attr("id", "rack_selected");
  } else {
      let rack_id = $(this).find("td:nth-child(1)").html();
      let rack_number = $(this).find("td:nth-child(2)").html();
      let qty = $(this).find("td:nth-child(3) input").val();
      press_date = $("#press_date").val();
      var newTr = $("<tr>");
      $("<td>").html(rack_id).appendTo(newTr);
      $("<td>").html(press_date).appendTo(newTr);
      $("<td>").html(rack_number).appendTo(newTr);
      $("<td>").html(qty).appendTo(newTr);
      if (!checkRackId(rack_id)) {
        $(newTr).appendTo("#input_rack_table tbody");
        $(this).remove();
      } else (alert("rack_number already input!"))
  }
});
$(document).on("change", "#select_rack_table tbody tr", function() {
  let qty = $(this).find("td:nth-child(3) input").val();
  let max_qty = $(this).find("td:nth-child(4)").html();
  if (qty >= max_qty) {
    $(this).find("td:nth-child(3) input").val(max_qty);
  } else if (qty <= 1){
    $(this).find("td:nth-child(3) input").val(1);
  } else {
    
  }
});

function checkRackId(rack_id) {
  exist = false;
  $("#input_rack_table tbody tr").each(function (index, element) {
      ip_id = $(this).find("td:first").html();
      if(ip_id == rack_id) exist = true;
  });
  return exist;
};

$(document).on("click", "#input_rack_table tbody tr", function() {
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
  } else {
    $(this).remove();
    $("#profile_cut_table tbody").empty();
  }
});
$(document).on("click", "#delete-rack-cancel__button", function () {
  let deleteDialog = document.getElementById("delete-rack__dialog");
  deleteDialog.close();
});

$(document).on("click", "#delete-rack-delete__button", function () {
  let deleteDialog = document.getElementById("delete-rack__dialog");
  let sendData = new Object();
  let fileName = "DelSelRackData.php";
  sendData = {
    t_using_aging_rack_id: $("#rack_selected__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  deleteDialog.close();
  makeRackTable();
});
$(document).on("keyup", "#profile_cut_table input", function () {
  if (0 < Number($(this).val()) &&
    Number($(this).val()) <= 20 &&
    $(this).val() != "") {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});
$(document).on("click", "#add_cut_button", function () {
  if (Number($("#input_rack_table tbody tr").length) == 0) {
    alert("Please select input rack!");
    return;
  }
  maxSumCut = 0;
  sum = 0;
  $("#input_rack_table tbody tr td:nth-child(4)").each(function (index, value) {
    maxSumCut += Number($(this).text());
  });
  let trDom = $("<tr>");
  let recordNumber = Number($("#profile_cut_table tbody tr").length) + 1;

  if (recordNumber > maxSumCut) {
    alert("Number input is bigger than input quantity!");
    return;
  };
  let rack_number = makeRackNumber(recordNumber);
  trDom.append($("<th>").html("No." + recordNumber));
    let tdDom;
    trDom.append($("<td>").html(rack_number));
    tdDom = $("<td>").append($("<input type='number'>").val($("#profile_cut_ok").val()).addClass("no-input need-clear"));
    trDom.append(tdDom);
    tdDom = $("<td>").append($("<input type='number'>").val($("#profile_cut_ng").val()).addClass("no-input need-clear"));
    trDom.append(tdDom);
  trDom.appendTo("#profile_cut_table");
});
function makeRackNumber(recordNumber) {
  var quantity = 0;
  var rack_number = 0;
  var sum = 0;
  var table = document.getElementById("input_rack_table");
  var tbody = table.getElementsByTagName("tbody")[0];
  var tr = tbody.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
      rack_number = tr[i].getElementsByTagName("td")[2].innerText;
      quantity = tr[i].getElementsByTagName("td")[3].innerText;
      sum = +quantity;
      if (recordNumber <= sum) {
        break;
      }
  }
  return rack_number;
};
function makeSendData(workInfrmationTable) {
  sendTable = [];
  workInfrmationTable.forEach(function (element, index) {
    sendTable.push([index + 1, 1, element[0], element[1]]);
  });
  return sendTable;
}

$("#file_upload").on("change", function () {
  var file = $(this).prop("files")[0];
  $("#file_url").html(getDateTime(new Date())+file.name);
  $("#preview__button").prop("disabled", false);
});
$(document).on("click", "#preview__button", function () {
  window.open("./DailyReportSub.html");
});
$(document).on("change", "#file_upload", function () {
  ajaxFileUpload();
});
function ajaxFileUpload() {
    var file_data = $('#file_upload').prop('files')[0];
    var form_data = new FormData();
    form_data.append('file', file_data);
    form_data.append('sub_name', getDateTime(new Date()));
    $.ajax({
        url: "./php/FileUpload.php",
        dataType: 'text',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post',
    });
}

$(document).on("change", "#ordersheet_id", function () {
  SelDies();
  SelPlugs();
  $("#select_rack_table tbody").empty();
  $("#input_rack_table tbody").empty();
  $("#profile_cut_table tbody").empty();
  $("#press_id option").remove();
  $("#press_date").val("");
});
$(document).on("change", "#production_number_id", function () {
  $("#ordersheet_id option").remove();
  $("#select_rack_table tbody").empty();
  $("#input_rack_table tbody").empty();
  $("#profile_cut_table tbody").empty();
  $("#press_id option").remove();
  $("#press_date").val("");
});

$(document).on("change keyup", ".no-input", function() {
  if (($(this).val() == "") || ($(this).val() == 0)) {
      $(this).removeClass("complete-input").addClass("no-input");
  } else {
      $(this).removeClass("no-input").addClass("complete-input");
  }
});
$(document).on("change keyup", ".complete-input", function() {
  if (($(this).val() == "") || ($(this).val() == 0)) {
      $(this).removeClass("complete-input").addClass("no-input");
  } else {
      $(this).removeClass("no-input").addClass("complete-input");
  }
});
$(document).on("keyup", ".number-input", function() {
  if($.isNumeric($(this).val())){
      $(this).removeClass("no-input").addClass("complete-input");
  } else {
      $(this).removeClass("complete-input").addClass("no-input");
  }
  checkInput();
  checkUpdate();
});
$(document).on("click", "#select_ordersheet", function () {
  window.open(
    "./OrderSheet.html",
    null,
    "width=830, height=500,toolbar=yes,menubar=yes,scrollbars=no"
  );
});

function checkInput() {
  var check = true;
  $(".left__wrapper .save-data").each(function() {
    if ($(this).hasClass("no-input")) {
      check = false;
    }
  });
  $(".left__wrapper select").each(function() {
    if ($(this).hasClass("no-input")) {
      check = false;
    }
  });
  if ($("#summary__table tbody tr").hasClass("selected-record")) {
    check = false;
  }
  if (Number($("#input_rack_table tbody tr").length) == 0) {
    check = false;
  }
  if (Number($("#profile_cut_table tbody tr").length) == 0) {
    check = false;
  }
  if (check) {
    $("#save__button").attr("disabled", false);
  } else {
    $("#save__button").attr("disabled", true);
  }
  return check;
};
function checkUpdate() {
  var check = true;
  $(".left__wrapper .save-data").each(function() {
    if ($(this).hasClass("no-input")) {
      check = false;
    }
  });
  if (!($("#summary__table tbody tr").hasClass("selected-record"))) {
    check = false;
  }
  if (check) {
    $("#update__button").attr("disabled", false);
  } else {
    $("#update__button").attr("disabled", true);
  };
  return check;
};

function makeSummaryTable() {
  var fileName = "SelSummary.php";
  var sendData = {
      dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#summary__table tbody"));
};
function fillTableBody(data, tbodyDom) {
  $(tbodyDom).empty();
  data.forEach(function(trVal) {
      let newTr = $("<tr>");
      Object.keys(trVal).forEach(function(tdVal, index) {
          // $("<td>").html(trVal[tdVal]).appendTo(newTr);
          if (tdVal == "order_number") {
            $("<th>").html("No." + trVal[tdVal]).appendTo(newTr);
          } else if ((tdVal == "ng_quantityyy") || (tdVal == "ok_quantityyy")) {
            $("<td>").append($("<input type='number'>").val(trVal[tdVal]).addClass("need-clear complete-input")).appendTo(newTr);
          } else if ((tdVal == "ok_qty")) {
            $("<td>").append($("<input type='number'>").val(trVal[tdVal]).addClass("need-clear complete-input")).appendTo(newTr);
          } else {
            $("<td>").html(trVal[tdVal]).appendTo(newTr);
          }
      });
      $(newTr).appendTo(tbodyDom);
  });
};
$(document).on("click", "#summary__table tbody tr", function (e) {
  let fileName = "SelUpdateData.php";
  let sendData;
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    $("#selected__tr").removeAttr("id");
    $(this).attr("id", "selected__tr");
    sendData = {
      targetId: $("#selected__tr").find("td").eq(0).html(),
    };
    myAjax.myAjax(fileName, sendData);
    putDataToInput(ajaxReturnData);
    $("#add_rack__button").text("Add");
    selRackByDrawing();
    selCutByDrawing();
  } else {
    // deleteDialog.showModal();
  }
  $("#save__button").attr("disabled", true);
  $("#preview__button").attr("disabled", false);
  $(".save-data").each(function (index, element) {
    $(this).removeClass("no-input").addClass("complete-input");
  });
  checkUpdate();
});
function getTableData(tableTrObj) {
  var tableData = [];
  tableTrObj.each(function (index, element) {
    var tr = [];
    $(this).find("td").each(function (index, element) {
      if ($(this).find("input").length) {
        tr.push($(this).find("input").val());
      } else if ($(this).find("select").length) {
        tr.push($(this).find("select").val());
      } else {
        tr.push($(this).html());
      }
    });
    tr.push(index + 1);
    tableData.push(tr);
  });
  return tableData;
};

$(document).on("keyup", ".number-input", function() {
  if($.isNumeric($(this).val())){
      $(this).removeClass("no-input").addClass("complete-input");
  } else {
      $(this).removeClass("complete-input").addClass("no-input");
  }
  checkInput();
  checkUpdate();
});
$(document).on("keyup change", ".save-data", function() {
  checkInput();
  checkUpdate();
});

function getInputData() {
  let inputData = new Object();
  $(".left__wrapper input.save-data").each(function (index, element) {
    inputData[$(this).attr("id")] = $(this).val();
  });
  $(".left__wrapper select.save-data").each(function (index, element) {
    inputData[$(this).attr("id")] = $(this).val();
  });
  if ($("#file_upload").prop("files")[0]) {
    inputData["file_url"] = $("#file_url").html();
    ajaxFileUpload();
  } else {
    inputData["file_url"] = $("#file_url").html();
  }
  inputData["production_number_id"] = separateString($("#production_number_id").val(), 1);
  return inputData;
};
function clearInputData() {
  $(".left__wrapper input.need-clear").each(function (index, element) {
    $(this).val("").removeClass("complete-input").addClass("no-input");
  });
  $(".left__wrapper select.need-clear").each(function (index, element) {
    $(this).val("0").removeClass("complete-input").addClass("no-input");
  });
  $(".left__wrapper input.no-need").each(function (index, element) {
    $(this).removeClass("no-input").addClass("complete-input");
  });
  $(".left__wrapper select.no-need").each(function (index, element) {
    $(this).removeClass("no-input").addClass("complete-input");
  });

  $("#file_url").html("No file");

  $("#input_rack_table tbody").empty();
  $("#profile_cut_table tbody").empty();
}

$(document).on("click", "#save__button", function () {
  fileName = "InsData.php";
  inputData = getInputData();
  sendData = inputData;
  myAjax.myAjax(fileName, sendData);
  let targetId = ajaxReturnData[0]["id"];
  inputTableData = getTableData($("#input_rack_table tbody tr"));
  inputTableData.push(targetId);
  fileName = "InsRackData.php";
  sendData = JSON.stringify(inputTableData);
  console.log(sendData);
  myAjax.myAjax(fileName, sendData);

  cutTableData = getTableData($("#profile_cut_table tbody tr"));
  cutTableData.push(targetId);
  fileName = "InsCutData.php";
  sendData = JSON.stringify(cutTableData);
  console.log(sendData);
  myAjax.myAjax(fileName, sendData);
  $("#save__button").attr("disabled", true);
  clearInputData();
  makeSummaryTable();
});
$(document).on("click", "#update__button", function () {
  fileName = "UpdateData.php";
  inputData = getInputData();
  inputData["targetId"] = $("#selected__tr").find("td").eq(0).html();
  sendData = inputData;
  myAjax.myAjax(fileName, sendData);
  clearInputData();
  makeSummaryTable();
  $("#update__button").attr("disabled", true);
});
function putDataToInput(data) {
  data.forEach(function (trVal) {
    Object.keys(trVal).forEach(function (tdVal) {
      $("#" + tdVal).val(trVal[tdVal]);
    });
    SelDies();
    SelPlugs();
    $("#die_number_id").val(trVal["die_number_id"]); 
    $("#plug_number_id").val(trVal["plug_number_id"]); 
  });
  $("#file_url").html(data[0].file_url);
};
$(document).on("click", "#directive__input", function () {
  window.open(
    "./OrderSheet.html",
    null,
    "width=830, height=500,toolbar=yes,menubar=yes,scrollbars=no"
  );
});