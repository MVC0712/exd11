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
// return today string YYYY-MM-DD
function makeYYYYMMDD(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
}
// html table td object to string array
function convertHTMLTableToStrTable(targetTable) {
  var strTable = "";
  var rows = targetTable.find("tr");

  rows.each(function () {
    var cells = $(this).find("td, th");
    cells.each(function () {
      var text = $(this).text().trim();
      strTable += text + "\t";
    });
    strTable += "\n";
  });

  return strTable;
}
// blink strings
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
//
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
// exchange language English - Vietnamese
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
