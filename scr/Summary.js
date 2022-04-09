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
    // 入力項目の非活性化
    // $("#directive__input").prop("disabled", true);
    // ボタンの非活性化
    $("#save__button").prop("disabled", true);
    $("#update__button").prop("disabled", true);
    // test ボタンの表示
    $("#test__button").remove();
    $("#delete-record__button").remove();
});

function makeSummaryTable() {
    var fileName = "./php/Summary/SelSummaryV2.php";
    var sendData = {
        dummy: "dummy",
        die_number: $("#die-number__input").val() + "%",
    };
    // 今日の日付の代入
    // $("#summary__table").val(returnToday());
    // summary tebale の読み出し
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

// Die number

$(document).on("keyup", "#die-number__input", function() {
    $(this).val($(this).val().toUpperCase()); // 小文字を大文字に
    console.log("hello");
    makeSummaryTable();
});