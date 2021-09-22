let cancelKeyupEvent = false;
let cancelKeydownEvent = false;
let editMode = false;
let readNewFile = false;

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

function makeSummaryTable() {
    var fileName = "./php/DieStatus/DieHistory.php";
    var sendData = {
        dummy: "dummy",
    };
    myAjax.myAjax(fileName, sendData);
    fillTableBody(ajaxReturnData, $("#die__table tbody"));
}

function fillTableBody(data, tbodyDom) {
    let checkLimit = new Object();
    let chekFlag = false;
    $(tbodyDom).empty();
    data.forEach(function(trVal) {
        let newTr = $("<tr>");
        Object.keys(trVal).forEach(function(tdVal, index) {

            $("<td>").html(trVal[tdVal]).appendTo(newTr);

        });
        chekFlag = false;
        $(newTr).appendTo(tbodyDom);
    });
}

$(document).on("click", "#die__table tbody tr", function() {
    var fileName = "./php/DieStatus/SelSelFile.php";
    var sendObj = new Object();
    document.getElementById("file_area").innerHTML = ``;
    if (!$(this).hasClass("selected-record")) {
        $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        $("#die__table__selected").removeAttr("id");
        $(this).attr("id", "die__table__selected");
        sendData = {
            targetId: $("#die__table__selected").find("td").eq(0).html(),
        };
        console.log(sendData);
        myAjax.myAjax(fileName, sendData);
        console.log(ajaxReturnData[0].file_url);

        var filename = ajaxReturnData[0].file_url;
        var fileType = filename.substr(filename.lastIndexOf(".") + 1, 3);
        console.log(filename);
        console.log(filename.lastIndexOf("."));
        console.log(filename.substr(filename.lastIndexOf(".") + 1, 3));
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
                case "jpg":
                case "JPG":
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
        $("#add__table tbody").append($(this).removeClass("selected-record"));
        $("#go__button").prop("disabled", false);
        document.getElementById("file_area").innerHTML = ``;
    }
});