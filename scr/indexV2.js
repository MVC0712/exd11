const targetDirectory = "./";
var ajaxReturnData;
var productionNumberTableValues = new Object();
var addNewDieName;
// var savedMode;
// let summaryTable = new Object();
// let productionNumberTable = new Object();

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
  let today = new Date();
  // $("#arrival_date").val(makeYYYYMMDD(today)).removeClass("input-required");
  // makeProductionNumberTalbe();
  // productionNumberTable = ajaxReturnData;
  // makeSummaryTalbe();
  // summaryTable = ajaxReturnData;
  // makeDieDiamaterSelect();
  // makeBolsterSelect();
  // // display dies quantities
  // countDiesQty();
  // // blink mode letters
  // setInterval(blinkText(), 3000);
  statusDisplay();
  repeatFunction();
});

function repeatFunction() {
  const intervalId = setInterval(() => {
    // 1分ごとに実行する処理
    statusDisplay();
  }, 60 * 1000);
}

function statusDisplay() {
  var fileName;
  var sendData = new Object();
  var dateObject = new Date();

  fileName = "./php/index/SelPressStatus.php";
  sendData = {
    dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);

  // set die name
  $("#number1_status").text(ajaxReturnData[0]["die_name_1"]);
  $("#number2_status").text(ajaxReturnData[0]["die_name_2"]);
  // change bordercolor depending on machine mode
  if (ajaxReturnData[0]["machine_1_mode"] == 1) {
    $("#number1_status").css("border-color", "#adff2f");
  } else {
    $("#number1_status").css("border-color", "#0000cc");
  }
  if (ajaxReturnData[0]["machine_2_mode"] == 1) {
    $("#number2_status").css("border-color", "#adff2f");
  } else {
    $("#number2_status").css("border-color", "#0000cc");
  }
  // checkRecordNormal(ajaxReturnData[0]["date_time_1"].split(" "));

  // exchange Data of date-time on database to DateObject of Javascript
  // number 1 machine
  dateObject = makeDateObject(ajaxReturnData[0]["date_time_1"]);
  // console.log(checkRecordNormal(dateObject));
  // set die nname and machine mode
  if (checkRecordNormal(dateObject) == true) {
    // set die name
    $("#number1_status").text(ajaxReturnData[0]["die_name_1"]);
    if (ajaxReturnData[0]["machine_1_mode"] == 1) {
      // when  machine is working
      $("#number1_status").css("border-color", "#adff2f");
    } else {
      // when the machine is stopping
      $("#number1_status").css("border-color", "#0000cc");
    }
  } else {
    // delete die name
    $("#number1_status").text("---");
    // border color set to blue
    $("#number1_status").css("border-color", "#0000cc");
  }
  // number 2 machine
  dateObject = makeDateObject(ajaxReturnData[0]["date_time_2"]);
  // console.log(checkRecordNormal(dateObject));
  // set die nname and machine mode
  if (checkRecordNormal(dateObject) == true) {
    // set die name
    $("#number2_status").text(ajaxReturnData[0]["die_name_2"]);
    if (ajaxReturnData[0]["machine_2_mode"] == 1) {
      // when  machine is working
      $("#number2_status").css("border-color", "#adff2f");
    } else {
      // when the machine is stopping
      $("#number2_status").css("border-color", "#0000cc");
    }
  } else {
    // delete die name
    $("#number2_status").text("---");
    // border color set to blue
    $("#number2_status").css("border-color", "#0000cc");
  }
}

function makeDateObject(strDate) {
  var parts = strDate.split(/[ :\-]/);
  var dateObject = new Date();

  dateObject.setFullYear(parts[0]);
  dateObject.setMonth(parts[1] - 1);
  dateObject.setDate(parts[2]);
  dateObject.setHours(parts[3]);
  dateObject.setMinutes(parts[4]);
  dateObject.setSeconds(parts[5]);

  return dateObject;
}

function checkRecordNormal(dateObject) {
  // the difference between now and recored time
  // is bigger than 10 min, return false
  // is smaller than 10 min , return true
  var diffInMilliseconds;
  var diffInMinutes;
  var today = new Date();
  var flag = true;

  // タイムゾーンオフセットを取得（分単位）
  const timeZoneOffset = new Date().getTimezoneOffset();

  if (timeZoneOffset == -540) {
    // 日本からアクセスしているとき
    // 2時間引く
    today.setHours(today.getHours() - 2);
  }

  // 分単位での差を計算
  diffInMilliseconds = Math.abs(today - dateObject);
  diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));

  // if recordeddata was older 10min than now
  if (diffInMinutes > 10) {
    flag = false;
  }
  return flag;
}
