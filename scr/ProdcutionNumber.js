// category　テーブルの編集モード
let summaryTableEditMode = false;
let category1TableEditMode = false;
let category2TableEditMode = false;

// 削除確認ダイアログ
let summaryDeleteDialog = document.getElementById("summary-delete__dialog");
let category1DeleteDialog = document.getElementById("category1-delete__dialog");
let category2DeleteDialog = document.getElementById("category2-delete__dialog");

$(function () {
  // ajaxSelSummary(); // summary tebale の読み出し

  // ボタンの非活性化
  $("#save__button").prop("disabled", true);
  $("#update__button").prop("disabled", true);
  $("#test__button").hide();
  // test ボタンの表示

  ajaxSelCategory1();
  ajaxSelSummary();
});
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Input Check From Here -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("keyup", "#production_number", function () {
  if ($(this).val().length > 3) {
    $("#save__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
  }
});

$(document).on("click", "#save__button", function () {
  let inputData = new Object();
  inputData = getInputData();
  ajaxInsInputData(inputData);
});

function ajaxInsInputData(inputData) {
  $.ajax({
    type: "POST",
    url: "./php/ProductionNumber/InsInputData.php",
    dataType: "json",
    async: false,
    data: inputData,
  })
    .done(function (data) {
      ajaxSelCategory1();
      ajaxSelSummary();
    })
    .fail(function () {
      alert("DB connect error");
    });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Input Check To Here -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Category1 Table ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#category1__table tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    // tr に class と id を付与する
    $("#category1__tr").removeAttr("id");
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record").attr("id", "category1__tr");
    // 選択アイテムをinput boxに移動、updateボタンを有効化する
    $("#category1__input").val($("#category1__tr").find("td").eq(1).html());
    category1TableEditMode = true;
    $("#category1__button").text("Update").attr("disabled", false);
    // category1 に従って category2 を選ぶ
    ajaxSelCategory2($("#category1__tr").find("td").eq(0).html());
  } else {
    // 削除問い合わせダイアログ
    category1DeleteDialog.showModal();
  }
});

// deleteダイアログのキャンセルボタンが押されたとき
$(document).on("click", "#category1-delete-dialog-cancel__button", function () {
  category1DeleteDialog.close();
});

// deleteダイアログの削除ボタンが押されたとき
$(document).on("click", "#category1-delete-dialog-delete__button", function () {
  let targetId;
  targetId = $("#category1__tr").find("td").eq(0).text();
  ajaxDelCategory1(targetId);
  category1DeleteDialog.close();
});

function ajaxDelCategory1(targetId) {
  $.ajax({
    type: "POST",
    url: "./php/ProductionNumber/DelCategory1.php",
    dataType: "json",
    async: false,
    data: {
      targetId: targetId,
    },
  })
    .done(function (data) {
      ajaxSelCategory1();
    })
    .fail(function () {
      alert("DB connect error");
    });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Category1 Input Frame -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("keyup", "#category1__input", function () {
  if ($(this).val().length > 1) {
    $("#category1__button").prop("disabled", false);
  } else {
    $("#category1__button").prop("disabled", true);
  }
});

$(document).on("click", "#category1__button", function () {
  let updateData = new Object();
  if (category1TableEditMode) {
    // edit mode の時 データベースの値を更新する
    updateData = {
      id: $("#category1__tr").find("td").eq(0).html(),
      val: $("#category1__input").val(),
    };
    // console.log(updateData);
    ajaxUpdateCategory1(updateData);
    category1TableEditMode = false;
    $("#category1__button").text("AddNew").attr("disabled", true);
  } else {
    // edit mode でない時、新規追加
    ajaxInsCategory1($("#category1__input").val());
  }
});

function ajaxUpdateCategory1(updateData) {
  $.ajax({
    type: "POST",
    url: "./php/ProductionNumber/UpdateCategory1.php",
    dataType: "json",
    // async: false,
    data: updateData,
  })
    .done(function (data) {
      ajaxSelCategory1();
      $("#category1__input").val("");
      ajaxSelSummary();
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function ajaxInsCategory1(inputValue) {
  console.log(inputValue);
  $.ajax({
    type: "POST",
    url: "./php/ProductionNumber/InsCategory1.php",
    dataType: "json",
    // async: false,
    data: {
      name_jp: inputValue,
    },
  })
    .done(function (data) {
      ajaxSelCategory1();
      $("#category1__input").val("");
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function ajaxSelCategory1() {
  // console.log(inputValue);
  $.ajax({
    type: "POST",
    url: "./php/ProductionNumber/SelCategory1.php",
    dataType: "json",
    async: false,
    data: {
      name_jp: "dummy",
    },
  })
    .done(function (data) {
      // console.log(data);
      addTableCategory1(data);
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function addTableCategory1(data) {
  let html = "";
  data.forEach(function (element) {
    html += "<tr><td>";
    html += element["id"] + "</td><td>";
    html += element["name_jp"] + "</td><td>";
    html += element["count"] + "</td></tr>";
  });
  $("#category1__table tbody").empty();
  $("#category1__table tbody").append(html);
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Category2 Table ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#category2__table tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    // tr に class と id を付与する
    $("#category2__tr").removeAttr("id");
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record").attr("id", "category2__tr");
    // editモードに変更　表の値をインプット枠に移動
    $("#category2__input").val($("#category2__tr").find("td").eq(1).html());
    category2TableEditMode = true;
    $("#category2__button").text("Update").attr("disabled", false);
  } else {
    // 削除問い合わせダイアログ
    category2DeleteDialog.showModal();
  }
});
// deleteダイアログのキャンセルボタンが押されたとき
$(document).on("click", "#category2-delete-dialog-cancel__button", function () {
  category2DeleteDialog.close();
});

// deleteダイアログの削除ボタンが押されたとき
$(document).on("click", "#category2-delete-dialog-delete__button", function () {
  let targetId;
  targetId = $("#category2__tr").find("td").eq(0).text();
  ajaxDelCategory2(targetId);
  category2DeleteDialog.close();
});

function ajaxDelCategory2(targetId) {
  $.ajax({
    type: "POST",
    url: "./php/ProductionNumber/DelCategory2.php",
    dataType: "json",
    // async: false,
    data: {
      targetId: targetId,
    },
  })
    .done(function (data) {
      ajaxSelCategory2($("#category1__tr").find("td").eq(0).html());
      // console.log($("#category1__tr").find("td").eq(0).html());
    })
    .fail(function () {
      alert("DB connect error");
    });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Category2 Input Frame -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("keyup", "#category2__input", function () {
  if ($(this).val().length > 1) {
    $("#category2__button").prop("disabled", false);
  } else {
    $("#category2__button").prop("disabled", true);
  }
});

$(document).on("click", "#category2__button", function () {
  let updateData = new Object();
  let targetId = $("#category1__tr").find("td").eq(0).html();

  if (category2TableEditMode) {
    updateData = {
      id: $("#category2__tr").find("td").eq(0).html(),
      val: $("#category2__input").val(),
    };
    ajaxUpdateCategory2(updateData);
    category2TableEditMode = false;
    $("#category2__button").text("AddNew").attr("disabled", true);
  } else {
    ajaxInsCategory2($("#category2__input").val(), targetId);
  }
});

function ajaxUpdateCategory2(updateData) {
  console.log(updateData);
  $.ajax({
    type: "POST",
    url: "./php/ProductionNumber/UpdateCategory2.php",
    dataType: "json",
    async: false,
    data: updateData,
  })
    .done(function (data) {
      ajaxSelCategory2($("#category1__tr").find("td").eq(0).html());
      $("#category2__input").val("");
      ajaxSelSummary();
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function ajaxInsCategory2(inputValue, targetId) {
  console.log(inputValue);
  $.ajax({
    type: "POST",
    url: "./php/ProductionNumber/InsCategory2.php",
    dataType: "json",
    // async: false,
    data: {
      targetId: targetId,
      name_jp: inputValue,
    },
  })
    .done(function (data) {
      ajaxSelCategory2($("#category1__tr").find("td").eq(0).html());
      $("#category2__input").val("");
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function ajaxSelCategory2(targetId) {
  // console.log(inputValue);
  $.ajax({
    type: "POST",
    url: "./php/ProductionNumber/SelCategory2.php",
    dataType: "json",
    async: false,
    data: {
      targetId: targetId,
    },
  })
    .done(function (data) {
      addTableCategory2(data);
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function addTableCategory2(data) {
  let html = "";
  data.forEach(function (element) {
    html += "<tr><td>";
    html += element["id"] + "</td><td>";
    html += element["name_jp"] + "</td><td>";
    html += element["count"] + "</td></tr>";
  });
  $("#category2__table tbody").empty();
  $("#category2__table tbody").append(html);
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// -------------------------   Update Button    -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "#update__button", function () {
  let inputData = new Object();

  inputData = getInputData();
  console.log(inputData);
  ajaxUpdateSummary(inputData);
});

function getInputData() {
  let inputData = new Object();
  let category2 = $("#category2__tr").find("td").eq(0).html();
  let dt = new Date();
  // .save-dataを持っている要素から値を取り出す
  $("input.save-data").each(function (index, element) {
    inputData[$(this).attr("id")] = $(this).val();
  });
  $("select.save-data").each(function (index, element) {
    inputData[$(this).attr("id")] = $(this).val();
  });
  // 日付はYY-mm-dd形式なのでYYYY-mm-dd形式に変更
  // inputData["date__input"] = "20" + inputData["date__input"];
  // targetId を別途保存
  inputData["targetId"] = $("#summary__tr").find("td").eq(0).html();
  // production category2 id の取得
  if (category2) {
    inputData["production_category2_id"] = category2;
  } else {
    // 選択されていない時は 0 を代入する
    inputData["production_category2_id"] = "0";
  }
  // 今日の日付の取得
  inputData["updated_at"] =
    dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();

  return inputData;
}

function ajaxUpdateSummary(inputData) {
  $.ajax({
    type: "POST",
    url: "./php/ProductionNumber/UpdateSummary.php",
    dataType: "json",
    async: false,
    data: inputData,
  })
    .done(function (data) {
      // clearInputData(); // データの削除と背景色の設定
      // // 今日の日付の代入
      // $("#date__input")
      //   .val(fillToday())
      //   .removeClass("no-input")
      //   .addClass("complete-input")
      //   .focus();
      $("#update__button").prop("disabled", true); // save ボタン非活性化
      summaryTableEditMode = false;
      clearInputData();
      ajaxSelSummary(); // テーブルの再表示
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function clearInputData() {
  $("input.save-data").val("");
  $("select.need-clear").val(0);
  // 選択を解除する
  $("#category1__tr").removeAttr("id");
  $("#category1__table .selected-record").removeClass("selected-record");
  $("#category2__tr").removeAttr("id");
  $("#category2__table .selected-record").removeClass("selected-record");
  // category　テーブルの入力枠を消去する
  $("#category1__input").val("");
  $("#category1__button").text("AddNew").prop("disabled", true);
  $("#category2__input").val("");
  $("#category2__button").text("AddNew").prop("disabled", true);
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Summary Table -------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function ajaxSelSummary() {
  // console.log(inputValue);
  $.ajax({
    type: "POST",
    url: "./php/ProductionNumber/SelSummary.php",
    dataType: "json",
    // async: false,
    data: {
      targetId: "dummy",
    },
  })
    .done(function (data) {
      // console.log(data);
      addSummaryTable(data);
      ajaxSelSumItems();
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function ajaxSelSumItems() {
  $.ajax({
    type: "POST",
    url: "./php/ProductionNumber/SelPnSum.php",
    dataType: "json",
    // async: false,
    data: {
      targetId: "dummy",
    },
  })
    .done(function (data) {
      $("#summary__footer").html(data[0]["count"] + " items");
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function addSummaryTable(data) {
  let html = "";
  data.forEach(function (element) {
    let specificWeight;
    let crossSectionArea = separate_num(element["cross_section_area"]);
    if (
      !isNaN(element["specific_weight"]) &&
      element["specific_weight"] != null
    ) {
      specificWeight = element["specific_weight"].toFixed(2);
    } else {
      specificWeight = "";
    }
    html += "<tr><td>";
    html += element["id"] + "</td><td>";
    html += element["category1_jp"] + "</td><td>";
    html += element["category2_jp"] + "</td><td>";
    html += element["production_number"] + "</td><td>";
    html += element["drawn_department"] + "</td><td>";
    html += element["billet_material"] + "</td><td>";
    html += element["aging_type"] + "</td><td>";
    // html += element["cross_section_area"] + "</td><td>";
    html += crossSectionArea + "</td><td>";
    html += element["packing_quantity"] + "</td><td>";
    html += specificWeight + " kg/m" + "</td><td>";
    html += element["production_length"] + " m" + "</td></tr>";
  });
  $("#summary__table tbody").empty();
  $("#summary__table tbody").append(html);
}

function separate_num(num) {
  // return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  return String(Math.round(num)).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

function separate(str) {
  return str.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- Summary Table Operate-------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "#summary__table tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    // tr に class を付与し、選択状態の background colorを付ける
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    // tr に id を付与する
    $("#summary__tr").removeAttr("id");
    $(this).attr("id", "summary__tr");
    ajaxSelCategory($("#summary__tr").find("td").eq(0).html());
    ajaxSelSelSummary($("#summary__tr").find("td").eq(0).html());
    // edit mode を有効化する
    summaryTableEditMode = true;
    $("#update__button").prop("disabled", false);
  } else {
    // 削除問い合わせダイアログ
    summaryDeleteDialog.showModal();
  }
});

// deleteダイアログのキャンセルボタンが押されたとき
$(document).on("click", "#summary-delete-dialog-cancel__button", function () {
  summaryDeleteDialog.close();
});

// deleteダイアログの削除ボタンが押されたとき
$(document).on("click", "#summary-delete-dialog-delete__button", function () {
  let targetId;
  targetId = $("#summary__tr").find("td").eq(0).text();
  console.log("hello: " + targetId);

  ajaxDelSummary($("#summary__tr").find("td").eq(0).text());

  summaryDeleteDialog.close();
});

function ajaxDelSummary(targetId) {
  $.ajax({
    type: "POST",
    url: "./php/ProductionNumber/DelSummary.php",
    dataType: "json",
    async: false,
    data: {
      targetId: targetId,
    },
  })
    .done(function (data) {
      // fillInputFrame(data[0]);
      ajaxSelCategory1();
      ajaxSelSummary();
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function ajaxSelSelSummary(targetId) {
  $.ajax({
    type: "POST",
    url: "./php/ProductionNumber/SelSelSummary.php",
    dataType: "json",
    async: false,
    data: {
      targetId: targetId,
    },
  })
    .done(function (data) {
      fillInputFrame(data[0]);
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function fillInputFrame(data) {
  $(".input__area input").eq(0).val(data["production_number"]);
  $(".input__area input").eq(1).val(data["production_length"]);
  $(".input__area input").eq(2).val(data["circumscribed_circle"]);
  $(".input__area input").eq(3).val(data["specific_weight"]);
  $(".input__area input").eq(4).val(data["cross_section_area"]);
  $(".input__area input").eq(5).val(data["packing_quantity"]);
  $(".input__area select").eq(0).val(data["drawn_department"]);
  $(".input__area select").eq(1).val(data["billet_material_id"]);
  $(".input__area select").eq(2).val(data["aging_type_id"]);
}

function ajaxSelCategory(targetId) {
  $.ajax({
    type: "POST",
    url: "./php/ProductionNumber/SelCate2_1.php",
    dataType: "json",
    async: false,
    data: {
      targetId: targetId,
    },
  })
    .done(function (data) {
      // category2 category1 のデータが有るときは、埋める
      if (data.length && data[0]["category1_id"] != 0) {
        setCategory1(data[0]["category1_id"]);
        ajaxSelCategory2($("#category1__tr").find("td").eq(0).html());
        setCategory2(data[0]["category2_id"]);
      } else {
        // 選択を解除する
        $("#category1__tr").removeAttr("id");
        $("#category1__table .selected-record").removeClass("selected-record");
        $("#category2__tr").removeAttr("id");
        $("#category2__table .selected-record").removeClass("selected-record");
      }
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function setCategory1(targetId) {
  // targetId と同じidの tr に class と id を付与し、選択状態にする
  let targetDom;
  targetDom = $("#category1__table tbody tr");
  $("#category1__table tbody tr").each(function (index, element) {
    if ($(element).find("td")[0].innerText == targetId) {
      // 表の第1列の値が targetId と同じなら、 id, classを付与する
      $("#category1__tr").removeAttr("id");
      $(element).parent().find("tr").removeClass("selected-record");
      $(element).addClass("selected-record");
      $(element).attr("id", "category1__tr");
    }
  });
}

function setCategory2(targetId) {
  // targetId と同じidの tr に class と id を付与し、選択状態にする
  let targetDom;
  targetDom = $("#category2__table tbody tr");
  $("#category2__table tbody tr").each(function (index, element) {
    if ($(element).find("td")[0].innerText == targetId) {
      // 表の第1列の値が targetId と同じなら、 id, classを付与する
      $("#category2__tr").removeAttr("id");
      $(element).parent().find("tr").removeClass("selected-record");
      $(element).addClass("selected-record");
      $(element).attr("id", "category2__tr");
    }
  });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- test button ---------------------------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "#test__button", function () {
  // let targetDom;
  // targetDom = $(".input__area");
  // console.log(targetDom);
  // targetDom = $("#production_number");
  // console.log(targetDom);

  // //   if ($(".input__area").hasClass("save-data")) {

  let inputDom;
  let inputData = new Object();

  // .save-dataを持っている要素から値を取り出す
  $("input.save-data").each(function (index, element) {
    inputData[$(this).attr("id")] = $(this).val();
  });
  $("select.save-data").each(function (index, element) {
    inputData[$(this).attr("id")] = $(this).val();
  });
  console.log(inputData);
  // $("input.save-data").each(function (index, element) {
  //   console.log(element);
  //   inputData[$(this).attr("id")] = $(this).val();
  // });

  // console.log(inputData);
});
