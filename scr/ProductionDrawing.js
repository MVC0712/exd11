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

$(function () {
  var fileName = "./php/ProductionDrawing/SelProductionNumber.php";
  var sendData = {
  };
  myAjax.myAjax(fileName, sendData);
  $("#summary__table tbody").empty();

  ajaxReturnData.forEach(function (trVal) {
    var newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo("#summary__table tbody");
  });
});

// ==============  summary table ====================
$(document).on("click", "#summary__table tbody tr", function() {
  var fileName = "./php/ProductionDrawing/SelSelFile.php";
  var sendData = new Object();
  document.getElementById("file_area").innerHTML = ``;
  if (!$(this).hasClass("selected-record")) {
      $(this).parent().find("tr").removeClass("selected-record");
      $(this).addClass("selected-record");
      $("#production__selected").removeAttr("id");
      $(this).attr("id", "production__selected");
      sendData = {
          targetId: $("#production__selected").find("td").eq(0).html(),
      };
      myAjax.myAjax(fileName, sendData);

      var filename = ajaxReturnData[0].file_url;
      if (filename !== null) {
        var fileType = filename.substr(filename.lastIndexOf(".") + 1, 3);
        // $("#file").prop("disabled", true);
        console.log(filename)
          switch (fileType) {
              case "pdf":
              case "PDF":
                  $("<object>")
                      .attr(
                          "data",
                          "../upload/Production_drawing/" + filename + "#toolbar=0&navpanes=0")
                      .attr("type", "application/pdf")
                      .appendTo("#file_area");
                  break;
              case "jpe":
              case "JPE":
              case "jpg":
              case "JPG":
              case "png":
              case "PNG":
                  $("<object>")
                      .attr("data", "../upload/Production_drawing/" + filename)
                      .attr("type", "image/jpeg")
                      .appendTo("#file_area");
                  break;
          } 
      } else if (filename === null) {
          document.getElementById("file_area").innerHTML = ``;
          // $("#file").prop("disabled", false);
      }
  } else {
      $(this).removeClass("selected-record");
      document.getElementById("file_area").innerHTML = ``;
  }
});

$("input#file").on("change", function () {
	var file = $(this).prop("files")[0];
	$("#file_url").html(file.name);
	ajaxFileUpload();
  var fileName = "./php/ProductionDrawing/InsFileName.php";
  var sendData = new Object();
  file_url = $("#file_url").html();
  file_url = file_url.replace(/#/g, '');
  sendData = {
    targetId: $("#production__selected").find("td").eq(0).html(),
    file_url: file_url
  };
  myAjax.myAjax(fileName, sendData);
});
function ajaxFileUpload() {
	var file_data = $('#file').prop('files')[0];
	var form_data = new FormData();
	form_data.append('file', file_data);
	$.ajax({
		url: "./php/ProductionDrawing/FileUpload.php",
		dataType: 'text',
		cache: false,
		contentType: false,
		processData: false,
		data: form_data,
		type: 'post',
	});
};

function timkiem() {
  var input, table, tr, td, filter, i, txtdata;
  input = document.getElementById("production_number__input");
  filter = input.value.toUpperCase();
  console.log(filter)
  table = document.getElementById("summary__table");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtdata = td.innerText;
      if (txtdata.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
