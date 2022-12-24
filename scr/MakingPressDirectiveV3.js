// 削除確認ダイアログ
// let deleteDialog = document.getElementById("delete__dialog");
// 編集モードの確認
let editMode = false;

$(function() {
    // ajaxSelSummary(); // summary tebale の読み出し

    // ボタンの非活性化
    $("#save__button").prop("disabled", true);
    $("#update__button").prop("disabled", true);
    $("#print__button").prop("disabled", true);
    $("#print__button_2").prop("disabled", true);
    // test ボタンの表示
    $("#test__button").hide();
    // dies select option を更新する
    if (0 == $("#incharge__select").val()) {
        // 担当者名
        ajaxSelIncharge();
    }

    ajaxSelBolster();
    ajaxSelDie($(this).val());
    clearInputData();
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- input check from here -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// die number ====================================================
$(document).on("focus", "#die-number__input", function(e) {
    ajaxSelDie("");
});

$(document).on("keydown", "#die-number__input", function(e) {});

$(document).on("keyup", "#die-number__input", function() {
    $(this).val($(this).val().toUpperCase()); // 小文字を大文字に
    ajaxSelDie($(this).val());
});

function ajaxSelDie(dieNumber) {
    dieNumber = dieNumber + "%";
    $.ajax({
            type: "POST",
            url: "./php/MakingPressDirective/SelDie.php",
            dataType: "json",
            // async: false,
            data: {
                die_number: dieNumber,
            },
        })
        .done(function(data) {
            // console.log(data);
            makeDieSelectDom(data);
        })
        .fail(function() {
            alert("DB connect error");
        });
}

function makeDieSelectDom(data) {
    $("#die-number__select > option").remove();
    $("#die-number__select").append($("<option>").val(0).html("NO select"));
    data.forEach(function(value) {
        $("#die-number__select").append(
            $("<option>").val(value["id"]).html(value["die_number"])
        );
    });
}

$(function() {
    if (0 == $(this).val()) {
        ajaxSelNbn();
    }
    ajaxSelNbn();
});

// die select ====================================================
$(document).on("change", "#die-number__select", function() {
    if ("0" != $(this).val()) {
        $(this).removeClass("no-input").addClass("complete-input");
        $(".u").each(function() {
            $(this).val("");
            $(this).removeClass("complete-input").addClass("no-input");
        });
    } else {
        $(this).removeClass("complete-input").addClass("no-input");
    }
    ajaxSelProductionNumber($(this).val());
});

function ajaxSelProductionNumber(dies_id) {
    let specificWeight;
    let die_diamater;
    $.ajax({
            type: "POST",
            url: "./php/MakingPressDirective/SelProductionNumber.php",
            dataType: "json",
            // async: false,
            data: {
                dies_id: dies_id,
            },
        })
        .done(function(data) {
            // console.log(data);
            if (data[0]) {
                specificWeight = data[0]["specific_weight"];
                // console.log(data[0]["specific_weight"]);
                specificWeight = Math.round(specificWeight * 100) / 100 + " kg/m";
                $("#production-name__display").html(data[0]["production_number"]);
                die_diamater = data[0]["die_diamater"];
                die_diamater = "&Phi;" + data[0]["die_diamater"] + "mm";
                $("#die-dimension__display").html(die_diamater);
                $("#specific-weight__display").html(specificWeight);
            } else {
                $("#production-name__display").html("");
                $("#specific-weight__display").html("");
            }
            ajaxSelSummary($("#die-number__select").val());
        })
        .fail(function() {
            alert("DB connect error");
        });
}

// date ====================================================
$(document).on("change", "#date__input", function() {
    $(this).removeClass("no-input").addClass("complete-input");
});

$(document).on("keydown", "#date__input", function(e) {
    chkMoveNext(e, $(this), $("#discard-thikness__input"));
});

function fillToday() {
    // 本日の日付をyy-mm-dd形式で返す
    let dt = new Date();
    let y = dt.getFullYear();
    let m = ("00" + (dt.getMonth() + 1)).slice(-2);
    let d = ("00" + dt.getDate()).slice(-2);
    return y + "-" + m + "-" + d;
}

// discard ====================================================
$(document).on("keyup", "#discard-thikness__input", function() {
    if (0 < $(this).val() && $(this).val() < 150) {
        $(this).removeClass("no-input").addClass("complete-input");
    } else {
        $(this).removeClass("complete-input").addClass("no-input");
    }
});

$(document).on("keydown", "#discard-thikness__input", function(e) {
    chkMoveNext(e, $(this), $("#pressing-type__select"));
});

// pressing type ====================================================
$(document).on("change", "#pressing-type__select", function(e) {
    if (0 != $(this).val())
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("keydown", "#pressing-type__select", function(e) {
    chkMoveNext(e, $(this), $("#ram-speed__input"));
});

// Ram Speed ====================================================
$(document).on("keyup", "#ram-speed__input", function(e) {
    if (0 < $(this).val() && $(this).val() < 50)
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("keydown", "#ram-speed__input", function(e) {
    chkMoveNext(e, $(this), $("#billet-length__select"));
});

// Billet Length ====================================================
$(document).on("change", "#billet-length__select", function(e) {
    if (0 != $(this).val())
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("keydown", "#billet-length__select", function(e) {
    chkMoveNext(e, $(this), $("#billet-temperature__input"));
});

// Billet Tempareture ====================================================
$(document).on("keyup", "#billet-temperature__input", function() {
    if (400 < $(this).val() && $(this).val() < 550)
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("keydown", "#billet-temperature__input", function(e) {
    chkMoveNext(e, $(this), $("#billet-taper-heating__select"));
});

// Billet Taper  ====================================================
$(document).on("change", "#billet-taper-heating__select", function() {
    if ("-1" != $(this).val())
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("keydown", "#billet-taper-heating__select", function(e) {
    chkMoveNext(e, $(this), $("#billet-size__select"));
});

// Billet Size  ====================================================
$(document).on("change", "#billet-size__select", function() {
    if (0 != $(this).val())
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("keydown", "#billet-size__select", function(e) {
    chkMoveNext(e, $(this), $("#billet-input-qty__input"));
});

// Billet Input Qty  ====================================================
$(document).on("keyup", "#billet-input-qty__input", function() {
    if (
        0 < Number($(this).val()) &&
        Number($(this).val()) < 100 &&
        $(this).val() != ""
    )
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("keydown", "#billet-input-qty__input", function(e) {
    chkMoveNext(e, $(this), $("#die-temperature__input"));
});

// Die Temperature  ====================================================
$(document).on("keyup", "#die-temperature__input", function() {
    if (400 < $(this).val() && $(this).val() < 550)
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("keydown", "#die-temperature__input", function(e) {
    chkMoveNext(e, $(this), $("#die-heating-time__input"));
});

// Die heating time  ====================================================
$(document).on("keyup", "#die-heating-time__input", function() {
    if (1 < $(this).val() && $(this).val() < 8)
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
});

// $(document).on("keydown", "#die-heating-time__input", function(e) {
//     chkMoveNext(e, $(this), $("#bolster__select"));
// });

// Bolster  ====================================================
// $(document).on("focus", "#bolster__select", function() {
//     if (0 == $(this).val()) {
//         ajaxSelBolster();
//     }
// });

// $(document).on("change", "#bolster__select", function() {
//     if (0 != $(this).val())
//         $(this).removeClass("no-input").addClass("complete-input");
//     else $(this).removeClass("complete-input").addClass("no-input");
// });

$(document).on("keydown", "#bolster__select", function(e) {
    chkMoveNext(e, $(this), $("#stretch-ratio__input"));
});

function ajaxSelBolster() {
    // dies_id = 2;
    $.ajax({
            type: "POST",
            url: "./php/MakingPressDirective/SelBolster.php",
            dataType: "json",
            async: false,
            data: {
                dies_id: "dummmy",
            },
        })
        .done(function(data) {
            // console.log(data);
            makeBolsterSelectDom(data);
        })
        .fail(function() {
            alert("DB connect error");
        });
}

function makeBolsterSelectDom(data) {
    $("#bolster__select > option").remove();
    $("#bolster__select").append($("<option>").val(0).html("NO select"));
    data.forEach(function(value) {
        $("#bolster__select").append(
            $("<option>").val(value["id"]).html(value["bolster_name"])
        );
    });
}

// Stretch  ====================================================
$(document).on("keyup", "#stretch-ratio__input", function() {
    if (
        0 <= Number($(this).val()) &&
        Number($(this).val()) < 5 &&
        !isNaN($(this).val()) &&
        $(this).val() != ""
    )
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("keydown", "#stretch-ratio__input", function(e) {
    chkMoveNext(e, $(this), $("#incharge__select"));
});

// Incharge  ====================================================
$(document).on("focus", "#incharge__select", function() {
    if (0 == $(this).val()) {
        ajaxSelIncharge();
    }
});

$(document).on("change", "#incharge__select", function() {
    if (0 != $(this).val())
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("keydown", "#incharge__select", function(e) {
    chkMoveNext(e, $(this), $("#sample-position-l__input"));
});

function ajaxSelIncharge() {
    // dies_id = 2;
    $.ajax({
            type: "POST",
            url: "./php/MakingPressDirective/SelIncharge.php",
            dataType: "json",
            async: false,
            data: {
                dies_id: "dummmy",
            },
        })
        .done(function(data) {
            // console.log(data);
            makeInchargeSelectDom(data);
        })
        .fail(function() {
            alert("DB connect error");
        });
}

function makeInchargeSelectDom(data) {
    $("#incharge__select > option").remove();
    $("#incharge__select").append($("<option>").val(0).html("NO select"));
    data.forEach(function(value) {
        $("#incharge__select").append(
            $("<option>").val(value["id"]).html(value["staff_name"])
        );
    });
}

// l Length  ====================================================
$(document).on("keyup", "#sample-position-l__input", function() {
    if (
        0 <= Number($(this).val()) &&
        Number($(this).val()) <= 10 &&
        !isNaN($(this).val()) &&
        $(this).val() != ""
    )
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("keydown", "#sample-position-l__input", function(e) {
    chkMoveNext(e, $(this), $("#sample-position-m__input"));
});

// m Length  ====================================================
$(document).on("keyup", "#sample-position-m__input", function() {
    if (
        0 <= Number($(this).val()) &&
        Number($(this).val()) <= 30 &&
        !isNaN($(this).val()) &&
        $(this).val() != ""
    )
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("keydown", "#sample-position-m__input", function(e) {
    chkMoveNext(e, $(this), $("#sample-position-n__input"));
});

// n Length  ====================================================
$(document).on("keyup", "#sample-position-n__input", function() {
    if (
        1 <= Number($(this).val()) &&
        Number($(this).val()) <= 30 &&
        !isNaN($(this).val()) &&
        $(this).val() != ""
    )
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("keydown", "#sample-position-n__input", function(e) {
    chkMoveNext(e, $(this), $("#nbn__select"));
});

// nBn  ====================================================
$(document).on("focus", "#nbn__select", function() {
    if (0 == $(this).val()) {
        ajaxSelNbn();
    }
    ajaxSelNbn();
});

function ajaxSelNbn() {
    // dies_id = 2;
    $.ajax({
            type: "POST",
            url: "./php/MakingPressDirective/Selnbn.php",
            dataType: "json",
            // async: false,
            data: {
                dies_id: "dummmy",
            },
        })
        .done(function(data) {
            // console.log(data);
            makeNbnSelectDom(data);
        })
        .fail(function() {
            alert("DB connect error");
        });
}

function makeNbnSelectDom(data) {
    $("#nbn__select > option").remove();
    $("#nbn__select").append($("<option>").val(0).html("NO"));
    data.forEach(function(value) {
        $("#nbn__select").append($("<option>").val(value["id"]).html(value["nbn"]));
    });
}

$(document).on("change", "#nbn__select", function() {
    if (0 != $(this).val())
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("keydown", "#nbn__select", function(e) {
    chkMoveNext(e, $(this), $("#note__textarea"));
});

$(document).on("keydown", "#nbn__select", function(e) {
    chkMoveNext(e, $(this), $("#note__textarea"));
});
// note  ====================================================
$(document).on("keydown", "#note__textarea", function(e) {
    if ($(this).val().length > 2)
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
});

$(document).on("keydown", "#note__textarea", function(e) {
    chkMoveNext(e, $(this), $("#save__button"));
});

function chkMoveNext(e, thisDom, nextDom) {
    // thisDOM がcomplete-inputクラスなら改行キーでnextDomにフォーカスを移動する
    if (e.keyCode == 13 && thisDom.hasClass("complete-input")) {
        e.preventDefault(); // 入力をキャンセル。これをしないと、移動後、ボタンをクリックしてしまう
        $(nextDom).focus();
    }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- input check to here   -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function ajaxSelSummary(dies_id) {
    // dies_id = 2;
    $.ajax({
            type: "POST",
            url: "./php/MakingPressDirective/SelSummaryV3.php",
            dataType: "json",
            // async: false,
            data: {
                dies_id: dies_id,
            },
        })
        .done(function(data) {
            // console.log(data);
            makeSummaryTable(data);
        })
        .fail(function() {
            alert("DB connect error");
        });
}

function makeSummaryTable(data) {
    let html = "";
    data.forEach(function(element, index) {
        html += "<tr><td>";
        html += element["id"] + "</td><td title = '" + element["dies_id"] + "'>";
        html += element["plan_date_at"] + "</td><td>";
        html += element["discard_thickness"] + "</td><td>";
        html += element["pressing_type"] + "</td><td>";
        html += element["pressing_type_id"] + "</td><td>";
        html += element["ram_speed"] + "</td><td>";
        html += element["billet_length"] + "</td><td>";
        html += element["billet_temperature"] + "</td><td>";
        html += element["billet_taper_heating"] + "</td><td>";
        html += element["die_temperature"] + "</td><td>";
        html += element["die_heating_time"] + "</td><td>";
        html += element["bolster_name"] + "</td><td>";
        html += element["bolstar_id"] + "</td><td>";
        html += element["stretch_ratio"] + "</td><td>";
        html += element["staff_name"] + "</td><td>";
        html += element["incharge_person_id"] + "</td><td>";
        html += element["value_l"] + "</td><td>";
        html += element["value_m"] + "</td><td>";
        html += element["value_n"] + "</td></tr>";
    });

    $("#summary__table tbody").empty();
    $("#summary__table tbody").append(html);
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Press work length   ----------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("change", ".for-work-length", function() {
    if (checkBilletComplete()) {
        ajaxSelSpecificWeight($("#die-number__select").val());
    }
});

function checkBilletComplete() {
    let flag = true;
    $($(".for-work-length")).each(function(element) {
        if ($(this).val() == "0" || $(this).val() == "") flag = false;
    });
    return flag;
}

function ajaxSelSpecificWeight(dies_id) {
    let workLength;
    let billetWeight;
    let containerDimension;
    let inputMaterialWeight;

    $.ajax({
            type: "POST",
            url: "./php/MakingPressDirective/SelSpecificWeight.php",
            dataType: "json",
            // async: false,
            data: {
                dies_id: dies_id,
            },
        })
        .done(function(data) {
            // 製品長さを計算する
            if (Number($("#billet-size__select").val()) == 9) {
                billetWeight = 132.3;
                containerDimension = 237;
            } else if (Number($("#billet-size__select").val()) == 12) {
                billetWeight = 236.7;
                containerDimension = 999;
            }
            inputMaterialWeight =
                billetWeight * (Number($("#billet-length__select").val()) / 1200) -
                (((containerDimension ** 2 / 4) *
                        3.142 *
                        $("#discard-thikness__input").val()) /
                    10 ** 6) *
                2.7;
            workLength = inputMaterialWeight / Number(data[0]["specific_weight"]);
            workLength = workLength / Number(data[0]["hole"]);
            workLength = Math.round(workLength * 10) / 10;
            $("#work-length__display").html(workLength.toFixed(1));
        })
        .fail(function() {
            alert("DB connect error");
        });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- cal work length  ----------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function calPressLength(billetSize, billetLength, specificWeight, whole) {
    let workLength;
    let billetWeight;
    let containerDimension;
    let inputMaterialWeight;

    if (billetSize == 9) {
        billetWeight = 132.3;
        containerDimension = 237;
    } else if (billetSize == 12) {
        billetWeight = 236.7;
        containerDimension = 999;
    }
    inputMaterialWeight =
        billetWeight * (billetLength / 1200) -
        (((containerDimension ** 2 / 4) *
                3.142 *
                $("#discard-thikness__input").val()) /
            10 ** 6) *
        2.7;
    workLength = inputMaterialWeight / specificWeight;
    workLength = workLength / whole;
    workLength = Math.round(workLength * 10) / 10;
    workLength = workLength.toFixed(1);

    return workLength;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- SAVE BUTTON  ----------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#save__button", function() {
    let inputData = new Object();

    inputData = getInputData();
    ajaxInsData(inputData);
    clearInputData(); // データの削除と背景色の設定
});

// 入力終わっているかチェック
$(document).on("change", "div.main__wrapper", function() {
    // console.log(checkInputComplete());
    // if (checkInputComplete() && editMode == false) {
    // if (checkInputComplete() && !editMode) {
    if (checkInputComplete()) {
        $("#save__button").prop("disabled", false);
    } else {
        $("#save__button").prop("disabled", true);
    }
});

// 必要入力箇所の入力が終わっているかチェック　終わっていればtrueを返す
function checkInputComplete() {
    let flag = true;
    // console.log($('.save-data'));
    $("#bolster__select").removeClass("no-input");
    $(".save-data").each(function(index, element) {
        // console.log(element);
        if ($(element).hasClass("no-input")) {
            // console.log($(this));
            flag = false;
        }
    });
    // console.log(flag);
    return flag;
}

function clearInputData() {
    $("input.save-data")
        .val("")
        .removeClass("complete-input")
        .addClass("no-input");
    $("input.need-clear").val("");
    $(".main__wrapper select.need-clear")
        .val(0)
        .removeClass("complete-input")
        .addClass("no-input");
    $("textarea.need-clear").val("");
    $("div.need-clear").html("");
}

function getInputData() {
    let inputData = new Object();
    // .save-dataを持っている要素から値を取り出す
    $(".save-data").each(function(index, element) {
        inputData[$(this).attr("id")] = $(this).val();
    });
    // 日付はYY-mm-dd形式なのでYYYY-mm-dd形式に変更
    // inputData["date__input"] = "20" + inputData["date__input"];
    inputData["date__input"] = inputData["date__input"];
    // targetId を別途保存
    inputData["targetId"] = $("#selected__tr").find("td").eq(0).html();
    // 今日の日付
    inputData["created_at"] = fillToday();
    // 型番の取得
    inputData["die-number"] = $("#die-number__select option:selected").text();
    // 品番の取得
    inputData["production-number"] = $("#production-name__display").html();
    // 押出種別
    inputData["press-type"] = $("#pressing-type__select option:selected").text();
    // 押出長
    inputData["work-length"] = $("#work-length__display").text();

    return inputData;
}

function ajaxInsData(inputData) {
    $.ajax({
            type: "POST",
            url: "./php/MakingPressDirective/InsDataV3.php",
            dataType: "json",
            // async: false,
            data: inputData,
        })
        .done(function(data) {
            // ajaxSelSummary(); // テーブルの再表示
            ajaxSelProductionNumber($("#die-number__select").val()); // summary テーブルの再表示
            clearInputData(); // データの削除と背景色の設定
            // 今日の日付の代入
            $("#date__input")
                .val(fillToday())
                .removeClass("no-input")
                .addClass("complete-input")
                .focus();
            $("#save__button").prop("disabled", true);
            $("#update__button").prop("disabled", true);
            $("#print__button").prop("disabled", true);
            $("#print__button_2").prop("disabled", true);
        })
        .fail(function(data) {
            alert("DB connect error");
            // console.log(data)
        });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Update BUTTON  ----------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#update__button", function() {
    if (!checkInputComplete()) {
        console.log("input not complete");
        return false;
    }
    inputData = getInputData();
    // return false;
    ajaxUpdateData(inputData);
});

function ajaxUpdateData(inputData) {
    $.ajax({
            type: "POST",
            url: "./php/MakingPressDirective/UpdateDataV2.php",
            dataType: "json",
            // async: false,
            data: inputData,
        })
        .done(function(data) {
            ajaxSelProductionNumber($("#die-number__select").val()); // summary テーブルの再表示
            clearInputData(); // データの削除と背景色の設定
            $("#update__button").prop("disabled", true); // update ボタン非活性化
            $("#print__button").prop("disabled", true); // print ボタン非活性化
            $("#print__button_2").prop("disabled", true); // print ボタン非活性化
            // 今日の日付の代入
            $("#date__input")
                .val(fillToday())
                .removeClass("no-input")
                .addClass("complete-input")
                .focus();
            editMode = false; // 編集モードをOFF
        })
        .fail(function(data) {
            alert("DB connect error");
        });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Summary Table ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#summary__table tr", function(e) {
    if (!$(this).hasClass("selected-record")) {
        // tr に class を付与し、選択状態の background colorを付ける
        $(this).parent().find("tr").removeClass("selected-record");
        $(this).addClass("selected-record");
        // tr に id を付与する
        $("#selected__tr").removeAttr("id");
        $(this).attr("id", "selected__tr");
        ajaxSelSelData($("#selected__tr").find("td").eq(0).html()); // 選択レコードのデータ読出
        editMode = true;

        ajaxSelSpecificWeight($("#die-number__select").val()); // 製品長さ計算

        $("#save__button").prop("disabled", false);
        $("#update__button").prop("disabled", false);
        $("#print__button").prop("disabled", false);
        $("#print__button_2").prop("disabled", false);
    } else {
        // 選択レコードを再度クリックした時
        // 削除問い合わせダイアログ
        deleteDialog.showModal();
    }
});

// deleteダイアログのキャンセルボタンが押されたとき
$(document).on("click", "#delete-dialog-cancel__button", function() {
    deleteDialog.close();
});

// deleteダイアログの削除ボタンが押されたとき
$(document).on("click", "#delete-dialog-delete__button", function() {
    let targetId;
    targetId = $("#selected__tr").find("td").eq(0).text();
    ajaxDelSelData(targetId);
    deleteDialog.close();
});

function ajaxDelSelData(targetId) {
    $.ajax({
            type: "POST",
            url: "./php/MakingPressDirective/DelSelData.php",
            dataType: "json",
            // async: false,
            data: {
                id: targetId,
            },
        })
        .done(function() {
            ajaxSelProductionNumber($("#die-number__select").val());
            $("#update__button").prop("disabled", true);
            clearInputData(); // 入力枠の削除
        })
        .fail(function() {
            alert("DB connect error");
        });
}

function ajaxSelSelData(targetId) {
    $.ajax({
            type: "POST",
            url: "./php/MakingPressDirective/SelSelDataV3.php",
            dataType: "json",
            async: false,
            data: {
                targetId: targetId,
            },
        })
        .done(function(data) {
            fillReadData(data);
            chekAllInputValue(); // checking read data
        })
        .fail(function(data) {
            alert("DB connect error");
            // console.log(data)
        });
}

function fillReadData(data) {
    let targetDom;
    // --- html 要素への書き込み ----
    targetDom = $(".main__wrapper .previous-value__display");
    // 金型加熱時間の数字の丸め。小数点0埋め。
    data[0]["die_heating_time"] = (
        Math.round(data[0]["die_heating_time"] * 10) / 10
    ).toFixed(1);
    // ストレッチ 小数点0埋め。
    data[0]["stretch_ratio"] = (
        Math.round(data[0]["stretch_ratio"] * 100) / 100
    ).toFixed(2);
    // サンプル取得開始位置
    data[0]["value_l"] = (Math.round(data[0]["value_l"] * 10) / 10).toFixed(1);

    targetDom.eq(0).html(data[0]["plan_date_at"]);
    targetDom.eq(2).html(data[0]["discard_thickness"] + "mm");
    targetDom.eq(3).html(data[0]["pressing_type"]);
    targetDom.eq(4).html(data[0]["ram_speed"] + "mm");
    targetDom.eq(5).html(data[0]["billet_length"] + "mm");
    targetDom.eq(6).html(data[0]["billet_temperature"] + "&#8451;");
    targetDom.eq(7).html(data[0]["billet_taper_heating"] + "&#8451;/m");
    targetDom.eq(8).html(data[0]["billet_size"] + " inch");
    targetDom.eq(9).html(data[0]["billet_input_quantity"]);
    targetDom.eq(10).html(data[0]["die_temperature"] + "&#8451;");
    targetDom.eq(11).html(data[0]["die_heating_time"] + " h");
    targetDom.eq(12).html(data[0]["bolster_name"]);
    targetDom.eq(13).html(data[0]["stretch_ratio"] + "%");
    targetDom.eq(14).html(data[0]["staff_name"]);
    targetDom.eq(15).html(data[0]["value_l"] + "m");
    targetDom.eq(16).html(data[0]["value_m"] + "pic");
    targetDom.eq(17).html(data[0]["value_n"] + "pic");
    targetDom.eq(18).html(data[0]["nbn"]);
    targetDom.eq(19).html(data[0]["previous_press_note"]);

    // --- input select 要素への書き込み ----
    targetDom = $(".main__wrapper .save-data");

    targetDom.eq(0).val(data[0]["plan_date_at"]);
    targetDom.eq(1).val(data[0]["discard_thickness"]);
    targetDom.eq(2).val(data[0]["pressing_type_id"]);
    targetDom.eq(3).val(data[0]["ram_speed"]);
    targetDom.eq(4).val(data[0]["billet_length"]);
    targetDom.eq(5).val(data[0]["billet_temperature"]);
    targetDom.eq(6).val(data[0]["billet_taper_heating"]);
    targetDom.eq(7).val(data[0]["billet_size"]);
    targetDom.eq(8).val(data[0]["billet_input_quantity"]);
    targetDom.eq(9).val(data[0]["die_temperature"]);
    targetDom.eq(10).val(data[0]["die_heating_time"]);
    targetDom.eq(11).val(data[0]["bolstar_id"]);
    targetDom.eq(12).val(data[0]["stretch_ratio"]);
    targetDom.eq(13).val(data[0]["incharge_person_id"]);
    targetDom.eq(14).val(data[0]["value_l"]);
    targetDom.eq(15).val(data[0]["value_m"]);
    targetDom.eq(16).val(data[0]["value_n"]);
    targetDom.eq(17).val(data[0]["nbn_id"]);
    targetDom.eq(18).val(data[0]["previous_press_note"]);

    // 背景色を変更すする
    $(".need-clear").removeClass("no-input").addClass("complete-input");
    // update ボタンの活性化
    $("#update__button").prop("disabled", false);
    return;
}

function fillReadDataOrg(data) {
    let targetDom;
    // input要素への値の代入
    targetDom = $(".input-blocks__wrapper input");
    targetDom.eq(0).val(data[0]["press_date_at"]);
    targetDom.eq(5).val(data[0]["billet_lot_number"]);
    targetDom.eq(8).val(data[0]["plan_billet_quantities"]);
    targetDom.eq(9).val(data[0]["actual_billet_quantities"]);
    targetDom.eq(10).val(data[0]["stop_code"]);
    targetDom.eq(11).val(data[0]["press_start_at"]);
    targetDom.eq(12).val(data[0]["press_finish_at"]);
    targetDom.eq(13).val(data[0]["actual_ram_speed"]);
    targetDom.eq(14).val(data[0]["actual_die_temperature"]);

    // select 要素への値の代入
    // option値が動的に変わるselectはoption値を代入する
    $("#die__select")
        .empty()
        .append($("<option>").html(data[0]["die_number"]).val(data[0]["dies_id"]));
    $("#stop-cause__select")
        .empty()
        .append(
            $("<option>")
            .html(data[0]["stop_code"])
            .val(data[0]["press_stop_cause_id"])
        );
    // option値が静的な場合、value値だけ代入する
    $("#is-washed__select").val(data[0]["is_washed_die"]);
    $("#machine-number__select").val(data[0]["press_machine_no"]);
    $("#pressing-type__select").val(data[0]["press_machine_no"]);
    $("#billet-size__select").val(data[0]["billet_size"]);
    $("#billet-length__select").val(data[0]["billet_length"]);
    $("#name__select")
        .empty()
        .append($("<option>").html(data[0]["staff_name"]).val(data[0]["staff_id"]));

    // 背景色を変更すする
    $(".need-clear").removeClass("no-input").addClass("complete-input");
    // update ボタンの活性化
    $("#update__button").prop("disabled", false);
}

function ajaxSelForExcel(targetId) {
    let pressLength;
    // targetId = 5;
    // targetId = targetId + "%";
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
            // press length を再計算する
            pressLength = calPressLength(
                data[0]["billet_size"],
                data[0]["billet_length"],
                data[0]["specific_weight"],
                data[0]["hole"]
            );
            data[0]["press_length"] = pressLength;
            // console.log(data);
            // return false;
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
            // url: "./py/MakingPressDirective.py",
            url: "./py/MakingPressDirective.py",
            // url: "./py/recieve.py",
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

$(document).on("click", "#select-die__title", function() {
    window.open("./MakingPressDirective_sub1.html");
});

$(document).on("click", "#print__button", function() {
    ajaxSelForExcel($("#selected__tr").find("td").eq(0).html());
});

function chekAllInputValue() {
    $(".save-data").each(function() {
        if (Number($(this).val()) != 0 && $(this).val() != "") {
            $(this).removeClass("no-input").addClass("complete-input");
        } else {
            $(this).removeClass("complete-input").addClass("no-input");
        }
    });
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- test button ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#test__button", function() {
    chekAllInputValueNew();
});

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

$(document).on("click", "#production-name__display", function () {
    window.open(
      "./ViewDrawing.html",
      null,
      "width=700, height=560,toolbar=yes,menubar=yes,scrollbars=no"
    );
    console.log($(this).html());
    var fileName = "./php/MakingPressDirective/SelSelFile.php";
    var sendData = {
        production_number: $(this).html()
    };
    myAjax.myAjax(fileName, sendData);
    console.log(ajaxReturnData[0].file_url);

});



$(function(){
	$('#print__button_2').click(function(){
		var fileName = "./php/MakingPressDirective/SelForExcelV3.php";
		var sendData = {
			targetId: $("#selected__tr").find("td").eq(0).html(),
		};
		myAjax.myAjax(fileName, sendData);
		var die_number = ajaxReturnData[0].die_number;
		var production_number = ajaxReturnData[0].production_number;
		var plan_date_at = ajaxReturnData[0].plan_date_at;
		var pressing_type = ajaxReturnData[0].pressing_type;
		var press_length = ajaxReturnData[0].press_length + "m";
		var production_length = Number(ajaxReturnData[0].production_length)*1000 + "mm";
        var material = ajaxReturnData[0].material;
		var specific_weight = ajaxReturnData[0].specific_weight + "kg/m";
		var ratio =  Math.round(ajaxReturnData[0].ratio,2);
		var nbn = ajaxReturnData[0].nbn + "*" + ajaxReturnData[0].hole;
		var previous_press_note = ajaxReturnData[0].previous_press_note;
		var staff_name = ajaxReturnData[0].staff_name;
        var issue_date = ajaxReturnData[0].issue_date;
		var plan_pressing_time = ajaxReturnData[0].plan_pressing_time;
		var billet_input_quantity = ajaxReturnData[0].billet_input_quantity + "billet";
		var billet_length = ajaxReturnData[0].billet_length + "mm";
		var discard_thickness = ajaxReturnData[0].discard_thickness + "mm";
        var ram_speed = ajaxReturnData[0].ram_speed + "mm/s";
		var work_speed2 = ajaxReturnData[0].work_speed2 + "m/min";
		var work_speed = ajaxReturnData[0].work_speed + "m/min";
		var billet_temperature = ajaxReturnData[0].billet_temperature + "°C";
		var billet_taper_heating = ajaxReturnData[0].billet_taper_heating + "°C/m";
        var billet_t = billet_temperature + "-" + billet_taper_heating;
		var die_temperature = ajaxReturnData[0].die_temperature + "°C";
        var die_heating_time = ajaxReturnData[0].die_heating_time + "h";
		var stretch_ratio = ajaxReturnData[0].stretch_ratio + "%";
		var cooling_type = ajaxReturnData[0].cooling_type;
		var billet_size = ajaxReturnData[0].billet_size + "Inch";
		var bolster_name = ajaxReturnData[0].bolster_name;
		var die_ring = "DR" + ajaxReturnData[0].bolster_name.substring(1, 5);
        var value_l = ajaxReturnData[0].value_l;
		var value_m = ajaxReturnData[0].value_m;
		var value_n = ajaxReturnData[0].value_n;
        var cut = value_m + "-" + value_n;
		var hole = ajaxReturnData[0].hole;
		var prsTimePL = Math.round(Number(ajaxReturnData[0].press_length)*Number(ajaxReturnData[0].billet_input_quantity)/Number(ajaxReturnData[0].work_speed)) + "min";

        let pullerF;
        if(ajaxReturnData[0].specific_weight >= 12) {
            pullerF = 130;
        } else if(5 <= ajaxReturnData[0].specific_weight < 12) {
            pullerF = 90;
        } else if(3 <= ajaxReturnData[0].specific_weight < 5) {
            pullerF = 70;
        } else if(ajaxReturnData[0].specific_weight < 3) {
            pullerF = 50;
        }

		var _el = $('<div style="width : 790px; display: flex; flex-direction: row;">');
		var _head = $('head').clone();
			_head.find('title').text("Etching - Print View");

		var page1 = `
		
<style>
body {
    width : 790px;
    height: auto;
    display: flex;
    flex-direction: column;
}
table thead th {
    border: 1px solid black;
    margin: 0px;
    background-color: white;
    color: black;
}
table td, table th {
    border: 1px solid black;
    margin: 0px;
    font-size: 8px;
}
</style>
<div style="width : 790px; height: 1100px; display: flex; flex-direction: row;">
<div style="width : 5%; height: 100%;">
</div>
<div style="width : 98%; height: 100%; display: flex; flex-direction: column;">
<div style="width: 100%; height: 3%; display: flex; border: none; flex-direction: row; justify-content: space-evenly; margin-top : 10px">
    <img src="./lib/logo.png" style="width : auto; height : 70%; margin-top: 10px;">
    <h3 style="width: auto; height: 70%; border: none; padding: 0; margin: 0; margin-top: 10px;">PHIẾU THÔNG TIN SẢN XUẤT</h3>
</div>
<div style="width : 100%; height: 100%; display: flex; flex-direction: column;">
    <div style="width : 100%; height: 7%; display : flex; flex-direction: row">
        <div style="height: 100%;">
            <table style="overflow: auto; width : auto;">
                <tbody style="overflow: auto; height: 60px;">
                    <tr>
                        <td style="width: 65px;">Ngày tạo phiếu</td>
                        <td style="width: 80px;">${issue_date}</td>
                        <td style="width: 50px;">Ngày đùn</td>
                        <td style="width: 60px;">${plan_date_at}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgb(0, 0, 0);">
                        <td style="width: 65px;">Người tạo phiếu</td>
                        <td style="width: 80px;">${staff_name}</td>
                        <td style="width: 50px;">Loại sản xuất</td>
                        <td style="width: 60px;">${pressing_type}</td>
                    </tr>
                    <tr>
                        <td style="width: 65px;">Mã khuôn</td>
                        <td style="width: 80px;">${die_number}</td>
                        <td style="width: 50px;">Vòng khuôn</td>
                        <td style="width: 60px;">${die_ring}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgb(0, 0, 0);">
                        <td style="width: 65px;">Mã sản phẩm</td>
                        <td style="width: 80px;">${production_number}</td>
                        <td style="width: 50px;">Đệm khuôn</td>
                        <td style="width: 60px;">${bolster_name}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div style="height: 100%; margin-left : 5px;">
            <table style="overflow: auto; width : auto;">
                <tbody style="overflow: auto; height: 60px;">
                    <tr>
                        <td style="width: 20px;"rowspan="2">Billet</td>
                        <td style="width: 55px;">Mã vật liệu</td>
                        <td style="width: 35px;">${material}</td>
                        <td style="width: 45px;">Xuất xứ</td>
                        <td style="width: 30px;">DB/VN</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgb(0, 0, 0);">
                        <td style="width: 55px;">Chiều dài</td>
                        <td style="width: 35px;">${billet_length}</td>
                        <td style="width: 45px;">Kích thước</td>
                        <td style="width: 30px;">${billet_size}</td>
                    </tr>
                    <tr>
                        <td style="width: 25px;"rowspan="2">SP đùn</td>
                        <td style="width: 55px;">Khối lượng/m</td>
                        <td style="width: 35px;">${specific_weight}</td>
                        <td style="width: 45px;">Tỷ lệ đùn</td>
                        <td style="width: 30px;">${ratio}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgb(0, 0, 0);">
                        <td style="width: 55px;">Chiều dài đùn</td>
                        <td style="width: 35px;">${press_length}</td>
                        <td style="width: 45px;">Chế độ đùn</td>
                        <td style="width: 30px;">${nbn}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div style="height: 100%; margin-left : 5px;">
            <table style="overflow: auto; width : auto;">
                <tbody style="overflow: auto; height: 60px;">
                    <tr>
                        <td style="width: 40px;">Ngày cắt</td>
                        <td style="width: 55px;">&#160&#160&#160&#160&#160&#160/&#160&#160&#160&#160&#160&#160/&#160&#160&#160&#160&#160&#160</td>
                        <td style="width: 35px;">Bắt đầu</td>
                        <td style="width: 45px;"></td>
                        <td style="width: 35px;">Kết thúc</td>
                        <td style="width: 45px;"></td>
                    </tr>
                    <tr>
                        <td style="width: 40px;">Tên NV</td>
                        <td style="width: 55px;" colspan="2"></td>
                        <td style="width: 35px;" colspan="2">Tổng thành phẩm</td>
                        <td style="width: 45px;"></td>
                    </tr>
                    <tr>
                        <td style="width: 40px;">KL pp cắt</td>
                        <td style="width: 55px;"></td>
                        <td style="width: 35px;">Mẫu</td>
                        <td style="width: 45px;"></td>
                        <td style="width: 35px;">SL Rack</td>
                        <td style="width: 45px;"></td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgb(0, 0, 0);">
                        <td style="width: 40px;">SP dài YC</td>
                        <td style="width: 55px;">${production_length}</td>
                        <td style="width: 35px;">SP dài TT</td>
                        <td style="width: 45px;"></td>
                        <td style="width: 35px;">SL cắt TB</td>
                        <td style="width: 45px;">${cut}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div style="width : 100%; height: 100%; display: flex;">
        <div style="width: 34%; height: 100%; display:flex; flex-direction:column; margin-right: 10px">
            <table style="overflow: auto; width : auto; margin-top: 5px; border: 1px solid rgb(0, 0, 0);">
                <thead>
                    <tr style="border: 1px solid rgb(0, 0, 0);">
                        <th style="width: 80px;">Số bundle</th>
                        <th style="width: 80px;">Số lượng</th>
                        <th style="width: 100px;">Lot</th>
                    </tr>
                </thead>
                <tbody style="overflow: auto; height: auto;">
                    <tr style="height: 15px">
                        <td style="width: 80px;"></td>
                        <td style="width: 80px;"></td>
                        <td style="width: 100px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 80px;"></td>
                        <td style="width: 80px;"></td>
                        <td style="width: 100px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 80px;"></td>
                        <td style="width: 80px;"></td>
                        <td style="width: 100px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 80px;"></td>
                        <td style="width: 80px;"></td>
                        <td style="width: 100px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 80px;"></td>
                        <td style="width: 80px;"></td>
                        <td style="width: 100px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 80px;"></td>
                        <td style="width: 80px;"></td>
                        <td style="width: 100px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 80px;"></td>
                        <td style="width: 80px;"></td>
                        <td style="width: 100px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 80px;"></td>
                        <td style="width: 80px;"></td>
                        <td style="width: 100px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 80px;"></td>
                        <td style="width: 80px;"></td>
                        <td style="width: 100px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 80px;"></td>
                        <td style="width: 80px;"></td>
                        <td style="width: 100px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 80px;"></td>
                        <td style="width: 80px;"></td>
                        <td style="width: 100px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 80px;"></td>
                        <td style="width: 80px;"></td>
                        <td style="width: 100px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 80px;"></td>
                        <td style="width: 80px;"></td>
                        <td style="width: 100px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 80px;"></td>
                        <td style="width: 80px;"></td>
                        <td style="width: 100px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 80px;"></td>
                        <td style="width: 80px;"></td>
                        <td style="width: 100px;"></td>
                    </tr>
                </tbody>
            </table>
            <table style="overflow: auto; width : auto; margin-top: 5px; border: 1px solid rgb(0, 0, 0);">
                <thead>
                    <tr style="border: 1px solid rgb(0, 0, 0);">
                        <th style="width: 260px;">Thông số đùn</th>
                    </tr>
                </thead>
                <tbody style="overflow: auto; height: auto;">
                    <tr style="height: 15px">
                        <td style="width: 70px;" colspan="2">Thiết đặt</td>
                        <td style="width: 60px;" colspan="2">Thực tế</td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 60px;">Thời gian đùn</td>
                        <td style="width: 70px;">${prsTimePL}</td>
                        <td style="width: 60px;">Thời gian đùn</td>
                        <td style="width: 70px; text-align: center;">-</td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 60px;">Billet dự kiến</td>
                        <td style="width: 70px;">${billet_input_quantity}</td>
                        <td style="width: 60px;">Billet thực tế</td>
                        <td style="width: 70px; text-align: center;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 60px;">Tốc độ SP</td>
                        <td style="width: 70px;">${work_speed}</td>
                        <td style="width: 60px;">Ngày đùn</td>
                        <td style="width: 70px; text-align: center;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 60px;">Tốc độ đùn</td>
                        <td style="width: 70px;">${ram_speed}</td>
                        <td style="width: 60px;">Người thao tác</td>
                        <td style="width: 70px; text-align: center;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 60px;">Nhiệt độ billet</td>
                        <td style="width: 70px;">${billet_t}</td>
                        <td style="width: 60px;">Nhiệt độ billet</td>
                        <td style="width: 70px; text-align: center;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 60px;">Kích thước đuôi</td>
                        <td style="width: 70px;">${discard_thickness}</td>
                        <td style="width: 60px;">Nhiệt độ diering</td>
                        <td style="width: 70px; text-align: center;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 60px;">Nhiệt độ khuôn</td>
                        <td style="width: 70px;">${die_temperature}</td>
                        <td style="width: 60px;">Nhiệt độ khuôn</td>
                        <td style="width: 70px; text-align: center;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 60px;">Tỉ lệ kéo</td>
                        <td style="width: 70px;">${stretch_ratio}</td>
                        <td style="width: 60px;">Nhiệt độ bolter</td>
                        <td style="width: 70px; text-align: center;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 60px;">TG nung khuôn</td>
                        <td style="width: 70px;">${die_heating_time}</td>
                        <td style="width: 60px;">TG nung khuôn</td>
                        <td style="width: 70px; text-align: center;">～</td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 60px;">Kiểu làm mát</td>
                        <td style="width: 70px;">${cooling_type}</td>
                        <td style="width: 60px;">Ngâm kiềm</td>
                        <td style="width: 70px; text-align: center;">Yes&#160&#160&#160&#160&#160&#160 No</td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 60px;">Lực kéo Puller</td>
                        <td style="width: 70px;">${pullerF}</td>
                        <td style="width: 60px;">Điều kiện ủ</td>
                        <td style="width: 70px; text-align: center;"></td>
                    </tr>
                </tbody>
            </table>
            <table style="overflow: auto; width : auto; margin-top: 5px; border: 1px solid rgb(0, 0, 0);">
                <thead>
                    <tr style="border: 1px solid rgb(0, 0, 0);">
                        <th style="width: 260px;">Nhiệt độ container</th>
                    </tr>
                </thead>
                <tbody style="overflow: auto; height: auto;">
                    <tr>
                        <td style="width: 80px;">Vị trí đo</td>
                        <td style="width: 90px;">Phía stem</td>
                        <td style="width: 90px;">Phía khuôn</td>
                    </tr>
                    <tr>
                        <td style="width: 80px;">Trước đùn</td>
                        <td style="width: 90px;"></td>
                        <td style="width: 90px;"></td>
                    </tr>
                    <tr>
                        <td style="width: 80px;">Sau đùn</td>
                        <td style="width: 90px;"></td>
                        <td style="width: 90px;"></td>
                    </tr>
                </tbody>
            </table>
            <table style="overflow: auto; width : auto; margin-top: 5px; border: 1px solid rgb(0, 0, 0);">
                <thead>
                    <tr style="border: 1px solid rgb(0, 0, 0);">
                        <th style="width: 260px;">Theo dõi quá trình đùn</th>
                    </tr>
                </thead>
                <tbody style="overflow: auto; height: auto;">
                    <tr>
                        <td style="width: 40px;" rowspan="2">Hạng mục</td>
                        <td style="width: 110px;" colspan="3">Vị trí Ram 1000/400mm</td>
                        <td style="width: 110px;" colspan="3">Vị trí Ram 200mm</td>
                    </tr>
                    <tr>
                        <td>Tốc độ đùn</td>
                        <td>Áp suất Main Ram</td>
                        <td>Nhiệt độ cửa ra</td>
                        <td>Tốc độ đùn</td>
                        <td>Áp suất Main Ram</td>
                        <td>Nhiệt độ cửa ra</td>
                    </tr>
                    <tr>
                        <td>No.1 billet</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>No.2 billet</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr style="border-top: 1px solid rgb(0, 0, 0);">
                        <td style="width: 110px;" colspan="2">Sub initial hight</td>
                        <td style="width: 110px;" colspan="5"></td>
                    </tr>
                    <tr>
                        <td style="width: 110px;" colspan="2"> Initial hight</td>
                        <td style="width: 110px;" colspan="5"></td>
                    </tr>
                </tbody>
            </table>
            <div style="display:flex; flex-direction: row;">
            <table style="overflow: auto; width: 130px; margin-top: 5px; border: 1px solid rgb(0, 0, 0);">
                <thead>
                    <tr>
                        <th style="width: 20px;">Stt</th>
                        <th style="width: 50px;">Mã số Rack</th>
                        <th style="width: 50px;">Số SP/Rack</th>
                    </tr>
                </thead>
                <tbody style="overflow: auto; height: auto; width: 130px;">
                    <tr style="height: 15px">
                        <td style="width: 20px;">1</td>
                        <td style="width: 50px;"></td>
                        <td style="width: 50px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 20px;">2</td>
                        <td style="width: 50px;"></td>
                        <td style="width: 50px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 20px;">3</td>
                        <td style="width: 50px;"></td>
                        <td style="width: 50px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 20px;">4</td>
                        <td style="width: 50px;"></td>
                        <td style="width: 50px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 20px;">5</td>
                        <td style="width: 50px;"></td>
                        <td style="width: 50px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 20px;">6</td>
                        <td style="width: 50px;"></td>
                        <td style="width: 50px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 20px;">7</td>
                        <td style="width: 50px;"></td>
                        <td style="width: 50px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 20px;">8</td>
                        <td style="width: 50px;"></td>
                        <td style="width: 50px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 20px;">9</td>
                        <td style="width: 50px;"></td>
                        <td style="width: 50px;"></td>
                    </tr>
                    <tr style="height: 15px">
                        <td style="width: 20px;">10</td>
                        <td style="width: 50px;"></td>
                        <td style="width: 50px;"></td>
                    </tr>
                </tbody>
            </table>
            <div style="width:120px; height: 95%; margin-top: 5px; margin-left: 5px; border: 1px solid rgb(0, 0, 0); font-size: 8px">
                Phân loại lỗi SP:<br/>
                [302] :Cấn móp bề mặt<br/>
                [304] :  Lỗi trầy xước<br/>
                [314] : Vết sần sùi<br/>
                [316] : Rỗ bề mặt<br/>
                [318] : Đen bề mặt
            </div>
        </div>
        <div style="width:98%; height: 120px; margin-top: 5px; border: 1px solid rgb(0, 0, 0); font-size: 8px">
            Ghi chú:
        </div>
        </div>
        <div style="width: 66%; height: 100%; margin-top: 5px;">
            <table style="overflow: auto; width : auto; border: 1px solid rgb(0, 0, 0);">
                <thead>
                    <tr>
                        <th style="width: 10px;">Stt</th>
                        <th style="width: 40px;">SP dài</th>
                        <th style="width: 35px;">Kéo</th>
                        <th style="width: 35px;">Nhám</th>
                        <th style="width: 35px;">Die mark</th>
                        <th style="width: 39px;">Gián đoạn</th>
                        <th style="width: 60px;">Xác nhận</th>
                        <th style="width: 60px;">TG cắt</th>
                        <th style="width: 48px;">Thành phẩm</th>
                        <th style="width: 15px;">302</th>
                        <th style="width: 15px;">304</th>
                        <th style="width: 15px;">314</th>
                        <th style="width: 15px;">316</th>
                        <th style="width: 15px;">318</th>
                    </tr>
                </thead>
                ${makeTable()}
            </table>
        </div>
    </div>
</div>
</div>
<div style="width : 2%; height: 100%;">
</div>
</div>`

		_el.append(_head)
		_el.append(page1);
		var nw = window.open("","","width=1200,height=900,left=250,location=no,titlebar=yes")
			nw.document.write(_el.html())
			nw.document.close()
		setTimeout(() => {
			nw.print()
			setTimeout(() => {
			nw.close()
			}, 200);
		}, 500);
	})
});

function makeTable() {
	var tbd = ``;
    var tr = ``;
	var trC = `<tbody style="height: 100%; overflow: hidden;">`;
	for (i = 1; i <= 70; ++i) {
		tr=`<tr>
                <td style="width: 10px; font-size: 8px;">${i}</td>
                <td style="width: 40px;"></td>
                <td style="width: 35px;"></td>
                <td style="width: 35px;"></td>
                <td style="width: 35px;"></td>
                <td style="width: 37px;"></td>
                <td style="width: 60px;"></td>
                <td style="width: 60px; text-align: center;">:</td>
                <td style="width: 48px;"></td>
                <td style="width: 15px;"></td>
                <td style="width: 15px;"></td>
                <td style="width: 15px;"></td>
                <td style="width: 15px;"></td>
                <td style="width: 15px;"></td>
            </tr>`;
		tbd += tr;
	}
    // console.log(trC + tbd + "</tbody>");
	return trC + tbd + "</tbody>";
};