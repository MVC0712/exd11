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

$(document).on("change", "#measurement__date", function() {
    if (press_id) {
        var fileName = "./php/Measurement/InsMeasurementDate.php";
        var sendData = {
            press_id : press_id,
            measurement__date: $("#measurement__date").val(),
        };
        console.log(sendData);
        myAjax.myAjax(fileName, sendData);
        $("#measurement__date").addClass("complete-input").removeClass("no-input");
    }
});
$(document).on("change", "#die_number__input", function() {
    makeSummaryTable();
});
function makeSummaryTable() {
    var fileName = "./php/Measurement/SelSummary.php";
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

$(document).on("click", "#save__button", function() {
    var fileName = "./php/Measurement/InsMeasurement.php";

    tableData = getTableDataInput($("#data__table tbody tr"))
    console.log(tableData);
    jsonData = JSON.stringify(tableData);
    
    var sendData = {
        data : jsonData,
        press_id : press_id,
    };
    console.log(sendData);
    myAjax.myAjax(fileName, sendData);

    var fileName = "./php/Measurement/SelData.php";
    var sendData = {
        press_id: press_id,
    };
    myAjax.myAjax(fileName, sendData);
    if (ajaxReturnData.length==0) {
        $("#save__button").prop("disabled", false);
    } else {
        $("#save__button").prop("disabled", true);
        makeDataTable($("#data__table"), ajaxReturnData);
    }
    makeSummaryTable();
});

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
    fileName = "./php/Measurement/UpdateMeasurement.php";
    sendData = {
      id: $("#data_select_tr td:nth-child(2)").html(),
      new_1_data : $("#data_select_tr td:nth-child(3) input").val(),
      new_2_data : $("#data_select_tr td:nth-child(4) input").val(),
      new_3_data : $("#data_select_tr td:nth-child(5) input").val(),
      new_4_data : $("#data_select_tr td:nth-child(6) input").val(),
      new_5_data : $("#data_select_tr td:nth-child(7) input").val(),
      new_6_data : $("#data_select_tr td:nth-child(8) input").val(),
      new_7_data : $("#data_select_tr td:nth-child(9) input").val(),
    };
    console.log(sendData);
    myAjax.myAjax(fileName, sendData);
});

$(document).on("click", "#add_new", function () {
    let sendData = new Object();
    let fileName;
    fileName = "./php/Measurement/AddNewMeasurement.php";
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
    };
    console.log(sendData);
    myAjax.myAjax(fileName, sendData);

    fileName = "./php/Measurement/SelData.php";
    sendData = {
        press_id: press_id,
    };
    myAjax.myAjax(fileName, sendData);
    if (ajaxReturnData.length==0) {
        $("#save__button").prop("disabled", false);
    } else {
        $("#save__button").prop("disabled", true);
        makeDataTable($("#data__table"), ajaxReturnData);
    }
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
        var fileName = "./php/Measurement/SelSide.php";
        var sendData = {
            dies_id: $("#selected__tr").find("td").eq(2).html(),
        };
        myAjax.myAjax(fileName, sendData);
        // $("#table_headder").html($("#selected__tr").find("td").eq(3).html()+" ("+$("#selected__tr").find("td").eq(1).html()+")");
        let h = ajaxReturnData[0].hole; 
        let n = ajaxReturnData[0].n; 
        let m = ajaxReturnData[0].m; 
        var fileName = "./php/Measurement/SelPressData.php";
        var sendData = {
            press_date: $("#selected__tr").find("td").eq(1).html(),
            dies_id: $("#selected__tr").find("td").eq(2).html(),
        };
        myAjax.myAjax(fileName, sendData);
        if (ajaxReturnData[0].hardness_check_date!=null) {
            $("#hardness__date").val(ajaxReturnData[0]["hardness_check_date"]).removeClass("no-input").addClass("complete-input");
        }
        press_id = ajaxReturnData[0]["press_id"];
        let a = ajaxReturnData[0]["actual_billet_quantities"];
    
        var fileName = "./php/Measurement/SelExist.php";
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

            }
            for (j = 0; j < 8; ++j) {
            let tdDom;
            if (j==0) {
                trDom.append($("<td>").html(""));
            } else {
                tdDom = $("<td>").append($("<input>").addClass("need-clear"));
            }
            trDom.append(tdDom);
            }
            trDom.appendTo("#data__table");
        }
        var fileName = "./php/Measurement/SelData.php";
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

        var fileName = "./php/Measurement/SelMeasurement.php";
        var sendData = {
            dies_id: $("#selected__tr").find("td").eq(2).html(),
        };
        myAjax.myAjax(fileName, sendData);
        if (ajaxReturnData.length != 0) {
            $("#rz1").html(ajaxReturnData[0].rz1);
            $("#die_mark_1").html(ajaxReturnData[0].die_mark_1);
            $("#rz2").html(ajaxReturnData[0].rz2);
            $("#die_mark_2").html(ajaxReturnData[0].die_mark_2);
            $("#rz3").html(ajaxReturnData[0].rz3);
            $("#die_mark_3").html(ajaxReturnData[0].die_mark_3);
            $("#note").html(ajaxReturnData[0].note);
        } else {
            $("#rz1").html("-");
            $("#die_mark_1").html("-");
            $("#rz2").html("-");
            $("#die_mark_2").html("-");
            $("#rz3").html("-");
            $("#die_mark_3").html("-");
            $("#note").html("-");
        }
    } else {
    }
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
function roundUp(num, precision) {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
}
