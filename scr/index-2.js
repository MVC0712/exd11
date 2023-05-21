const targetDirectory = "./";
// const targetDirectory = "./../../diereport/ext0.11/exd11/";
let ajaxReturnData;
let planDate = new Object();

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
  let displayDate = new Object();
  var arrPlanTable = new Array();
  var titleDate = new Array();

  sessionStorage.removeItem("active_staff");

  getDisplayWeek();
  arrPlanTable = getPlanTableData(planDate);
  makePlanTable(arrPlanTable);
  titleDate = makeDateStrings(planDate);
  // titleDate = makeDateStrings(displayDate);
  makeTitleTr(titleDate);

  // inputSession();
});

function makeTitleTr(titleDate) {
  var newTr = $("<tr>");
  // console.log(titleDate);
  for (var i = 0; i <= 6; i++) {
    newTr.append($("<th>").text(titleDate[i]).attr("colspan", "4"));
  }
  // console.log(newTr);
  $("#weekleyPlan thead").empty().append(newTr);
}

function makeDateStrings(planDate) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var titleDate = new Array();
  var tempDate = new Date(planDate["sundayDate"]);
  var day = String(tempDate.getDate()).padStart(2, "0");
  var dayOfWeek = daysOfWeek[tempDate.getDay()];
  titleDate.push(day + dayOfWeek);

  for (var i = 0; i <= 6; i++) {
    tempDate.setDate(tempDate.getDate() + 1);
    day = String(tempDate.getDate()).padStart(2, "0");
    dayOfWeek = daysOfWeek[tempDate.getDay()];
    titleDate.push(day + dayOfWeek);
  }
  // console.log(titleDate);
  return titleDate;
}

$("#press_plan__a").click(function () {
  console.log("hello");
  $("main").css("background-image", "./../img/BG.jpg");
  $("main").css("background-image", "none");
  // makePressPlan();
});

function getDisplayWeek() {
  let currentDate = new Date(); // get date of today
  let sundayDate = new Date();
  let saturdayDate = new Date();
  // get day of week (0: Sun, 1:Mon, 2:Tue ..... 6:Sat)
  let currentDay = currentDate.getDay();
  // let planDate = new Object();
  // get this week sunday * start from Sunday week
  sundayDate.setFullYear(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDay
  );
  saturdayDate.setDate(sundayDate.getDate() + 6);

  // set test Date 23-2-5 ~ 23-2-11
  // sundayDate.setFullYear(2023, 1, 5);
  // saturdayDate.setFullYear(2023, 1, 11);

  // exchange Date object to yyyy-mm-dd
  planDate["sundayDate"] = sundayDate;
  planDate["saturdayDate"] = saturdayDate;

  return planDate;
}

// function getPlanTableData(sundayDate, saturdayDate) {
function getPlanTableData(displayDate) {
  // var targetDate = new Date(sundayDate);
  var targetDate = new Date(displayDate["sundayDate"]);
  var arrPlanTable = new Array();
  // var arrPlanTable = new Object();

  for (var i = 0; i <= 6; i++) {
    arrPlanTable["weekDay" + i] = [];
  }

  getPressPlan();
  ajaxReturnData.forEach(function (val) {
    const planDateString = val["plan_date"].split("-");
    const planDate = new Date(
      planDateString[0],
      planDateString[1] - 1,
      planDateString[2]
    );

    for (var i = 0; i <= 6; i++) {
      targetDate.setDate(displayDate["sundayDate"].getDate() + i); // ターゲット週の何曜日のデータに一致するか
      if (isSameDate(targetDate, planDate)) {
        arrPlanTable["weekDay" + i].push(val);
      }
    }
  });
  // console.log(arrPlanTable);
  return arrPlanTable;

  // makePlanTableHeadder(arrPlanTable);
}

// function makePlanTableHeadder(arrPlanTable) {}

function makePlanTable(arrPlanTable) {
  var tdObject = new Object($("<td>"));
  var trObject = new Object($("<tr>"));
  var maxPlanNumber = 0;

  Object.keys(arrPlanTable).forEach((key) => {
    if (maxPlanNumber < arrPlanTable[key].length) {
      maxPlanNumber = arrPlanTable[key].length;
    }
  });
  // console.log("maxPlanNumber: " + maxPlanNumber);
  $("#weekleyPlan tbody").empty();

  if (maxPlanNumber != 0) {
    for (var i = 0; i < maxPlanNumber; i++) {
      trObject = $("<tr>");
      for (var j = 0; j <= 6; j++) {
        if (arrPlanTable["weekDay" + j][i] != undefined) {
          trObject.append(
            $("<td>").text(arrPlanTable["weekDay" + j][i]["die_number"])
          );
          trObject.append(
            $("<td>").text(arrPlanTable["weekDay" + j][i]["pressing_type"])
          );
          trObject.append(
            $("<td>").text(arrPlanTable["weekDay" + j][i]["quantity"])
          );
          trObject.append($("<td>").text(""));
        } else {
          for (var k = 0; k <= 3; k++) {
            trObject.append($("<td>").text(""));
          }
        }
        tdObject.append(tdObject);
      }
      $("#weekleyPlan tbody").append(trObject);
    }
  } else {
    trObject = $("<tr>");
    for (var j = 0; j <= 6; j++) {
      trObject.append("<td>");
      trObject.append("<td>");
      trObject.append("<td>");
      trObject.append("<td>");
    }
    $("#weekleyPlan tbody").append(trObject);
  }
}

function isSameDate(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function getPressPlan() {
  let fileName;
  let sendData = new Object();

  fileName = "./php/index/selPressPlan.php";
  sendData = {
    dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  // console.log(ajaxReturnData);
}

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
  if (sessionStorage.getItem("active_staff") == null) {
    if (checkStaff()) {
      $("main").css("background-image", "none");
      openPage("DailyReportV16.html");
    }
  } else {
    openPage("DailyReportV16.html");
  }
});

$("#qualityPage").on("click", function () {
  if (sessionStorage.getItem("active_staff") == null) {
    if (checkStaff()) {
      $("main").css("background-image", "none");
      $("main").css("background-image", "");
      openPage("QualityReportV3.html");
    }
  } else {
    openPage("QualityReportV3.html");
  }
});

$("#ethcingPage").on("click", function () {
  if (sessionStorage.getItem("active_staff") == null) {
    if (checkStaff()) {
      $("main").css("background-image", "none");
      openPage("EtchingV4.html");
    }
  } else {
    openPage("EtchingV4.html");
  }
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

$("#user__div").on("click", function () {
  console.log("Hello");
});

$("#one_week_back__a").on("click", function () {
  backOneWeek();

  arrPlanTable = getPlanTableData(planDate);
  makePlanTable(arrPlanTable);
  titleDate = makeDateStrings(planDate);
  makeTitleTr(titleDate);
});

function backOneWeek() {
  planDate["sundayDate"] = new Date(
    planDate["sundayDate"].setDate(planDate["sundayDate"].getDate() - 7)
  );
  planDate["saturdayDate"] = new Date(
    planDate["saturdayDate"].setDate(planDate["saturdayDate"].getDate() - 7)
  );
}

$("#one_week_forward__a").on("click", function () {
  forwardOneWeek();

  arrPlanTable = getPlanTableData(planDate);
  makePlanTable(arrPlanTable);
  titleDate = makeDateStrings(planDate);
  makeTitleTr(titleDate);
});

function forwardOneWeek() {
  planDate["sundayDate"] = new Date(
    planDate["sundayDate"].setDate(planDate["sundayDate"].getDate() + 7)
  );
  planDate["saturdayDate"] = new Date(
    planDate["saturdayDate"].setDate(planDate["saturdayDate"].getDate() + 7)
  );
}

function checkStaff() {
  console.log(sessionStorage.getItem("active_staff"));
  let flag = true;
  let staff_code = prompt("Please enter your Emp No:", "");
  if (staff_code === null) {
    // return;
    flag = false;
  }
  var fileName = "./php/SelEmpCode.php";
  var sendData = {
    staff_code: staff_code,
  };
  myAjax.myAjax(fileName, sendData);
  if (ajaxReturnData.length != 0) {
    sessionStorage.setItem("active_staff", JSON.stringify(ajaxReturnData));
    active = sessionStorage.getItem("active_staff");
    alert(JSON.parse(active)[0].staff_name + " is activating!");
  } else {
    alert("Your Emp No does not exist!");
    // inputSession();
    flag = false;
  }
  $("#active_staff").html(JSON.parse(active)[0].staff_name);

  console.log(sessionStorage.getItem("active_staff"));
  console.log(flag);
  return flag;
}
