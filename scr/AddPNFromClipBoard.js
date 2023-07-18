let ajaxReturnData;
const myAjax = {
  myAjax: function (fileName, sendData) {
    $.ajax({
      type: "POST",
      url: fileName,
      dataType: "json",
      data: sendData,
      async: false,
    })
      .done(function (data) {
        ajaxReturnData = data;
      })
      .fail(function () {
        alert("DB connect error");
      });
  },
};

$(document).on("click", "#insert__button", function () {
  // read production number from Clip board
  // console.log("hello");
  navigator.clipboard
    .readText()
    .then(function (text) {
      // insert clipboard list to table
      insertTextToTable(text);
      // check dublication
      checkDublication();
    })
    .catch(function (error) {
      console.error("Can't access to Clipboard", error);
      alert("Can't access to Clipboard");
    });
});

function insertTextToTable(text) {
  const itemText = text.split("\r\n");
  $("#summary__table_body").empty();
  itemText.forEach(function (element, index) {
    if (element.length != 0) {
      var newTr = $("<tr>")
        .append($("<td>").html(index + 1))
        .append($("<td>").html(element).addClass("save-data"))
        .append(
          $("<td>")
            .addClass("category1__select save-data")
            .append(returnCate1Select())
        )
        .append($("<td>"))
        .appendTo($("#summary__table_body"));
    }
  });
}

function checkDublication() {
  let fileName;
  let tdText;
  let trDom;
  let sendData = new Object();
  // read ng list and fill option
  fileName = "./php/ProductionNumber/SelProductionNumber.php";
  sendData = {
    dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);

  $("#summary__table_body tr td:nth-child(2)").each(function (row) {
    tdText = $(this).html();
    trDom = $(this).parent();
    ajaxReturnData.forEach(function (element) {
      if (element.production_number == tdText) {
        trDom.addClass("duplication-tr");
        $("#save__button").prop("disabled", true);
      }
    });
  });
}

$(document).on("change", "tbody td.category1__select select", function () {
  let fileName;
  let sendData = new Object();
  let targetTd = $(this).parent().parent().find("td").eq(3);
  let mySelect = $("<select>").append($("<option>").val(0).html("no"));
  // read ng list and fill option
  fileName = "./php/ProductionNumber/SelCategory2V2.php";
  sendData = {
    targetId: $(this).val(),
  };
  myAjax.myAjax(fileName, sendData);
  // console.log(ajaxReturnData);

  targetTd.addClass("category2__select save-data");
  targetTd.empty();

  ajaxReturnData.forEach(function (recordData) {
    mySelect.append($("<option>").val(recordData.id).html(recordData.name_jp));
  });

  targetTd.empty();
  targetTd.append(mySelect);
});

function returnCate1Select() {
  let mySelect = $("<select>").append($("<option>").val(0).html("no"));
  let fileName;
  let sendData = new Object();

  fileName = "./php/ProductionNumber/SelCategory1V2.php";
  sendData = {
    dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);

  ajaxReturnData.forEach(function (recordData) {
    mySelect.append($("<option>").val(recordData.id).html(recordData.name_jp));
  });
  return mySelect;
}

$(document).on("change", "tbody td.category2__select select", function () {
  if (checkSelectCompleted() && $(".duplication-tr").length == 0) {
    $("#save__button").prop("disabled", false);
  } else {
    $("#save__button").prop("disabled", true);
  }
});

function checkSelectCompleted() {
  // check category2 select element was selected
  let flag = true;
  const targetDom = $(".category2__select select");
  const recordCnt = $("#summary__table_body tr").length;

  if (targetDom.length != recordCnt) {
    flag = false;
  }

  targetDom.each(function () {
    if ($(this).val() == 0) {
      flag = false;
    }
  });

  return flag;
}

$(document).on("click", "#save__button", function () {
  // save new production data to SQL
  const targetObj = new Object($("#mode_display"));
  const str = "Saved";
  let fileName;
  let sendData = new Object();

  sendData = getSaveData();
  fileName = "./php/ProductionNumber/InsProductionNumberFromClipboard.php";

  Object.keys(sendData).forEach(function (key) {
    // console.log(sendData[key]);
    myAjax.myAjax(fileName, sendData[key]);
  });
  $("#summary__table tbody").empty();
  $("#save__button").prop("disabled", true);
  blinkDisplay(targetObj, str);
});

function getSaveData() {
  var sendData = new Object();
  var recordData = new Object();
  var today = new Date();

  $("#summary__table tbody tr").each(function (index, element) {
    recordData = {
      production_number: $(element).find("td:eq(1)").text(),
      category1: parseInt($(element).find("td:eq(2) select").val()),
      category2: parseInt($(element).find("td:eq(3) select").val()),
      create_at: makeYYYYMMDD(today),
    };
    sendData[index] = recordData;
  });
  return sendData;
}

function makeYYYYMMDD(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
}

$(document).on("click", "#test__button", function () {});

// Window Colose
$(document).on("mouseover", "#window_close__mark", function () {
  // console.log("hello");
  $("#window_close__mark").attr("src", "./img/close-2.png");
});

$(document).on("mouseout", "#window_close__mark", function () {
  // console.log("hello2");
  $("#window_close__mark").attr("src", "./img/close.png");
});

$(document).on("click", "#window_close__mark", function () {
  // open("about:blank", "_self").close(); // close window
  window.close();
});

$(document).on("click", "#test__button", function () {
  // $("#mode_display").html("Saved");
  // displayModeDisplay("Saved");
  const targetObj = new Object($("#mode_display"));
  const str = "Saved";
  blinkDisplay(targetObj, str);
});

function blinkDisplay(targetObj, str) {
  var count = 10;
  var interval = setInterval(function () {
    if (count <= 0) {
      clearInterval(interval);
    }
    targetObj.html(str);
    setTimeout(function () {
      targetObj.html("");
    }, 300);
    count--;
  }, 500);
}
