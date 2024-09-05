let ajaxReturnData;
let press_id;
let result = [
  {
    id: 1,
    re: "OK",
  },
  {
    id: 2,
    re: "NG",
  },
];
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
    makeSummaryTable();
    makeNameList("");
    getNo();
});

function getNo() {
  var rowCount1 = $("#data__table tbody tr").length;
  $("#no").val(rowCount1 + 1);

  var rowCount2 = $("#rack__table tbody tr").length;
  $("#order").val(rowCount2 + 1);
};

$(document).on("keyup", "#die_number__input", function() {
    makeSummaryTable();
});

function makeSummaryTable() {
    var fileName = "./php/DailyReport3/SelSummary.php";
    var sendData = {
        die_number__input: $("#die_number__input").val(),
    };
    myAjax.myAjax(fileName, sendData);
    $("#summary_table tbody").empty();
    ajaxReturnData.forEach(function(trVal) {
        let newTr = $("<tr>");
        Object.keys(trVal).forEach(function(tdVal, index) {
            $("<td>").html(trVal[tdVal]).appendTo(newTr);
        });
        $(newTr).appendTo("#summary_table tbody");
    });
};

function makeNameList(inputValue) {
  let fileName = "./php/DailyReport3/SelStaff.php";
  let sendData = {
    name_s: "%" + inputValue + "%",
  };
  myAjax.myAjax(fileName, sendData);
  $("#cutting_staff_id option").remove();
  $("#cutting_staff_id").append($("<option>").val(0).html("--------------"));
  ajaxReturnData.forEach(function (value) {
    $("#cutting_staff_id").append(
    $("<option>").val(value["id"]).html(value["staff_name"])
    );
  });
};

function makeDataTable(targetDom, ajaxReturnData) {
    $(targetDom).empty();
    ajaxReturnData.forEach(function(trVal) {
        var newTr = $("<tr>");
        Object.keys(trVal).forEach(function(tdVal) {
          if (tdVal == "billet_number" || tdVal == "order_number" || tdVal == "id") {
            $("<td>").html(trVal[tdVal]).appendTo(newTr);
          } else if (tdVal == "staff_check_id") {
            $("<td>").append(makeStaff(trVal[tdVal])).appendTo(newTr);
          } else if (tdVal == "result") {
            $("<td>").append(makeResult(trVal[tdVal])).appendTo(newTr);
          } else {
            $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
          }
        });
        $(newTr).appendTo(targetDom);
    });
    
};
function makeStaff(seletedId) {
  let fileName = "./php/DailyReport3/SelStaff.php";
  let sendData = {
    name_s: "%%",
  };
  myAjax.myAjax(fileName, sendData);
  let targetDom = $("<select>");
  $("<option>").html("No").val(0).appendTo(targetDom);
  ajaxReturnData.forEach(function (element) {
    if (element["id"] == seletedId) {
      $("<option>").html(element["staff_name"]).val(element["id"]).prop("selected", true).appendTo(targetDom);
    } else {
      $("<option>").html(element["staff_name"]).val(element["id"]).appendTo(targetDom);
    }
  });
  return targetDom;
};
function makeResult(seletedId) {
  let targetDom = $("<select>");
  $("<option>").html("No").val(0).appendTo(targetDom);
  result.forEach(function (element) {
    if (element["id"] == seletedId) {
      $("<option>").html(element["re"]).val(element["id"]).prop("selected", true).appendTo(targetDom);
    } else {
      $("<option>").html(element["re"]).val(element["id"]).appendTo(targetDom);
    }
  });
  return targetDom;
}
function getTableDataInput(tableTrObj) {
    var tableData = [];
    tableTrObj.each(function (index, element) {
      var tr = [];
      $(this)
        .find("td")
        .each(function (index, element) {
            if ($(this).find("select").length) {
                tr.push($(this).find("select").val());
            } else if ($(this).find("input").length) {
                    tr.push($(this).find("input").val());
            } else {
                tr.push($(this).html());
            }
        });
        tableData.push(tr);
    });
    return tableData;
};

$(document).on("change", "#data__table tbody tr", function () {
    let sendData = new Object();
    let fileName;
    fileName = "./php/DailyReport3/UpdateData.php";
    sendData = {
      id: $("#data_select_tr td:nth-child(1)").html(),
      work_length : $("#data_select_tr td:nth-child(3) input").val(),
      stretch_length : $("#data_select_tr td:nth-child(4) input").val(),
      work_quantity : $("#data_select_tr td:nth-child(5) input").val(),
    };
    console.log(sendData);
    myAjax.myAjax(fileName, sendData);
    
});
$(document).on("change", "#rack__table tbody tr", function () {
  let sendData = new Object();
  let fileName;
  fileName = "./php/DailyReport3/UpdateRack.php";
  sendData = {
    id: $("#rack_select_tr td:nth-child(1)").html(),
    rack_number : $("#rack_select_tr td:nth-child(3) input").val(),
    work_quantity : $("#rack_select_tr td:nth-child(4) input").val(),
  };
  console.log(sendData);
  myAjax.myAjax(fileName, sendData);
  
});
$(document).on("click", "#add_new", function () {
    let sendData = new Object();
    let fileName;
    fileName = "./php/DailyReport3/AddNewProfile.php";
    sendData = {
      press_id : press_id,
      billet_number : $("#no").val(),
      work_length : $("#work_length").val(),
      stretch_length : $("#stretch_length").val(),
      work_quantity : $("#work_quantity").val(),
    };
    console.log(sendData);
    myAjax.myAjax(fileName, sendData);

    fileName = "./php/DailyReport3/SelData.php";
    sendData = {
        press_id: press_id,
    };
    myAjax.myAjax(fileName, sendData);
    makeDataTable($("#data__table tbody"), ajaxReturnData);
    getNo();
});

$(document).on("click", "#add-rack__button", function () {
  let sendData = new Object();
  let fileName;
  fileName = "./php/DailyReport3/AddRack.php";
  sendData = {
    press_id : press_id,
    order_number : $("#order").val(),
    rack_number : $("#racknumber__input").val(),
    work_quantity : $("#rackqty__input").val(),
  };
  console.log(sendData);
  myAjax.myAjax(fileName, sendData);

  fileName = "./php/DailyReport3/SelRack.php";
  sendData = {
      press_id: press_id,
  };
  myAjax.myAjax(fileName, sendData);
  makeDataTable($("#rack__table tbody"), ajaxReturnData);
  getNo();
});

$(document).on("click", "#data__table tbody tr", function(e) {
    if (!$(this).hasClass("selected-record")) {
        $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        $("#data_select_tr").removeAttr("id");
        $(this).attr("id", "data_select_tr");
    } else {
    }
});
$(document).on("click", "#rack__table tbody tr", function(e) {
  if (!$(this).hasClass("selected-record")) {
      $(this).parent().find("tr").removeClass("selected-record");
      $(this).addClass("selected-record");
      $("#rack_select_tr").removeAttr("id");
      $(this).attr("id", "rack_select_tr");
  } else {
  }
});
$(document).on("click", "#summary_table tbody tr", function(e) {
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    $("#selected__tr").removeAttr("id");
    $(this).attr("id", "selected__tr");
  } else {
  }
  press_id = $("#selected__tr").find("td").eq(0).html();
  fileName = "./php/DailyReport3/SelData.php";
  sendData = {
    press_id: press_id,
  };
  myAjax.myAjax(fileName, sendData);
  makeDataTable($("#data__table tbody"), ajaxReturnData);
  
  fileName = "./php/DailyReport3/SelPrsData.php";
  sendData = {
    press_id: press_id,
  };
  myAjax.myAjax(fileName, sendData);
  $("#cutting_staff_id").val(ajaxReturnData[0].cutting_staff_id);
  $("#cutting_date").val(ajaxReturnData[0].cutting_date);
  $("#cutting_start").val(ajaxReturnData[0].cutting_start);
  $("#cutting_finish").val(ajaxReturnData[0].cutting_finish);
  $("#first_actual_length").val(ajaxReturnData[0].first_actual_length);

  fileName = "./php/DailyReport3/SelRack.php";
  sendData = {
    press_id: press_id,
  };
  myAjax.myAjax(fileName, sendData);
  makeDataTable($("#rack__table tbody"), ajaxReturnData);
  getNo();

  fileName = "./php/DailyReport3/SelCutPosition.php";
  sendData = {
    press_id: press_id,
  };
  myAjax.myAjax(fileName, sendData);

  $("#production_length").val(ajaxReturnData[0].production_length);
  $("#h").val(ajaxReturnData[0].h);
  $("#a").val(ajaxReturnData[0].a);
  $("#b").val(ajaxReturnData[0].b);
  $("#c").val(ajaxReturnData[0].c);
  $("#d").val(ajaxReturnData[0].d);
  $("#e").val(ajaxReturnData[0].e);
  $("#f").val(ajaxReturnData[0].f);
  $("#end").val(ajaxReturnData[0].end);
  
  fileName = "./php/DailyReport3/SelCutMN.php";
  sendData = {
    dies_id: $("#selected__tr").find("td").eq(2).html(),
  };
  myAjax.myAjax(fileName, sendData);

  $("#mn").val(ajaxReturnData[0].mn);
});

$(document).on("keyup", "#work_length", function() {
  if ((5 < $(this).val()) && 60 > $(this).val())
      $(this).removeClass("no-input").addClass("complete-input");
  else $(this).removeClass("complete-input").addClass("no-input");
  addCheck();
});

$(document).on("keyup", "#no", function() {
  if ((5 < $(this).val()) && 60 > $(this).val())
      $(this).removeClass("no-input").addClass("complete-input");
  else $(this).removeClass("complete-input").addClass("no-input");
  addCheck();
});

function addCheck() {
  if (($("#work_length").hasClass("no-input")) || 
      ($("#no").hasClass("no-input"))) {
      $("#add_new").prop("disabled", true);
  } else {
      $("#add_new").prop("disabled", false);
  }
};

function getNull(num) {
  if (num == 0) {
    return null;
  } else {
    return num;
  }
};

$(document).on("keyup", "#racknumber__input", function() {
  if ((0 < $(this).val()) && 300 > $(this).val())
      $(this).removeClass("no-input").addClass("complete-input");
  else $(this).removeClass("complete-input").addClass("no-input");
  addRackCheck();
});

$(document).on("keyup", "#rackqty__input", function() {
  if ((0 < $(this).val()) && 500 > $(this).val())
      $(this).removeClass("no-input").addClass("complete-input");
  else $(this).removeClass("complete-input").addClass("no-input");
  addRackCheck();
});

function addRackCheck() {
  if (($("#racknumber__input").hasClass("no-input")) || 
      ($("#rackqty__input").hasClass("no-input"))) {
      $("#add-rack__button").prop("disabled", true);
  } else {
      $("#add-rack__button").prop("disabled", false);
  }
};

$(document).on("change", ".save-data", function() {
  if ($("#summary_table tbody tr").hasClass("selected-record")) {
    fileName = "./php/DailyReport3/UpdatePrsData.php";
    sendData = {
      press_id: press_id,
      first_actual_length : $("#first_actual_length").val(),
      cutting_staff_id : $("#cutting_staff_id").val(),
      cutting_date : $("#cutting_date").val(),
      cutting_start : $("#cutting_start").val(),
      cutting_finish : $("#cutting_finish").val(),      
    };
    myAjax.myAjax(fileName, sendData);
  }
});