let ajaxReturnData;

const myAjax = {
  myAjax: function (fileName, sendData) {
    $.ajax({
      type: "POST",
      url: fileName,
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
  // makeNgSelect();
  $("#add__button").prop("disabled", true);
  $("#test__button").remove();
  makeSummaryTable();
  mau();
});

// ==============  die_number  ===================
$(document).on("keyup", "#die_number__input", function () {
  if (checkInput()) {
    makeTableWithTerm();
  } else {
    makeSummaryTable();
  }
  mau();
});

function makeSummaryTable() {
  var fileName = "./php/QualitySummary/SelSummaryV4.php";
  var sendData = {
    die_number: $("#die_number__input").val() + "%",
  };
  // read n
  myAjax.myAjax(fileName, sendData);
  // fill select options

  // return false;

  $("#summary__table tbody").empty();

  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("#summary__table tbody");
  });
  mau();
  ulitycall();
}

// ==============  press term  ===================
$(document).on("change", "input.date__input", function () {
  if (checkInput()) {
    // both input frame is filled?
    makeTableWithTerm();
  }
});

function makeTableWithTerm() {
  var fileName = "./php/QualitySummary/SelSummaryTermV4.php";
  var sendData = {
    die_number: $("#die_number__input").val() + "%",
    start_term: $("#start_term").val(),
    end_term: $("#end_term").val(),
  };
  myAjax.myAjax(fileName, sendData);
  console.log(ajaxReturnData);
  $("#summary__table tbody").empty();

  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("#summary__table tbody");
  });
  console.log("Term search");
  mau();
  ulitycall();
}

function checkInput() {
  let flag = false;
  // $("input.date__input").each(function() {
  //     if ($(this).val() == "") {
  //         flag = false;
  //     }
  // });

  var fr = document.getElementById("start_term").value;
  var to = document.getElementById("end_term").value;
  if (fr != "" && to != "") {
    flag = true;
  }
  console.log(flag);
  return flag;
}

// ==============  summary table ====================
$(document).on("click", "#summary__table tbody tr", function (e) {
  // tr に class を付与し、選択状態の background colorを付ける
  $(this).parent().find("tr").removeClass("selected-record");
  $(this).addClass("selected-record");
  console.log($(this).closest('tr').children('td:last').text());

  $('#spt').html($(this).closest('tr').children('td:last').text());
    $('#vll').css({
      display:  'block',
      left:  200,
      top:   e.pageY
   });

   $('#vll').css({
    // display:  'none'
 });
});

function timkiem() {
  var input, table, tr, td, filter, i, txtdata;
  input = document.getElementById("presstype");
  filter = input.value.toUpperCase();
  table = document.getElementById("summary__table");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[3];
    if (td) {
      txtdata = td.innerText;
      if (txtdata.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
  ulitycall();
}

function mau() {
  var table, tr, td, i, j, txtdata;
  table = document.getElementById("summary__table");
  tr = table.getElementsByTagName("tr");
  for (j = 10; j < 38; j++) {
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[j];
      if (td) {
        txtdata = td.innerText;
        if (txtdata > 0) {
          td.style.backgroundColor = "orange";
        }
      }
    }
  }
  timkiem();
}

function pb() {
  var tablepb, trpb, tdpb, ipb, j;
  var pb = 0;
  var txtdatapb = 0;
  tablepb = document.getElementById("summary__table");
  trpb = tablepb.getElementsByTagName("tr");
  for (ipb = 0; ipb < trpb.length; ipb++) {
    tdpb = trpb[ipb].getElementsByTagName("td")[4];
    if (tdpb) {
      txtdatapb = Number(tdpb.innerText);
      if ($(trpb[ipb]).css("display") !== "none") {
        pb += txtdatapb;
      }
    }
  }
  document.getElementById("pb").innerHTML = pb;
}

function datesearch() {
  var choice, datea, filterdt, tabledt, trdt, td9, td10, td11, td12, idt;
  var datea = document.getElementById("date").value;
  filterdt = formatDate(datea);
  choice = $("#choice").val();
  tabledt = document.getElementById("summary__table");
  trdt = tabledt.getElementsByTagName("tr");
  if (choice == 1) {
    console.log(9);
    for (idt = 0; idt < trdt.length; idt++) {
      td9 = trdt[idt].getElementsByTagName("td")[9];
      if (td9) {
        if (td9.innerHTML.toUpperCase().indexOf(filterdt) > -1) {
          trdt[idt].style.display = "";
        } else {
          trdt[idt].style.display = "none";
        }
      }
    }
  } else if (choice == 2) {
    console.log(10);
    for (idt = 0; idt < trdt.length; idt++) {
      td10 = trdt[idt].getElementsByTagName("td")[10];
      if (td10) {
        if (td10.innerHTML.toUpperCase().indexOf(filterdt) > -1) {
          trdt[idt].style.display = "";
        } else {
          trdt[idt].style.display = "none";
        }
      }
    }
  } else if (choice == 3) {
    console.log(11);
    for (idt = 0; idt < trdt.length; idt++) {
      td11 = trdt[idt].getElementsByTagName("td")[11];
      if (td11) {
        if (td11.innerHTML.toUpperCase().indexOf(filterdt) > -1) {
          trdt[idt].style.display = "";
        } else {
          trdt[idt].style.display = "none";
        }
      }
    }
  } else if (choice == 4) {
    console.log(12);
    for (idt = 0; idt < trdt.length; idt++) {
      td12 = trdt[idt].getElementsByTagName("td")[12];
      if (td12) {
        if (td12.innerHTML.toUpperCase().indexOf(filterdt) > -1) {
          trdt[idt].style.display = "";
        } else {
          trdt[idt].style.display = "none";
        }
      }
    }
  } else if (choice == 5) {
    console.log("all");
    for (idt = 0; idt < trdt.length; idt++) {
      td9 = trdt[idt].getElementsByTagName("td")[9];
      td10 = trdt[idt].getElementsByTagName("td")[10];
      td11 = trdt[idt].getElementsByTagName("td")[11];
      td12 = trdt[idt].getElementsByTagName("td")[12];
      if (td9) {
        if (
          td9.innerHTML.toUpperCase().indexOf(filterdt) > -1 ||
          td10.innerHTML.toUpperCase().indexOf(filterdt) > -1 ||
          td11.innerHTML.toUpperCase().indexOf(filterdt) > -1 ||
          td12.innerHTML.toUpperCase().indexOf(filterdt) > -1
        ) {
          trdt[idt].style.display = "";
        } else {
          trdt[idt].style.display = "none";
        }
      }
    }
  }
}

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [month, day].join("-");
}

function total_row(col, idcol) {
  var tablett, trtt, tdtt, itt, tt;
  var tt = 0;
  var txttt = 0;
  tablett = document.getElementById("summary__table");
  trtt = tablett.getElementsByTagName("tr");
  for (itt = 0; itt < trtt.length; itt++) {
    tdtt = trtt[itt].getElementsByTagName("td")[col];
    if (tdtt) {
      txttt = Number(tdtt.innerText);
      if ($(trtt[itt]).css("display") !== "none") {
        tt += txttt;
      }
    }
  }
  document.getElementById(idcol).innerHTML = tt;
}
function special_note(col) {
  var tablett, trtt, tdtt, itt;
  tablett = document.getElementById("summary__table");
  trtt = tablett.getElementsByTagName("tr");
  for (itt = 1; itt < trtt.length; itt++) {
    tdtt = trtt[itt].getElementsByTagName("td")[col];
    var aaa = tdtt.innerText;
    if (aaa != "") {
      $(trtt[itt]).css("color", "red");
    }
  }
}
function per(col) {
  var tablett, trtt, tdtt, tdtt1, itt;
  tablett = document.getElementById("summary__table");
  trtt = tablett.getElementsByTagName("tr");
  for (itt = 1; itt < trtt.length; itt++) {
    tdtt = trtt[itt].getElementsByTagName("td")[col];
    tdtt1 = trtt[itt].getElementsByTagName("td")[3];
    var aaa = tdtt.innerText;
    if ((aaa != "") && (aaa.slice(0, -1) <= 90) && (tdtt1.innerText !== "〇")) {
      $(trtt[itt]).css("background-color", "#d0ff00");
    }
  }
}
function ulitycall() {
  total_row(4, "pb");
  total_row(5, "ab");
  total_row(6, "qty");
  total_row(7, "tng");
  total_row(8, "tok");
  total_row(14, "t301");
  total_row(15, "t302");
  total_row(16, "t303");
  total_row(17, "t304");
  total_row(18, "t305");
  total_row(19, "t306");
  total_row(20, "t307");
  total_row(21, "t308");
  total_row(22, "t309");
  total_row(23, "t310");
  total_row(24, "t311");
  total_row(25, "t312");
  total_row(26, "t313");
  total_row(27, "t314");
  total_row(28, "t315");
  total_row(29, "t316");
  total_row(30, "t317");
  total_row(31, "t318");
  total_row(32, "t319");
  total_row(33, "t320");
  total_row(34, "t321");
  total_row(35, "t322");
  total_row(36, "t323");
  total_row(37, "t324");
  total_row(38, "t351");
  special_note(39);
  per(9);
}

// ==============  summary table ====================
$(document).on("click", "#quality-summary-test__button", function () {
  // button
  window.open("QualitySummaryV2.html");
  window.open("about:blank", "_self").close();
});

$( "#summary__table thead tr th" ).hover(function(e) {
    var fileName = "./php/QualitySummary/SelErrorDes.php";
    var sendData = {
      error_code : $(this).html(),
    };
    myAjax.myAjax(fileName, sendData);

    $('#vn').html(ajaxReturnData[0].description_vn + ": " + ajaxReturnData[0].note_vn);
    $('#jp').html(ajaxReturnData[0].description_jp + ": " + ajaxReturnData[0].note_jp);
    $('#desc').css({
      display:  'block',
      left:  e.pageX - 250,
      top:   e.pageY + 25
   });
  }, function() {
    $('#desc').css({
      display:  'none'
   });
  }
);