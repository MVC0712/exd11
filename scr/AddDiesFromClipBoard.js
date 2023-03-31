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

// document.getElementById("test__button").addEventListener("click", () => {});

document
  .getElementById("insert__button")
  .addEventListener("click", async () => {
    let itemData;
    const text = await navigator.clipboard.readText();

    itemData = text.split("\r\n");
    $("#summary__table_body").empty();
    itemData.forEach(function (element, index) {
      var newTr = $("<tr>");
      $("<td>")
        .html(index + 1)
        .appendTo(newTr);
      $("<td>").html(element).appendTo(newTr);
      if (element.length != 0) {
        newTr.appendTo($("#summary__table_body"));
      }
    });
  });

document.getElementById("check__button").addEventListener("click", function () {
  console.log("hello");
  let fileName;
  let tdText;
  let sendData = new Object();
  // read ng list and fill option
  fileName = "./php/ProductionNumber/SelProductionNumber.php";
  sendData = {
    dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);

  $("#summary__table_body tr td:nth-child(2)").each(function (row) {
    tdText = $(this).html();
    ajaxReturnData.forEach(function (element) {
      if (element.production_number == tdText) {
        console.log(element.production_number + " == " + tdText);
      }
    });
  });
});
