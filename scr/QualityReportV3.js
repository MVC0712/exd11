let ajaxReturnData;
let originalValue;
// let deleteDialog = document.getElementById("delete_ng__dialog");
// let deleteRackDialog = document.getElementById("delete_rack__dialog");
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
    makeNgSelect();
    $("#add__button").prop("disabled", true);
    $("#test__button").remove();
});

function makeNgSelect() {
    var fileName = "./php/QualityReport/SelNgCode.php";
    var sendData = {
        ng_code: $("#ng_code__input").val() + "%",
    };
    myAjax.myAjax(fileName, sendData);
    $("#ng_code__select").empty();
    if (ajaxReturnData.length == 1) {
        $("#ng_code__select").removeClass("no-input").addClass("complete-input");
    } else {
        $("#ng_code__select").append($("<option>").val(0).html("no"));
        $("#ng_code__select").removeClass("complete-input").addClass("no-input");
    }
    ajaxReturnData.forEach(function(value) {
        $("<option>")
            .val(value["id"])
            .html(value["quality_code"] + "-" + value["description_vn"])
            .appendTo("#ng_code__select");
    });
}

function makeDieOption() {
    var fileName = "./php/QualityReport/SelDieNumber.php";
    var sendData = {
        dummy: "dummy",
        press_date: $("#date__input").val(),
    };
    myAjax.myAjax(fileName, sendData);
}
// ==============  date  ===================
$(document).on("change", "#date__input", function() {
    makeDieOption();
    $("#die_number option").remove();
    $("#die_number").append($("<option>").val(0).html("NO select"));
    $("#die_number").removeClass("complete-input").addClass("no-input");
    $("#slkhuon").html(ajaxReturnData.length);

    ajaxReturnData.forEach(function(value) {
        $("#die_number").append(
            $("<option>").val(value["id"]).html(value["die_number"])
        );
    });
    $("#date__input").removeClass("no-input").addClass("complete-input");
});

// ==============  die_number  ===================
$(document).on("change", "#die_number", function() {
    if ($(this).val() != 0) {
        $(this).removeClass("no-input").addClass("complete-input");

        fillPressStart();
        $("#slngay").html(ajaxReturnData.length);
        $("#press_start option").remove();
        $("#press_start").append($("<option>").val(0).html("NO"));
        $("#press_start").removeClass("complete-input").addClass("no-input");
        ajaxReturnData.forEach(function(value) {
            $("#press_start").append(
                $("<option>").val(value["press_start_at"]).html(value["press_start_hm"])
            );
        });
    } else {
        $(this).removeClass("complete-input").addClass("no-input");
    }
});

function fillPressStart() {
    var fileName = "./php/QualityReport/SelPressStart.php";
    var sendData = {
        press_date: $("#date__input").val(),
        dies_id: $("#die_number").val(),
    };
    myAjax.myAjax(fileName, sendData);
}

$(document).on("change", "#press_start", function() {
    if ($(this).val() != 0) {
        $(this).removeClass("no-input").addClass("complete-input");
        fillPressData();
    } else {
        $(this).removeClass("complete-input").addClass("no-input");
    }
});

function fillPressData() {
    var fileName = "./php/QualityReport/SelPressDataWithTime.php";
    var sendData = {
        press_date: $("#date__input").val(),
        dies_id: $("#die_number").val(),
        press_start_at: $("#press_start").val(),
    };
    console.log(sendData);
    myAjax.myAjax(fileName, sendData);
    console.log(ajaxReturnData);
    $("#pressing_type").val(ajaxReturnData[0]["pressing_type"]);
    $("#input_billet_quantity").val(
        ajaxReturnData[0]["actual_billet_quantities"]
    );
    press_id = ajaxReturnData[0]["press_id"];
    $("#dimension_check_date").val(ajaxReturnData[0]["dimension_check_date"]);
    $("#etching_check_date").val(ajaxReturnData[0]["etching_check_date"]);
    $("#aging_check_date").val(ajaxReturnData[0]["aging_check_date"]);
    $("#packing_date").val(ajaxReturnData[0]["packing_check_date"]);

    fileName = "./php/QualityReport/SelRackData.php";
    sendData = {
        press_id: ajaxReturnData[0]["press_id"],
    };
    myAjax.myAjax(fileName, sendData);
    makeAgingRackTable(ajaxReturnData, $("#rack__table tbody tr"));
    calTotalWorkQty();
    makeTotalNgTable();
    $("#add__button").prop("disabled", true);
    $("#ng__table tbody:nth-child(2)").empty();
    $("#total_ng_quantity").html("0");
    $("#total_ok_quantity").html("0");
}

function makeAgingRackTable(data, tbodyDom) {
    $("#table__body").empty();

    data.forEach(function(trVal) {
        var newTr = $("<tr>");
        Object.keys(trVal).forEach(function(tdVal) {
            if (tdVal == "work_quantity") {
                $("<td>").append($("<input>").val(trVal[tdVal]).attr('disabled', true)).appendTo(newTr);
            } else {
                $("<td>").html(trVal[tdVal]).appendTo(newTr);
            }
        });
        $(newTr).appendTo("#table__body");
    });
}
// ===================== complete date input ====================
$(document).on("change", "#complete_date", function() {
    var fileName = "./php/QualityReport/UpdateQualityCheckDate.php";
    var sendData = {
        process_id: $('input:radio[name="process_name"]:checked').val(),
        press_id: press_id,
        date: $("#complete_date").val(),
    };
    // call php program
    // console.log(sendData);
    myAjax.myAjax(fileName, sendData);
    fillPressData();
});

// ===================== ng code input ====================
$(document).on("keyup", "#ng_code__input", function() {
    makeNgSelect();
});

$(document).on("keydown", "#ng_code__input", function(e) {
    if ($("#ng_code__select").hasClass("complete-input") && e.keyCode == 13) {
        $("#ng_quantity").focus();
        e.preventDefault();
    }
});
// ===================== ng code select ====================
$(document).on("change", "#ng_code__select", function() {
    if ($(this).val() != 0) {
        $(this).removeClass("no-input").addClass("complete-input");
    } else {
        $(this).removeClass("complete-input").addClass("no-input");
    }
});

// ===================== ng qty input ====================
$(document).on("keyup", "#ng_quantity", function() {
    let val = $(this).val();

    if (0 <= Number(val) && Number(val) <= 500 && val != "") {
        $(this).removeClass("no-input").addClass("complete-input");
    } else {
        $(this).removeClass("complete-input").addClass("no-input");
    }
});

$(document).on("keydown", "#ng_quantity", function(e) {
    if ($(this).hasClass("complete-input") && e.keyCode == 13) {
        $("#add__button").focus();
        e.preventDefault();
    }
});
// ===================== actvation of Add button ====================
$(document).on("click", ".buttom__wrapper", function() {
    checkNgData()
});

$(document).on("change", ".buttom__wrapper", function() {
    checkNgData()
});

$(document).on("keyup", ".buttom__wrapper", function() {
    checkNgData()
});

function checkNgData() {
    let condition1, condition2, condition3, condition4;

    condition1 = $("#selected__tr").length;
    condition2 = Number($("#ng_quantity").val());
    condition3 = $("#ng_code__select").val();
    condition4 = $("#ng_quantity").val();

    if (condition1 != 0 && condition2 >= 0 && condition3 != 0 && condition4 != "") {
        // console.log("ok")
        $("#add__button").prop("disabled", false);
    } else {
        $("#add__button").prop("disabled", true);
    }
}

// ===================== Add button ====================
$(document).on("click", "#add__button", function() {
    let fileName = "./php/QualityReport/InsQalityInformation.php";
    let sendData = {
        press_date: $("#date__input").val(),
        dies_id: $("#die_number").val(),
        process_id: $('input:radio[name="process_name"]:checked').val(),
        using_aging_rack_id: $("#selected__tr td").eq(0).html(),
        quality_code_id: $("#ng_code__select").val(),
        ng_quantities: $("#ng_quantity").val(),
        created_at: getToday(),
    };
    // console.log(sendData);
    // call php program
    myAjax.myAjax(fileName, sendData);
    // read ng table data
    fileName = "./php/QualityReport/SelSelRackNGData.php";
    sendData = {
        using_aging_rack_id: $("#selected__tr td").eq(0).html(),
    };
    myAjax.myAjax(fileName, sendData);
    makeNgTable($("#ng__table tbody:nth-child(2)"));
    // clear and color input frame
    $(".ng_table__wrapper .need-clear").val("");
    $(".ng_table__wrapper .save-data")
        .removeClass("complete-input")
        .addClass("no-input");
    makeTotalNgTable();
});

function getToday() {
    // 本日の日付をyy-mm-dd形式で返す
    let dt = new Date();
    return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++    rack table   ++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ===================== select rack table ===============
$(document).on("click", "#table__body tr", function(e) {
    let fileName;
    let sendData;
    if (!$(this).hasClass("selected-record")) {
        // tr に class を付与し、選択状態の background colorを付ける
        $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        // tr に id を付与する
        $("#selected__tr").removeAttr("id");
        $(this).attr("id", "selected__tr");

        // read ng table data
        fileName = "./php/QualityReport/SelSelRackNGData.php";
        sendData = {
            using_aging_rack_id: $("#selected__tr td").eq(0).html(),
        };
        myAjax.myAjax(fileName, sendData);
        makeNgTable($("#ng__table tbody:nth-child(2)"));
        // $("#add__button").prop("disabled", false);
    } else {
        // 選択レコードを再度クリックした時
        // 削除問い合わせダイアログ
        deleteRackDialog.showModal();
        $("#add__button").prop("disabled", true);
    }
});

// deleteダイアログのキャンセルボタンが押されたとき
$(document).on("click", "#delete_rack__dialog-cancel", function() {
    deleteRackDialog.close();
});

// deleteダイアログの削除ボタンが押されたとき
$(document).on("click", "#delete_rack__dialog-delete", function() {
    // delete quality information
    fileName = "./php/QualityReport/DelRackData.php";
    sendData = {
        id: $("#selected__tr").find("td").eq(0).html(),
    };
    myAjax.myAjax(fileName, sendData);
    // reload rack table data
    fillPressData();

    deleteRackDialog.close();
});

function makeNgTable(targetDom) {
    let ngTotal = 0;
    let okTotal;
    targetDom.empty();
    // console.log(ajaxReturnData);
    ajaxReturnData.forEach(function(trVal) {
        var newTr = $("<tr>");
        Object.keys(trVal).forEach(function(tdVal) {
            if (tdVal == "ng_quantities") {
                $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
                ngTotal += Number(trVal[tdVal]);
            } else if (tdVal == "quality_code") {
                $("<td>").append(makeNgCodeOptionDom(trVal[tdVal])).appendTo(newTr);
            } else if (tdVal == "process_name") {
                $("<td>")
                    .append(makeProcessCodeOptionDom(trVal[tdVal]))
                    .appendTo(newTr);
            } else {
                $("<td>").html(trVal[tdVal]).appendTo(newTr);
            }
        });
        $(newTr).appendTo(targetDom);
    });
    $("#total_ng_quantity").html(ngTotal);
    okTotal = Number($("#total_work_quantity").html()) - ngTotal;
    okTotal = Number($("#selected__tr input").val()) - ngTotal;
    $("#total_ok_quantity").html(okTotal);
}

// makeProcessCodeOptionDom

function makeNgCodeOptionDom(seletedId) {
    let targetDom = $("<select>");

    fileName = "./php/QualityReport/SelNgCode.php";
    sendData = {
        ng_code: "%",
    };
    myAjax.myAjax(fileName, sendData);

    ajaxReturnData.forEach(function(element) {
        if (element["quality_code"] == seletedId) {
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
// ===================== input work quantity ===================
$(document).on("keyup", "#rack__table input", function() {
    if (
        (1 <= Number($(this).val()) && Number($(this).val()) <= 500) ||
        $(this).val() == ""
    ) {
        $(this).removeClass("no-input").addClass("complete-input");
    } else {
        $(this).removeClass("complete-input").addClass("no-input");
    }
});

$(document).on("change", "#rack__table input", function() {
    let id;
    id = $(this).parent().parent().find("td").eq(0).html();

    // Update Input Data
    fileName = "./php/QualityReport/UpdateRackWorkQty.php";
    sendData = {
        id: id,
        work_quantity: $(this).val(),
    };
    myAjax.myAjax(fileName, sendData);
    // read used aging rack information
    fillPressData();
    // ng table reset
    $("#ng__table tbody:nth-child(2)").empty();
});

function calTotalWorkQty() {
    let total = 0;
    $("#rack__table input").each(function(index, val) {
        // console.log($(this).val());
        if (!isNaN($(this).val())) {
            total += Number($(this).val());
        }
    });
    $("#total_work_quantity").html(total);
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// -------------------------  ng__table tr ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#ng__table tr", function(e) {
    if (!$(this).hasClass("selected-record")) {
        // tr に class を付与し、選択状態の background colorを付ける
        $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        // tr に id を付与する
        $("#ng-selected__tr").removeAttr("id");
        $(this).attr("id", "ng-selected__tr");
        // input 要素
        $(this).parent().find("input").removeClass("selected-input");
        $(this).find("input").addClass("selected-input");
        // be color to select element
        $(this).parent().find("select").removeClass("selected-select");
        $(this).find("select").addClass("selected-select");
    } else {
        // 選択レコードを再度クリックした時
        // 削除問い合わせダイアログ
        deleteDialog.showModal();
    }
});

// deleteダイアログのキャンセルボタンが押されたとき
$(document).on("click", "#delete_ng__dialog-cancel", function() {
    deleteDialog.close();
});

// deleteダイアログの削除ボタンが押されたとき
$(document).on("click", "#delete_ng__dialog-delete", function() {
    // delete quality information
    fileName = "./php/QualityReport/DelNGData.php";
    sendData = {
        id: $("#ng-selected__tr").find("td").eq(0).html(),
    };
    myAjax.myAjax(fileName, sendData);
    // read ng table data
    fileName = "./php/QualityReport/SelSelRackNGData.php";
    sendData = {
        using_aging_rack_id: $("#selected__tr td").eq(0).html(),
    };
    myAjax.myAjax(fileName, sendData);
    makeNgTable($("#ng__table tbody:nth-child(2)"));

    makeTotalNgTable();

    deleteDialog.close();
});

// NG quantity input in NG table
$(document).on("focus", "#ng__table input", function() {
    originalValue = $(this).val();
});

$(document).on("change", "#ng__table input", function() {
    if (
        0 <= Number($(this).val()) &&
        Number($(this).val()) <= 100 &&
        $(this).val() != ""
    ) {
        // when input value is normal
        update_t_press_quatlities();
    } else {
        // when input value is abnormal
        $(this).val(originalValue);
    }
    makeTotalNgTable();

});

$(document).on("change", "#ng__table select", function() {
    update_t_press_quatlities();
    makeTotalNgTable();
});

function update_t_press_quatlities() {
    fileName = "./php/QualityReport/UpdateWorkQuantities.php";

    sendData = {
        id: $("#ng-selected__tr").find("td").eq(0).html(),
        ng_quantities: $("#ng-selected__tr").find("input").val(),
        process_id: $("#ng-selected__tr").find("select").eq(0).val(),
        quality_code_id: $("#ng-selected__tr").find("select").eq(1).val(),
    };
    myAjax.myAjax(fileName, sendData);
    // read ng table data
    fileName = "./php/QualityReport/SelSelRackNGData.php";
    sendData = {
        using_aging_rack_id: $("#selected__tr td").eq(0).html(),
    };
    myAjax.myAjax(fileName, sendData);
    makeNgTable($("#ng__table tbody:nth-child(2)"));
}

// =====================  TEST BUTTON ======================
$(document).on("click", "#test__button", function() {
    makeTotalNgTable();
});

function makeTotalNgTable() {
    fileName = "./php/QualityReport/SelTotalNg.php";
    sendData = {
        press_id: press_id,
    };
    myAjax.myAjax(fileName, sendData);

    ajaxReturnData.forEach(function(trVal) {
        let newTr = $("<tr>");
        Object.keys(trVal).forEach(function(tdVal) {
            $("<td>").html(trVal[tdVal]).appendTo(newTr);
        });
        $("#total-ng__table tbody").empty();
        $(newTr).appendTo("#total-ng__table tbody");
    });
}

function makeProcessCodeOptionDom(seletedId) {
    let targetDom = $("<select>");

    fileName = "./php/QualityReport/SelProcess.php";
    sendData = {
        ng_code: "dummy",
    };
    myAjax.myAjax(fileName, sendData);

    ajaxReturnData.forEach(function(element) {
        if (element["process_name"] == seletedId) {
            $("<option>")
                .html(element["process_name"])
                .val(element["id"])
                .prop("selected", true)
                .appendTo(targetDom);
        } else {
            $("<option>")
                .html(element["process_name"])
                .val(element["id"])
                .appendTo(targetDom);
        }
    });
    return targetDom;
}