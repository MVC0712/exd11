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
    selHeader();
    selMeaData();
});
function selHeader() {
	var fileName = "SelHeader.php";
	var sendData = {
		production_number_id : 119,
	};
	myAjax.myAjax(fileName, sendData);
	
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
		press_id : '1021',
	};
	myAjax.myAjax(fileName, sendData);
	result = groupBy(ajaxReturnData, 'position', 'value');
	result.forEach(function(trVal) {
		var newTr = $("<tr>");
		Object.keys(trVal).forEach(function(tdVal) {
			if (tdVal == "data") {
				trVal[tdVal].forEach(function(Val) {
					$("<td>").html(Val).appendTo(newTr);
				});
			} else {
				$("<td>").html(trVal[tdVal]).appendTo(newTr);
			}
		});
		$(newTr).appendTo("#data__table tbody");
	});
	compareValue();
}

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
				if(row >= 9) {
					$.each(sheet_data[row], function(key,valueObj){
						if((key == 4) || (key > 6)) {
							$("<td>").html(valueObj).appendTo(newTr);
						}
					});
				}
				$(newTr).appendTo("#data__table tbody");
			}
		}
		excel_file.value = '';
	}
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
			tr.push($(this).html());
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
			if ((index != 0) && (($(this).html() >= upperValue[index]) || ($(this).html() <= lowerValue[index]))){
				$(this).css("color", "red");
			}
		});
	});
};