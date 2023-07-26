let ajaxReturnData;
let press_id;

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
});

$(document).on("change", "#dcyc", function () {
    if ($(this).val() != 0)
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("change", "#ght", function () {
    if ($(this).val() != 0)
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("change", "#ghd", function () {
    if ($(this).val() != 0)
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("change", "#hardness__date", function() {
    if (press_id) {
        var fileName = "./php/HardNess/InsHardNessDate.php";
        var sendData = {
            press_id : press_id,
            hardness__date: $("#hardness__date").val(),
        };
        console.log(sendData);
        myAjax.myAjax(fileName, sendData);
        $("#hardness__date").addClass("complete-input").removeClass("no-input");
    }
});

function makeSummaryTable() {
    var fileName = "./php/HardNess/SelSummary.php";
    var sendData = {
        dummy: "dummy",
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

function makeDataTable(targetDom, ajaxReturnData) {
    $("#data__table tbody tr").remove();
    ajaxReturnData.forEach(function(trVal) {
        var newTr = $("<tr>");
        Object.keys(trVal).forEach(function(tdVal) {
            if (tdVal == "position" || tdVal == "id") {
                $("<td>").html(trVal[tdVal]).appendTo(newTr);
            } else {
                $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
            }
        });
        $(newTr).appendTo(targetDom);
    });
};

function makeNgCodeOptionDom(seletedId) {
    let targetDom = $("<select>");

    var ngcode=[
        {
            "id": 33,
            "quality_code": ""
        },
        {
            "id": 0,
            "quality_code": "OK"
        },
        {
            "id": 1,
            "quality_code": "NG"
        }
    ]

    ngcode.forEach(function(element) {
        if (element["id"] == seletedId) {
            $("<option>")
                .html(element["quality_code"])
                .val(element["id"])
                .prop("selected", true)
                .appendTo(targetDom);
        } else {
            $("<option>")
                .html(element["quality_code"])
                .val(element["id"])
                .appendTo(targetDom);
        }
    });
    return targetDom;
};

function makeJugCodeOptionDom(seletedId) {
    let targetDom = $("<select>");

    var jugcode=[
        {
            "id": 1,
            "jug": "OK"
        },
        {
            "id": 2,
            "jug": "NG"
        },
        {
            "id": 3,
            "jug": ""
        }
    ]

    jugcode.forEach(function(element) {
        if (element["id"] == seletedId) {
            $("<option>")
                .html(element["jug"])
                .val(element["id"])
                .prop("selected", true)
                .appendTo(targetDom);
        } else {
            $("<option>")
                .html(element["jug"])
                .val(element["id"])
                .appendTo(targetDom);
        }
    });
    return targetDom;
};

$(document).on("change", "#data__table tbody td", function() {
    var table, tr, td, i, j, txtdata;
    table = document.getElementById("data__table");
    tr = table.getElementsByTagName("tr");
    for (j = 0; j < 12; j++) {
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[j];
        td1 = tr[i].getElementsByTagName("td")[j+1];
        if (td) {
            txtdata = $(td).find("select").find("option:selected").text();
            if (txtdata == "NG") {
                $(td).find("select").css("background-color", "red");
                $(td1).find("select").css("background-color", "red");
            } else if (txtdata == "OK") {
                $(td).find("select").css("background-color", "white");
                $(td1).find("select").css("background-color", "white");
            // } else if (txtdata != 0 && txtdata != "OK") {
            //     $(td).find("select").css("background-color", "orange");
            }
        }
      }
    }
});

$(document).on("click", "#save__button", function() {
    var fileName = "./php/HardNess/InsHardness.php";

    tableData = getTableDataInput($("#data__table tbody tr"))
    console.log(tableData);
    jsonData = JSON.stringify(tableData);
    
    var sendData = {
        data : jsonData,
        press_id : press_id,
        hardness_finish : $("#hardness_finish").val(),
    };
    console.log(sendData);
    myAjax.myAjax(fileName, sendData);

    var fileName = "./php/HardNess/SelData.php";
    var sendData = {
        press_id: press_id,
    };
    myAjax.myAjax(fileName, sendData);
    if (ajaxReturnData.length==0) {
        console.log("Chưa có dữ liệu");
        $("#confirm").html("Chưa lưu dữ liệu");
        $("#save__button").prop("disabled", false);
    } else {
        console.log("Đã lưu dữ liệu");
        $("#confirm").html("Đã lưu dữ liệu");
        $("#save__button").prop("disabled", true);
        makeDataTable($("#data__table"), ajaxReturnData);
    }
    // var fileName = "./php/HardNess/SelFinish.php";
    // var sendData = {
    //     press_id: press_id,
    // };
    // myAjax.myAjax(fileName, sendData);
    // $("#hardness_finish").val(ajaxReturnData[0].hardness_finish);
    color();
    makeSummaryTable();

});

function makeNgCodeOptionDom(seletedId) {
    let targetDom = $("<select>");

    var ngcode=[
        {
            "id": 0,
            "hardness_finish": "Chưa HT"
        },
        {
            "id": 1,
            "hardness_finish": "Đã HT"
        },
    ]
    ngcode.forEach(function(element) {
        if (element["id"] == seletedId) {
            $("<option>")
                .html(element["hardness_finish"])
                .val(element["id"])
                .prop("selected", true)
                .appendTo(targetDom);
        } else {
            $("<option>")
                .html(element["hardness_finish"])
                .val(element["id"])
                .appendTo(targetDom);
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
    fileName = "./php/HardNess/UpdateHardness.php";
    sendData = {
      id: $("#data_select_tr td:nth-child(2)").html(),
      new_1_data : $("#data_select_tr td:nth-child(3) input").val(),
      new_2_data : $("#data_select_tr td:nth-child(4) input").val(),
      new_3_data : $("#data_select_tr td:nth-child(5) input").val(),
      new_4_data : $("#data_select_tr td:nth-child(6) input").val(),
      new_5_data : $("#data_select_tr td:nth-child(7) input").val(),
      new_6_data : $("#data_select_tr td:nth-child(8) input").val(),
      new_7_data : $("#data_select_tr td:nth-child(9) input").val(),
      new_8_data : $("#data_select_tr td:nth-child(10) input").val(),
      new_9_data : $("#data_select_tr td:nth-child(11) input").val(),
      new_10_data : $("#data_select_tr td:nth-child(12) input").val(),
    };
    console.log(sendData);
    myAjax.myAjax(fileName, sendData);
});

$(document).on("click", "#add_new", function () {
    let sendData = new Object();
    let fileName;
    fileName = "./php/HardNess/AddNewHardness.php";
    sendData = {
      id: press_id,
      new_pos : $("#new_pos").val(),
      new_1_data : $("#new_1_data").val(),
      new_2_data : $("#new_2_data").val(),
      new_3_data : $("#new_3_data").val(),
      new_4_data : $("#new_4_data").val(),
      new_5_data : $("#new_5_data").val(),
      new_6_data : $("#new_6_data").val(),
      new_7_data : $("#new_7_data").val(),
      new_8_data : $("#new_8_data").val(),
      new_9_data : $("#new_9_data").val(),
      new_10_data : $("#new_10_data").val(),
    };
    console.log(sendData);
    myAjax.myAjax(fileName, sendData);

    fileName = "./php/HardNess/SelData.php";
    sendData = {
        press_id: press_id,
    };
    myAjax.myAjax(fileName, sendData);
    if (ajaxReturnData.length==0) {
        $("#confirm").html("Chưa lưu dữ liệu");
        $("#save__button").prop("disabled", false);
    } else {
        $("#confirm").html("Đã lưu dữ liệu");
        $("#save__button").prop("disabled", true);
        makeDataTable($("#data__table"), ajaxReturnData);
    }
    jugment();
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
        $("#hardness__date").val("").addClass("no-input").removeClass("complete-input");
        var fileName = "./php/HardNess/SelSide.php";
        var sendData = {
            dies_id: $("#selected__tr").find("td").eq(2).html(),
        };
        myAjax.myAjax(fileName, sendData);
        // $("#table_headder").html($("#selected__tr").find("td").eq(3).html()+" ("+$("#selected__tr").find("td").eq(1).html()+")");
        let h = ajaxReturnData[0].hole; 
        let n = ajaxReturnData[0].n; 
        let m = ajaxReturnData[0].m; 
        press_id = $("#selected__tr").find("td").eq(0).html();
        var fileName = "./php/HardNess/SelPressDataV2.php";
        var sendData = {
            // press_date: $("#selected__tr").find("td").eq(1).html(),
            // dies_id: $("#selected__tr").find("td").eq(2).html(),
            press_id: press_id,
        };
        myAjax.myAjax(fileName, sendData);
        if (ajaxReturnData[0].hardness_check_date!=null) {
            $("#hardness__date").val(ajaxReturnData[0]["hardness_check_date"]).removeClass("no-input").addClass("complete-input");
        }
        // press_id = $("#selected__tr").find("td").eq(0).html();
        let a = ajaxReturnData[0]["actual_billet_quantities"];
    
        var fileName = "./php/HardNess/SelExist.php";
        var sendData = {
            press_id: press_id,
        };
        myAjax.myAjax(fileName, sendData);
        // console.log(ajaxReturnData[0].exist);
    
        $("#data__table tbody tr").remove();
        for (i = 0; i < Math.ceil(a * 2 * m * h); ++i) {
            let trDom = $("<tr>");
            if (n==1){
				if (i%2==0){trDom.append($("<td>").html(Math.ceil((i-n)/(2*n) + 1) + "H"));}
				else {trDom.append($("<td>").html(Math.ceil((i-n)/(2*n) + 1) + "E"));}
			} else if (n==2){
				if (i%4==0){trDom.append($("<td>").html( Math.ceil((i-n-1)/(2*n) + 1) + "H"));}
				else if (i%4==1) {trDom.append($("<td>").html( Math.ceil((i-n-1)/(2*n) + 1) + "A"));}
				else if (i%4==2) {trDom.append($("<td>").html( Math.ceil((i-n-1)/(2*n) + 1) + "B"));}
				else {trDom.append($("<td>").html( Math.ceil((i-n-1)/(2*n) + 1) + "E"));}
			} else if (n==3){
				if (i%6==0){ trDom.append($("<td>").html( Math.ceil((i-n-2)/(2*n) + 1) + "H")); }
				else if (i%6==1) { trDom.append($("<td>").html( Math.ceil((i-n-2)/(2*n) + 1) + "A")); }
				else if (i%6==2) { trDom.append($("<td>").html( Math.ceil((i-n-2)/(2*n) + 1) + "B")); }
				else if (i%6==3) { trDom.append($("<td>").html( Math.ceil((i-n-2)/(2*n) + 1) + "C")); }
				else if (i%6==4) { trDom.append($("<td>").html( Math.ceil((i-n-2)/(2*n) + 1) + "D")); }
				else { trDom.append($("<td>").html( Math.ceil((i-n-2)/(2*n) + 1) + "E")); }
			} else if (n==4){
				if (i%8==0){ trDom.append($("<td>").html( Math.ceil((i-n-3)/(2*n) + 1) + "H")); }
				else if (i%8==1) { trDom.append($("<td>").html( Math.ceil((i-n-3)/(2*n) + 1) + "A")); }
				else if (i%8==2) { trDom.append($("<td>").html( Math.ceil((i-n-3)/(2*n) + 1) + "B")); }
				else if (i%8==3) { trDom.append($("<td>").html( Math.ceil((i-n-3)/(2*n) + 1) + "C")); }
				else if (i%8==4) { trDom.append($("<td>").html( Math.ceil((i-n-3)/(2*n) + 1) + "D")); }
				else if (i%8==5) { trDom.append($("<td>").html( Math.ceil((i-n-3)/(2*n) + 1) + "E")); }
				else if (i%8==6) { trDom.append($("<td>").html( Math.ceil((i-n-3)/(2*n) + 1) + "F")); }
				else { trDom.append($("<td>").html( Math.ceil((i-n-3)/(2*n) + 1) + "END")); }
			} else if (n==5){
				if (i%10==0){ trDom.append($("<td>").html( Math.ceil((i-n-4)/(2*n) + 1) + "H")); }
				else if (i%10==1) { trDom.append($("<td>").html( Math.ceil((i-n-4)/(2*n) + 1) + "A")); }
				else if (i%10==2) { trDom.append($("<td>").html( Math.ceil((i-n-4)/(2*n) + 1) + "B")); }
				else if (i%10==3) { trDom.append($("<td>").html( Math.ceil((i-n-4)/(2*n) + 1) + "C")); }
				else if (i%10==4) { trDom.append($("<td>").html( Math.ceil((i-n-4)/(2*n) + 1) + "D")); }
				else if (i%10==5) { trDom.append($("<td>").html( Math.ceil((i-n-4)/(2*n) + 1) + "E")); }
				else if (i%10==6) { trDom.append($("<td>").html( Math.ceil((i-n-4)/(2*n) + 1) + "F")); }
				else if (i%10==7) { trDom.append($("<td>").html( Math.ceil((i-n-4)/(2*n) + 1) + "I")); }
				else if (i%10==8) { trDom.append($("<td>").html( Math.ceil((i-n-4)/(2*n) + 1) + "K")); }
				else { trDom.append($("<td>").html( Math.ceil((i-n-4)/(2*n) + 1) + "END")); }
			} else if (n==6){
				if (i%12==0){ trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "H")); }
				else if (i%12==1) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "A")); }
				else if (i%12==2) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "B")); }
				else if (i%12==3) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "C")); }
				else if (i%12==4) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "D")); }
				else if (i%12==5) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "E")); }
				else if (i%12==6) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "F")); }
				else if (i%12==7) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "F")); }
				else if (i%12==8) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "I")); }
				else if (i%12==9) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "K")); }
				else if (i%12==10) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "L")); }
				else if (i%12==11) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "M")); }
				else { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "END")); }
			}
            for (j = 0; j < 11; ++j) {
            let tdDom;
            if (j==0) {
                trDom.append($("<td>").html(""));
            } else if (j%2==1) {
                tdDom = $("<td>").append($("<input>").addClass("need-clear"));
            // } else if (j==2){
            //     tdDom = $("<td>");
                // tdDom = $("<td>").append($("<select>").append(
                //     $("<option>").val(33).html(""),
                //     $("<option>").val(11).html("OK"),
                //     $("<option>").val(19).html("NG")
                // ).addClass("need-clear"));
            } else {
                // tdDom = $("<td>");
                tdDom = $("<td>").append($("<input>").addClass("need-clear"));
            }
            trDom.append(tdDom);
            }
            trDom.appendTo("#data__table");
        }
    
        var fileName = "./php/HardNess/SelData.php";
        var sendData = {
            press_id: press_id,
        };
        myAjax.myAjax(fileName, sendData);
        if (ajaxReturnData.length==0) {
            $("#confirm").html("Chưa lưu dữ liệu");
            $("#save__button").prop("disabled", false);
            $("#skip").prop("disabled", false);
            $("#add_new").prop("disabled", true);
            $("#jugmm").prop("disabled", true);
        } else {
            $("#confirm").html("Đã lưu dữ liệu");
            $("#save__button").prop("disabled", true);
            $("#skip").prop("disabled", true);
            $("#add_new").prop("disabled", false);
            $("#jugmm").prop("disabled", false);
            makeDataTable($("#data__table"), ajaxReturnData);
        }

        var fileName = "./php/HardNess/SelHardNess.php";
        var sendData = {
            dies_id: $("#selected__tr").find("td").eq(2).html(),
        };
        myAjax.myAjax(fileName, sendData);
        $("#dcyc").val(ajaxReturnData[0].hardness).removeClass("no-input").addClass("complete-input");

        var fileName = "./php/HardNess/SelFinish.php";
        var sendData = {
            press_id: press_id,
        };
        myAjax.myAjax(fileName, sendData);
        if (ajaxReturnData.length==0) {
            $("#hardness_finish").val(0);
        } else {
            $("#hardness_finish").val(ajaxReturnData[0].hardness_finish);
        }
    } else {

    }
});

$(document).on("change", "#hardness_finish", function() {
    var fileName = "./php/HardNess/UpdateFinish.php";
    var sendData = {
        press_id: press_id,
        hardness_finish: $("#hardness_finish").val(),
    };
    myAjax.myAjax(fileName, sendData);
});

$(document).on("click", "#jugmm", function(e) {
    var fileName = "./php/HardNess/SelData.php";
    var sendData = {
        press_id: press_id,
    };
    myAjax.myAjax(fileName, sendData);
    makeDataTable($("#data__table"), ajaxReturnData);
    jugment();
});

function timkiem() {
    var input, table, tr, td, td1, td2, filter, i, txtdata, txtdata1, txtdata2, txtdata3;
    input = document.getElementById("die_number__input");
    filter = input.value.toUpperCase();
    table = document.getElementById("summary_table");
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
};

function jugment() {
    var table, tr, td, i, j, txtdata, tt=0, avr=0, co=0;
    table = document.getElementById("data__table");
    tr = table.getElementsByTagName("tr");
    // var max = Number($("#ght").val()) + Number($("#dcyc").val());
    var min = Number($("#dcyc").val()) - 0.5;
    console.log(min);
      for (i = 1; i < tr.length; i++) {
        avr = 0;
        co=0;
        tt=0;
        for (j = 2; j < 12; ++j) {
            td = tr[i].getElementsByTagName("td")[j];
            if (td) {
                txtdata = Number(td.getElementsByTagName("input")[0].value);
                tt+=txtdata;
                if (txtdata != 0) {
                    co+=1;
                }
            }
        }
        avr = tt/co;
        console.log(avr);
        table.rows[i].insertCell(12);
        table.rows[i].cells[12].innerHTML = roundUp(avr, 1);
        if (avr < min) {
            // table.rows[i].cells[12].innerHTML = "NG";
            table.rows[i].style.backgroundColor = "red";
        } else {
            // table.rows[i].cells[12].innerHTML = "OK";
            table.rows[i].style.backgroundColor = "white";
        }
    }
};

function roundUp(num, precision) {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
}
$(document).on("click", "#skip", function(e) {
    skip();
});
function skip() {
    var table, tr, td, i, j, txtdata;
    table = document.getElementById("data__table");
    tr = table.getElementsByTagName("tr");
    var min = Number($("#dcyc").val());
      for (i = 1; i < tr.length; i++) {
        for (j = 2; j < 12; ++j) {
            td = tr[i].getElementsByTagName("td")[j];
            if (td) {
                td.innerHTML = min;
            }
        }
    }
};

$(document).on("click", "#download_excel", function() {
    console.log(1111111)
    ajaxMakeDlFile($("#selected__tr").find("td").eq(1).html()+"-"+$("#selected__tr").find("td").eq(3).html());
});

function ajaxMakeDlFile(phpFileName) {
$.ajax({
        type: "POST",
        url: "./php/DownLoad/" + "Hardness" + ".php",
        dataType: "json",
        data: {
            file_name: phpFileName,
            press_id : press_id
        },
    })
    .done(function(data) {
        downloadFile(phpFileName + ".csv");
    })
    .fail(function(data) {
        alert("call php program error 255");
    });
}

function downloadFile(downloadFileName) {
const a = document.createElement("a");
document.body.appendChild(a);
a.download = downloadFileName;
a.href = "./download/" + downloadFileName;

a.click();
a.remove();
}
