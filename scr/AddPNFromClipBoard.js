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

document
  .getElementById("insert__button")
  .addEventListener("click", async () => {
    let itemData;
    const cate1Sel = returnCate1Select();
    const text = await navigator.clipboard.readText();

    itemData = text.split("\r\n");
    $("#summary__table_body").empty();
    itemData.forEach(function (element, index) {
      let newTr = $("<tr>");
      newTr.append($("<td>").html(index + 1));
      newTr.append($("<td>").html(element));
      newTr.append(
        $("<td>").addClass("category1__select").append(returnCate1Select())
      );
      newTr.append($("<td>"));
      // newTr.append($("<td>").append(cate1Sel));  <--- why this don't work?
      if (element.length != 0) {
        newTr.appendTo($("#summary__table_body"));
      }
    });
    checkDublication();
  });

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

// document.getElementById("test__button").addEventListener("click", () => {});
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

  targetTd.addClass("category2__select");
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
  console.log("hello");
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

  console.log(flag);
  return flag;
}

document.getElementById("check__button").addEventListener("click", function () {
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

  console.log(flag);
});

$(document).on("click", "#check__button", function () {
  console.log("hello");
  const fileName = "./php/ProductionNumber/test3.php";
  const targetTr = $("#summary__table_body tr");
  let sendData = new Object();

  let object = {
    1: { x: 1, y: 2 },
    2: { x: 3, y: 4 },
  };

  // targetTr.each(function (index) {
  //   sendData[index] = {
  //     production_name: "aaa",
  //     category2_id: index,
  //   };
  // });

  targetTr.each(function (index) {
    sendData[index] = {
      production_number: $(this).find("td").eq(1).html(),
      category2_id: $(this).find("select").eq(1).val(),
    };
  });

  console.log(sendData);

  myAjax.myAjax(fileName, sendData);
});
