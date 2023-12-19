let ajaxReturnData;
let press_id;

const myAjax = {
    myAjax: function(fileName, sendData) {
        $.ajax({
                type: "POST",
                url: "./php/MeasurementPosition/" + fileName,
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
    // selHeader();
    makeStaff();
	makeProductionNumber();
});
function selHeader() {
	var fileName = "SelHeader.php";
	var sendData = {
		production_number_id : $("#selected__tr").find("td").eq(2).html(),
	};
	console.log(sendData)
	myAjax.myAjax(fileName, sendData);
	$("#data__table thead").empty();
	$("#data__table tbody").empty();
	result = groupBy(ajaxReturnData);
	result.forEach(function(trVal) {
		var newTr = $("<tr>");
		Object.keys(trVal).forEach(function(tdVal) {
			if (tdVal == "data") {
				trVal[tdVal].forEach(function(Val) {
					$("<th>").html(Val).appendTo(newTr);
				});
			} else {
				$("<th>").html(trVal[tdVal]).appendTo(newTr);
			}
		});
		$(newTr).appendTo("#data__table thead");
	});
}
function selMeaData() {
	var fileName = "SelMeaData.php";
	var sendData = {
		press_id : $("#selected__tr").find("td").eq(0).html(),
	};
	myAjax.myAjax(fileName, sendData);
	result = groupBy(ajaxReturnData, 'position', 'value');
	result.forEach(function(trVal) {
		var newTr = $("<tr>");
		Object.keys(trVal).forEach(function(tdVal) {
			if (tdVal == "data") {
				trVal[tdVal].forEach(function(Val) {
					$("<td>").append($("<input>").val(Val)).appendTo(newTr);
				});
			} else {
				$("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
			}
		});
		$(newTr).appendTo("#data__table tbody");
	});
	compareValue();
};
function makeProductionNumber() {
    var fileName = "SelProductionNumber.php";
    var sendData = {
		production_number : $("#pro_search").val(),
    };
    myAjax.myAjax(fileName, sendData);
    $("#production_number > option").remove();
    $("#production_number").append($("<option>").val(0).html("NO select"));
    ajaxReturnData.forEach(function(value) {
        $("#production_number").append(
            $("<option>").val(value["id"]).html(value["production_number"])
        );
    });
};
function makeStaff() {
    var fileName = "SelStaff.php";
    var sendData = {
    };
    myAjax.myAjax(fileName, sendData);
    $("#staff_id > option").remove();
    $("#staff_id").append($("<option>").val(0).html("NO select"));
    ajaxReturnData.forEach(function(value) {
        $("#staff_id").append(
            $("<option>").val(value["id"]).html(value["staff_name"])
        );
    });
};
function groupBy(array, name, value) {
	const
		groupByNameValue = (r, o) => {
			var object = r.find(p => p.name === o[name]);
			if (!object) {
				r.push(object = { name: o[name], data: [] });
			}
			object.data.push(o[value]);
			return r;
		},
		groupByAllKeys = (r, o) => {
			Object.entries(o).forEach(([name, value]) => {
				var object = r.find(p => p.name === name);
				if (!object) {
					r.push(object = { name, data: [] });
				}
				object.data.push(value);
			});
			return r;
		}
	return array.reduce(name && value ? groupByNameValue : groupByAllKeys, []);
};
$(document).on("keyup", "#die_number__input", function() {
    makeSummaryTable();
});
$(document).on("keyup", "#pro_search", function() {
    makeProductionNumber();
});
$(document).on("change", "#measurement_date", function() {
	if ("" != $(this).val())
	$(this).removeClass("no-input").addClass("complete-input");
else $(this).removeClass("complete-input").addClass("no-input");
    checkSaveMeaData();
});
$(document).on("change", "#staff_id", function() {
	if (0 != $(this).val())
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
    checkSaveMeaData();
});
$(document).on("change", "#production_number", function() {
	if (0 != $(this).val())
        $(this).removeClass("no-input").addClass("complete-input");
    else $(this).removeClass("complete-input").addClass("no-input");
	checkSavePosData();
});
function makeSummaryTable() {
	var fileName = "SelSummary.php";
	var sendData = {
			die_number__input: $("#die_number__input").val(),
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
};

$(document).on("click", "#save__button", function() {

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

$(document).on("change", "#data__table tbody tr", function () {

});

$(document).on("click", "#data__table tbody tr", function(e) {
	if (!$(this).hasClass("selected-record")) {
		$(this).parent().find("tr").removeClass("selected-record");
		$(this).addClass("selected-record");
		$("#data_select_tr").removeAttr("id");
		$(this).attr("id", "data_select_tr");
	} else {
	}
});

$(document).on("click", "#summary_table tbody tr", function(e) {
	if (!$(this).hasClass("selected-record")) {
		$(this).parent().find("tr").removeClass("selected-record");
		$(this).addClass("selected-record");
		$("#selected__tr").removeAttr("id");
		$(this).attr("id", "selected__tr");
		selHeader();
		checkSaveMeaData();
	} else {
	}
});
function roundUp(num, precision) {
	precision = Math.pow(10, precision)
	return Math.ceil(num * precision) / precision
};

$(document).on("click", "#form", function() {
  const a = document.createElement("a");
  document.body.appendChild(a);

  a.download = "ToWarehouseForm.xlsx";
  a.href = "../../../diereport/ex0.11/py/ToWarehouseForm.xlsx";

  a.click();
  a.remove();
});

const excel_file = document.getElementById('file');
excel_file.addEventListener('change', (event) => {
	// if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(event.target.files[0].type)) {
	// 	document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">Only .xlsx or .xls file format are allowed</div>';
	// 	excel_file.value = '';
	// 	return false;
	// }
	$("#data__table tbody").empty();
	var from_row = $("#from_row").val();
	if (from_row == "") {
		from_row = 9;
	} else {from_row = $("#from_row").val()}
	// var to_row = $("#to_row").val();
	const options = {
		raw: false, 
		dateNF: 'yyyy-mm-dd',
		header: 1
	};
	var reader = new FileReader();
	reader.readAsArrayBuffer(event.target.files[0]);
	reader.onload = function (event) {
		var data = new Uint8Array(reader.result);
		var work_book = XLSX.read(data, { type: 'array' });
		var sheet_name = work_book.SheetNames;
		var sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], options);
		for(var row = 0; row < sheet_data.length; row++) {
			let newTr = $("<tr>");
			if(sheet_data[row].length !== 0) {
				// console.log(sheet_data[row]);
				if(row >= from_row) {
					$.each(sheet_data[row], function(key,valueObj){
						if((key == 4) || (key > 6)) {
							$("<td>").append($("<input>").val(valueObj)).appendTo(newTr);
							$(newTr).appendTo("#data__table tbody");
						}
					});
				}
			}
		}
		compareValue();
		excel_file.value = '';
	}
	checkSaveMeaData();
});

function getSaveData() {
	var idArray = [];
	$("#data__table thead tr").each(function (index, element) {
		var tr = [];
		$(this).find("th").each(function (index, element) {
			tr.push($(this).html());
		});
		idArray.push(tr);
	});

	var valueArray = [];
	$("#data__table tbody tr").each(function (index, element) {
		var tr = [];
		$(this).find("td").each(function (index, element) {
			tr.push($(this).find("input").val());
		});
		valueArray.push(tr);
	});

	var res = [];
	for (var i = 0; i < valueArray.length; i++) {
		for (var j = 1; j < valueArray[i].length; j++) {
			res.push({ measurement_position_id: idArray[0][j], position: valueArray[i][0], value: valueArray[i][j] });
		}
	}
	return res;
};

function compareValue() {
	var limitValue = [];
	$("#data__table thead tr").each(function (index, element) {
		var tr = [];
		$(this).find("th").each(function (index, element) {
			tr.push($(this).html());
		});
		limitValue.push(tr);
	});
	upperValue = limitValue[3];
	lowerValue = limitValue[4];
	$("#data__table tbody tr").each(function (index, element) {
		$(this).find("td").each(function (index, element) {
			if ((index != 0) && (($(this).find("input").val() >= upperValue[index]) || ($(this).find("input").val() <= lowerValue[index]))){
				$(this).find("input").css("color", "red");
			}
		});
	});
};

function checkSaveMeaData() {
	if (($("#data__table thead tr").length == 0) || 
		($("#data__table tbody tr").length == 0) || 
		(($("#data__table thead tr:first th").length) != ($("#data__table tbody tr:first td").length)) || 
		($("#measurement_date").hasClass("no-input")) || 
		($("#staff_id").hasClass("no-input"))) {
		$("#save__button").prop("disabled", true);
	} else {
		$("#save__button").prop("disabled", false);
	}
};
function checkSavePosData() {
	if (($("#add_value tbody tr").length == 0) || 
		($("#production_number").hasClass("no-input"))) {
		$("#save_new_value").prop("disabled", true);
	} else {
		$("#save_new_value").prop("disabled", false);
	}
};


$(document).on("click", "#add_new_value", function() {
	var newTr = $("<tr>");
	$("<td>").append(makeNumberInput($("#pos_on_drawing").val())).appendTo(newTr);
	$("<td>").append(makeNumberInput($("#value").val())).appendTo(newTr);
	$("<td>").append(makeNumberInput($("#upper_limit").val())).appendTo(newTr);
	$("<td>").append(makeNumberInput($("#lower_limit").val())).appendTo(newTr);
	$(newTr).appendTo("#add_value tbody");
	checkSavePosData();
});
function makeNumberInput(qty) {
	let targetDom = $("<input>");
	targetDom.attr("type", "number");
	targetDom.val(qty);
	return targetDom;
}


$(document).on("click", "#save_new_value", function() {
	let production_number_id = $("#production_number").val();
	let dataS = getTableDataInput($("#add_value tbody tr"));
  dataS.push(production_number_id);
  fileName = "InsMeaPosValue.php";
  sendData = JSON.stringify(dataS);
  myAjax.myAjax(fileName, sendData);
});

$(document).on("click", "#save__button", function() {
	let measurement_date = $("#measurement_date").val();
	let staff_id = $("#staff_id").val();
	let press_id = $("#selected__tr").find("td").eq(0).html();
	var sendData = new Object();
  var fileName = "InsMeaPosValueOnPress.php";
	sendData["dataS"] = getSaveData();
	sendData["measurement_date"] = measurement_date;
	sendData["staff_id"] = staff_id;
	sendData["press_id"] = press_id;

  myAjax.myAjax(fileName, sendData);
});