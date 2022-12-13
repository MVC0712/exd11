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
    makeSelStaff();
});

function makeSummaryTable() {
    var fileName = "./php/Etching/SelSummaryV3.php";
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
}
function makeSelStaff() {
    var fileName = "./php/Etching/SelStaff.php";
    var sendData = {
        dummy: "dummy",
    };
    myAjax.myAjax(fileName, sendData);
    stafSelect(ajaxReturnData, "etching_staff", 2);
    stafSelect(ajaxReturnData, "etching_check_staff", 1);
};
function stafSelect(data, dom, pos) {
    $("#" + dom + " > option").remove();
    $("#" + dom).append($("<option>").val(0).html("NO select"));
    data.forEach(function(value) {
        if (pos == 2) {
            $("#" + dom).append(
                $("<option>").val(value["id"]).html(value["staff_name"])
            );
        } else {
            if (value.position_id == 1) {
                $("#" + dom).append(
                    $("<option>").val(value["id"]).html(value["staff_name"])
                );
            }
        };
    });
};
function makeDataTable(targetDom, ajaxReturnData) {
    $("#data__table tbody tr").remove();
    ajaxReturnData.forEach(function(trVal) {
        var newTr = $("<tr>");
        Object.keys(trVal).forEach(function(tdVal) {
            if (tdVal == "Position" || tdVal == "id") {
                $("<td>").html(trVal[tdVal]).appendTo(newTr);
            } else if (tdVal == "1st_code" || tdVal == "2nd_code" || tdVal == "3rd_code" ||
                    tdVal == "4th_code" || tdVal == "5th_code") {
                $("<td>").append(makeNgCodeOptionDom(trVal[tdVal])).appendTo(newTr);
            } else if (tdVal == "1st_jug" || tdVal == "2nd_jug" || tdVal == "3rd_jug" ||
                    tdVal == "4th_jug" || tdVal == "5th_jug") {
                $("<td>")
                    .append(makeJugCodeOptionDom(trVal[tdVal]))
                    .appendTo(newTr);
            } else {
                $("<td>").html(trVal[tdVal]).appendTo(newTr);
            }
        });
        $(newTr).appendTo(targetDom);
    });
    total_code("311", "c311");
    total_code("319", "c319");
    total_code("320", "c320");
    total_code("351", "c351");
}

function makeNgCodeOptionDom(seletedId) {
    let targetDom = $("<select>");

    var ngcode=[
        {
            "id": 33,
            "quality_code": ""
        },
        {
            "id": 11,
            "quality_code": "311"
        },
        {
            "id": 19,
            "quality_code": "319"
        },
        {
            "id": 20,
            "quality_code": "320"
        },
        {
            "id": 25,
            "quality_code": "351"
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
}

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
}

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

function color() {
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
            } else if (txtdata != 0 && txtdata != "OK") {
                $(td).find("select").css("background-color", "orange");
            }
        }
      }
    }
}

$(document).on("click", "#save__button", function() {
    var fileName = "./php/Etching/InsEtchingV3.php";

    tableData = getTableDataInput($("#data__table tbody tr"))
    console.log(tableData);
    jsonData = JSON.stringify(tableData);

    var sendData = {
        data : jsonData,
        press_id : press_id,
        etching_finish : $("#etching_finish").val(),
        etching_staff : $("#etching_staff").val(),
        etching_check_staff : $("#etching_check_staff").val(),
        file_url : $("#file_url").html(),
    };
    console.log(sendData);
    myAjax.myAjax(fileName, sendData);

    var fileName = "./php/Etching/SelData.php";
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
    color();
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
            } else {
                tr.push($(this).html());
            }
        });
        tableData.push(tr);
    });
    return tableData;
};
$(document).on("click", "#data__table tbody tr", function(e) {
    if (!$(this).hasClass("selected-record")) {
        $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        $("#selected__tr").removeAttr("id");
        $(this).attr("id", "selected__tr");
    } else {

    }
    total_code("311", "c311");
    total_code("319", "c319");
    total_code("320", "c320");
    total_code("351", "c351");

});
$(document).on("change", "#data__table tbody tr select", function () {
    let sendData = new Object();
    let fileName;
    fileName = "./php/Etching/UpdateEtching.php";
    sendData = {
      id: $("#selected__tr td:nth-child(2)").html(),
      jug1 : $("#selected__tr td:nth-child(3) select").val(),
      code1 : $("#selected__tr td:nth-child(4) select").val(),
      jug2 : $("#selected__tr td:nth-child(5) select").val(),
      code2 : $("#selected__tr td:nth-child(6) select").val(),
      jug3 : $("#selected__tr td:nth-child(7) select").val(),
      code3 : $("#selected__tr td:nth-child(8) select").val(),
      jug4 : $("#selected__tr td:nth-child(9) select").val(),
      code4 : $("#selected__tr td:nth-child(10) select").val(),
      jug5 : $("#selected__tr td:nth-child(11) select").val(),
      code5 : $("#selected__tr td:nth-child(12) select").val(),
    };
    console.log(sendData);
    myAjax.myAjax(fileName, sendData);

    total_code("311", "c311");
    total_code("319", "c319");
    total_code("320", "c320");
    total_code("351", "c351");
});
$(document).on("change", "#etching__date", function() {
    var fileName = "./php/Etching/InsEtchingDate.php";
    var sendData = {
        press_id : press_id,
        etching__date: $("#etching__date").val(),
    };
    myAjax.myAjax(fileName, sendData);
    $("#etching__date").addClass("complete-input").removeClass("no-input");
});
$(document).on("change", "#etching_finish", function() {
    updateFinish();
});
$(document).on("change", "#etching_staff", function() {
    if ($(this).val() != 0) {
        $(this).removeClass("no-input").addClass("complete-input");
    } else {
        $(this).removeClass("complete-input").addClass("no-input");
    }
    updateFinish();
});
$(document).on("change", "#etching_check_staff", function() {
    if ($(this).val() != 0) {
        $(this).removeClass("no-input").addClass("complete-input");
    } else {
        $(this).removeClass("complete-input").addClass("no-input");
    }
    updateFinish();
});
$(document).on("change", "#file-upload__input", function() {
    updateFinish();
});

function updateFinish() {
    if (press_id) {
        var fileName = "./php/Etching/UpdateFinish.php";
        var sendData = {
            press_id: press_id,
            etching_finish : $("#etching_finish").val(),
            etching_staff : $("#etching_staff").val(),
            etching_check_staff : $("#etching_check_staff").val(),
            file_url : $("#file_url").html(),
        };
        myAjax.myAjax(fileName, sendData);
    }
};

function total_code(code, idcol) {
    var ttcode = $('#data__table tbody td').map(function(){
        return $(this).find("select").find("option:selected").text().split(/\W+/).filter(function(v){return v==code}).length
    }).toArray().reduce(function(p,v){return p+v});
    document.getElementById(idcol).innerHTML = ttcode;
};
$(document).on("click", "#data__table tbody tr", function(e) {
    if (!$(this).hasClass("selected-record")) {
        $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        $("#selected__tr").removeAttr("id");
        $(this).attr("id", "selected__tr");
    } else {
    }
    total_code("311", "c311");
    total_code("319", "c319");
    total_code("320", "c320");
    total_code("351", "c351");

});$(document).on("click", "#summary_table tbody tr", function(e) {
    if (!$(this).hasClass("selected-record")) {
        $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        $("#selected__tr").removeAttr("id");
        $(this).attr("id", "selected__tr");

        var fileName = "./php/Etching/SelSide.php";
        var sendData = {
            dies_id: $("#selected__tr").find("td").eq(2).html(),
        };
        myAjax.myAjax(fileName, sendData);
        $("#table_headder").html($("#selected__tr").find("td").eq(3).html()+" ("+$("#selected__tr").find("td").eq(1).html()+")");
        let h = ajaxReturnData[0].hole;
        let n = ajaxReturnData[0].n;
        let m = ajaxReturnData[0].m;
        press_id = $("#selected__tr").find("td").eq(0).html();
        var fileName = "./php/Etching/SelPressDataV2.php";
        var sendData = {
            press_id: press_id,
        };
        myAjax.myAjax(fileName, sendData);
        $("#pressing_type").val(ajaxReturnData[0]["pressing_type"]);
        $("#etching__date").val(ajaxReturnData[0]["etching_check_date"]).removeClass("no-input").addClass("complete-input");
        $("#input_billet_quantity").val(
            ajaxReturnData[0]["actual_billet_quantities"]
        );
        let a = ajaxReturnData[0]["actual_billet_quantities"];

        var fileName = "./php/Etching/SelExist.php";
        var sendData = {
            press_id: press_id,
        };
        myAjax.myAjax(fileName, sendData);
        console.log(ajaxReturnData[0].exist);

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
            for (j = 0; j < 11; ++j) {
            let tdDom;
            if (j==0) {
                trDom.append($("<td>").html(""));
            } else if (j%2==1) {
                tdDom = $("<td>").append($("<select>").append(
                    $("<option>").val(1).html("OK"),
                    $("<option>").val(2).html("NG")
                ).addClass("need-clear"));
                    if (j>2) {
                        tdDom = $("<td>").append($("<select>").append(
                            $("<option>").val(3).html(""),
                            $("<option>").val(1).html("OK"),
                            $("<option>").val(2).html("NG")
                        ).addClass("need-clear"));
                    }
            } else if (j==2){
                tdDom = $("<td>").append($("<select>").append(
                    $("<option>").val(33).html(""),
                    $("<option>").val(11).html("311"),
                    $("<option>").val(19).html("319"),
                    $("<option>").val(20).html("320"),
                    $("<option>").val(25).html("351"),
                ).addClass("need-clear"));
            } else {
                tdDom = $("<td>").append($("<select>").append(
                    $("<option>").val(33).html(""),
                    $("<option>").val(11).html("311"),
                    $("<option>").val(19).html("319"),
                    $("<option>").val(20).html("320"),
                    $("<option>").val(25).html("351"),
                ).addClass("need-clear"));
            }

            trDom.append(tdDom);
            }
            trDom.appendTo("#data__table");
        }

        var fileName = "./php/Etching/SelData.php";
        var sendData = {
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
        color();
        var fileName = "./php/Etching/SelFinish.php";
        var sendData = {
            press_id: press_id,
        };
        myAjax.myAjax(fileName, sendData);
        console.log(ajaxReturnData)
        if (ajaxReturnData.length==0) {
            $("#etching_finish").val(0);
            $("#etching_staff").val(0);
            $("#etching_check_staff").val(0);
            $("#file_url").html("No_image.jpg");
        } else {
            $("#etching_finish").val(ajaxReturnData[0].etching_finish);
            $("#etching_staff").val(ajaxReturnData[0].etching_staff).removeClass("no-input").addClass("complete-input");
            $("#etching_check_staff").val(ajaxReturnData[0].etching_check_staff).removeClass("no-input").addClass("complete-input");
            $("#file_url").html(ajaxReturnData[0].etching_file_url);
            $("#preview__button").prop("disabled", false)
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

$("input#file-upload__input").on("change", function () {
    var file = $(this).prop("files")[0];
    $("label").html(file.name);
    $("#preview__button").prop("disabled", false);
    ajaxFileUpload();
});
function ajaxFileUpload() {
    var file_data = $('#file-upload__input').prop('files')[0];
    var form_data = new FormData();
    form_data.append('file', file_data);
    $.ajax({
        url: "./php/Etching/FileUpload.php",
        dataType: 'text',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post',
    });
};
$(document).on("click", "#preview__button", function () {
    window.open("./EtchingSub.html");
});

$(document).on("click", "#print__button", function() {
    ajaxSelForExcel($("#selected__tr").find("td").eq(0).html());
});
function ajaxSelForExcel(targetId) {
    let pressLength;
    $.ajax({
        type: "POST",
        url: "./php/MakingPressDirective/SelForExcelV3.php",
        dataType: "json",
        async: false,
        data: {
            targetId: targetId,
        },
    })
    .done(function(data) {
        pressLength = calPressLength(
            data[0]["billet_size"],
            data[0]["billet_length"],
            data[0]["specific_weight"],
            data[0]["hole"]
        );
        data[0]["press_length"] = pressLength;
        ajaxPyMakeExcelFile(data);
    })
    .fail(function() {
        alert("DB connect error");
    });
}
function ajaxPyMakeExcelFile(inputData) {
    let data = new Object();
    let donwloadFileName;
    data = inputData[0];
    data["pressing_type"] = encodeURI(data["pressing_type"]);
    data["staff_name"] = encodeURI(data["staff_name"]);
    data["previous_press_note"] = encodeURI(data["previous_press_note"]);
    donwloadFileName = data["plan_date_at"] + "_" + data["die_number"] + ".xlsx";
    let JSONdata = JSON.stringify(data);
    $.ajax({
            async: false,
            url: "./py/MakingPressDirective.py",
            type: "post",
            data: JSONdata,
            dataType: "json",
        })
        .done(function(data) {
            console.log(data);
            downloadExcelFile(donwloadFileName);
        })
        .fail(function() {
            console.log("failed");
        });
}
function downloadExcelFile(donwloadFileName) {
    const a = document.createElement("a");
    document.body.appendChild(a);

    a.download = donwloadFileName;
    a.href = "../PressDIrectiveFile/" + donwloadFileName;

    a.click();
    a.remove();
}