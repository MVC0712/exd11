// 削除確認ダイアログ
let deleteDialog = document.getElementById("delete__dialog");
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

function makeSummaryTable() {
    var fileName = "./php/RaspberryPi/SelSummary.php";
    var sendData = {
        dummy: "dummy",
        die_number: "%" + $("#die-number__input").val() + "%",
        machine: $("#machine").val(),
    };
    myAjax.myAjax(fileName, sendData);
    fillTableBody(ajaxReturnData, $("#summary__table tbody"));
}

function fillTableBody(data, tbodyDom) {
    let checkLimit = new Object();
    let chekFlag = false;
    $(tbodyDom).empty();
    data.forEach(function(trVal) {
        let newTr = $("<tr>");
        Object.keys(trVal).forEach(function(tdVal, index) {
            // console.log(tdVal);
            if (tdVal == "profile_length") {
                trVal[tdVal] = trVal[tdVal] + " km";
            }
            $("<td>").html(trVal[tdVal]).appendTo(newTr);
        });
        chekFlag = false;
        $(newTr).appendTo(tbodyDom);
    });
}

$(document).on("keyup", "#die-number__input", function() {
    $(this).val($(this).val().toUpperCase());
    makeSummaryTable();
});
$(document).on("change", "#machine", function() {
    makeSummaryTable();
});