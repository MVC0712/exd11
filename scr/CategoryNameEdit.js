let ajaxReturnData;
let deleteTableName;

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

$(function () {
  // make summary table
  // readSummaryTable();
  readCategory1Table();
  // $("#test__button").remove();
});

$(document).on("click", "#language__mark", function () {
  const str = $("#language__mark").attr("src");
  const language = str.match(/\/([^.\/]+)\.\w+$/);
  const tileLettersObject = $("div.title__letters");
  // console.log(tileLettersObject);
  let fileName;
  let sendData = new Object();

  fileName = "./php/ProductionNumber/SelTitleName.php";
  sendData = {
    dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);

  tileLettersObject.each(function () {
    let targetObj = $(this);
    ajaxReturnData.forEach(function (databaseLetters) {
      // console.log(targetObj.text() + "\n" + databaseLetters["english"]);
      switch (language[1]) {
        case "En":
          if (targetObj.text() == databaseLetters["english"]) {
            // console.log(
            //   databaseLetters["english"] + " : " + databaseLetters["vietnamese"]
            // );
            targetObj.text(databaseLetters["vietnamese"]);
            $("#language__mark").attr("src", "./img/Vn.png");
          }
          break;
        case "Vn":
          if (targetObj.text() == databaseLetters["vietnamese"]) {
            // console.log(
            //   databaseLetters["english"] + " : " + databaseLetters["vietnamese"]
            // );
            targetObj.text(databaseLetters["english"]);
            $("#language__mark").attr("src", "./img/En.png");
          }
          break;
      }
    });
  });
});

$("#window_close__mark").hover(
  function () {
    const src = $("#window_close__mark").attr("src").replace("2_1", "2_2");
    // console.log("hello");
    $("#window_close__mark").attr("src", src);
  },
  function () {
    const src = $("#window_close__mark").attr("src").replace("2_2", "2_1");
    // console.log("good bye");
    $("#window_close__mark").attr("src", src);
  }
);

$(document).on("click", "#window_close__mark", function () {
  window.close();
});

function readCategory1Table() {
  let fileName;
  let sendData = new Object();
  // read ng list and fill option
  fileName = "./php/ProductionNumber/SelCategory1V2.php";
  sendData = {
    dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  $("#category1__table tbody").empty();
  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal, index) {
      switch (index) {
        case 1:
          $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
          break;
        default:
          $("<td>").html(trVal[tdVal]).appendTo(newTr);
      }
    });
    $(newTr).appendTo("#category1__table tbody");
  });
}

$(document).on("click", "#category1__table tbody tr", function () {
  $("#category1__table tbody tr.selected-record").removeClass(
    "selected-record"
  );
  $("#category1__tr").removeAttr("id");
  $(this).addClass("selected-record").attr("id", "category1__tr");

  // set category talbe
  setCategory2Talbe();
  // copy category1 name
  $("#category1__text").val($(this).find("td").eq(1).text());
});

function setCategory2Talbe() {
  let fileName;
  let sendData = new Object();

  fileName = "./php/ProductionNumber/SelCategory2V2.php";
  sendData = {
    targetId: $("#category1__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);

  $("#category2__table tbody").empty();
  if (ajaxReturnData.length == 0) {
    $("#category2__table tbody").append($("<tr>").append($("<td><td><td>")));
  } else {
    ajaxReturnData.forEach(function (trVal) {
      var newTr = $("<tr>");
      Object.keys(trVal).forEach(function (tdVal, index) {
        // $("<td>").html(trVal[tdVal]).appendTo(newTr);
        switch (index) {
          case 1:
            $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
            break;
          default:
            $("<td>").html(trVal[tdVal]).appendTo(newTr);
        }
      });
      $(newTr).appendTo("#category2__table tbody");
    });
  }
}

$(document).on("click", "#category1__table tr.selected-record", function () {
  let fileName;
  let sendData = new Object();

  deleteTableName = "category1";
  fileName = "./php/ProductionNumber/SelEmploeeNumber.php";
  sendData = {
    dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);

  document.getElementById("delete__dialog").showModal();
});

$(document).on("click", "#category2__table tbody tr", function () {
  $("#category2__table tbody tr.selected-record").removeClass(
    "selected-record"
  );
  $("#category2__tr").removeAttr("id");
  // $(this).removeClass("selected-record").removeAttr("id");
  $(this).addClass("selected-record").attr("id", "category2__tr");
});

$(document).on(
  "click",
  "#category2__table tbody tr.selected-record",
  function () {
    let fileName;
    let sendData = new Object();

    deleteTableName = "category2";

    fileName = "./php/ProductionNumber/SelEmploeeNumber.php";
    sendData = {
      dummy: "dummy",
    };
    myAjax.myAjax(fileName, sendData);

    document.getElementById("delete__dialog").showModal();
  }
);

// Dialog
$(document).on("click", "#dialog-cancel__button", function () {
  document.getElementById("delete__dialog").close();
  $("#update__button").prop("disabled", true);
  $("#dialog-delete__button").attr("disabled", true);
  $("#emploee_number").val("");
});

$(document).on("click", "#dialog-delete__button", function () {
  let fileName;
  let sendData = new Object();

  // console.log($("#summary__tr td").eq(0).text());
  console.log(deleteTableName);
  switch (deleteTableName) {
    case "category1":
      fileName = "./php/ProductionNumber/DelCategory1.php";
      sendData = {
        targetId: $("#category1__tr td").eq(0).text(),
      };
      // console.log(sendData);
      myAjax.myAjax(fileName, sendData);
      readCategory1Table();
      break;
    case "category2":
      fileName = "./php/ProductionNumber/DelCategory2.php";
      sendData = {
        targetId: $("#category2__tr td").eq(0).text(),
      };
      console.log(sendData);
      // set category talbe
      myAjax.myAjax(fileName, sendData);
      setCategory2Talbe();
      break;
    default:
      console.log("anything wrong");
  }

  document.getElementById("delete__dialog").close();
  $("#dialog-delete__button").attr("disabled", true);
  $("#emploee_number").val("");

  $("#mothion__display").text("Deleted xóa bỏ").css("opacity", 0);
  $("#mothion__display").animate({ opacity: 1 }, 1000, function () {
    $("#mothion__display").animate({ opacity: 0 }, 1000), function () {};
  });
});

$(document).on("keyup", "#emploee_number", function () {
  if (
    $(this).val().length == 7 &&
    findValueInObject(ajaxReturnData, $(this).val())
  ) {
    $("#dialog-delete__button").attr("disabled", false);
  }
});

function findValueInObject(obj, searchValue) {
  for (let key in obj) {
    if (
      obj[key]["emploee_number"] == searchValue &&
      obj[key]["position_id"] == 1
    ) {
      return true;
    }
  }
  return false;
}

$(document).on("change", "#category1__table tbody input", function () {
  const targetId = $(this).parent().parent().find("td").eq(0).text();
  let fileName;
  let sendData = new Object();

  if ($(this).val().length <= 1) return;

  fileName = "./php/ProductionNumber/UpdateCategory1.php";
  sendData = {
    val: $(this).val(),
    id: targetId * 1,
  };
  myAjax.myAjax(fileName, sendData);
  readCategory1Table();

  $("#category1__table tbody tr").each(function () {
    if ($(this).find("td").eq(0).text() == targetId) {
      $(this).addClass("selected-record");
      $(this).get(0).scrollIntoView({
        behavior: "smooth",
      });
    }
  });

  $("#mothion__display").text("Updated").css("opacity", 0);
  $("#mothion__display").animate({ opacity: 1 }, 1000, function () {
    $("#mothion__display").animate({ opacity: 0 }, 1000), function () {};
  });
});

$(document).on("change", "#category2__table tbody input", function () {
  const targetId = $(this).parent().parent().find("td").eq(0).text();
  let fileName;
  let sendData = new Object();

  if ($(this).val().length <= 1) return;

  fileName = "./php/ProductionNumber/UpdateCategory2.php";
  sendData = {
    val: $(this).val(),
    id: targetId * 1,
  };
  myAjax.myAjax(fileName, sendData);

  // readCategory2Table();
  setCategory2Talbe();

  $("#category2__table tbody tr").each(function () {
    if ($(this).find("td").eq(0).text() == targetId) {
      $(this).addClass("selected-record");
      $(this).get(0).scrollIntoView({
        behavior: "smooth",
      });
    }
  });

  $("#mothion__display").text("Updated").css("opacity", 0);
  $("#mothion__display").animate({ opacity: 1 }, 1000, function () {
    $("#mothion__display").animate({ opacity: 0 }, 1000), function () {};
  });
});

$(document).on("keyup", "#category1__input", function () {
  if ($(this).val().length >= 1) {
    $("#mothion__display").text("Add New Mode");
  } else {
    $("#mothion__display").text("");
  }

  if (checkCategory1($(this).val()) == false) {
    $(this).addClass("input-required");
  } else {
    $(this).removeClass("input-required");
  }

  // save button activation
  if (
    $("#mothion__display").text() == "Add New Mode" &&
    $(this).hasClass("input-required") == false
  ) {
    $("#category1__button").attr("disabled", false);
  } else {
    $("#category1__button").attr("disabled", true);
  }
});

function checkCategory1(inputValue) {
  const category1TableValue = $("#category1__table tbody tr input");
  let flag = true;

  category1TableValue.each(function () {
    if ($(this).val() == inputValue) {
      flag = false;
    }
  });
  return flag;
}

$(document).on("click", "#category1__button", function () {
  const targetLetters = $("#category1__input").val();
  const fileName = "./php/ProductionNumber/InsCategory1V2.php";
  let sendData = new Object();
  let dt = new Date();

  sendData = {
    name_jp: targetLetters,
    create_at:
      dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate(),
  };
  myAjax.myAjax(fileName, sendData);
  // console.log(sendData);

  readCategory1Table();
  $("#category1__table tbody input").each(function () {
    console.log($(this).val());
    if ($(this).val() == targetLetters) {
      let targetTr = $(this).parent().parent();
      $(this).addClass("selected-record");
      targetTr.addClass("selected-record").get(0).scrollIntoView({
        behavior: "smooth",
      });
    }
  });
  $("#category1__input").val("");
  $("#mothion__display").html("");
  $(this).attr("disabled", true);
});

$(document).on("keyup", "#category2__input", function () {
  if (
    $(this).val().length <= 1 ||
    checkSameLettersInCategroy2($(this).val()) == false
  ) {
    $(this).addClass("input-required");
  } else {
    $(this).removeClass("input-required");
  }
  // console.log(checkSameLettersInCategroy2($(this).val()));
  if ($(this).val().length > 1) {
    $("#mothion__display").text("Edit Mode");
  } else {
    $("#mothion__display").text("");
  }

  activationCategory2Button();
});

function checkSameLettersInCategroy2(val) {
  let flag = true;

  $("#category2__table tbody tr input").each(function () {
    if ($(this).val() == val) {
      flag = false;
    }
  });
  return flag;
}

function activationCategory2Button() {
  let flag = true;

  if (
    $("#category1__tr").length == 0 ||
    $("#category2__input").hasClass("input-required")
  ) {
    flag = false;
  }

  if (flag) {
    $("#category2__button").attr("disabled", false);
  } else {
    $("#category2__button").attr("disabled", true);
  }
  return flag;
}

$(document).on("click", "#category2__button", function () {
  const targetLetters = $("#category2__input").val();
  const targetId = $("#category1__tr td").eq(0).text();
  const fileName = "./php/ProductionNumber/InsCategory2V2.php";
  let sendData = new Object();
  let dt = new Date();

  sendData = {
    name_jp: targetLetters,
    targetId: targetId,
    create_at:
      dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate(),
  };
  myAjax.myAjax(fileName, sendData);

  // set category talbe
  setCategory2Talbe();
  // return;
  $("#category2__table tbody input").each(function () {
    if ($(this).val() == targetLetters) {
      let targetTr = $(this).parent().parent();
      $(this).addClass("selected-record");
      targetTr.addClass("selected-record").get(0).scrollIntoView({
        behavior: "smooth",
      });
    }
  });
  $("#category2__input").val("");
  $("#mothion__display").html("");
  $(this).attr("disabled", true);
});
