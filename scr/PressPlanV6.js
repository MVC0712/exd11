let editMode = false;
let deleteDialog = document.getElementById("delete__dialog");
const myAjax = {
  myAjax: function(fileName, sendData) {
      $.ajax({
              type: "POST",
              url: fileName,
              dataType: "json",
              data: sendData,
              async: false,
          })
          .done(function(data) {
              ajaxReturnData = data;
          })
          .fail(function() {
              alert("DB connect error");
          });
  },
};
const shiftSel =[
	{
		id : 4,
		shift : "HC"
	},{
		id : 1,
		shift : 1
	},
	{
		id : 2,
		shift : 2
	},{
		id : 3,
		shift : 3
	}
];
const nitrideSel =[
	{
		id : 0,
		nitride : "No"
	},
	{
		id : 1,
		nitride : "Yes"
	}
];

$(function() {
  var now = new Date();
  var MonthLastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  var MonthFirstDate = new Date(now.getFullYear(), (now.getMonth() + 12) % 12, 1);
  var formatDateComponent = function(dateComponent) {
    return (dateComponent < 10 ? '0' : '') + dateComponent;
  };

  var formatDate = function(date) {
    return date.getFullYear()  + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate()) ;
  };
  var a = (new Date());
  var b = formatDate(MonthLastDate);
  var c = formatDate(new Date());

  $("#plan_start").val(c);
  $("#plan_end").val(formatDate(new Date(a.setDate(a.getDate() + 10))))

  makeSummaryTable();
  makeProductionNumber();
});
$(document).on("keyup", "#production_number", function (e) {
  var fileName = "./php/PressPlan/SelProductionNumber.php";
  var sendData = {
    production_number: $(this).val(),
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#production__table tbody"));
});
function makeProductionNumber() {
  var fileName = "./php/PressPlan/SelProductionNumber.php";
  var sendData = {
    production_number: $("#production_number").val(),
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#production__table tbody"));
}
function makeSummaryTable() {
  var fileName = "./php/PressPlan/SelSummaryV6.php";
  var sendData = {
    start : $("#plan_start").val(),
    end : $("#plan_end").val(),
    die_number : $("#die_number").val(),
    machine : $("#machine").val(),
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#summary__table tbody"));
  makeLastBillet();
  makePlanBillet();
  makeUsedBillet();
  makeOrderBillet();
  orderQuantity();
  $("#hover_area").addClass("notshow");
}
function makeLastBillet() {
  var fileName = "./php/PressPlan/SelLastBillet.php";
  var sendData = {
      dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  $("#ht60612281200").text(ajaxReturnData[0].A60612281200);
  $("#ht6061228600").text(ajaxReturnData[0].A6061228600);
  $("#ht60632281200").text(ajaxReturnData[0].A60632281200);
  $("#ht6063228600").text(ajaxReturnData[0].A6063228600);
  $("#ht6N012281200").text(ajaxReturnData[0].A6N01A2281200);
  $("#ht6N01228600").text(ajaxReturnData[0].A6N01A228600);

  $("#ht60613051200").text(ajaxReturnData[1].A60612281200);
  $("#ht6061305600").text(ajaxReturnData[1].A6061228600);
  $("#ht60633051200").text(ajaxReturnData[1].A60632281200);
  $("#ht6063305600").text(ajaxReturnData[1].A6063228600);
  $("#ht6N013051200").text(ajaxReturnData[1].A6N01A2281200);
  $("#ht6N01305600").text(ajaxReturnData[1].A6N01A228600);

  $("#ht60613551200").text(ajaxReturnData[2].A60612281200);
  $("#ht6061355600").text(ajaxReturnData[2].A6061228600);
  $("#ht60633551200").text(ajaxReturnData[2].A60632281200);
  $("#ht6063355600").text(ajaxReturnData[2].A6063228600);
  $("#ht6N013551200").text(ajaxReturnData[2].A6N01A2281200);
  $("#ht6N01355600").text(ajaxReturnData[2].A6N01A228600);
};

function makeUsedBillet() {
  var fileName = "./php/PressPlan/SelUsedBillet.php";
  var sendData = {
      start : $("#plan_start").val(),
      end : $("#plan_end").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#tt60612281200").html(ajaxReturnData[0].A60612281200);
  $("#tt6061228600").html(ajaxReturnData[0].A6061228600);
  $("#tt60632281200").html(ajaxReturnData[0].A60632281200);
  $("#tt6063228600").html(ajaxReturnData[0].A6063228600);
  $("#tt6N012281200").html(ajaxReturnData[0].A6N01A2281200);
  $("#tt6N01228600").html(ajaxReturnData[0].A6N01A228600);

  $("#tt60613051200").text(ajaxReturnData[0].A60613051200);
  $("#tt6061305600").text(ajaxReturnData[0].A6061305600);
  $("#tt60633051200").text(ajaxReturnData[0].A60633051200);
  $("#tt6063305600").text(ajaxReturnData[0].A6063305600);
  $("#tt6N013051200").text(ajaxReturnData[0].A6N01A3051200);
  $("#tt6N01305600").text(ajaxReturnData[0].A6N01A305600);

  $("#tt60613551200").text(ajaxReturnData[0].A60613551200);
  $("#tt6061355600").text(ajaxReturnData[0].A6061355600);
  $("#tt60633551200").text(ajaxReturnData[0].A60633551200);
  $("#tt6063355600").text(ajaxReturnData[0].A6063355600);
  $("#tt6N013551200").text(ajaxReturnData[0].A6N01A3551200);
  $("#tt6N01355600").text(ajaxReturnData[0].A6N01A355600);
};

function makePlanBillet() {
  var fileName = "./php/PressPlan/SelPlanBillet.php";
  var sendData = {
      start : $("#plan_start").val(),
      end : $("#plan_end").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#pl60612281200").html(ajaxReturnData[0].A60612281200);
  $("#pl6061228600").html(ajaxReturnData[0].A6061228600);
  $("#pl60632281200").html(ajaxReturnData[0].A60632281200);
  $("#pl6063228600").html(ajaxReturnData[0].A6063228600);
  $("#pl6N012281200").html(ajaxReturnData[0].A6N01A2281200);
  $("#pl6N01228600").html(ajaxReturnData[0].A6N01A228600);

  $("#pl60613051200").text(ajaxReturnData[0].A60613051200);
  $("#pl6061305600").text(ajaxReturnData[0].A6061305600);
  $("#pl60633051200").text(ajaxReturnData[0].A60633051200);
  $("#pl6063305600").text(ajaxReturnData[0].A6063305600);
  $("#pl6N013051200").text(ajaxReturnData[0].A6N01A3051200);
  $("#pl6N01305600").text(ajaxReturnData[0].A6N01A305600);

  $("#pl60613551200").text(ajaxReturnData[0].A60613551200);
  $("#pl6061355600").text(ajaxReturnData[0].A6061355600);
  $("#pl60633551200").text(ajaxReturnData[0].A60633551200);
  $("#pl6063355600").text(ajaxReturnData[0].A6063355600);
  $("#pl6N013551200").text(ajaxReturnData[0].A6N01A3551200);
  $("#pl6N01355600").text(ajaxReturnData[0].A6N01A355600);
};

function makeOrderBillet() {
  $("#od60612281200").html(orderQuantity($("#pl60612281200").html() - $("#ht60612281200").html()));
  $("#od6061228600").html(orderQuantity($("#pl6061228600").html() - $("#ht6061228600").html()));
  $("#od60632281200").html(orderQuantity($("#pl60632281200").html() - $("#ht60632281200").html()));
  $("#od6063228600").html(orderQuantity($("#pl6063228600").html() - $("#ht6063228600").html()));
  $("#od6N012281200").html(orderQuantity($("#pl6N012281200").html() - $("#ht6N012281200").html()));
  $("#od6N01228600").html(orderQuantity($("#pl6N01228600").html() - $("#ht6N01228600").html()));

  $("#od60613051200").html(orderQuantity($("#pl60613051200").html() - $("#ht60613051200").html()));
  $("#od6061305600").html(orderQuantity($("#pl6061305600").html() - $("#ht6061305600").html()));
  $("#od60633051200").html(orderQuantity($("#pl60633051200").html() - $("#ht60633051200").html()));
  $("#od6063305600").html(orderQuantity($("#pl6063305600").html() - $("#ht6063305600").html()));
  $("#od6N013051200").html(orderQuantity($("#pl6N013051200").html() - $("#ht6N013051200").html()));
  $("#od6N01305600").html(orderQuantity($("#pl6N01305600").html() - $("#ht6N01305600").html()));

  $("#od60613551200").html(orderQuantity($("#pl60613551200").html() - $("#ht60613551200").html()));
  $("#od6061355600").html(orderQuantity($("#pl6061355600").html() - $("#ht6061355600").html()));
  $("#od60633551200").html(orderQuantity($("#pl60633551200").html() - $("#ht60633551200").html()));
  $("#od6063355600").html(orderQuantity($("#pl6063355600").html() - $("#ht6063355600").html()));
  $("#od6N013551200").html(orderQuantity($("#pl6N013551200").html() - $("#ht6N013551200").html()));
  $("#od6N01355600").html(orderQuantity($("#pl6N01355600").html() - $("#ht6N01355600").html()));
};

function orderQuantity(number) {
  if(number>0){
    odd_part = number % 7;
    if (odd_part==0) {
      return number;
    } else {
      return Math.ceil(number / 7) * 7;
    }
  } else {
    return 0;
  }
};
function fillTableBody(data, tbodyDom) {
  $(tbodyDom).empty();
    data.forEach(function(trVal) {
      var newTr = $("<tr>");
      Object.keys(trVal).forEach(function(tdVal) {
		$("<td>").html(trVal[tdVal]).appendTo(newTr);
      });
      $(newTr).appendTo(tbodyDom);
  });
};
function makeShift(seletedId) {
	let targetDom = $("<select>");
  
	shiftSel.forEach(function(element) {
		if (element["id"] == seletedId) {
			$("<option>")
				.html(element["shift"])
				.val(element["id"])
				.prop("selected", true)
				.appendTo(targetDom);
		} else {
			$("<option>")
				.html(element["shift"])
				.val(element["id"])
				.appendTo(targetDom);
		}
	});
	return targetDom;
};
function makeNitride(seletedId) {
	let targetDom = $("<select>");
  
	nitrideSel.forEach(function(element) {
		if (element["id"] == seletedId) {
			$("<option>")
				.html(element["nitride"])
				.val(element["id"])
				.prop("selected", true)
				.appendTo(targetDom);
		} else {
			$("<option>")
				.html(element["nitride"])
				.val(element["id"])
				.appendTo(targetDom);
		}
	});
	return targetDom;
}
function makeDieNumberSel(seletedId, id) {
  let targetDom = $("<select>");

  fileName = "./php/PressPlan/SelDieNumber.php";
  sendData = {
    production_number_id: id,
  };
  myAjax.myAjax(fileName, sendData);

  ajaxReturnData.forEach(function(element) {
      if (element["id"] == seletedId) {
          $("<option>")
              .html(element["die_number"])
              .val(element["id"])
              .prop("selected", true)
              .appendTo(targetDom);
      } else {
          $("<option>")
              .html(element["die_number"])
              .val(element["id"])
              .appendTo(targetDom);
      }
  });
  return targetDom;
}
function makeDatePlan(datePlan) {
  let targetDom = $("<input>");
  targetDom.attr("type", "date");
  targetDom.val(datePlan);
  return targetDom;
}
function makeInput(qty) {
  let targetDom = $("<input>");
  targetDom.attr("type", "text");
  targetDom.val(qty);
  return targetDom;
}
// ------------------------- input check from here -------------------------
$(document).on("keyup", "#production_number", function (e) {
  var fileName = "./php/PressPlan/SelProductionNumber.php";
  var sendData = {
    production_number: $(this).val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#production_number__select")
  .empty()
  .append($("<option>").val(0).html("No select"));
  ajaxReturnData.forEach(function (value) {
    $("<option>")
      .val(value["id"])
      .html(value["production_number"])
      .appendTo("#production_number__select");
  });
});
$(document).on("change", "#press_date_at", function (e) {
  if ($(this).val() != 0 && $(this).val() != "") {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  checkSave();
});
$(document).on("change", "#press_machine", function (e) {
	if ($(this).val() != 0 && $(this).val() != "") {
	  $(this).removeClass("no-input").addClass("complete-input");
	} else {
	  $(this).removeClass("complete-input").addClass("no-input");
	}
	checkSave();
  });
$(document).on("keyup", "#die_number", function (e) {
  makeSummaryTable();
});
function checkSave() {
  if ($("#add__table tbody tr").length == 0 || $("#press_date_at").val()== "" || $("#press_machine").val() == 0) {
    $("#save__button").prop("disabled", true);
  } else {
    $("#save__button").prop("disabled", false);
  }
};
$(document).on("change", "#plan_start", function (e) {
  makeSummaryTable();
});
$(document).on("change", "#plan_end", function (e) {
  makeSummaryTable();
});
$(document).on("change", "#machine", function (e) {
	makeSummaryTable();
});
// ------------------------- Summary Table ---------------------------------
$(document).on("click", "#summary__table tbody tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).parent().find("tr").removeClass("same-date");
    $(this).addClass("selected-record");
    $("#selected__tr").removeAttr("id");
    $(this).attr("id", "selected__tr");
    $("#selected__tr td:nth-child(3)").attr("id", "selected__date");
    var plDate = $("#selected__tr td:nth-child(3)").html();
    console.log(plDate);
    $("#summary__table tbody tr").each(function (index, element) {
      if ($(this).find("td:nth-child(3)").html() == plDate) {
        $(this).addClass("same-date");
      } else {
        $(this).removeClass("same-date");
      }
    });
    $("#print__button").prop("disabled", false);
  } else {
    let pas = prompt("Please enter your Password", "********");
    if (pas == '01910926') {
      deleteDialog.showModal();
    } else {
      alert("Wrong pas");
    }
    $("#print__button").prop("disabled", true);
  }
});
$(document).on("click", "#production__table tbody tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    $("#selected__tr").removeAttr("id");
    $(this).attr("id", "selected__tr");
    $("#selected__tr td:nth-child(3) input").attr("id", "selected__date");

    var fileName = "./php/PressPlan/SelDieHover.php";
    var sendData = {
      production_number: $(this).find("td:nth-child(1)").html()
    };
    myAjax.myAjax(fileName, sendData);
    fillTableBody(ajaxReturnData, $("#hover_table tbody"));
    $("#hover_area").removeClass("notshow");
  } else {
    $("#hover_area").addClass("notshow");
    let pro_id = $(this).find("td:nth-child(1)").html();
    let pro = $(this).find("td:nth-child(2)").html();
      var newTr = $("<tr>");
      var rowCount = $('#add__table tbody tr').length;
      $("<td>").html(pro_id).appendTo(newTr);
      $("<td>").html(pro).appendTo(newTr);
      $("<td>").append(makeDieNumberSel("", pro_id)).appendTo(newTr);
      $("<td>").append(makeShift()).appendTo(newTr);
      $("<td>").append(makeInput(rowCount + 1)).appendTo(newTr);
      $("<td>").append(makeInput("0")).appendTo(newTr);
      $("<td>").append(makeNitride(0)).appendTo(newTr);
      $("<td>").append(makeInput("")).appendTo(newTr);
      $(newTr).appendTo("#add__table tbody");
      $(this).remove();
  }
  checkSave();
});
$(document).on("click", "#add__table tbody tr", function (e) {
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    $("#selected__tr").removeAttr("id");
    $(this).attr("id", "selected__tr");
  } else {
      // $(this).remove();
  }
  checkSave();
});
function getTableDataInput(tableTrObj) {
  var tableData = [];
  tableTrObj.each(function (index, element) {
    var tr = [];
    $(this).find("td")
      .each(function (index, element) {
          if ($(this).find("select").length) {
              tr.push($(this).find("select").val());
          } else if ($(this).find("input").length) {
              tr.push($(this).find("input").val());
          } else {
              tr.push($(this).html());
          }
      });
      tableData.push(tr);
  });
  return tableData;
};
$(document).on("click", "#delete-dialog-cancel__button", function () {
  deleteDialog.close();
});

$(document).on("click", "#delete-dialog-delete__button", function () {
  var fileName = "./php/PressPlan/DelPlan.php";
  var sendData = {
    targetId : $("#selected__tr td:nth-child(1)").html(),
  };
  myAjax.myAjax(fileName, sendData);
  deleteDialog.close();
  makeSummaryTable();
});

// ------------------------- Save Button -------------------------
$(document).on("click", "#save__button", function () {
  var fileName = "./php/PressPlan/InsPressPlanV6.php";
  tableData = getTableDataInput($("#add__table tbody tr"))
    console.log(tableData); 
    jsonData = JSON.stringify(tableData);
    
    var sendData = {
        data : jsonData,
        press_date_at : $("#press_date_at").val(),
        press_machine : $("#press_machine").val(),
    };
    console.log(sendData);
  myAjax.myAjax(fileName, sendData);
  makeSummaryTable();
  clearInputData();
});

$(document).on("change", "#summary__table tbody tr td", function () {
  let sendData = new Object();
  let fileName;
  fileName = "./php/PressPlan/UpdateInputDataV3.php";
  sendData = {
    targetId : $("#selected__tr td:nth-child(1)").html(),
    die_number_id : $("#selected__tr td:nth-child(5) select").val(),
    ordinal : $("#selected__tr td:nth-child(6) input").val(),
    date_plan : $("#selected__date").val(),
    quantity : $("#selected__tr td:nth-child(7) input").val(),
    note : $("#selected__tr td:nth-child(8) input").val(),
  };
  console.log(sendData);
  myAjax.myAjax(fileName, sendData);
  makeSummaryTable();
});
// ------------------------- update button -------------------------
function clearInputData() {
  $("#add__table tbody tr").remove();
}

$(document).on("click", "#test__button", function () {
  
});

$(document).on("click", "#download_excel", function() {
  ajaxMakeDlFile("Plan");
});

function ajaxMakeDlFile(phpFileName) {
  $.ajax({
          type: "POST",
          url: "./php/DownLoad/" + phpFileName + ".php",
          dataType: "json",
          data: {
              file_name: phpFileName,
              start : $("#plan_start").val(),
    end : $("#plan_end").val(),
    die_number : $("#die_number").val(),
          },
      })
      .done(function(data) {
          downloadFile(phpFileName + ".csv");
      })
      .fail(function(data) {
          alert("call php program error 255");
      });
}

function downloadFile(downloadFileName) {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = downloadFileName;
  a.href = "./download/" + downloadFileName;

  a.click();
  a.remove();
}

$(function(){
	$('#print__button').click(function(){
		var fileName = "./php/PressPlan/SelForPrintPage.php";
		var sendData = {
			id: $("#selected__tr").find("td").eq(0).html(),
		};
		myAjax.myAjax(fileName, sendData);
    console.log(ajaxReturnData)
		var actual_billet_quantities = ajaxReturnData[0].actual_billet_quantities;
		var die_number = ajaxReturnData[0].die_number;
		var press_date_at = ajaxReturnData[0].press_date_at;
		if (ajaxReturnData[0].etcing_file_url) {
			var etcing_file_url = "../EtchingPicture/" + ajaxReturnData[0].etcing_file_url;
		} else {etcing_file_url = "../EtchingPicture/No_image.jpg";}
		var hole = ajaxReturnData[0].hole;
		var m = ajaxReturnData[0].m;
		var n = ajaxReturnData[0].n;
		var nbmh = n +"B" + m + "*" + hole;

		var _el = $('<div style="width : 790px; display: flex; flex-direction: row;">');
		var _head = $('head').clone();
			_head.find('title').text("Etching - Print View");

		var page1 = `
		<style>
			body {
				width : 790px; 
				height: auto; 
				display: flex; 
				flex-direction: column;
			}
			table thead th {
				border: 1px solid black;
				margin: 0px;
				background-color: none;
				color: black;
			}
			@media print {
				table tbody tr {
					-webkit-print-color-adjust: exact;
				}
			}
			table td, table th {
				border: 1px solid black;
				margin: 0px;
			}
		</style>
		<div style="width : 790px; height: 1100px; display: flex; flex-direction: row;">
		<div style="width : 7%; height: 100%;">
		</div>
		<div style="width : 97%; height: 100%; display: flex; flex-direction: column;">
			<div style="width : 100%; height: 5%;">
			</div>
				<div style="width: 100%; height: 2%; display: flex; border: none; flex-direction: row;">
					<h3  style="width: 90%; height: 100%; border: none; padding: 0; margin: 0;">BÁO CÁO ETCHING</h3>
					<div id="nbm" style="width: 10%;">${nbmh}</div>
				</div>
				<div style="width: 100%; height: 6%">
					<table style="overflow: auto; ">
						<tbody style="overflow: auto; height: 50px;">
							<tr>
								<td style="width: 80px;">Ngày đùn</td>
								<td style="width: 80px;">${press_date_at}</td>
								<td style="width: 90px;">Mã khuôn</td>
								<td style="width: 150px;">${die_number}</td>
								<td style="width: 50px;">Số billet</td>
								<td style="width: 50px;">${actual_billet_quantities}</td>
							</tr>
							<tr>
								<td style="width: 80px;">Ngày kiểm tra</td>
								<td style="width: 80px;"></td>
								<td style="width: 90px;">Người kiểm tra</td>
								<td style="width: 150px;"></td>
								<td style="width: 50px;">Số SP</td>
								<td style="width: 50px;">${actual_billet_quantities*hole}</td>
							</tr>
						</tbody>
					</table>
					<div style="font-size: 10px">
						Quy cách đánh giá: Hàng đạt chỉ tiêu (O), bỏ hàng (X), hàng lỗi ghi mã của lỗi (ví dụ lỗi vết nứt: 320)
					</div>
				</div>
			<div style="width : 100%; height: 70%; display: flex">
				<div style="width: 25%; height: 100%;">
					<table>
						<thead>
							<tr>
								<th style="width: 30px;">Vị trí</th>
								<th style="width: 30px;">0:</th>
								<th style="width: 30px;">1:</th>
								<th style="width: 30px;">2:</th>
								<th style="width: 30px;">3:</th>
							</tr>
						</thead>
						${makeTable(0,50,n)}
					</table>
				</div>
				<div style="width: 25%; height: 100%;">
					<table>
						<thead>
							<tr>
								<th style="width: 30px;">Vị trí</th>
								<th style="width: 30px;">0:</th>
								<th style="width: 30px;">1:</th>
								<th style="width: 30px;">2:</th>
								<th style="width: 30px;">3:</th>
							</tr>
						</thead>
						${makeTable(50,100,n)}
					</table>
				</div>
				<div style="width: 25%; height: 100%;">
					<table>
						<thead>
							<tr>
								<th style="width: 30px;">Vị trí</th>
								<th style="width: 30px;">0:</th>
								<th style="width: 30px;">1:</th>
								<th style="width: 30px;">2:</th>
								<th style="width: 30px;">3:</th>
							</tr>
						</thead>
						${makeTable(100,150,n)}
					</table>
				</div>
				<div style="width: 25%; height: 100%;">
					<table>
						<thead>
							<tr>
								<th style="width: 30px;">Vị trí</th>
								<th style="width: 30px;">0:</th>
								<th style="width: 30px;">1:</th>
								<th style="width: 30px;">2:</th>
								<th style="width: 30px;">3:</th>
							</tr>
						</thead>
						${makeTable(150,200,n)}
					</table>
				</div>   
			</div>
			<div style="display: flex; flex-direction: row;">
				<div style="height: 150px; width: 300px">
					<table style="overflow: auto; ">
						<tbody style="overflow: auto; height: 40px;">
							<tr>
								<td style="width: 60px;">Rack</td>
								<td style="width: 40px;"></td>
								<td style="width: 40px;"></td>
								<td style="width: 40px;"></td>
								<td style="width: 40px;"></td>
								<td style="width: 40px;"></td>
								<td style="width: 40px;"></td>
							</tr>
							<tr>
								<td style="width: 60px;">SL rút</td>
								<td style="width: 40px;"></td>
								<td style="width: 40px;"></td>
								<td style="width: 40px;"></td>
								<td style="width: 40px;"></td>
								<td style="width: 40px;"></td>
								<td style="width: 40px;"></td>
							</tr>
						</tbody>
					</table>
					<table style="overflow: auto;">
						<tbody style="overflow: auto; height: 20px;">
							<tr>
								<td style="width: 318px;">Kỹ sư phụ trách: </td>
							</tr>
						</tbody>
					</table>
					<table style="overflow: auto;">
						<tbody style="overflow: auto; height: 50px;">
							<tr>
								<td style="width: 318px; height: 40px;">Chú ý: </td>
							</tr>
						</tbody>
					</table>
					<table style="overflow: auto; ">
						<tbody style="overflow: auto; height: 40px;">
							<tr>
								<td style="width: 80px;">311: Lỗi ăn mòn</td>
								<td style="width: 80px;">319: Lỗi tạp chất</td>
								<td style="width: 80px;">320: lỗi vết nứt</td>
								<td style="width: 80px;">351: lỗi khác</td>
							</tr>
						</tbody>
					</table>
				</div> 
				<div style="height: 150px; width: 300px">
					<img src=${etcing_file_url} alt="" style="width: 100%; height: 100%; object-fit: contain;">
				</div>
			</div>
		</div>
		</div>`

		var page2 = `
			<div style="width : 790px; height: 1100px; display: flex; flex-direction: row;">
			<div style="width : 7%; height: 100%;">
			</div>
			<div style="width : 97%; height: 100%; display: flex; flex-direction: column;">
			<div style="width : 100%; height: 5%;">
				</div>
				<div style="width: 100%; height: 2%; display: flex; border: none; flex-direction: row;">
					<h3  style="width: 90%; height: 100%; border: none; padding: 0; margin: 0;">BÁO CÁO ETCHING</h3>
					<div id="nbm" style="width: 10%;">${nbmh}</div>
				</div>
				<div style="width: 100%; height: 6%">
					<table style="overflow: auto; ">
						<tbody style="overflow: auto; height: 50px;">
							<tr>
								<td style="width: 80px;">Ngày đùn</td>
								<td style="width: 80px;">${press_date_at}</td>
								<td style="width: 90px;">Mã khuôn</td>
								<td style="width: 150px;">${die_number}</td>
								<td style="width: 50px;">Số billet</td>
								<td style="width: 50px;">${actual_billet_quantities}</td>
							</tr>
							<tr>
								<td style="width: 80px;">Ngày kiểm tra</td>
								<td style="width: 80px;"></td>
								<td style="width: 90px;">Người kiểm tra</td>
								<td style="width: 150px;"></td>
								<td style="width: 50px;">Số SP</td>
								<td style="width: 50px;">${actual_billet_quantities*hole}</td>
							</tr>
						</tbody>
					</table>
					<div style="font-size: 10px">
						Quy cách đánh giá: Hàng đạt chỉ tiêu (O), bỏ hàng (X), hàng lỗi ghi mã của lỗi (ví dụ lỗi vết nứt: 320)
					</div>
				</div>
			<div style="width : 100%; height: 70%; display: flex">
				<div style="width: 25%; height: 100%;">
					<table>
						<thead>
							<tr>
								<th style="width: 30px;">Vị trí</th>
								<th style="width: 30px;">0:</th>
								<th style="width: 30px;">1:</th>
								<th style="width: 30px;">2:</th>
								<th style="width: 30px;">3:</th>
							</tr>
						</thead>
							${makeTable(200,250,n)}
						</table>
					</div>
					<div style="width: 25%; height: 100%;">
						<table>
							<thead>
								<tr>
									<th style="width: 30px;">Vị trí</th>
									<th style="width: 30px;">0:</th>
									<th style="width: 30px;">1:</th>
									<th style="width: 30px;">2:</th>
									<th style="width: 30px;">3:</th>
								</tr>
							</thead>
							${makeTable(250,300,n)}
						</table>
					</div>
					<div style="width: 25%; height: 100%;">
						<table>
							<thead>
								<tr>
									<th style="width: 30px;">Vị trí</th>
									<th style="width: 30px;">0:</th>
									<th style="width: 30px;">1:</th>
									<th style="width: 30px;">2:</th>
									<th style="width: 30px;">3:</th>
								</tr>
							</thead>
							${makeTable(300,350,n)}
						</table>
					</div>
					<div style="width: 25%; height: 100%;">
						<table>
							<thead>
								<tr>
									<th style="width: 30px;">Vị trí</th>
									<th style="width: 30px;">0:</th>
									<th style="width: 30px;">1:</th>
									<th style="width: 30px;">2:</th>
									<th style="width: 30px;">3:</th>
								</tr>
							</thead>
							${makeTable(350,400,n)}
							</table>
						</div>   
					</div>
					<div style="display: flex; flex-direction: row;">
						<div style="height: 150px; width: 300px">
							<table style="overflow: auto; ">
								<tbody style="overflow: auto; height: 40px;">
									<tr>
										<td style="width: 60px;">Rack</td>
										<td style="width: 40px;"></td>
										<td style="width: 40px;"></td>
										<td style="width: 40px;"></td>
										<td style="width: 40px;"></td>
										<td style="width: 40px;"></td>
										<td style="width: 40px;"></td>
									</tr>
									<tr>
										<td style="width: 60px;">SL rút</td>
										<td style="width: 40px;"></td>
										<td style="width: 40px;"></td>
										<td style="width: 40px;"></td>
										<td style="width: 40px;"></td>
										<td style="width: 40px;"></td>
										<td style="width: 40px;"></td>
									</tr>
								</tbody>
							</table>
							<table style="overflow: auto;">
								<tbody style="overflow: auto; height: 20px;">
									<tr>
										<td style="width: 318px;">Kỹ sư phụ trách: </td>
									</tr>
								</tbody>
							</table>
							<table style="overflow: auto;">
								<tbody style="overflow: auto; height: 50px;">
									<tr>
										<td style="width: 318px; height: 40px;">Chú ý: </td>
									</tr>
								</tbody>
							</table>
							<table style="overflow: auto; ">
								<tbody style="overflow: auto; height: 40px;">
									<tr>
										<td style="width: 80px;">311: Lỗi ăn mòn</td>
										<td style="width: 80px;">319: Lỗi tạp chất</td>
										<td style="width: 80px;">320: lỗi vết nứt</td>
										<td style="width: 80px;">351: lỗi khác</td>
									</tr>
								</tbody>
							</table>
						</div> 
						<div style="height: 150px; width: 300px">
							<img src=${etcing_file_url} alt="" style="width: 100%; height: 100%; object-fit: contain;">
						</div>
					</div>
				</div>
				</div>`
		_el.append(_head)
		_el.append(page1);
		if (actual_billet_quantities * 2 * m * hole >100) {
            _el.append(page2);
		}
		var nw = window.open("","","width=1200,height=900,left=250,location=no,titlebar=yes")
			nw.document.write(_el.html())
			nw.document.close()
		setTimeout(() => {
			nw.print()
			setTimeout(() => {
			nw.close()
			}, 200);
		}, 500);
	})
});

function makeTable(min,max,n) {
	var tbd = ``;
	var trDomC = `<tbody style="height: 90%; overflow: hidden;">`;
	for (i = min; i < max; ++i) {
		if (i % 2 == 0 ) {
			var trDom = `<tr style="background-color: rgb(228, 255, 140);">`;
		} else var trDom = `<tr>`;
		if (n==1){
			if (i%2==0){
				trDom += `<td style="width: 30px; font-size: 8px;">${Math.ceil((i-n)/(2*n) + 1) + "H"}</td>`;
			} else {
				trDom += `<td style="width: 30px; font-size: 8px;">${Math.ceil((i-n)/(2*n) + 1) + "E"}</td>`;
			}
		} else if (n==2){
			if (i%4==0){
				trDom += `<td style="width: 30px; font-size: 8px;">${Math.ceil((i-n-1)/(2*n) + 1) + "H"}</td>`;
			} else if (i%4==1) {
				trDom += `<td style="width: 30px; font-size: 8px;">${Math.ceil((i-n-1)/(2*n) + 1) + "A"}</td>`;
			} else if (i%4==2) {
				trDom += `<td style="width: 30px; font-size: 8px;">${Math.ceil((i-n-1)/(2*n) + 1) + "B"}</td>`;
			} else {
				trDom += `<td style="width: 30px; font-size: 8px;">${Math.ceil((i-n-1)/(2*n) + 1) + "E"}</td>`;
			}
		} else if (n==3){
			if (i%6==0){
				trDom += `<td style="width: 30px; font-size: 8px;">${Math.ceil((i-n-2)/(2*n) + 1) + "H"}</td>`;
			} else if (i%6==1) {
				trDom += `<td style="width: 30px; font-size: 8px;">${Math.ceil((i-n-2)/(2*n) + 1) + "A"}</td>`;
			} else if (i%6==2) {
				trDom += `<td style="width: 30px; font-size: 8px;">${Math.ceil((i-n-2)/(2*n) + 1) + "B"}</td>`;
			} else if (i%6==3) {
				trDom += `<td style="width: 30px; font-size: 8px;">${Math.ceil((i-n-2)/(2*n) + 1) + "C"}</td>`;
			} else if (i%6==4) {
				trDom += `<td style="width: 30px; font-size: 8px;">${Math.ceil((i-n-2)/(2*n) + 1) + "D"}</td>`;
			} else {
				trDom += `<td style="width: 30px; font-size: 8px;">${Math.ceil((i-n-2)/(2*n) + 1) + "E"}</td>`;
			}
		} else if (n==4){
			if (i%8==0){
				trDom += `<td style="width: 30px; font-size: 8px;">${Math.ceil((i-n-3)/(2*n) + 1) + "H"}</td>`;
			} else if (i%8==1) {
				trDom += `<td style="width: 30px; font-size: 8px;">${Math.ceil((i-n-3)/(2*n) + 1) + "A"}</td>`;
			} else if (i%8==2) {
				trDom += `<td style="width: 30px; font-size: 8px;">${Math.ceil((i-n-3)/(2*n) + 1) + "B"}</td>`;
			} else if (i%8==3) {
				trDom += `<td style="width: 30px; font-size: 8px;">${Math.ceil((i-n-3)/(2*n) + 1) + "C"}</td>`;
			} else if (i%8==4) {
				trDom += `<td style="width: 30px; font-size: 8px;">${Math.ceil((i-n-3)/(2*n) + 1) + "D"}</td>`;
			} else if (i%8==5) {
				trDom += `<td style="width: 30px; font-size: 8px;">${Math.ceil((i-n-3)/(2*n) + 1) + "E"}</td>`;
			} else if (i%8==6) {
				trDom += `<td style="width: 30px; font-size: 8px;">${Math.ceil((i-n-3)/(2*n) + 1) + "F"}</td>`;
			} else {
				trDom += `<td style="width: 30px; font-size: 8px;">${Math.ceil((i-n-3)/(2*n) + 1) + "END"}</td>`;
			}
		}
		trDom += `<td style="width: 30px; font-size: 7px;">O</td>
		            <td style="width: 30px;"></td>
		            <td style="width: 30px;"></td>
		            <td style="width: 30px;"></td>
		        </tr>`;
		tbd += trDom;
	}
	return trDomC + tbd + "</tbody>";
};