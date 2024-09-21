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
  var rowCount = $("#data__table tbody tr").length;
  $("#no").val(rowCount + 1);
};

$(document).on("keyup", "#die_number__input", function() {
    makeSummaryTable();
});

function makeSummaryTable() {
    var fileName = "./php/DailyReport2/SelSummary.php";
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
  let fileName = "./php/DailyReport2/SelStaff.php";
  let sendData = {
    name_s: "%" + inputValue + "%",
  };
  myAjax.myAjax(fileName, sendData);
  $("#name__select option").remove();
  $("#name__select").append($("<option>").val(0).html("--------------"));
  ajaxReturnData.forEach(function (value) {
    $("#name__select").append(
    $("<option>").val(value["id"]).html(value["staff_name"])
    );
  });
};

function makeDataTable(targetDom, ajaxReturnData) {
    $("#data__table tbody tr").remove();
    ajaxReturnData.forEach(function(trVal) {
        var newTr = $("<tr>");
        Object.keys(trVal).forEach(function(tdVal) {
          if (tdVal == "billet_number" || tdVal == "id") {
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
  let fileName = "./php/DailyReport2/SelStaff.php";
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
    fileName = "./php/DailyReport2/UpdateData.php";
    sendData = {
      id: $("#data_select_tr td:nth-child(1)").html(),
      work_length : $("#data_select_tr td:nth-child(3) input").val(),
      roughness : $("#data_select_tr td:nth-child(4) input").val(),
      die_mark : $("#data_select_tr td:nth-child(5) input").val(),
      staff_check_id : $("#data_select_tr td:nth-child(6) select").val(),
      result : $("#data_select_tr td:nth-child(7) select").val(),
    };
    console.log(sendData);
    myAjax.myAjax(fileName, sendData);
    
});

$(document).on("click", "#add_new", function () {
    let sendData = new Object();
    let fileName;
    fileName = "./php/DailyReport2/AddNewProfile.php";
    sendData = {
      press_id : press_id,
      billet_number : $("#no").val(),
      work_length : $("#length").val(),
      roughness : $("#rz").val(),
      die_mark : $("#die_mark").val(),
      staff_check_id : $("#name__select").val(),
      result : $("#result").val(),
    };
    console.log(sendData);
    myAjax.myAjax(fileName, sendData);

    fileName = "./php/DailyReport2/SelData.php";
    sendData = {
        press_id: press_id,
    };
    myAjax.myAjax(fileName, sendData);
    makeDataTable($("#data__table"), ajaxReturnData);
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

$(document).on("click", "#summary_table tbody tr", function(e) {
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    $("#selected__tr").removeAttr("id");
    $(this).attr("id", "selected__tr");
  } else {
  }
  press_id = $("#selected__tr").find("td").eq(0).html();
  fileName = "./php/DailyReport2/SelData.php";
  sendData = {
    press_id: press_id,
  };
  myAjax.myAjax(fileName, sendData);
  makeDataTable($("#data__table"), ajaxReturnData);
  getNo();
  addCheck();
});

$(document).on("keyup", "#length", function() {
  if ((5 < $(this).val()) && 60 > $(this).val())
      $(this).removeClass("no-input").addClass("complete-input");
  else $(this).removeClass("complete-input").addClass("no-input");
  addCheck();
});

$(document).on("keyup", "#no", function() {
  // if ((5 < $(this).val()) && 60 > $(this).val())
  //     $(this).removeClass("no-input").addClass("complete-input");
  // else $(this).removeClass("complete-input").addClass("no-input");
  addCheck();
});

function addCheck() {
  if (($("#length").hasClass("no-input")) || 
      (!($("#summary_table tbody tr").hasClass("selected-record"))) ||
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