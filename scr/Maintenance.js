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
    machine();
    line();
    part();
    $("#save__button").prop("disabled", true);
    $("#update__button").prop("disabled", true);
    $("#test__button").remove();
    $("#delete-record__button").remove();
});

function makeSummaryTable() {
    var fileName = "./php/Maintenance/SelSummary.php";
    var sendData = {
        dummy: "dummy",
    };
    myAjax.myAjax(fileName, sendData);
    fillTableBody(ajaxReturnData, $("#summary__table tbody"));
    make_action()
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

function machine() {
    var fileName = "./php/Maintenance/SelMachine.php";
    var sendData = {
        dummy: "dummy",
    };
    myAjax.myAjax(fileName, sendData);
    $("#machine option").remove();
    $("#machine").append($("<option>").val(0).html("NO select"));
    ajaxReturnData.forEach(function(value) {
        $("#machine").append(
            $("<option>").val(value["id"]).html(value["machine"])
        );
    });
};

function part() {
    var fileName = "./php/Maintenance/SelPart.php";
    var sendData = {
        dummy: "dummy",
    };
    myAjax.myAjax(fileName, sendData);
    $("#part_position option").remove();
    $("#part_position").append($("<option>").val(0).html("NO select"));
    ajaxReturnData.forEach(function(value) {
        $("#part_position").append(
            $("<option>").val(value["id"]).html(value["part_position"])
        );
    });
}

function line() {
    var fileName = "./php/Maintenance/SelLine.php";
    var sendData = {
        dummy: "dummy",
    };
    myAjax.myAjax(fileName, sendData);
    $("#line option").remove();
    $("#line").append($("<option>").val(0).html("NO select"));
    ajaxReturnData.forEach(function(value) {
        $("#line").append(
            $("<option>").val(value["id"]).html(value["line"])
        );
    });
}

$(document).on("change", "#machine", function() {
    var fileName = "./php/Maintenance/SelPartPosition.php";
    var sendData = {
        machine_id: $("#machine").val()
    };
    myAjax.myAjax(fileName, sendData);
    $("#part_position option").remove();
    $("#part_position").append($("<option>").val(0).html("NO select"));
    ajaxReturnData.forEach(function(value) {
        $("#part_position").append(
            $("<option>").val(value["id"]).html(value["part_position"])
        );
    });
    if ($(this).val() != 0) {
        $(this).removeClass("no-input").addClass("complete-input");
        $("#part_position").removeClass("complete-input").addClass("no-input");
    } else {
        $(this).removeClass("complete-input").addClass("no-input");
        $("#part_position").removeClass("complete-input").addClass("no-input");
    }
    go_check();
});

$(document).on("change", "#line", function() {
    if ($(this).val() != 0) {
        $(this).removeClass("no-input").addClass("complete-input");
    } else {
        $(this).removeClass("complete-input").addClass("no-input");
    }
    go_check();
});

$(document).on("change", "#part_position", function() {
    if ($(this).val() != 0) {
        $(this).removeClass("no-input").addClass("complete-input");
    } else {
        $(this).removeClass("complete-input").addClass("no-input");
    }
    go_check();
});

// -------------------------   summary table tr click   -------------

$(document).on("click", "#summary__table tbody tr", function() {
    var fileName = "./php/Maintenance/SelSelHis.php";
    var sendData = new Object();
    if (!$(this).hasClass("selected-record")) {
        $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        $("#summary__table__selected").removeAttr("id");
        $(this).attr("id", "summary__table__selected");
        sendData = {
            targetId: $("#summary__table__selected").find("td").eq(3).html(),
        };
        myAjax.myAjax(fileName, sendData);
        document.getElementById("ma_po").innerHTML = ajaxReturnData[0].machine+"-"+ajaxReturnData[0].part_position;
        fillTableBodyh(ajaxReturnData, $("#ma__table tbody"));
    } else {
        $(this).removeClass("selected-record");
        $("#go__button").prop("disabled", false);
    }
    go_check();
    document.getElementById("file_area").innerHTML = ``;
    $("#update__button").remove();
});

function go_check() {
    if ((($("#maintenance_start").val() == "")|| 
        ($("#maintenance_finish").val() == "")||
        ($("#machine").val() == 0)||
        ($("#line").val() == 0)||
        ($("#part_position").val() == 0))) {
        $("#go__button").prop("disabled", true);
    } else {
        $("#go__button").prop("disabled", false);
    }
};

$(document).on("click", "#go__button", function() {
    var fileName = "./php/Maintenance/InsMaintenance.php";
    var sendObj = new Object();
    sendObj["maintenance_start"] =getDateTime(new Date($("#maintenance_start").val()));
    sendObj["maintenance_finish"] = getDateTime(new Date($("#maintenance_finish").val()));
    sendObj["note"] = $("#note").val();
    sendObj["line"] = $("#line").val();
    sendObj["machine"] = $("#machine").val();
    sendObj["part_position"] = $("#part_position").val();
    if (document.getElementById("myfile").files.length == 0) {
        console.log("khong co file");
        sendObj["file_url"] = 'No_image.jpg';
    } else {
        console.log("co file");
        sendObj["file_url"] = $('#myfile')[0].files[0].name;

        var file_data = $('#myfile').prop('files')[0];
        var form_data = new FormData();
        form_data.append('file', file_data);
        $.ajax({
            url: "./php/Maintenance/FileUpload.php",
            dataType: 'text',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
        });
    }
    myAjax.myAjax(fileName, sendObj);
    console.log(sendObj)

    $("#go__button").prop("disabled", true);
    $("#note").val("");
    $("#myfile").val("");
    $("#myfile").removeClass("complete-input").addClass("no-input");
    $("#line").val(0);
    $("#line").removeClass("complete-input").addClass("no-input");
    $("#machine").val(0);
    $("#machine").removeClass("complete-input").addClass("no-input");
    $("#part_position").val(0);
    $("#part_position").removeClass("complete-input").addClass("no-input");
    $("#maintenance_start").val("");
    $("#maintenance_start").removeClass("complete-input").addClass("no-input");
    $("#maintenance_finish").val("");
    $("#maintenance_finish").removeClass("complete-input").addClass("no-input");
    makeSummaryTable();
    $("#update__button").remove();
});

$(document).on("click", "#update__button", function() {
    var fileName = "./php/Maintenance/UpdateData.php";
    var sendObj = new Object();
    sendObj["maintenance_start"] =getDateTime(new Date($("#maintenance_start").val()));
    sendObj["maintenance_finish"] = getDateTime(new Date($("#maintenance_finish").val()));
    sendObj["note"] = $("#note").val();
    sendObj["line"] = $("#line").val();
    sendObj["machine"] = $("#machine").val();
    sendObj["part_position"] = $("#part_position").val();
    if (document.getElementById("myfile").files.length == 0) {
        sendObj["file_url"] = 'No_image.jpg';
    } else {
        sendObj["file_url"] = $('#myfile')[0].files[0].name;
        var file_data = $('#myfile').prop('files')[0];
        var form_data = new FormData();
        form_data.append('file', file_data);
        $.ajax({
            url: "./php/Maintenance/FileUpload.php",
            dataType: 'text',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
        });
    }
    if (!$("#ma__table").hasClass("selected-record")) {
        sendObj["targetId"] = $("#die__table__selected").find("td").eq(0).html();
    }

    myAjax.myAjax(fileName, sendObj);
    console.log(sendObj)

    $("#go__button").prop("disabled", true);
    $("#note").val("");
    $("#myfile").val("");
    $("#myfile").removeClass("complete-input").addClass("no-input");
    $("#line").val(0);
    $("#line").removeClass("complete-input").addClass("no-input");
    $("#machine").val(0);
    $("#machine").removeClass("complete-input").addClass("no-input");
    $("#part_position").val(0);
    $("#part_position").removeClass("complete-input").addClass("no-input");
    $("#maintenance_start").val("");
    $("#maintenance_start").removeClass("complete-input").addClass("no-input");
    $("#maintenance_finish").val("");
    $("#maintenance_finish").removeClass("complete-input").addClass("no-input");
    makeSummaryTable();
    $("#update__button").remove();
});

const getTwoDigits = (value) => value < 10 ? `0${value}` : value;
const getDateTime = (date) => {
    const day = getTwoDigits(date.getDate());
    const month = getTwoDigits(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = getTwoDigits(date.getHours());
    const mins = getTwoDigits(date.getMinutes());
    return `${year}-${month}-${day} ${hours}:${mins}:00`;
}

$(document).on("change", "#maintenance_start", function() {
    var a= $("#maintenance_start").val();
    b=new Date(a)
    c=getDateTime(b)
    console.log(c)
    if ($(this).val() != "") {
        $(this).removeClass("no-input").addClass("complete-input");
    } else {
        $(this).removeClass("complete-input").addClass("no-input");
    }
    go_check();
});

$(document).on("change", "#maintenance_finish", function() {
    var a= $("#maintenance_finish").val();
    b=new Date(a)
    c=getDateTime(b)
    console.log(c)
    if ($(this).val() != "") {
        $(this).removeClass("no-input").addClass("complete-input");
    } else {
        $(this).removeClass("complete-input").addClass("no-input");
    }
    go_check();
});

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

$(document).on("click", "#ma__table tbody tr", function() {
    let update;
    var fileName = "./php/Maintenance/SelSelFile.php";
    var sendData = new Object();
    document.getElementById("file_area").innerHTML = ``;
    if (!$(this).hasClass("selected-record")) {
        let update = true;
        $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        $("#die__table__selected").removeAttr("id");
        $(this).attr("id", "die__table__selected");
        sendData = {
            targetId: $("#die__table__selected").find("td").eq(0).html(),
        };
        myAjax.myAjax(fileName, sendData);

        $("#line").val(ajaxReturnData[0].line_id);
        $("#line").removeClass("no-input").addClass("complete-input");
        $("#machine").val(ajaxReturnData[0].machine_id);
        $("#machine").removeClass("no-input").addClass("complete-input");
        $("#part_position").val(ajaxReturnData[0].part_position_id);
        $("#part_position").removeClass("no-input").addClass("complete-input");
        $("#maintenance_start").val(ajaxReturnData[0].maintenance_start);
        $("#maintenance_start").removeClass("no-input").addClass("complete-input");
        $("#maintenance_finish").val(ajaxReturnData[0].maintenance_finish);
        $("#maintenance_finish").removeClass("no-input").addClass("complete-input");
        $("#note").val(ajaxReturnData[0].note);

        $("<button>Update</button>").attr("id", "update__button").appendTo("#ins__data");

        var filename = ajaxReturnData[0].file_url;
        var fileType = filename.substr(filename.lastIndexOf(".") + 1, 3);
        if (filename.length !== 0) {
            switch (fileType) {
                case "pdf":
                case "PDF":
                    $("<object>")
                        .attr(
                            "data",
                            "../upload/Maintenance/" + filename + "#toolbar=0&navpanes=0")
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
                        .attr("data", "../upload/Maintenance/" + filename)
                        .attr("type", "image/jpeg")
                        .appendTo("#file_area");
                    break;
            }
        } else if (filename === null) {
            let update = false; 
            document.getElementById("file_area").innerHTML = ``;
        }
    } else {
        $(this).removeClass("selected-record");
        document.getElementById("file_area").innerHTML = ``;
        $("#update__button").remove();
    }
});


function make_action() {
    var table, tr, act, txt_act, i;
    table = document.getElementById("summary__table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        act = tr[i].getElementsByTagName("td")[10];
        if (act) {
            txt_act = act.innerText.replace(",", "");
            if (txt_act=="IT" ) {
                table.rows[i].style.backgroundColor = "#ffc870";
            } else {
            } 
        }
    }
};
