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
    staff();
    makeSummaryTable();
    machine();
    line();
    // part();
    $("#save__button").prop("disabled", true);
    $("#update").prop("disabled", true);
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
    make_action();
    Insert_check();
    Update_check();
}

function staff() {
    var fileName = "./php/Maintenance/SelStaff.php";
    var sendData = {
        dummy: "dummy",
    };
    myAjax.myAjax(fileName, sendData);
    $("#staff option").remove();
    $("#staff").append($("<option>").val(0).html("NO select"));
    ajaxReturnData.forEach(function(value) {
        $("#staff").append(
            $("<option>").val(value["id"]).html(value["staff_name"])
        );
    });
};

function fillTableBody(data, tbodyDom) {
    $(tbodyDom).empty();
    data.forEach(function(trVal) {
        let newTr = $("<tr>");
        Object.keys(trVal).forEach(function(tdVal) {
            if (tdVal == "duration") {
                $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
            } else {
                $("<td>").html(trVal[tdVal]).appendTo(newTr);
            }
        });

        $(newTr).appendTo(tbodyDom);
    });
    Insert_check();
    Update_check();
}

function machine() {
    var fileName = "./php/Maintenance/SelMachine.php";
    var sendData = {
        dummy: "dummy",
    };
    myAjax.myAjax(fileName, sendData);
    fillTableBody(ajaxReturnData, $("#machine tbody"));
};

function part() {
    var fileName = "./php/Maintenance/SelPart.php";
    var sendData = {
        dummy: "dummy",
    };
    myAjax.myAjax(fileName, sendData);
    fillTableBody(ajaxReturnData, $("#work tbody"));
}

function line() {
    var fileName = "./php/Maintenance/SelLine.php";
    var sendData = {
        dummy: "dummy",
    };
    myAjax.myAjax(fileName, sendData);
    fillTableBody(ajaxReturnData, $("#line tbody"));
}

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
            targetId: $("#summary__table__selected").find("td").eq(5).html(),
        };
        myAjax.myAjax(fileName, sendData);
        document.getElementById("ma_po").innerHTML = ajaxReturnData[0].machine+"-"+ajaxReturnData[0].part_position;
        fillTableBodyh(ajaxReturnData, $("#history__summary tbody"));
    } else {
        $(this).removeClass("selected-record");
        $(this).removeAttr("id");
        $("#insert").prop("disabled", false);
    }
    Insert_check();
    Update_check();
    document.getElementById("file_area").innerHTML = ``;
});

$(document).on("click", "#history__summary tbody tr", function() {
    var fileName = "./php/Maintenance/SelFile.php";
    var sendData = new Object();
    if (!$(this).hasClass("selected-record")) {
        $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        $("#history__summary__selected").removeAttr("id");
        $(this).attr("id", "history__summary__selected");
        Insert_check();
        Update_check();
        sendData = {
            targetId: $("#history__summary__selected").find("td").eq(0).html(),
        };
        myAjax.myAjax(fileName, sendData);
        console.log(ajaxReturnData);

        document.getElementById("file_area").innerHTML = ``;
        ajaxReturnData.forEach(function(value) {
            var file_name = value["attached_file"];
            if (file_name.length !== 0) {
                $("<object>")
                .attr("data", "../upload/Maintenance/" + file_name)
                .attr("type", "image/jpeg")
                .appendTo("#file_area");
                console.log(file_name);
            }
        });

        var fileName = "./php/Maintenance/SelSelUpdate.php";
        var sendData = new Object();
        sendData = {
            targetId: $("#history__summary__selected").find("td").eq(0).html(),
        };
        myAjax.myAjax(fileName, sendData);
        console.log(ajaxReturnData);

        let line_id=ajaxReturnData[0].line_id;
        let machine_id=ajaxReturnData[0].machine_id;
        let part_position_id=ajaxReturnData[0].part_position_id;
        let staff_id=ajaxReturnData[0].staff_id;
        let maintenance_start=ajaxReturnData[0].maintenance_start;
        let normal=ajaxReturnData[0].normal;
        let note=ajaxReturnData[0].note;

        $("#staff").val(staff_id);
        $("#staff").removeClass("no-input").addClass("complete-input");
        $("#note").val(note);
        $("#normal").val(normal);
        $("#maintenance_start").val(maintenance_start);
        $("#maintenance_start").removeClass("no-input").addClass("complete-input");
        select_row(line_id, $("#line tbody tr"), "line__selected");
        select_row(machine_id, $("#machine tbody tr"), "machine__selected");

        var fileName = "./php/Maintenance/SelPartPosition.php";
        var sendData = {
            machine_id: machine_id,
        };
        myAjax.myAjax(fileName, sendData);
        fillTableBody(ajaxReturnData, $("#work tbody"));
        select_row(part_position_id, $("#work tbody tr"), "work__selected");

    } else {
        $(this).removeClass("selected-record");
        $(this).removeAttr("id");
        $("#insert").prop("disabled", false);
    }
    Insert_check();
    Update_check();
});

$(document).on("click", "#line tbody tr", function() {
    if (!$(this).hasClass("selected-record")) {
        $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        $("#line__selected").removeAttr("id");
        $(this).attr("id", "line__selected");
    } else {
        $(this).removeClass("selected-record");
        $(this).removeAttr("id");
        $("#insert").prop("disabled", false);
    }
});

$(document).on("click", "#machine tbody tr", function() {
    var fileName = "./php/Maintenance/SelPartPosition.php";
    if (!$(this).hasClass("selected-record")) {
        $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        $("#machine__selected").removeAttr("id");
        $(this).attr("id", "machine__selected");
        InsWork_check();
        Update_check();
        var sendData = {
            machine_id: $("#machine__selected").find("td").eq(0).html(),
        };
        myAjax.myAjax(fileName, sendData);
        fillTableBody(ajaxReturnData, $("#work tbody"));
    } else {
        $(this).removeClass("selected-record");
        $(this).removeAttr("id");
        $("#insert").prop("disabled", false);
        $("#work tbody").empty();
        InsWork_check();
        Update_check();
    }
});

$(document).on("click", "#work tbody tr", function() {
    if (!$(this).hasClass("selected-record")) {
        // $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        // $("#work__selected").removeAttr("id");
        $(this).attr("id", "work__selected");
    } else {
        $(this).removeClass("selected-record");
        $(this).removeAttr("id");
        // $("#insert").prop("disabled", false);
    }
    Insert_check();
    Update_check();
});


function InsWork_check() {
    if ((($("#duration").val().length == 0)|| 
        ($("#ins_work").val().length == 0)||
        (!$("#machine tbody tr").hasClass("selected-record")))) {
        $("#Insert_work").prop("disabled", true);
    } else {
        $("#Insert_work").prop("disabled", false);
    }
};

function Insert_check() {
    if (($("#maintenance_start").val() == "")|| 
        ($("#staff").val() == 0)||
        (!$("#machine tbody tr").hasClass("selected-record")) ||
        (!$("#line tbody tr").hasClass("selected-record")) ||
        (!$("#work tbody tr").hasClass("selected-record"))) {
        $("#insert").prop("disabled", true);
    } else {
        $("#insert").prop("disabled", false);
    }
};

function Update_check() {
    if (($("#maintenance_start").val() == "")|| 
        ($("#staff").val() == 0)||
        (!$("#machine tbody tr").hasClass("selected-record")) ||
        (!$("#line tbody tr").hasClass("selected-record")) ||
        (!$("#history__summary tbody tr").hasClass("selected-record")) ||
        (!$("#work tbody tr").hasClass("selected-record"))) {
        $("#update").prop("disabled", true);
    } else {
        $("#update").prop("disabled", false);
    }
};

$(document).on("click", "#insert", function() {
    var fileName = "./php/Maintenance/InsMaintenanceV2.php";
    var sendObj = new Object();
    $("#work tbody tr").each(function() {
        if ($(this).hasClass("selected-record")) {
            sendObj[$(this).find("td").eq(0).html()] = $(this).find("td").eq(0).html();
        }
    });
    sendObj["maintenance_start"] =getDate(new Date($("#maintenance_start").val()));
    sendObj["note"] = $("#note").val();
    sendObj["normal"] = $("#normal").val();
    sendObj["staff"] = $("#staff").val();
    sendObj["line"] = $("#line__selected").find("td").eq(0).html();
    sendObj["machine"] = $("#machine__selected").find("td").eq(0).html();

    myAjax.myAjax(fileName, sendObj);
    let lid = ajaxReturnData.id;
    if (document.getElementById("file").files.length == 0) {
        console.log("khong co file");
    } else {
        console.log("co file");
        var totalfiles = document.getElementById("file").files.length;
        var formData = new FormData();
        for (var index = 0; index < totalfiles; index++) {
          formData.append("files[]", document.getElementById("file").files[index]);
        }
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "./php/Maintenance/FileUploadMultiple.php", true);
        xhttp.onreadystatechange = function() {
           if (this.readyState == 4 && this.status == 200) {
              var response = this.responseText;
              alert(response + " File uploaded.");
           }
        };
        xhttp.send(formData);

        var sendFileName = new Object();
        var inp = document.getElementById('file');
        for (var i = 0; i < inp.files.length; ++i) {
          var name = inp.files.item(i).name;
          console.log("here is a file name: " + name);
          sendFileName[i] = name;
        }
        sendFileName["t_maintenance_history_id"]=lid;
        console.log(sendFileName);
        var InsFileName = "./php/Maintenance/InsFileName.php";
        myAjax.myAjax(InsFileName, sendFileName);
    }
    $("#insert").prop("disabled", true);
    $("#note").val("");
    $("#file").val("");
    $("#maintenance_start").val("");
    $("#maintenance_start").removeClass("complete-input").addClass("no-input");
    makeSummaryTable();
});

$(document).on("click", "#update", function() {
    var fileName = "./php/Maintenance/UpdateDataV2.php";
    var sendObj = new Object();
    sendObj["maintenance_start"] =getDateTime(new Date($("#maintenance_start").val()));
    sendObj["note"] = $("#note").val();
    sendObj["normal"] = $("#normal").val();
    sendObj["staff"] = $("#staff").val();
    sendObj["line"] = $("#line__selected").find("td").eq(0).html();
    sendObj["part_position"] = $("#work__selected").find("td").eq(0).html();
    if (!$("#history__summary").hasClass("selected-record")) {
        sendObj["targetId"] = $("#history__summary__selected").find("td").eq(0).html();
    }
    myAjax.myAjax(fileName, sendObj);
    console.log(sendObj);
    if (document.getElementById("file").files.length == 0) {
        console.log("khong co file");
    } else {
        console.log("co file");
        var totalfiles = document.getElementById("file").files.length;
        var formData = new FormData();
        for (var index = 0; index < totalfiles; index++) {
          formData.append("files[]", document.getElementById("file").files[index]);
        }
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "./php/Maintenance/FileUploadMultiple.php", true);
        xhttp.onreadystatechange = function() {
           if (this.readyState == 4 && this.status == 200) {
              var response = this.responseText;
              alert(response + " File uploaded.");
           }
        };
        xhttp.send(formData);

        var sendFileName = new Object();
        var inp = document.getElementById('file');
        for (var i = 0; i < inp.files.length; ++i) {
          var name = inp.files.item(i).name;
          console.log("here is a file name: " + name);
          sendFileName[i] = name;
        }
        sendFileName["t_maintenance_history_id"]=sendObj["targetId"];
        console.log(sendFileName);
        var InsFileName = "./php/Maintenance/InsFileName.php";
        myAjax.myAjax(InsFileName, sendFileName);
    }
    $("#insert").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#note").val("");
    $("#file").val("");
    $("#maintenance_start").val("");
    $("#maintenance_start").removeClass("complete-input").addClass("no-input");
    makeSummaryTable();
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
const getDate = (date) => {
    const day = getTwoDigits(date.getDate());
    const month = getTwoDigits(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
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
    Insert_check();
    Update_check();
});

$(document).on("change", "#staff", function() {
    if ($(this).val() != 0) {
        $(this).removeClass("no-input").addClass("complete-input");
    } else {
        $(this).removeClass("complete-input").addClass("no-input");
    }
    Insert_check();
    Update_check();
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

        $("<button>Update</button>").attr("id", "update").appendTo("#ins__data");

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
        $("#update").remove();
    }
});

function make_action() {
    var table, tr, act, txt_act, i;
    table = document.getElementById("summary__table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        act = tr[i].getElementsByTagName("td")[11];
        if (act) {
            txt_act = act.innerText.replace(",", "");
            if (txt_act=="IT" ) {
                table.rows[i].style.backgroundColor = "#ffc870";
            } else {
            } 
        }
    }
};

$(document).on("change", "#work input", function() {
    fileName = "./php/Maintenance/UpdateWork.php";

    sendData = {
        id: $("#work__selected").find("td").eq(0).html(),
        duration: $("#work__selected td:nth-child(3) input").val(),
    };
    myAjax.myAjax(fileName, sendData);
    // console.log(sendData);
});

$(document).on("keyup", "#ins_line", function() {
    if ($(this).val().length != 0) {
        $(this).removeClass("no-input").addClass("complete-input");
        $("#Insert_line").prop("disabled", false);
    } else {
        $(this).removeClass("complete-input").addClass("no-input");
        $("#Insert_line").prop("disabled", true);
    }
    Insert_check();
    Update_check();
});

$(document).on("keyup", "#ins_machine", function() {
    if ($(this).val().length != 0) {
        $(this).removeClass("no-input").addClass("complete-input");
        $("#Insert_machine").prop("disabled", false);
    } else {
        $(this).removeClass("complete-input").addClass("no-input");
        $("#Insert_machine").prop("disabled", true);
    }
    Insert_check();
    Update_check();
});

$(document).on("keyup", "#ins_work", function() {
    if ($(this).val().length != 0) {
        $(this).removeClass("no-input").addClass("complete-input");
    } else {
        $(this).removeClass("complete-input").addClass("no-input");
    }
    InsWork_check();
    Update_check();
});

$(document).on("keyup", "#duration", function() {
    if ($(this).val().length != 0) {
        $(this).removeClass("no-input").addClass("complete-input");
    } else {
        $(this).removeClass("complete-input").addClass("no-input");
    }
    InsWork_check();
    Update_check();
});

$(document).on("click", "#Insert_line", function() {
    var fileName = "./php/Maintenance/InsLine.php";
    var sendObj = new Object();
    sendObj["line"] = $("#ins_line").val();
    myAjax.myAjax(fileName, sendObj);
    console.log(sendObj)

    $("#ins_line").val("");
    $("#ins_line").removeClass("complete-input").addClass("no-input");
    $("#Insert_line").prop("disabled", true);
    Insert_check();
    Update_check();
});

$(document).on("click", "#Insert_machine", function() {
    var fileName = "./php/Maintenance/InsMachine.php";
    var sendObj = new Object();
    sendObj["machine"] = $("#ins_machine").val();
    myAjax.myAjax(fileName, sendObj);
    console.log(sendObj)

    $("#ins_machine").val("");
    $("#ins_machine").removeClass("complete-input").addClass("no-input");
    $("#Insert_machine").prop("disabled", true);
    Insert_check();
    Update_check();
});

$(document).on("click", "#Insert_work", function() {
    var fileName = "./php/Maintenance/InsWork.php";
    var sendObj = new Object();
    sendObj["part_position"] = $("#ins_work").val();
    sendObj["duration"] = $("#duration").val();
    sendObj["machine_id"] = $("#machine__selected").find("td").eq(0).html();
    myAjax.myAjax(fileName, sendObj);

    var fileName = "./php/Maintenance/SelPartPosition.php";
    var sendData = {
        machine_id: $("#machine__selected").find("td").eq(0).html(),
    };
    myAjax.myAjax(fileName, sendData);
    fillTableBody(ajaxReturnData, $("#work tbody"));

    $("#ins_work").val("");
    $("#ins_work").removeClass("complete-input").addClass("no-input");
    $("#duration").val("");
    $("#duration").removeClass("complete-input").addClass("no-input");
    $("#Insert_work").prop("disabled", true);
    Insert_check();
    Update_check();
});

function select_row(targetId, targetDom, id) {
    targetDom.each(function(index, element) {
        if ($(element).find("td").eq(0).text() == targetId) {
            $(element).parent().find("tr").removeClass("selected-record");
            $(element).addClass("selected-record");
            $(id).removeAttr("id");
            $(element).attr("id", id);
            $('#'+id)[0].scrollIntoView();
        }
    });
    Insert_check();
    Update_check();
};