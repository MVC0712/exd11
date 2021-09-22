var editMode = "NO";

$(function () {
  ajaxSelAgingRack(); // no aging rack list
  ajaxSelAgingHitory(); // aginged rack list
  $("#aging_date").val(fillToday());
  buttonActivation();
  // console.log("hello");
  $("#test__button").remove();
});

function fillToday() {
  // 本日の日付をyy-mm-dd形式で返す
  var month;
  var dt = new Date();
  month = dt.getMonth() + 1;
  if (month < 9) month = "0" + month;

  return dt.getFullYear() + "-" + month + "-" + dt.getDate();
}

$(document).on("click", "test__button", function () {
  console.log("hello");
});

function ajaxSelAgingRack() {
  $.ajax({
    type: "POST",
    url: "./php/Aging/SelAgingRack.php",
    dataType: "json",
    async: false,
    data: {
      press_date_at: "dummy",
    },
  })
    .done(function (data) {
      fillTableBody(data, $("#not_aging__table tbody"));
      // makeDieSelect(data);
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function fillTableBody(data, targetDom) {
  $(targetDom).empty();
  data.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo(targetDom);
  });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ------------------------- not aging table - plan aging table -------------
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", ".aging__table tr", function () {
  var tableId = $(this).parent().parent().attr("id");
  if (!$(this).hasClass("selected-record")) {
    // tr に class を付与し、選択状態の background colorを付ける
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    // tr に id を付与する
    $(tableId + "selected").removeAttr("id");
    $(this).attr("id", tableId + "__selected");
  } else {
    // 選択レコードを再度クリックした時
    console.log("hello");
    editMode = "NEW_AGING";
    buttonActivation();
    moveAgingTr($(this));
  }
});

function moveAgingTr(targetDom) {
  var result;
  result = targetDom.attr("id").indexOf("not_aging__table__selected");
  targetDom.removeClass("selected-record");

  if (result == 0) {
    targetDom.appendTo($("#plan_aging__table tbody"));
  } else {
    targetDom.appendTo($("#not_aging__table tbody"));
    console.log("hello");
    // console.log();
    if ($("#plan_aging__table tbody tr").length == 0) {
      editMode = "NO";
      buttonActivation();
    }
  }
}

function getTableData(tableTrObj) {
  var tableData = [];
  tableTrObj.each(function (index, element) {
    var tr = [];
    $(this)
      .find("td")
      .each(function (index, element) {
        tr.push($(this).text());
      });
    tr.push($("#aging_date").val());
    tr.push($("#hardness").val());
    tr.push(fillToday());
    tableData.push(tr);
  });
  return tableData;
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++  Aging BUTTON  +++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#save__button", function () {
  ajaxInsAging2();
});

function ajaxInsAging2(tableData) {
  // return false;

  // return false;
  $.ajax({
    type: "POST",
    url: "./php/Aging/InsAging2.php",
    dataType: "json",
    async: false,

    data: makeAjaxData(),
  })
    .done(function (data) {
      ajaxSelAgingRack(); // no aging rack list
      ajaxSelAgingHitory(); // aginged rack list
      $("#plan_aging__table tbody").empty();
      editMode = "NO";
      buttonActivation();
    })
    .fail(function () {
      // alert("DB connect error");
      // console.alert("データベース接続異常");
    });
}

function ajaxInsAging(tableData) {
  // return false;
  $.ajax({
    type: "POST",
    url: "./php/Aging/InsAging.php",
    dataType: "json",
    async: false,
    data: JSON.stringify(tableData),
  })
    .done(function (data) {
      ajaxSelAgingRack(); // no aging rack list
      ajaxSelAgingHitory(); // aginged rack list
      $("#plan_aging__table tbody").empty();
    })
    .fail(function () {
      alert("DB connect error");
      // console.alert("データベース接続異常");
    });
}

function ajaxSelAgingHitory() {
  $.ajax({
    type: "POST",
    url: "./php/Aging/SelAgingHistory.php",
    dataType: "json",
    async: false,
    data: "dummy",
  })
    .done(function (data) {
      // console.log(data);
      fillTableBody(data, $("#history__table tbody"));
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function makeAjaxData() {
  var arr = [];
  var data = new Object();

  data["aging_at"] = $("#aging_date").val();
  data["hardness"] = $("#hardness").val();
  data["created_at"] = fillToday();

  $("#plan_aging__table tbody tr td:nth-child(1)").each(function (index, val) {
    arr.push(Number($(this).html()));
  });

  data["t_using_aging_rack_id"] = arr;
  return data;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++  hisotry_table  +++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#history__table tbody tr", function () {
  if (!$(this).hasClass("selected-record")) {
    // 1回目のクリックの時
    // 同じ aging_idのレコードを同じ色に塗る
    var aging_id = $(this).find("td")[5].innerText;
    $("#history__table tbody tr").each(function (index, val) {
      if ($(this).find("td")[5].innerText == aging_id) {
        $(this).addClass("selected-record");
      } else {
        $(this).removeClass("selected-record");
      }
    });
    editMode = "UPDATE_AGING";
    buttonActivation();
    $("#aging_date").val(
      $("#history__table .selected-record").eq(0).find("td").eq(6).html()
    );
    $("#hardness").val(
      $("#history__table .selected-record").eq(0).find("td").eq(7).html()
    );
  } else {
    // 2回目のクリックの時
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    clearInput();
    editMode = "REMOVE_AGING";
    buttonActivation();
  }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++  UPDATE BUTTON  +++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#update__button", function () {
  var updateData = new Object();

  updateData = {
    id: $("#history__table .selected-record").eq(0).find("td").eq(5).html(),
    aging_date: $("#aging_date").val(),
    hardness: $("#hardness").val(),
    update_at: fillToday(),
  };
  console.log(updateData);
  ajaxUpdateAging(updateData);
});

function ajaxUpdateAging(updateData) {
  $.ajax({
    type: "POST",
    url: "./php/Aging/UpdateAging.php",
    dataType: "json",
    async: false,
    data: updateData,
  })
    .done(function (data) {
      ajaxSelAgingRack(); // no aging rack list
      ajaxSelAgingHitory(); // aginged rack list
      clearInput();
      editMode = "NO";
      buttonActivation();
    })
    .fail(function () {
      alert("DB connect error");
    });
}

function clearInput() {
  $(".down__block input").val("");
  $("#aging_date").val(fillToday());
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++  Add Aging BUTTON  +++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "tbody", function () {
  // not_aging__table　と history__table が選択されたとき、
  // Add Agingボタンを活性化する
  if (
    $("#not_aging__table__selected").length &&
    $("#history__table .selected-record").length
  ) {
    editMode = "ADD_AGING";
    buttonActivation();
  }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++  REMOVE AGING BUTTON  ++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#remove-aging__button", function () {
  var targetId;
  targetId = $("#history__table tbody .selected-record")
    .find("td")
    .eq(0)
    .html();
  // console.log(targetId);
  ajaxUpdateRemoveAging(targetId);
});

function ajaxUpdateRemoveAging(id) {
  $.ajax({
    type: "POST",
    url: "./php/Aging/UpdateRemoveAging2.php",
    dataType: "json",
    async: false,
    data: {
      id: id,
    },
  })
    .done(function (data) {
      ajaxSelAgingRack(); // no aging rack list
      ajaxSelAgingHitory(); // aginged rack list
      clearInput();
      editMode = "NO";
      buttonActivation();
    })
    .fail(function () {
      alert("DB connect error");
    });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++  ADD AGING BUTTON  ++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#add-aging__button", function () {
  var updateData = new Object();
  updateData = {
    using_aging_rack_id: $("#not_aging__table__selected")
      .find("td")
      .eq(0)
      .html(),
    aging_id: $("#history__table tbody tr.selected-record")
      .eq(0)
      .find("td")
      .eq(5)
      .html(),
  };
  ajaxUpdateAddAging(updateData);
});

function ajaxUpdateAddAging(updateData) {
  $.ajax({
    type: "POST",
    url: "./php/Aging/UpdateAddAging.php",
    dataType: "json",
    async: false,
    data: updateData,
  })
    .done(function (data) {
      ajaxSelAgingRack(); // no aging rack list
      ajaxSelAgingHitory(); // aginged rack list
      clearInput();
      editMode = "NO";
      buttonActivation();
    })
    .fail(function () {
      alert("DB connect error");
    });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++  Button Activation  +++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
function buttonActivation() {
  // console.log(editMode);
  switch (editMode) {
    case "NO":
      $("#save__button").prop("disabled", true);
      $("#update__button").prop("disabled", true);
      $("#add-aging__button").prop("disabled", true);
      $("#remove-aging__button").prop("disabled", true);
      break;
    case "NEW_AGING":
      $("#save__button").prop("disabled", false);
      $("#update__button").prop("disabled", true);
      $("#add-aging__button").prop("disabled", true);
      $("#remove-aging__button").prop("disabled", true);
      break;
    case "UPDATE_AGING":
      $("#save__button").prop("disabled", true);
      $("#update__button").prop("disabled", false);
      $("#add-aging__button").prop("disabled", true);
      $("#remove-aging__button").prop("disabled", true);
      break;
    case "ADD_AGING":
      console.log("add_aging");
      $("#save__button").prop("disabled", true);
      $("#update__button").prop("disabled", true);
      $("#add-aging__button").prop("disabled", false);
      $("#remove-aging__button").prop("disabled", true);
      break;
    case "REMOVE_AGING":
      $("#save__button").prop("disabled", true);
      $("#update__button").prop("disabled", true);
      $("#add-aging__button").prop("disabled", true);
      $("#remove-aging__button").prop("disabled", false);
      break;
  }
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++  TEST BUTTON  +++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).on("click", "#test__button", function () {
  var updateData = new Object();
  updateData = {
    using_aging_rack_id: $("#not_aging__table__selected")
      .find("td")
      .eq(0)
      .html(),
    aging_id: $("#history__table tbody tr.selected-record")
      .eq(0)
      .find("td")
      .eq(5)
      .html(),
  };
});
