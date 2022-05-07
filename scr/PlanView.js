let ajaxReturnData;
let ajaxReturnData1;
let ajaxReturnData2;
const getTwoDigits = (value) => value < 10 ? `0${value}` : value;

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
  $("#delete_plan").prop("disabled", true);
  // die_ins();
});

$(function() {
  var now = new Date();
  var MonthLastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  // var MonthFirstDate = new Date(now.getFullYear() - (now.getMonth() > 0 ? 0 : 1), (now.getMonth() + 12) % 12, 1);
  var MonthFirstDate = new Date(now.getFullYear(), (now.getMonth() + 12) % 12, 1);
  var formatDateComponent = function(dateComponent) {
    return (dateComponent < 10 ? '0' : '') + dateComponent;
  };

  var formatDate = function(date) {
    return date.getFullYear()  + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate()) ;
  };

  var a = formatDate(MonthFirstDate);
  var b = formatDate(MonthLastDate);

  $("#std").val(a);
  $("#end").val(b);
});

function round(num, decimalPlaces = 0) {
  num = Math.round(num + "e" + decimalPlaces);
  return Number(num + "e" + -decimalPlaces);
}

function makeSummaryTable() {
    var fileName = "./php/PlanView/SelSummaryFullDieid.php";
    var sendObj = new Object();
    sendObj["start_s"] = $('#std').val();
    sendObj["end_s"] = $("#end").val();
    myAjax.myAjax(fileName, sendObj);
    fillTableBody1(ajaxReturnData, $("#summary__table tbody"));
}

function fillTableBody(data, tbodyDom) {
  $(tbodyDom).empty();
    data.forEach(function(trVal) {
      var newTr = $("<tr>");
      Object.keys(trVal).forEach(function(tdVal) {
          if (tdVal == "idd" && (trVal+1).idd==tdVal.idd)  {
            $("<td>").html(trVal[tdVal]).appendTo(newTr);
            $("<td>").html((trVal+1)[tdVal]).appendTo(newTr);
          } else {
              $("<td>").html(trVal[tdVal]).appendTo(newTr);
          }
      });
      $(newTr).appendTo(tbodyDom);
  });
}
function fillTableBody1(data, tbodyDom) {
  $(tbodyDom).empty();
// loop through the data and append a row to the table body if idd of this row = idd of the next row then append this row and next row to table
  for (var i = 0; i < data.length; i++) {
    var newTr = $("<tr>");
    var newTrr = $("<tr>");
    // Object.keys(data[i]).forEach(function(tdVal) {
      if ((data[i]).idd==data[i+1].idd) {
        // for (var m = 0;m< Object.keys(data[i]).length; m++) {
        //   $("<td>").html(data[i][m]).appendTo(newTr);
        // }
        // for (var n = 0;n< data[i+1].length; n++) {
        //   $("<td>").html(data[i+1][n]).appendTo(newTr);
        // }

        for (const a in data[i]) {
          $("<td>").html(data[i][a]).appendTo(newTr);
        }
        for (const a in data[i+1]) {
          $("<td>").html(data[i+1][a]).appendTo(newTrr);
        }

        i++;
      } else {
        // for (var l = 0;l< Object.keys(data[i]).length; l++) {
        //   $("<td>").html(data[i][l]).appendTo(newTr);
        // }
      }
    // });
    $(newTr).appendTo(tbodyDom);
    $(newTrr).appendTo(tbodyDom);
  }

  //   data.forEach(function(trVal) {
  //     var newTr = $("<tr>");
  //     Object.keys(trVal).forEach(function(tdVal) {
  //         if (tdVal == "idd" && (trVal+1).idd==tdVal.idd)  {
  //           $("<td>").html(trVal[tdVal]).appendTo(newTr);
  //           $("<td>").html((trVal+1)[tdVal]).appendTo(newTr);
  //         } else {
  //             $("<td>").html(trVal[tdVal]).appendTo(newTr);
  //         }
  //     });
  //     $(newTr).appendTo(tbodyDom);
  // });
}

// ==============  summary table ====================
$(document).on("click", "#summary__table tbody tr", function(e) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
});

$(document).on("click", "#summary__table tbody td", function(e) {
    // var table = document.getElementById("summary__table");
    // var tr = table.getElementsByTagName("tr");
    // var year_s = tr[1].getElementsByTagName("th")[this.cellIndex];
    // var month_s = tr[3].getElementsByTagName("th")[this.cellIndex];
    // var date_s = tr[4].getElementsByTagName("th")[this.cellIndex];
    // var die_id  = this.parentNode.cells[1];
    // var die__id = Number($(die_id).text());
    // console.log([Number($(die_id).text()), Number($(date_s).text()),
    //   Number($(month_s).text()), Number($(year_s).text())]);
    // var date_full = ($(year_s).text()) +'-' + getTwoDigits($(month_s).text()) + '-' + getTwoDigits($(date_s).text());
    // console.log(date_full)
  if (!$(this).hasClass("active")) {
    $("td").removeClass("active");
    $(this).addClass("active");
  } else {
    $("td").removeClass("active");
    // $("#die__select").val(die__id).change();
    // $("#press__date").val(date_full);
    // $("#press__date").removeClass("no-input").addClass("complete-input");
  }
});

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
    var r_year = "<tr> <th rowspan='4' style ='width: 150px;'>Production number</th> ";
    var r_year1 = "<tr style='display:none;'><th style='display:none;'></th><th style='display:none;'></th>";
    var daysInYear = 0;

    var c_month = start.getMonth();
    var r_month = "<tr>";
    var r_month1 = "<tr style='display:none;'><th style='display:none;'></th><th style='display:none;'></th>";
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
            // r_month1 += '<th>' + months[c_month] + '</th>';
            c_month = start.getMonth();
            daysInMonth = 0;
        }
        daysInMonth++;

        r_days += '<th>' + start.getDate() + '</th>';
        r_days2 += '<th>' + weekday[start.getDay()] + '</th>';
        r_month1 += '<th>' + months[c_month] + '</th>';
        r_year1 += '<th>' + c_year + '</th>';
    }
    r_days += "</tr>";
    r_days2 += "</tr>";
    r_year += '<th colspan="' + (daysInYear) + '">' + c_year + '</th>';
    r_year1 += '<th>' + c_year + '</th>';
    // r_year += "<th rowspan='4' style ='width: 40px;'>Total</th><th rowspan='4' style ='width: 45px;'>Per</th></tr>";
    r_year += "</tr>";
    r_year1 += "</tr>";
    r_month += '<th colspan="' + (daysInMonth) + '">' + months[c_month] + '</th>';
    r_month1 += '<th>' + months[c_month] + '</th>';
    r_month += "</tr>";
    r_month1 += "</tr>";
    table = "<table id='summary__table'> <thead>" + r_year + r_year1 + r_month + r_month1 + r_days + "</thead> <tbody> </tbody> </table>";

    div.html(table);
}

// $(document).on("change", "#press__date", function() {
//   $(this).removeClass("no-input").addClass("complete-input");
//   check_ins();
//   check_del();
// });
// $(document).on("keyup", "#die__input", function() {
//   let fileName = "./php/PlanView/SelDieNumber.php";
//   let sendData = {
//       die_number: $(this).val() + "%",
//   };
//   myAjax.myAjax(fileName, sendData);
//   $("#number-of-die__display").html(ajaxReturnData.length);
//   $("#die__select option").remove();
//   $("#die__select").append($("<option>").val(0).html("NO select"));
//   ajaxReturnData.forEach(function(value) {
//       $("#die__select").append(
//           $("<option>").val(value["id"]).html(value["die_number"])
//       );
//   });
// });
// function die_ins() {
//   let fileName = "./php/PlanView/SelDieNumber.php";
//   let sendData = {
//       die_number: $("#die__input").val() + "%",
//   };
//   myAjax.myAjax(fileName, sendData);
//   $("#number-of-die__display").html(ajaxReturnData.length);
//   $("#die__select option").remove();
//   $("#die__select").append($("<option>").val(0).html("NO select"));
//   ajaxReturnData.forEach(function(value) {
//       $("#die__select").append(
//           $("<option>").val(value["id"]).html(value["die_number"])
//       );
//   });
// check_ins();
// check_del();
// };
// $(document).on("change", "#die__select", function() {
//   if ($(this).val() != "0") {
//     $(this).removeClass("no-input").addClass("complete-input");
// } else {
//     $(this).removeClass("complete-input").addClass("no-input");
// }
// check_ins();
// check_del();
// });
// $(document).on("keyup", "#press__qty", function() {
//   if ($(this).val() > 0) {
//     $(this).removeClass("no-input").addClass("complete-input");
// } else {
//     $(this).removeClass("complete-input").addClass("no-input");
// }
// check_ins();
// check_del();
// });

// function check_ins() {
//   $("#insert_plan").prop("disabled", true);
//   var st1 = $("#die__select").val();
//   var st2 = $("#press__date").val().length;
//   var st3 = $("#press__qty").val();

//   if(st1 !=0 && st2 !=0 &&st3 > 0){
//     $("#insert_plan").prop("disabled", false);
//   }else{
//     $("#insert_plan").prop("disabled", true);
//   }
// };

// function check_del() {
//   $("#delete_plan").prop("disabled", true);
//   var st1 = $("#die__select").val();
//   var st2 = $("#press__date").val().length;
//   var st3 = $("#press__qty").val().length;
//   if(st1 !=0 && st2 !=0 && st3 ==0 ){
//     $("#delete_plan").prop("disabled", false);
//   }else{
//     $("#delete_plan").prop("disabled", true);
//   }
// };

function Total() {
  $table1 = $('#summary__table');
  $table1.find('tbody tr').each(function(){
    var sum = 0;
    $(this).find('td').each(function(){
      if(!isNaN(Number($(this).text()))){
        sum = sum + Number($(this).text());
      }
    });
    sum = sum - Number($(this).find("td").eq(0).html())
    - Number($(this).find("td").eq(1).html());
    $(this).append('<td>'+sum+'</td>');
  });
  check_tt();
};

function check_tt() {
  var table = document.getElementById("summary__table");
  var tbody = table.getElementsByTagName("tbody")[0];
  var tr = tbody.getElementsByTagName("tr");
  var b = tr[0].cells.length - 1;
  for (i = 0; i < tr.length; i += 2) {
    var lastcol1 =tr[i].getElementsByTagName("td")[b].innerText;
    var lastcol2 =tr[i+1].getElementsByTagName("td")[b].innerText;

    if (lastcol1 != 0 || lastcol2 != 0) {
      tr[i].style.display = "";
      tr[i+1].style.display = "";
      
      if (lastcol1 == 0 && lastcol2 != 0) {
        tbody.rows[i].append('No plan');
      } else{
        var per = lastcol2/lastcol1*100;
        tbody.rows[i].append(round(per,1)+'%');
      }
    } else {
      tr[i].style.display = "none";
      tr[i+1].style.display = "none";
    }
  }
};