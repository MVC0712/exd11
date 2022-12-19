let ajaxReturnData;
let press_id;
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
$(function() {
	makeSummaryTable();
	makeSelStaff();
});
function makeSummaryTable() {
	var fileName = "./php/Etching/SelSummaryV3.php";
	var sendData = {
		dummy: "dummy",
	};
	myAjax.myAjax(fileName, sendData);
	$("#summary_table tbody").empty();
	ajaxReturnData.forEach(function(trVal) {
		let newTr = $("<tr>");
		Object.keys(trVal).forEach(function(tdVal, index) {
			$("<td>").html(trVal[tdVal]).appendTo(newTr);
		});
		$(newTr).appendTo("#summary_table tbody");
	});
}
function makeSelStaff() {
	var fileName = "./php/Etching/SelStaff.php";
	var sendData = {
		dummy: "dummy",
	};
	myAjax.myAjax(fileName, sendData);
	stafSelect(ajaxReturnData, "etching_staff", 2);
	stafSelect(ajaxReturnData, "etching_check_staff", 1);
};
function stafSelect(data, dom, pos) {
	$("#" + dom + " > option").remove();
	$("#" + dom).append($("<option>").val(0).html("NO select"));
	data.forEach(function(value) {
		if (pos == 2) {
			$("#" + dom).append(
				$("<option>").val(value["id"]).html(value["staff_name"])
			);
		} else {
			if (value.position_id == 1) {
				$("#" + dom).append(
					$("<option>").val(value["id"]).html(value["staff_name"])
				);
			}
		};
	});
};
function makeDataTable(targetDom, ajaxReturnData) {
	$("#data__table tbody tr").remove();
	ajaxReturnData.forEach(function(trVal) {
		var newTr = $("<tr>");
		Object.keys(trVal).forEach(function(tdVal) {
			if (tdVal == "Position" || tdVal == "id") {
				$("<td>").html(trVal[tdVal]).appendTo(newTr);
			} else if (tdVal == "1st_code" || tdVal == "2nd_code" || tdVal == "3rd_code" ||
					tdVal == "4th_code" || tdVal == "5th_code") {
				$("<td>").append(makeNgCodeOptionDom(trVal[tdVal])).appendTo(newTr);
			} else if (tdVal == "1st_jug" || tdVal == "2nd_jug" || tdVal == "3rd_jug" ||
					tdVal == "4th_jug" || tdVal == "5th_jug") {
				$("<td>")
					.append(makeJugCodeOptionDom(trVal[tdVal]))
					.appendTo(newTr);
			} else {
				$("<td>").html(trVal[tdVal]).appendTo(newTr);
			}
		});
		$(newTr).appendTo(targetDom);
	});
	total_code("311", "c311");
	total_code("319", "c319");
	total_code("320", "c320");
	total_code("351", "c351");
};
function makeNgCodeOptionDom(seletedId) {
	let targetDom = $("<select>");
	var ngcode=[
		{
			"id": 33,
			"quality_code": ""
		},
		{
			"id": 11,
			"quality_code": "311"
		},
		{
			"id": 19,
			"quality_code": "319"
		},
		{
			"id": 20,
			"quality_code": "320"
		},
		{
			"id": 25,
			"quality_code": "351"
		}
	]
	ngcode.forEach(function(element) {
		if (element["id"] == seletedId) {
			$("<option>")
				.html(element["quality_code"])
				.val(element["id"])
				.prop("selected", true)
				.appendTo(targetDom);
		} else {
			$("<option>")
				.html(element["quality_code"])
				.val(element["id"])
				.appendTo(targetDom);
		}
	});
	return targetDom;
};
function makeJugCodeOptionDom(seletedId) {
	let targetDom = $("<select>");
	var jugcode=[
		{
			"id": 1,
			"jug": "OK"
		},
		{
			"id": 2,
			"jug": "NG"
		},
		{
			"id": 3,
			"jug": ""
		}
	]
	jugcode.forEach(function(element) {
		if (element["id"] == seletedId) {
			$("<option>")
				.html(element["jug"])
				.val(element["id"])
				.prop("selected", true)
				.appendTo(targetDom);
		} else {
			$("<option>")
				.html(element["jug"])
				.val(element["id"])
				.appendTo(targetDom);
		}
	});
	return targetDom;
};
$(document).on("change", "#data__table tbody td", function() {
	var table, tr, td, i, j, txtdata;
	table = document.getElementById("data__table");
	tr = table.getElementsByTagName("tr");
	for (j = 0; j < 12; j++) {
	  for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[j];
		td1 = tr[i].getElementsByTagName("td")[j+1];
		if (td) {
			txtdata = $(td).find("select").find("option:selected").text();
			if (txtdata == "NG") {
				$(td).find("select").css("background-color", "red");
				$(td1).find("select").css("background-color", "red");
			} else if (txtdata == "OK") {
				$(td).find("select").css("background-color", "white");
				$(td1).find("select").css("background-color", "white");
			}
		}
	  }
	}
});
function color() {
	var table, tr, td, i, j, txtdata;
	table = document.getElementById("data__table");
	tr = table.getElementsByTagName("tr");
	for (j = 0; j < 12; j++) {
	  for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[j];
		td1 = tr[i].getElementsByTagName("td")[j+1];
		if (td) {
			txtdata = $(td).find("select").find("option:selected").text();
			if (txtdata == "NG") {
				$(td).find("select").css("background-color", "red");
				$(td1).find("select").css("background-color", "red");
			} else if (txtdata == "OK") {
				$(td).find("select").css("background-color", "white");
				$(td1).find("select").css("background-color", "white");
			} else if (txtdata != 0 && txtdata != "OK") {
				$(td).find("select").css("background-color", "orange");
			}
		}
	  }
	}
};
$(document).on("click", "#save__button", function() {
	var fileName = "./php/Etching/InsEtchingV3.php";
	tableData = getTableDataInput($("#data__table tbody tr"))
	console.log(tableData);
	jsonData = JSON.stringify(tableData);
	var sendData = {
		data : jsonData,
		press_id : press_id,
		etching_finish : $("#etching_finish").val(),
		etching_staff : $("#etching_staff").val(),
		etching_check_staff : $("#etching_check_staff").val(),
		file_url : $("#file_url").html(),
	};
	console.log(sendData);
	myAjax.myAjax(fileName, sendData);
	var fileName = "./php/Etching/SelData.php";
	var sendData = {
		press_id: press_id,
	};
	myAjax.myAjax(fileName, sendData);
	if (ajaxReturnData.length==0) {
		console.log("Chưa có dữ liệu");
		$("#confirm").html("Chưa lưu dữ liệu");
		$("#save__button").prop("disabled", false);
	} else {
		console.log("Đã lưu dữ liệu");
		$("#confirm").html("Đã lưu dữ liệu");
		$("#save__button").prop("disabled", true);
		makeDataTable($("#data__table"), ajaxReturnData);
	}
	color();
	makeSummaryTable();
});
function getTableDataInput(tableTrObj) {
	var tableData = [];
	tableTrObj.each(function (index, element) {
	  var tr = [];
	  $(this)
		.find("td")
		.each(function (index, element) {
			if ($(this).find("select").length) {
				tr.push($(this).find("select").val());
			} else {
				tr.push($(this).html());
			}
		});
		tableData.push(tr);
	});
	return tableData;
};
$(document).on("click", "#data__table tbody tr", function(e) {
	if (!$(this).hasClass("selected-record")) {
		$(this).parent().find("tr").removeClass("selected-record");
		$(this).addClass("selected-record");
		$("#selected__tr").removeAttr("id");
		$(this).attr("id", "selected__tr");
	} else {
	}
	total_code("311", "c311");
	total_code("319", "c319");
	total_code("320", "c320");
	total_code("351", "c351");
});
$(document).on("change", "#data__table tbody tr select", function () {
	let sendData = new Object();
	let fileName;
	fileName = "./php/Etching/UpdateEtching.php";
	sendData = {
	  id: $("#selected__tr td:nth-child(2)").html(),
	  jug1 : $("#selected__tr td:nth-child(3) select").val(),
	  code1 : $("#selected__tr td:nth-child(4) select").val(),
	  jug2 : $("#selected__tr td:nth-child(5) select").val(),
	  code2 : $("#selected__tr td:nth-child(6) select").val(),
	  jug3 : $("#selected__tr td:nth-child(7) select").val(),
	  code3 : $("#selected__tr td:nth-child(8) select").val(),
	  jug4 : $("#selected__tr td:nth-child(9) select").val(),
	  code4 : $("#selected__tr td:nth-child(10) select").val(),
	  jug5 : $("#selected__tr td:nth-child(11) select").val(),
	  code5 : $("#selected__tr td:nth-child(12) select").val(),
	};
	console.log(sendData);
	myAjax.myAjax(fileName, sendData);
	total_code("311", "c311");
	total_code("319", "c319");
	total_code("320", "c320");
	total_code("351", "c351");
});
$(document).on("change", "#etching__date", function() {
	var fileName = "./php/Etching/InsEtchingDate.php";
	var sendData = {
		press_id : press_id,
		etching__date: $("#etching__date").val(),
	};
	myAjax.myAjax(fileName, sendData);
	$("#etching__date").addClass("complete-input").removeClass("no-input");
});
$(document).on("change", "#etching_finish", function() {
	updateFinish();
});
$(document).on("change", "#etching_staff", function() {
	if ($(this).val() != 0) {
		$(this).removeClass("no-input").addClass("complete-input");
	} else {
		$(this).removeClass("complete-input").addClass("no-input");
	}
	updateFinish();
});
$(document).on("change", "#etching_check_staff", function() {
	if ($(this).val() != 0) {
		$(this).removeClass("no-input").addClass("complete-input");
	} else {
		$(this).removeClass("complete-input").addClass("no-input");
	}
	updateFinish();
});
$(document).on("change", "#file-upload__input", function() {
	updateFinish();
});
function updateFinish() {
	if (press_id) {
		var fileName = "./php/Etching/UpdateFinish.php";
		var sendData = {
			press_id: press_id,
			etching_finish : $("#etching_finish").val(),
			etching_staff : $("#etching_staff").val(),
			etching_check_staff : $("#etching_check_staff").val(),
			file_url : $("#file_url").html(),
		};
		myAjax.myAjax(fileName, sendData);
	}
};
function total_code(code, idcol) {
	var ttcode = $('#data__table tbody td').map(function(){
		return $(this).find("select").find("option:selected").text().split(/\W+/).filter(function(v){return v==code}).length
	}).toArray().reduce(function(p,v){return p+v});
	document.getElementById(idcol).innerHTML = ttcode;
};
$(document).on("click", "#data__table tbody tr", function(e) {
	if (!$(this).hasClass("selected-record")) {
		$(this).parent().find("tr").removeClass("selected-record");
		$(this).addClass("selected-record");
		$("#selected__tr").removeAttr("id");
		$(this).attr("id", "selected__tr");
	} else {
	}
	total_code("311", "c311");
	total_code("319", "c319");
	total_code("320", "c320");
	total_code("351", "c351");
});
$(document).on("click", "#summary_table tbody tr", function(e) {
	if (!$(this).hasClass("selected-record")) {
		$(this).parent().find("tr").removeClass("selected-record");
		$(this).addClass("selected-record");
		$("#selected__tr").removeAttr("id");
		$(this).attr("id", "selected__tr");

		var fileName = "./php/Etching/SelSide.php";
		var sendData = {
			dies_id: $("#selected__tr").find("td").eq(2).html(),
		};
		myAjax.myAjax(fileName, sendData);
		$("#table_headder").html($("#selected__tr").find("td").eq(3).html()+" ("+$("#selected__tr").find("td").eq(1).html()+")");
		let h = ajaxReturnData[0].hole;
		let n = ajaxReturnData[0].n;
		let m = ajaxReturnData[0].m;
		press_id = $("#selected__tr").find("td").eq(0).html();
		var fileName = "./php/Etching/SelPressDataV2.php";
		var sendData = {
			press_id: press_id,
		};
		myAjax.myAjax(fileName, sendData);
		$("#pressing_type").val(ajaxReturnData[0]["pressing_type"]);
		$("#etching__date").val(ajaxReturnData[0]["etching_check_date"]).removeClass("no-input").addClass("complete-input");
		$("#input_billet_quantity").val(
			ajaxReturnData[0]["actual_billet_quantities"]
		);
		let a = ajaxReturnData[0]["actual_billet_quantities"];
		var fileName = "./php/Etching/SelExist.php";
		var sendData = {
			press_id: press_id,
		};
		myAjax.myAjax(fileName, sendData);
		$("#data__table tbody tr").remove();
		for (i = 0; i < Math.ceil(a * 2 * m * h); ++i) {
			let trDom = $("<tr>");
			if (n==1){
				if (i%2==0){trDom.append($("<td>").html(Math.ceil((i-n)/(2*n) + 1) + "H"));}
				else {trDom.append($("<td>").html(Math.ceil((i-n)/(2*n) + 1) + "E"));}
			} else if (n==2){
				if (i%4==0){trDom.append($("<td>").html( Math.ceil((i-n-1)/(2*n) + 1) + "H"));}
				else if (i%4==1) {trDom.append($("<td>").html( Math.ceil((i-n-1)/(2*n) + 1) + "A"));}
				else if (i%4==2) {trDom.append($("<td>").html( Math.ceil((i-n-1)/(2*n) + 1) + "B"));}
				else {trDom.append($("<td>").html( Math.ceil((i-n-1)/(2*n) + 1) + "E"));}
			} else if (n==3){
				if (i%6==0){ trDom.append($("<td>").html( Math.ceil((i-n-2)/(2*n) + 1) + "H")); }
				else if (i%6==1) { trDom.append($("<td>").html( Math.ceil((i-n-2)/(2*n) + 1) + "A")); }
				else if (i%6==2) { trDom.append($("<td>").html( Math.ceil((i-n-2)/(2*n) + 1) + "B")); }
				else if (i%6==3) { trDom.append($("<td>").html( Math.ceil((i-n-2)/(2*n) + 1) + "C")); }
				else if (i%6==4) { trDom.append($("<td>").html( Math.ceil((i-n-2)/(2*n) + 1) + "D")); }
				else { trDom.append($("<td>").html( Math.ceil((i-n-2)/(2*n) + 1) + "E")); }
			} else if (n==4){
				if (i%8==0){ trDom.append($("<td>").html( Math.ceil((i-n-3)/(2*n) + 1) + "H")); }
				else if (i%8==1) { trDom.append($("<td>").html( Math.ceil((i-n-3)/(2*n) + 1) + "A")); }
				else if (i%8==2) { trDom.append($("<td>").html( Math.ceil((i-n-3)/(2*n) + 1) + "B")); }
				else if (i%8==3) { trDom.append($("<td>").html( Math.ceil((i-n-3)/(2*n) + 1) + "C")); }
				else if (i%8==4) { trDom.append($("<td>").html( Math.ceil((i-n-3)/(2*n) + 1) + "D")); }
				else if (i%8==5) { trDom.append($("<td>").html( Math.ceil((i-n-3)/(2*n) + 1) + "E")); }
				else if (i%8==6) { trDom.append($("<td>").html( Math.ceil((i-n-3)/(2*n) + 1) + "F")); }
				else { trDom.append($("<td>").html( Math.ceil((i-n-3)/(2*n) + 1) + "END")); }
			}
			for (j = 0; j < 11; ++j) {
			let tdDom;
			if (j==0) {
				trDom.append($("<td>").html(""));
			} else if (j%2==1) {
				tdDom = $("<td>").append($("<select>").append(
					// $("<option>").val(3).html(""),
					$("<option>").val(1).html("OK"),
					$("<option>").val(2).html("NG")
				).addClass("need-clear"));
					if (j>2) {
						tdDom = $("<td>").append($("<select>").append(
							$("<option>").val(3).html(""),
							$("<option>").val(1).html("OK"),
							$("<option>").val(2).html("NG")
						).addClass("need-clear"));
					}
			} else if (j==2){
				tdDom = $("<td>").append($("<select>").append(
					$("<option>").val(33).html(""),
					$("<option>").val(11).html("311"),
					$("<option>").val(19).html("319"),
					$("<option>").val(20).html("320"),
					$("<option>").val(25).html("351"),
				).addClass("need-clear"));
			} else {
				tdDom = $("<td>").append($("<select>").append(
					$("<option>").val(33).html(""),
					$("<option>").val(11).html("311"),
					$("<option>").val(19).html("319"),
					$("<option>").val(20).html("320"),
					$("<option>").val(25).html("351"),
				).addClass("need-clear"));
			}
			trDom.append(tdDom);
			}
			trDom.appendTo("#data__table");
		}
		var fileName = "./php/Etching/SelData.php";
		var sendData = {
			press_id: press_id,
		};
		myAjax.myAjax(fileName, sendData);
		if (ajaxReturnData.length==0) {
			$("#confirm").html("Chưa lưu dữ liệu");
			$("#save__button").prop("disabled", false);
		} else {
			$("#confirm").html("Đã lưu dữ liệu");
			$("#save__button").prop("disabled", true);
			makeDataTable($("#data__table"), ajaxReturnData);
		}
		color();
		var fileName = "./php/Etching/SelFinish.php";
		var sendData = {
			press_id: press_id,
		};
		myAjax.myAjax(fileName, sendData);
		if (ajaxReturnData.length==0) {
			$("#etching_finish").val(0);
			$("#etching_staff").val(0);
			$("#etching_check_staff").val(0);
			$("#file_url").html("No_image.jpg");
		} else {
			$("#etching_finish").val(ajaxReturnData[0].etching_finish);
			$("#etching_staff").val(ajaxReturnData[0].etching_staff).removeClass("no-input").addClass("complete-input");
			$("#etching_check_staff").val(ajaxReturnData[0].etching_check_staff).removeClass("no-input").addClass("complete-input");
			$("#file_url").html(ajaxReturnData[0].etching_file_url);
			$("#preview__button").prop("disabled", false)
		}
	} else {

	}
	$("#print__button").prop("disabled", false);
});
function timkiem() {
	var input, table, tr, td, td1, td2, filter, i, txtdata, txtdata1, txtdata2, txtdata3;
	input = document.getElementById("die_number__input");
	filter = input.value.toUpperCase();
	table = document.getElementById("summary_table");
	var tbody = table.getElementsByTagName("tbody")[0];
	var tr = tbody.getElementsByTagName("tr");
	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[1];
		td1 = tr[i].getElementsByTagName("td")[2];
		td2 = tr[i].getElementsByTagName("td")[3];
		td3 = tr[i].getElementsByTagName("td")[4];
		if (td||td1||td2) {
			txtdata = td.innerText;
			txtdata1 = td1.innerText;
			txtdata2 = td2.innerText;
			txtdata3 = td3.innerText;
			if (txtdata.toUpperCase().indexOf(filter) > -1||
				txtdata1.toUpperCase().indexOf(filter) > -1||
				txtdata2.toUpperCase().indexOf(filter) > -1||
				txtdata3.toUpperCase().indexOf(filter) > -1) {
				tr[i].style.display = "";
			} else {
				tr[i].style.display = "none";
			}
		}
	}
};
$("input#file-upload__input").on("change", function () {
	var file = $(this).prop("files")[0];
	$("label").html(file.name);
	$("#preview__button").prop("disabled", false);
	ajaxFileUpload();
});
function ajaxFileUpload() {
	var file_data = $('#file-upload__input').prop('files')[0];
	var form_data = new FormData();
	form_data.append('file', file_data);
	$.ajax({
		url: "./php/Etching/FileUpload.php",
		dataType: 'text',
		cache: false,
		contentType: false,
		processData: false,
		data: form_data,
		type: 'post',
	});
};
$(document).on("click", "#preview__button", function () {
	window.open("./EtchingSub.html");
});

$(function(){
	$('#print__button').click(function(){
		var fileName = "./php/Etching/SelForExcel.php";
		var sendData = {
			press_id: $("#selected__tr").find("td").eq(0).html(),
		};
		myAjax.myAjax(fileName, sendData);

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
			table td, table th {
				border: 1px solid black;
				margin: 0px;
			}
		</style>
		<div style="width : 790px; height: 1100px; display: flex; flex-direction: row;">
		<div style="width : 2%; height: 100%;">
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
					<img src=${etcing_file_url} alt="" style="height: 150px; width: auto; margin-left: 20px;">
				</div>
			</div>
		</div>
		</div>`

		var page2 = `
			<div style="width : 790px; height: 1100px; display: flex; flex-direction: row;">
			<div style="width : 3%; height: 100%;">
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
							<img src=${etcing_file_url} alt="" style="height: 150px; width: auto; margin-left: 20px;">
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
	    var trDom = `<tr>`;
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
		trDom += `<td style="width: 30px;"></td>
		            <td style="width: 30px;"></td>
		            <td style="width: 30px;"></td>
		            <td style="width: 30px;"></td>
		        </tr>`;
		tbd += trDom;
	}
	return trDomC + tbd + "</tbody>";
};