let ajaxReturnData;
let press_id;
let meaStaff =[{id: 30, staff_name: "Trần Thị Thảo"},
                {id: 34, staff_name: "Phạm Thị Kim Hương"},
                {id: 41, staff_name: "Nguyễn Thị Vui"},
                {id: 60, staff_name: "Đinh Kiều Diễm"},
            ];

let imageList = [];

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
    selMeaPos();
    selMeaData();
});
function selMeaPos() {
    var fileName = "./php/MeasurementPosition/SelJug.php";
    var sendData = {
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
                $("<td>").html(trVal[tdVal]).appendTo(newTr);
            }
        });
        $(newTr).appendTo("#data__table thead");
    });
}
function selMeaData() {
    var fileName = "./php/MeasurementPosition/SelMeaData.php";
    var sendData = {
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
$(document).on("change", "#name__select", function() {
    if (press_id) {
        var fileName = "./php/MeasurementPosition/InsMeasurementStaff.php";
        var sendData = {
            press_id : press_id,
            measurement_staff: $("#name__select").val(),
        };
        console.log(sendData);
        myAjax.myAjax(fileName, sendData);
        $("#name__select").addClass("complete-input").removeClass("no-input");
    }
});
$(document).on("change", "#measurement__date", function() {
    if (press_id) {
        var fileName = "./php/MeasurementPosition/InsMeasurementDate.php";
        var sendData = {
            press_id : press_id,
            measurement__date: $("#measurement__date").val(),
        };
        console.log(sendData);
        myAjax.myAjax(fileName, sendData);
        $("#measurement__date").addClass("complete-input").removeClass("no-input");
    }
});
$(document).on("keyup", "#die_number__input", function() {
    makeSummaryTable();
});
function makeSummaryTable() {
    var fileName = "./php/MeasurementPosition/SelSummary.php";
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
function makeDataTable(targetDom, ajaxReturnData) {
    $("#data__table tbody tr").remove();
    ajaxReturnData.forEach(function(trVal) {
        var newTr = $("<tr>");
        Object.keys(trVal).forEach(function(tdVal) {
            if (tdVal == "position" || tdVal == "id") {
                $("<td>").html(trVal[tdVal]).appendTo(newTr);
            } else {
                $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
            }
        });
        $(newTr).appendTo(targetDom);
    });
    
};

$(document).on("click", "#save__button", function() {
    var fileName = "./php/MeasurementPosition/InsMeasurement.php";

    tableData = getTableDataInput($("#data__table tbody tr"))
    console.log(tableData);
    jsonData = JSON.stringify(tableData);
    
    var sendData = {
        data : jsonData,
        press_id : press_id,
    };
    console.log(sendData);
    myAjax.myAjax(fileName, sendData);

    var fileName = "./php/MeasurementPosition/SelData.php";
    var sendData = {
        press_id: press_id,
    };
    myAjax.myAjax(fileName, sendData);
    if (ajaxReturnData.length==0) {
        $("#save__button").prop("disabled", false);
    } else {
        $("#save__button").prop("disabled", true);
        makeDataTable($("#data__table"), ajaxReturnData);
    }
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
    let sendData = new Object();
    let fileName;
    fileName = "./php/MeasurementPosition/UpdateMeasurement.php";
    sendData = {
      id: $("#data_select_tr td:nth-child(2)").html(),
      new_1_data : $("#data_select_tr td:nth-child(3) input").val(),
      new_2_data : $("#data_select_tr td:nth-child(4) input").val(),
      new_3_data : $("#data_select_tr td:nth-child(5) input").val(),
      new_4_data : $("#data_select_tr td:nth-child(6) input").val(),
      new_5_data : $("#data_select_tr td:nth-child(7) input").val(),
      new_6_data : $("#data_select_tr td:nth-child(8) input").val(),
      new_7_data : $("#data_select_tr td:nth-child(9) input").val(),
    };
    console.log(sendData);
    myAjax.myAjax(fileName, sendData);
    
});

$(document).on("click", "#add_new", function () {
    let sendData = new Object();
    let fileName;
    fileName = "./php/MeasurementPosition/AddNewMeasurement.php";
    sendData = {
      id: press_id,
      new_pos : $("#new_pos").val(),
      new_1_data : $("#new_1_data").val(),
      new_2_data : $("#new_2_data").val(),
      new_3_data : $("#new_3_data").val(),
      new_4_data : $("#new_4_data").val(),
      new_5_data : $("#new_5_data").val(),
      new_6_data : $("#new_6_data").val(),
      new_7_data : $("#new_7_data").val(),
    };
    console.log(sendData);
    myAjax.myAjax(fileName, sendData);

    fileName = "./php/MeasurementPosition/SelData.php";
    sendData = {
        press_id: press_id,
    };
    myAjax.myAjax(fileName, sendData);
    if (ajaxReturnData.length==0) {
        $("#save__button").prop("disabled", false);
    } else {
        $("#save__button").prop("disabled", true);
        makeDataTable($("#data__table"), ajaxReturnData);
    }
    
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
        $("#measurement__date").val("").addClass("no-input").removeClass("complete-input");
        $("#name__select").val(0).addClass("no-input").removeClass("complete-input");
        var fileName = "./php/MeasurementPosition/SelSide.php";
        var sendData = {
            dies_id: $("#selected__tr").find("td").eq(2).html(),
        };
        myAjax.myAjax(fileName, sendData);
        let h = ajaxReturnData[0].hole; 
        let n = ajaxReturnData[0].n; 
        let m = ajaxReturnData[0].m; 
        press_id = $("#selected__tr").find("td").eq(0).html();
        var fileName = "./php/MeasurementPosition/SelPressDataV2.php";
        var sendData = {
            // press_date: $("#selected__tr").find("td").eq(1).html(),
            // dies_id: $("#selected__tr").find("td").eq(2).html(),
            press_id: press_id,
        };
        myAjax.myAjax(fileName, sendData);
        if (ajaxReturnData[0].measurement_check_date!=null) {
            $("#measurement__date").val(ajaxReturnData[0]["measurement_check_date"]).removeClass("no-input").addClass("complete-input");
        }
        if (ajaxReturnData[0].measurement_staff!=null) {
            $("#name__select").val(ajaxReturnData[0]["measurement_staff"]).removeClass("no-input").addClass("complete-input");
        }
        // press_id = ajaxReturnData[0]["press_id"];
        let a = ajaxReturnData[0]["actual_billet_quantities"];
    
        var fileName = "./php/MeasurementPosition/SelExist.php";
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
			} else if (n==5){
				if (i%10==0){ trDom.append($("<td>").html( Math.ceil((i-n-4)/(2*n) + 1) + "H")); }
				else if (i%10==1) { trDom.append($("<td>").html( Math.ceil((i-n-4)/(2*n) + 1) + "A")); }
				else if (i%10==2) { trDom.append($("<td>").html( Math.ceil((i-n-4)/(2*n) + 1) + "B")); }
				else if (i%10==3) { trDom.append($("<td>").html( Math.ceil((i-n-4)/(2*n) + 1) + "C")); }
				else if (i%10==4) { trDom.append($("<td>").html( Math.ceil((i-n-4)/(2*n) + 1) + "D")); }
				else if (i%10==5) { trDom.append($("<td>").html( Math.ceil((i-n-4)/(2*n) + 1) + "E")); }
				else if (i%10==6) { trDom.append($("<td>").html( Math.ceil((i-n-4)/(2*n) + 1) + "F")); }
				else if (i%10==7) { trDom.append($("<td>").html( Math.ceil((i-n-4)/(2*n) + 1) + "I")); }
				else if (i%10==8) { trDom.append($("<td>").html( Math.ceil((i-n-4)/(2*n) + 1) + "K")); }
				else { trDom.append($("<td>").html( Math.ceil((i-n-4)/(2*n) + 1) + "END")); }
			} else if (n==6){
				if (i%12==0){ trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "H")); }
				else if (i%12==1) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "A")); }
				else if (i%12==2) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "B")); }
				else if (i%12==3) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "C")); }
				else if (i%12==4) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "D")); }
				else if (i%12==5) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "E")); }
				else if (i%12==6) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "F")); }
				else if (i%12==7) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "F")); }
				else if (i%12==8) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "I")); }
				else if (i%12==9) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "K")); }
				else if (i%12==10) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "L")); }
				else if (i%12==11) { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "M")); }
				else { trDom.append($("<td>").html( Math.ceil((i-n-5)/(2*n) + 1) + "END")); }
			}
            for (j = 0; j < 8; ++j) {
            let tdDom;
            if (j==0) {
                trDom.append($("<td>").html(""));
            } else {
                tdDom = $("<td>").append($("<input>").addClass("need-clear"));
            }
            trDom.append(tdDom);
            }
            trDom.appendTo("#data__table");
        }
        var fileName = "./php/MeasurementPosition/SelData.php";
        var sendData = {
            press_id: press_id,
        };
        myAjax.myAjax(fileName, sendData);
        if (ajaxReturnData.length==0) {
            $("#save__button").prop("disabled", false);
            $("#add_new").prop("disabled", true);
        } else {
            $("#save__button").prop("disabled", true);
            $("#add_new").prop("disabled", false);
            makeDataTable($("#data__table"), ajaxReturnData);
        }

        var fileName = "./php/MeasurementPosition/SelMeasurement.php";
        var sendData = {
            dies_id: $("#selected__tr").find("td").eq(2).html(),
        };
        myAjax.myAjax(fileName, sendData);
        if (ajaxReturnData.length != 0) {
            $("#rz1").html(ajaxReturnData[0].rz1);
            $("#die_mark_1").html(ajaxReturnData[0].die_mark_1);
            $("#rz2").html(ajaxReturnData[0].rz2);
            $("#die_mark_2").html(ajaxReturnData[0].die_mark_2);
            $("#rz3").html(ajaxReturnData[0].rz3);
            $("#die_mark_3").html(ajaxReturnData[0].die_mark_3);
            $("#note").html(ajaxReturnData[0].note);
            ulitycall();
        } else {
            $("#rz1").html("-");
            $("#die_mark_1").html("-");
            $("#rz2").html("-");
            $("#die_mark_2").html("-");
            $("#rz3").html("-");
            $("#die_mark_3").html("-");
            $("#note").html("-");
        }

        var fileName = "./php/MeasurementPosition/SelUrl.php";
        var sendData = {
            press_id: press_id,
        };
        myAjax.myAjax(fileName, sendData);
        imageList = [];
        imageList = ajaxReturnData;
        console.log(imageList);
    } else {
    }
});
function roundUp(num, precision) {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
};
function jug_column(col, jug_val) {
    var tablett, trtt, tdtt, itt;
    var jug = $("#"+jug_val).html();
    if ($.isNumeric(jug)) {
        tablett = document.getElementById("data__table");
        trtt = tablett.getElementsByTagName("tr");
        for (itt = 0; itt < trtt.length; itt++) {
        tdtt = trtt[itt].getElementsByTagName("td")[col];
        if (tdtt) {
            var txttt = Number(tdtt.getElementsByTagName('input')[0].value);
            if (txttt>jug) {
                tdtt.style.backgroundColor = "red";
            }
        }
        }
    }
};
function ulitycall() {
    jug_column(2, "rz1");
    jug_column(4, "rz2");
    jug_column(6, "rz3");
    jug_column(3, "die_mark_1");
    jug_column(5, "die_mark_2");
    jug_column(7, "die_mark_3");
    console.log(1);
};

$(document).on("change", "#file", function () {
    var totalfiles = document.getElementById("file").files.length;
    var formData = new FormData();
    for (var index = 0; index < totalfiles; index++) {
      formData.append("files[]", document.getElementById("file").files[index]);
    }
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "./php/MeasurementPosition/FileUploadMultiple.php", true);
    xhttp.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {
          var response = this.responseText;
          alert(response + " File uploaded.");
       }
    };
    xhttp.send(formData);

    var sendFileName = new Object();
    var inp = document.getElementById('file');
    for (var i = 0; i < inp.files.length; ++i) {
      var name = inp.files.item(i).name;
      console.log("here is a file name: " + name);
      sendFileName[i] = name;
    }
    sendFileName["press_id"] = press_id;
    console.log(sendFileName);
    var InsFileName = "./php/MeasurementPosition/InsFileName.php";
    myAjax.myAjax(InsFileName, sendFileName);
});

$(document).on("click", "#preview__button", function () {
	window.open("./PictureView.html");
    window.localStorage.setItem("file_url", JSON.stringify(imageList));
});

var ExcelToJSON = function() {
    this.parseExcel = function(file) {
    var reader = new FileReader();

    reader.onload = function(e) {
			var data = e.target.result;
			var workbook = XLSX.read(data, {
					type: 'binary',
					cellDates: true,
					cellNF: false,
					cellText: false
			});
			const options = {
					raw: false, 
					dateNF: 'yyyy-mm-dd',
			};
			workbook.SheetNames.forEach(function(sheetName) {
					var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName], options);
					var productList = JSON.parse(JSON.stringify(XL_row_object));
					console.log(productList)
					var rows = $('#excel_table tbody');
					for (i = 0; i < productList.length; i++) {
					var columns = Object.values(productList[i])
					rows.append(`
							<tr>
							<td>${makeOrderSheetId(columns[0].replace( /\s/g, ''))}</td>
							<td>${columns[0].replace( /\s/g, '')}</td>
							<td>${makeProductionNumber(columns[0].replace( /\s/g, ''))}</td>
							<td><input type="date" value="${columns[1].replace( /\s/g, '')}"</td>
							<td><input type="number" value="${columns[2].replace( /\s/g, '')}"</td>
							<td><button class="remove_button">X</button></td>
							</tr>
					`);
					}
			})
    };
    reader.onerror = function(ex) {
    console.log(ex);
    };
    reader.readAsBinaryString(file);
};
};
  
function handleFileSelect(evt) {
    var files = evt.target.files;
    var xl2json = new ExcelToJSON();
    xl2json.parseExcel(files[0]);
};

document.getElementById('fileupload').addEventListener('change', handleFileSelect, false);