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
    } else {
        $(this).removeClass("complete-input").addClass("no-input");
        $("#part_position").removeClass("complete-input").addClass("no-input");
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
    var fileName = "./php/Maintenance/SelDieHis.php";
    var sendData = new Object();
    if (!$(this).hasClass("selected-record")) {
        $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        $("#summary__table__selected").removeAttr("id");
        $(this).attr("id", "summary__table__selected");
        sendData = {
            targetId: $("#summary__table__selected").find("td").eq(0).html(),
        };
        // myAjax.myAjax(fileName, sendData);
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

// function go_check() {
//     if(($("#maintenance_start").val() != "")|| 
//         ($("#maintenance_finish").val() != "")||
//         ($("#machine").val() == 0)||
//         ($("#part_position").val() == 0)){
//         $("#go__button").prop("disabled", true);
//     } else {
//         $("#go__button").prop("disabled", false);
//     }
// };

$(document).on("click", "#go__button", function() {
    var fileName = "./php/Maintenance/InsMaintenance.php";
    var sendObj = new Object();
    $("#add__table tbody tr td:nth-child(4)").each(function(
        index,
        element
    ) {
        sendObj[index] = $(this).html();
    });
    sendObj["maintenance_start"] =getDateTime(new Date($("#maintenance_start").val()));
    sendObj["maintenance_finish"] = getDateTime(new Date($("#maintenance_finish").val()));
    sendObj["note"] = $("#note").val();
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

    $("#add__table tbody").empty();
    $("#go__button").prop("disabled", true);
    $("#note").val("");
    $("#myfile").val("");
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

// $(document).on("click", "#die__table tbody tr", function() {
//     var fileName = "./php/DieStatus/SelSelFile.php";
//     var sendData = new Object();
//     document.getElementById("file_area").innerHTML = ``;
//     if (!$(this).hasClass("selected-record")) {
//         $(this).parent().find("tr").removeClass("selected-record");
//         $(this).addClass("selected-record");
//         $("#die__table__selected").removeAttr("id");
//         $(this).attr("id", "die__table__selected");
//         sendData = {
//             targetId: $("#die__table__selected").find("td").eq(0).html(),
//         };
//         myAjax.myAjax(fileName, sendData);

//         var filename = ajaxReturnData[0].file_url;
//         var fileType = filename.substr(filename.lastIndexOf(".") + 1, 3);
//         if (filename.length !== 0) {
//             switch (fileType) {
//                 case "pdf":
//                 case "PDF":
//                     $("<object>")
//                         .attr(
//                             "data",
//                             "../upload/DieHistory/" + filename + "#toolbar=0&navpanes=0")
//                         .attr("type", "application/pdf")
//                         .appendTo("#file_area");
//                     break;
//                 case "jpeg":
//                 case "JPEG":
//                 case "jpg":
//                 case "JPG":
//                 case "png":
//                 case "PNG":
//                     $("<object>")
//                         .attr("data", "../upload/DieHistory/" + filename)
//                         .attr("type", "image/jpeg")
//                         .appendTo("#file_area");
//                     break;
//             }
//         } else if (filename === null) {
//             document.getElementById("file_area").innerHTML = ``;
//         }
//     } else {
//         $(this).removeClass("selected-record");
//         document.getElementById("file_area").innerHTML = ``;
//     }
// });