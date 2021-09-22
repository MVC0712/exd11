let ajaxReturnData;
let ajaxReturnData1;
let ajaxReturnData2;

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
    myAjax1: function(fileName1, sendData1) {
      $.ajax({
              type: "POST",
              url: fileName1,
              dataType: "json",
              data: sendData1,
              async: false,
          })
          .done(function(data) {
              ajaxReturnData1 = data;
          })
          .fail(function() {
              alert("DB connect error");
          });
  },
  myAjax2: function(fileName2, sendData2) {
    $.ajax({
            type: "POST",
            url: fileName2,
            dataType: "json",
            data: sendData2,
            async: false,
        })
        .done(function(data) {
            ajaxReturnData2 = data;
        })
        .fail(function() {
            alert("DB connect error");
        });
  }
};

$(function() {
  $("#insert_plan").prop("disabled", true);
    makeSummaryTable();
});

function makeSummaryTable() {
    var fileName = "./php/Schedule/SelSummary.php";
    var fileName1 = "./php/Schedule/SelSummaryPrs.php";
    var fileName2 = "./php/Schedule/SelSummarySch.php";
    var sendObj = new Object();

    sendObj["start_s"] = $('#std').val();
    sendObj["end_s"] = $("#end").val();
    myAjax.myAjax(fileName, sendObj);
    myAjax.myAjax1(fileName1, sendObj);
    myAjax.myAjax2(fileName2, sendObj);

    $("#summary__table tbody").empty();
    ajaxReturnData.forEach(function(trVal) {
        var newTr = $("<tr>");
        Object.keys(trVal).forEach(function(tdVal) {
            $("<td>").html(trVal[tdVal]).appendTo(newTr);
        });
        $(newTr).appendTo("#summary__table tbody");
    });
    Total();
}

// ==============  summary table ====================
$(document).on("click", "#summary__table tbody tr", function(e) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
});

$(document).on("click", "#summary__table tbody td", function(e) {
  table = document.getElementById("summary__table");
    var table = document.getElementById("summary__table");
    var tr = table.getElementsByTagName("tr");
    var date_s = tr[2].getElementsByTagName("th")[this.cellIndex];
  var die_id  = this.parentNode.cells[1];
  console.log([Number($(die_id).text()), Number($(date_s).text())]);

  if (!$(this).hasClass("active")) {
    $("td").removeClass("active");
    $(this).addClass("active");
    } else {
      $("td").removeClass("active");
}
})

// summary_table
$(document).on("change", "#std", function() {
    renderHead($('div#table'), new Date($("#std").val()), new Date($("#end").val()));
    makeSummaryTable();
});
$(document).on("change", "#end", function() {
    renderHead($('div#table'), new Date($("#std").val()), new Date($("#end").val()));
    makeSummaryTable();
});
$(function() {
    renderHead($('div#table'), new Date($("#std").val()), new Date($("#end").val()));
    makeSummaryTable();
});

var weekday = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

function renderHead(div, start, end) {
    var c_year = start.getFullYear();
    var r_year = "<tr> <th rowspan='4' style ='width: 100px;'>Die number</th> ";
    var daysInYear = 0;

    var c_month = start.getMonth();
    var r_month = "<tr>";
    var daysInMonth = 0;

    var r_days = "<tr><th style='display:none;'></th><th style='display:none;'></th><th style='display:none;'></th>";
    var r_days2 = "<tr><th style='display:none;'></th><th style='display:none;'></th><th style='display:none;'></th>";
    for (start; start <= end; start.setDate(start.getDate() + 1)) {
        if (start.getFullYear() !== c_year) {
            r_year += '<th colspan="' + daysInYear + '">' + c_year + '</th>';
            c_year = start.getFullYear();
            daysInYear = 0;
        }
        daysInYear++;
        if (start.getMonth() !== c_month) {
            r_month += '<th colspan="' + daysInMonth + '">' + months[c_month] + '</th>';
            c_month = start.getMonth();
            daysInMonth = 0;
        }
        daysInMonth++;

        r_days += '<th>' + start.getDate() + '</th>';
        r_days2 += '<th>' + weekday[start.getDay()] + '</th>';
    }
    r_days += "</tr>";
    r_days2 += "</tr>";
    r_year += '<th colspan="' + (daysInYear) + '">' + c_year + '</th>';
    r_year += "<th rowspan='4' style ='width: 40px;'>Total</th></tr>";
    r_month += '<th colspan="' + (daysInMonth) + '">' + months[c_month] + '</th>';
    r_month += "</tr>";
    table = "<table id='summary__table'> <thead>" + r_year + r_month + r_days + r_days2 + "</thead> <tbody> </tbody> </table>";

    div.html(table);
}

// Prs date
$(document).on("change", "#press__date", function() {
  $(this).removeClass("no-input").addClass("complete-input");
  check_ins()
});

// Die input
$(document).on("keyup", "#die__input", function() {
  let fileName = "./php/Schedule/SelDieNumber.php";
  let sendData = {
      die_number: $(this).val() + "%",
  };
  myAjax.myAjax(fileName, sendData);
  $("#number-of-die__display").html(ajaxReturnData.length);
  $("#die__select option").remove();
  $("#die__select").append($("<option>").val(0).html("NO select"));
  ajaxReturnData.forEach(function(value) {
      $("#die__select").append(
          $("<option>").val(value["id"]).html(value["die_number"])
      );
  });
});

// Die select
$(document).on("change", "#die__select", function() {
  if ($(this).val() != "0") {
    $(this).removeClass("no-input").addClass("complete-input");
} else {
    $(this).removeClass("complete-input").addClass("no-input");
}
check_ins()
});

// Prs qty
$(document).on("keyup", "#press__qty", function() {
  if ($(this).val().length > 0) {
    $(this).removeClass("no-input").addClass("complete-input");
} else {
    $(this).removeClass("complete-input").addClass("no-input");
}
check_ins()
});

function check_ins() {
  $("#insert_plan").prop("disabled", true);
  var st1 = $("#die__select").val();
  var st2 = $("#press__date").val().length;
  var st3 = $("#press__qty").val();

  if(st1 !=0 && st2 !=0 &&st3 !=0){
    $("#insert_plan").prop("disabled", false);
  }else{
    $("#insert_plan").prop("disabled", true);
  }
};

$(document).on("click", "#insert_plan", function() {
  var fileName = "./php/Schedule/InsPlan.php";
  var sendObj = new Object();

  sendObj["dies_id"] = $('#die__select').val();
  sendObj["press_date"] = $("#press__date").val();
  sendObj["press_quantity"] = $("#press__qty").val();
  console.log(sendObj)
  myAjax.myAjax(fileName, sendObj);

  $("#insert_plan").prop("disabled", true);
  $("#die__input").val("");
  $("#die__select").val("");
  $("#press__date").val("");
  $("#press__qty").val("");
  makeSummaryTable();
});

function Total() {
  $table1 = jQuery('#summary__table');
  $table1.find('tbody tr').each(function(){
    var sum = 0;
    jQuery(this).find('td').each(function(){
      if(!isNaN(Number(jQuery(this).text()))){
        sum = sum + Number(jQuery(this).text());
      }
    });
    sum = sum - Number($(this).find("td").eq(0).html())
    - Number($(this).find("td").eq(1).html());
    jQuery(this).append('<td>'+sum+'</td>');
  });
};

// $('document').ready(function(){
//   $table1 = jQuery('#summary__table');
//   $table1.find('thead tr').append('<th>Total</th>');
//   $table1.find('tbody tr').each(function(){
//     var sum = 0;
//     jQuery(this).find('td').each(function(){
//       if(!isNaN(Number(jQuery(this).text()))){
//         sum = sum + Number(jQuery(this).text());
//       }
//     });
//     jQuery(this).append('<td>'+sum+'</td>');
//   });
// });