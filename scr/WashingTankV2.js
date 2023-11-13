var ajaxReturnData;

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
$(function() {
    makeSummaryTankTable();
    makeHistoryTankTable();
});$(function() {
    makeStaff();
});

$(function() {
    $("#save__button").prop("disabled", true);
    $("#update__button").prop("disabled", true);
    $("#test__button").remove();
    $("#delete-record__button").remove();

    var allRadios = document.getElementsByName('check_uncheck');
    var booRadio;
    var x = 0;
    for (x = 0; x < allRadios.length; x++) {
        allRadios[x].onclick = function() {
            if (booRadio == this) {
                this.checked = false;
                booRadio = null;
            } else {
                booRadio = this;
            }
        };
    }
});

const getTwoDigits = (value) => value < 10 ? `0${value}` : value;
const formatDate = (date) => {
    const hours = getTwoDigits(date.getHours());
    const mins = getTwoDigits(date.getMinutes());
    const day = getTwoDigits(date.getDate());
    const month = getTwoDigits(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${year}-${month}-${day}T${hours}:${mins}`;
}
const getYYYYmmdd = (date = new Date()) => {
    // date = new Date($("#do_sth_at").val());
    const hours = getTwoDigits(date.getHours());
    const mins = getTwoDigits(date.getMinutes());
    const day = getTwoDigits(date.getDate());
    const month = getTwoDigits(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${year}${month}${day}`;
}
const formatTime = (date) => {
    const hours = getTwoDigits(date.getHours());
    const mins = getTwoDigits(date.getMinutes());
    return `${hours}:${mins}`;
}
const date = new Date();
document.getElementById('do_sth_at').value = formatDate(date);
document.getElementById('wasshing_tank_change_at').value = formatDate(date);
document.getElementById('wasshing_shot_change_at').value = formatDate(date);

function makeSummaryTable() {
    var fileName = "./php/WashingTank/SelSummaryV2.php";
    var sendData = {
        dummy: "dummy",
    };
    myAjax.myAjax(fileName, sendData);
    fillTableBody(ajaxReturnData, $("#summary__table tbody"));
    make_action();
}
function makeHistoryTankTable() {
    var fileName = "./php/WashingTank/SelTankHistory.php";
    var sendData = {
        dummy: "dummy",
    };
    myAjax.myAjax(fileName, sendData);
    fillTableBody(ajaxReturnData, $("#washing_tank__history tbody"));
}
function makeSummaryTankTable() {
    var fileName = "./php/WashingTank/SelSummaryTank.php";
    var sendData = {
        dummy: "dummy",
    };
    myAjax.myAjax(fileName, sendData);
    fillTableBody(ajaxReturnData, $("#washing_tank__summary tbody"));
    make_actiontank();
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

function makeStaff() {
    var fileName = "./php/WashingTank/SelStaff.php";
    var sendData = {
    };
    myAjax.myAjax(fileName, sendData);
    $("#staff > option").remove();
    $("#staff").append($("<option>").val(0).html("NO select"));
    ajaxReturnData.forEach(function(value) {
        $("#staff").append(
            $("<option>").val(value["id"]).html(value["staff_name"])
        );
    });

    $("#change_staff > option").remove();
    $("#change_staff").append($("<option>").val(0).html("NO select"));
    ajaxReturnData.forEach(function(value) {
        $("#change_staff").append(
            $("<option>").val(value["id"]).html(value["staff_name"])
        );
    });

    $("#change_shot_staff > option").remove();
    $("#change_shot_staff").append($("<option>").val(0).html("NO select"));
    ajaxReturnData.forEach(function(value) {
        $("#change_shot_staff").append(
            $("<option>").val(value["id"]).html(value["staff_name"])
        );
    });
};

$(document).on("change", "#staff", function() {
    if (0 != $(this).val())
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
    go_check();
});

$(document).on("change", "#change_staff", function() {
    if (0 != $(this).val())
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
    change_check();
});

$(document).on("change", "#change_shot_staff", function() {
    if (0 != $(this).val())
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
    change_shot_check();
});

$(document).on("keyup", "#naoh_weight", function() {
    if ((20 < $(this).val()) && 450 > $(this).val())
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
    change_check();
});

$(document).on("keyup", "#glass_weight", function() {
    if ((10 <= $(this).val()) && 100 >= $(this).val())
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
    change_shot_check();
});

$(document).on("keyup", "#gluconat_weight", function() {
    if ((1 < $(this).val()) && 20 > $(this).val())
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
    change_check();
});

$(document).on("change", "#tank", function() {
    if (0 != $(this).val())
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
    go_check();
});

$(document).on("change", "#wasshing_tank", function() {
    if (0 != $(this).val())
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
    change_check();
});

$(document).on("change", "#myfile", function() {
    if ($('#myfile').get(0).files.length === 0) {
        $("#myfile").removeClass("complete-input").addClass("no-input");
    } else {
        $("#myfile").removeClass("no-input").addClass("complete-input");
    }
    go_check();
});

$(document).on("change", "input[name='check_uncheck']", function() {
    console.log(this)
    var a = $(this).val();
    if ((a == "31") || (a == "32") || (a == "7") || (a == "9")) {
        $("#note").removeClass("complete-input").addClass("no-input");
        $("#specific_value").removeClass("complete-input").addClass("no-input");
        $("#myfile").removeClass("complete-input").addClass("no-input");
    } else {
        $("#note").removeClass("no-input").addClass("complete-input");
        $("#specific_value").removeClass("no-input").addClass("complete-input");
        $("#myfile").removeClass("no-input").addClass("complete-input");
    }
    go_check();
});
$(document).on("keyup change", "#specific_value", function() {
    var a = $("#specific_value").val();
    console.log($(this).attr("type"))
    if ($(this).attr("type") == "number") {
        if ((a > 0) && (a <= 4))
            $(this).removeClass("no-input").addClass("complete-input");
        else $(this).removeClass("complete-input").addClass("no-input");
    } else if ($(this).attr("type") == "date") {
        if (a != "")
            $(this).removeClass("no-input").addClass("complete-input");
        else $(this).removeClass("complete-input").addClass("no-input");
    }
    go_check();
});
$(document).on("keyup", "#note", function() {
    if ("" != $(this).val())
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
    go_check();
});
// -------------------------   summary table tr click   -------------

$(document).on("click", "#summary__table tbody tr", function() {
    var fileName = "./php/WashingTank/SelDieHisV2.php";
    var sendData = new Object();
    if (!$(this).hasClass("selected-record")) {
        $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        $("#summary__table__selected").removeAttr("id");
        $(this).attr("id", "summary__table__selected");
        sendData = {
            targetId: $("#summary__table__selected").find("td").eq(0).html(),
        };
        myAjax.myAjax(fileName, sendData);
        console.log(ajaxReturnData[0].die_number);
        document.getElementById("sel_die_number").innerHTML = ajaxReturnData[0].die_number;
        fillTableBodyh(ajaxReturnData, $("#die__table tbody"));
    } else {
        $("#add__table tbody").append($(this).removeClass("selected-record"));
        $("#go__button").prop("disabled", false);
    }
    go_check();
    document.getElementById("file_area").innerHTML = ``;
});

// -------------------------   add__table table tr click   -------------

$(document).on("click", "#add__table tbody tr", function() {
    var sendData = new Object();
    var tableId = $(this).parent().parent().attr("id");

    if (!$(this).hasClass("selected-record")) {
        $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        $("#add__table__selected").removeAttr("id");
        $(this).attr("id", "add__table__selected");
        sendData = {
            id: $("#add__table__selected").find("td").eq(0).html(),
        };
    } else {
        $("#summary__table tbody").prepend($(this).removeClass("selected-record"));
        $("#go__button").prop("disabled", true);
    }
    go_check();
});

function go_check() {
    if (($("#add__table tbody tr").length == 0) || 
        ($("#process").val() == 0) || 
        ($("#staff").val() == 0) || 
        ($("#note").hasClass("no-input")) || 
        ($("#specific_value").hasClass("no-input")) || 
        ($("#myfile").hasClass("no-input")) || 
        ($("#tank").hasClass("no-input"))) {
        $("#go__button").prop("disabled", true);
    } else {
        $("#go__button").prop("disabled", false);
    }
};

function change_check() {
    if (($("#wasshing_tank").val() == 0) || 
        ($("#change_staff").val() == 0) ||
        ($("#naoh_weight").hasClass("no-input")) || 
        ($("#gluconat_weight").hasClass("no-input"))) {
        $("#change_tank_button").prop("disabled", true);
    } else {
        $("#change_tank_button").prop("disabled", false);
    }
};

function change_shot_check() {
    if (($("#change_shot_staff").val() == 0) ||
        ($("#glass_weight").hasClass("no-input"))) {
        $("#change_shot_button").prop("disabled", true);
    } else {
        $("#change_shot_button").prop("disabled", false);
    }
};

$(document).on("change", "#process", function() {
    if ($("#process").val() == 0) {
        $("#process").removeClass("complete-input").addClass("no-input");
        document.getElementById("status_process").innerHTML = ``;
        $("#specific_value").prop('type', 'text');
        $("#specific_value").prop("disabled", true);
    } else if ($("#process").val() == 1) {
        $("#process").removeClass("no-input").addClass("complete-input");
        document.getElementById("status_process").innerHTML = `
            <input type="radio" checked name="check_uncheck" class="radio-button" value="2" / > OK <br />
            <input type="radio" name="check_uncheck" class="radio-button" value="31" / > NG Rz/Die mark <br /> 
            <input type="radio" name="check_uncheck" class="radio-button" value="32" / > NG Kích thước <br /> 
            `;
        $("#specific_value").prop('type', 'number');
        $("#special").html("Prioritize");
        $("#specific_value").prop("disabled", false);
    } else if ($("#process").val() == 2) {
        $("#process").removeClass("no-input").addClass("complete-input");
        document.getElementById("status_process").innerHTML = `
            <input type="radio" checked name="check_uncheck" class='radio-button' value="4" />Washing <br />`;
        $("#specific_value").prop('type', 'text');
        $("#specific_value").prop("disabled", true);
        $("#special").html("Non");
    } else if ($("#process").val() == 3) {
        $("#process").removeClass("no-input").addClass("complete-input");
        document.getElementById("status_process").innerHTML = `
            <input type="radio" checked name="check_uncheck" class='radio-button' value="8" />Nitriding <br />
            <input type="radio" name="check_uncheck" class='radio-button' value="7" />Grinding <br />
            <input type="radio" name="check_uncheck" class='radio-button' value="9" />Wire cutting <br />`;
        $("#special").html("Finish");
        $("#specific_value").prop('type', 'date');
        $("#specific_value").prop("disabled", false);
    } else if ($("#process").val() == 4) {
        $("#process").removeClass("no-input").addClass("complete-input");
        document.getElementById("status_process").innerHTML = `
            <input type="radio" checked name="check_uncheck" class='radio-button' value="10" />On rack <br />`;
        $("#specific_value").prop('type', 'text');
        $("#specific_value").prop("disabled", true);
        $("#special").html("Non");
    }
    if ($("#process").val() == 2) {
        $("#tank").prop("disabled", false);
        $("#tank").removeClass("complete-input").addClass("no-input");
    } else {
        $("#tank").prop("disabled", true);
        $("#tank").val(0);
        $("#tank").removeClass("no-input").addClass("complete-input");
    }
    go_check();
});

$(document).on("click", "#go__button", function() {
    var fileName = "./php/WashingTank/InsStatusV2.php";
    var sendObj = new Object();
    $("#add__table tbody tr td:nth-child(1)").each(function(
        index,
        element
    ) {
        sendObj[index] = $(this).html();
    });
    sendObj["die_status_id"] = $('input[name="check_uncheck"]:checked').val();
    sendObj["do_sth_at"] = $("#do_sth_at").val();
    sendObj["staff"] = $("#staff").val();
    sendObj["tank"] = $("#tank").val();
    sendObj["specific_value"] = $("#specific_value").val();
    sendObj["note"] = $("#note").val();
    if (document.getElementById("myfile").files.length == 0) {
        console.log("khong co file");
        sendObj["file_url"] = 'No_image.jpg';
    } else {
        console.log("co file");
        // sendObj["file_url"] = $('#myfile')[0].files[0].name;
        sendObj["file_url"] =  getYYYYmmdd() + $('#myfile')[0].files[0].name;

        var file_data = $('#myfile').prop('files')[0];
        var form_data = new FormData();
        form_data.append('file', file_data);
        $.ajax({
            url: "./php/WashingTank/FileUpload.php",
            dataType: 'text',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
        });
    }
    console.log(sendObj);
    myAjax.myAjax(fileName, sendObj);

    $("#add__table tbody").empty();
    document.getElementById("status_process").innerHTML = ``;
    $("#go__button").prop("disabled", true);
    $("#process").removeClass("complete-input").addClass("no-input");
    $("#process").val("0");
    $("#note").val("");
    $("#myfile").val("");
    $("#specific_value").val("");
    makeSummaryTable();
    makeSummaryTankTable();
});

$(document).on("click", "#change_tank_button", function() {
    var fileName = "./php/WashingTank/InsChangeTank.php";
    var sendObj = new Object();
    sendObj["wasshing_tank"] = $("#wasshing_tank").val();
    sendObj["naoh_weight"] = $("#naoh_weight").val();
    sendObj["gluconat_weight"] = $("#gluconat_weight").val();
    sendObj["change_staff"] = $("#change_staff").val();
    sendObj["wasshing_tank_change_at"] = $("#wasshing_tank_change_at").val();

    myAjax.myAjax(fileName, sendObj);

    $("#change_tank_button").prop("disabled", true);
    $("#wasshing_tank").val("0").removeClass("complete-input").addClass("no-input");
    $("#naoh_weight").val().removeClass("complete-input").addClass("no-input");
    $("#gluconat_weight").val().removeClass("complete-input").addClass("no-input");
    $("#change_staff").val("0").removeClass("complete-input").addClass("no-input");

    makeSummaryTankTable();
    makeHistoryTankTable();
});

$(document).on("click", "#change_shot_button", function() {
    var fileName = "./php/WashingTank/InsChangeShot.php";
    var sendObj = new Object();
    sendObj["wasshing_shot"] = $("#wasshing_shot").val();
    sendObj["glass_weight"] = $("#glass_weight").val();
    sendObj["change_shot_staff"] = $("#change_shot_staff").val();
    sendObj["wasshing_shot_change_at"] = $("#wasshing_shot_change_at").val();

    myAjax.myAjax(fileName, sendObj);

    $("#change_shot_button").prop("disabled", true);
    $("#glass_weight").val("0").removeClass("complete-input").addClass("no-input");
    $("#change_shot_staff").val("0").removeClass("complete-input").addClass("no-input");

    makeSummaryTankTable();
    makeHistoryTankTable();
});

function make_action() {
    var table, tr, pr_tm, sta_val, txt_pr_tm, txt_sta_val, i;
    var W1P1 =[];
    table = document.getElementById("summary__table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        die_id = tr[i].getElementsByTagName("td")[0];
        pr_tm = tr[i].getElementsByTagName("td")[2];
        sta_val = tr[i].getElementsByTagName("td")[4];
        if (pr_tm) {
            txt_die_id = Number(die_id.innerText.replace(",", ""));
            txt_pr_tm = Number(pr_tm.innerText.replace(",", ""));
            txt_sta_val = Number(sta_val.innerText.replace(",", ""));
            table.rows[i].insertCell(9);
            if (((txt_pr_tm >= 1) && (W1P1.includes(txt_die_id))) || 
                (txt_pr_tm >= 2)||(txt_sta_val == 3)) {
                table.rows[i].cells[9].innerHTML = "Need wash";
                table.rows[i].cells[9].style.backgroundColor = "#ffc880";
                
            } else if ((txt_sta_val == 31)||(txt_sta_val == 32)) {
                table.rows[i].cells[9].innerHTML = "Need wash";
                table.rows[i].cells[9].style.backgroundColor = "#ffc880";

            } else if (txt_sta_val == 1) {
                table.rows[i].cells[9].innerHTML = "Wait result";
                table.rows[i].cells[9].style.backgroundColor = "#bff542";

            } else if (((txt_sta_val == 2) && (txt_pr_tm <= 1)) ||
                    ((txt_sta_val == 10) || (txt_sta_val == 2 ||(txt_sta_val == 11)))) {
                table.rows[i].cells[9].innerHTML = "Ready press";
                table.rows[i].cells[9].style.backgroundColor = "#b3ffe4";

            } else if ((txt_sta_val == 4)) {
                table.rows[i].cells[9].innerHTML = "Washing";
                table.rows[i].cells[9].style.backgroundColor = "#bfc1ff"

            } else if ((txt_sta_val == 5) || (txt_sta_val == 6)) {
                table.rows[i].cells[9].innerHTML = "Cleaning";
                table.rows[i].cells[9].style.backgroundColor = "#bfc1ff"

            } else if ((txt_sta_val == 7) || (txt_sta_val == 8) ||
                    (txt_sta_val == 9)) {
                table.rows[i].cells[9].innerHTML = "Fixing";
                table.rows[i].cells[9].style.backgroundColor = "red"
            }
        }
    }
};

function make_actiontank() {
    var table, tr, vvv, ww, i;
    table = document.getElementById("washing_tank__summary");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        vvv = tr[i].getElementsByTagName("td")[4];
        ww = tr[i].getElementsByTagName("td")[5];
        if (vvv) {
            ww = Number(ww.innerText.replace(",", ""));
            vvv = Number(vvv.innerText.replace(",", ""));
            if (ww*4700/250 < vvv) {
                console.log(ww*4700/250, vvv)
                table.rows[i].style.backgroundColor = "red";
            }
        }
    }
};

function fillTableBodyh(data, tbodyDom) {
    $(tbodyDom).empty();
    data.forEach(function(trVal) {
        let newTr = $("<tr>");
        Object.keys(trVal).forEach(function(tdVal, index) {
            $("<td>").html(trVal[tdVal]).appendTo(newTr);
        });
        $(newTr).appendTo(tbodyDom);
    });
}

$(document).on("click", "#die__table tbody tr", function() {
    var fileName = "./php/WashingTank/SelSelFile.php";
    var sendData = new Object();
    document.getElementById("file_area").innerHTML = ``;
    if (!$(this).hasClass("selected-record")) {
        $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        $("#die__table__selected").removeAttr("id");
        $(this).attr("id", "die__table__selected");
        sendData = {
            targetId: $("#die__table__selected").find("td").eq(0).html(),
        };
        myAjax.myAjax(fileName, sendData);

        var filename = ajaxReturnData[0].file_url;
        var fileType = filename.substr(filename.lastIndexOf(".") + 1, 3);
        if (filename.length !== 0) {
            switch (fileType) {
                case "pdf":
                case "PDF":
                    $("<object>")
                        .attr(
                            "data",
                            "../upload/DieHistory/" + filename + "#toolbar=0&navpanes=0")
                        .attr("type", "application/pdf")
                        .appendTo("#file_area");
                    break;
                case "jpe":
                case "JPE":
                case "jpg":
                case "JPG":
                case "png":
                case "PNG":
                    $("<object>")
                        .attr("data", "../upload/DieHistory/" + filename)
                        .attr("type", "image/jpeg")
                        .appendTo("#file_area");
                    break;
            }
        } else if (filename === null) {
            document.getElementById("file_area").innerHTML = ``;
        }
    } else {
        $(this).removeClass("selected-record");
        document.getElementById("file_area").innerHTML = ``;
    }
});

function timkiemkhuon() {
    var input, table, tr, td, td1, td2, filter, i, txtdata, txtdata1, txtdata2, txtdata3;
    input = document.getElementById("die_number__input");
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