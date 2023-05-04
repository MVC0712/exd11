const targetDirectory = "./";
let ajaxReturnData;
let active = sessionStorage.getItem("active_staff");
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

$(document).on("click", "#log_out", function() {
  // $('#active_staff').html('');
  clearSession();
});
function clearSession() {
  sessionStorage.clear();
  inputSession();
};
function inputSession() {
  if (sessionStorage.active_staff ==null) {
      let staff_code = prompt("Please enter your Emp No:", "");
      if (staff_code === null) {
          return;
      };
      var fileName = "./php/SelEmpCode.php";
      var sendData = {
          staff_code: staff_code,
      };
      myAjax.myAjax(fileName, sendData);
      if (ajaxReturnData.length != 0){
          sessionStorage.setItem("active_staff", JSON.stringify(ajaxReturnData));
          active = sessionStorage.getItem("active_staff");
          alert(JSON.parse(active)[0].staff_name + " is activating!");
      } else {
          alert("Your Emp No does not exist!");
          inputSession();
      }
  }
  $('#active_staff').html(JSON.parse(active)[0].staff_name);
};

$(function () {
  inputSession();

  
});

$("#languageMode").on("click", function () {
  if ($(this).prop("checked") == true) {
    $("#langualgeImage").prop("src", "./img/Vn.png");
  } else {
    $("#langualgeImage").prop("src", "./img/En.png");
  }

  changeLanguage();
});

function changeLanguage() {
  const str = $("#langualgeImage").attr("src");
  const language = str.match(/\/([^.\/]+)\.\w+$/);
  const tileLettersObject = $(".title__letters");

  fileName = "./php/SelTitleName.php";
  sendData = {
    dummy: "dummy",
  };
  console.log(language[1]);
  myAjax.myAjax(fileName, sendData);
  // console.log(ajaxReturnData);
  // return;
  tileLettersObject.each(function () {
    let targetObj = $(this);
    ajaxReturnData.forEach(function (databaseLetters) {
      // console.log(targetObj.text() + "\n" + databaseLetters["english"]);
      switch (language[1]) {
        case "Vn":
          if (targetObj.text() == databaseLetters["english"]) {
            targetObj.text(databaseLetters["vietnamese"]);
          }
          break;
        case "En":
          if (targetObj.text() == databaseLetters["vietnamese"]) {
            targetObj.text(databaseLetters["english"]);
          }
          break;
      }
    });
  });
}

$("#pressReportPage").on("click", function () {
  openPage("DailyReportV16.html");
});

$("#qualityPage").on("click", function () {
  openPage("QualityReportV3.html");
});

$("#ethcingPage").on("click", function () {
  openPage("EtchingV4.html");
});

function openPage(targetPage) {
  const myObj = $("<iframe>");
  myObj
    .attr("src", targetDirectory + targetPage)
    .attr("frameborder", "0")
    .attr("width", "100%")
    .attr("height", "100%");
  $("main").empty().append(myObj);
}
