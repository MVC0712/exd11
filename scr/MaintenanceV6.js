var ajaxReturnData;
let cancelKeyupEvent = false;
let cancelKeydownEvent = false;
let editMode = false;
let selectedRecordId = null;

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

function getTableData(tableTrObj) {
  var tableData = [];
  tableTrObj.each(function (index, element) {
    var tr = [];
    $(this)
      .find("td")
      .each(function (index, element) {
        if ($(this).find("input").length) {
          tr.push($(this).find("input").val());
        } else if ($(this).find("select").length) {
          tr.push($(this).find("select").val());
        } else {
          tr.push($(this).html());
        }
      });
    tableData.push(tr);
  });
  return tableData;
}

$(document).on("change", "#machine", function () {
  if ($(this).val() != "0") {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  checkSave();
});

$(document).on("change", "#line", function () {
  if ($(this).val() != "0") {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  checkSave();
});

$(document).on("change", "#equip_status", function () {
  if ($(this).val() != "0") {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  checkSave();
});

$(document).on("change", "#date_occur", function () {
  if ($(this).val().length != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  checkSave();
});

$(document).on("change", "#date_repair", function () {
  if ($(this).val().length != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  checkSave();
});

$(document).on("keyup", "#re_content", function () {
  if ($(this).val().length != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  checkSave();
});

$(document).on("keyup", "#detail", function () {
  if ($(this).val().length != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  checkSave();
});

$(document).on("keyup", "#repair_time", function () {
  if ($(this).val().length != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  checkSave();
});

$(document).on("keyup", "#equip_status", function () {
  if ($(this).val().length != 0) {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  checkSave();
});

function checkSave() {
  // Nếu nút update đang enable → bỏ qua
  if (!$("#update__button").prop("disabled")) {
    return;
  }

  let flag = true;

  $(".save-data").each(function () {
    if ($(this).hasClass("no-input")) {
      flag = false;
    }
  });

  // Nếu dữ liệu đầy đủ thì bật nút Save, ngược lại disable
  $("#save__button").prop("disabled", !flag);
}

$(document).ready(function () {
  // --- Rút gọn tên file ---
  function shortenFileName(name, maxLength = 18) {
    if (name.length <= maxLength) return name;
    let extIndex = name.lastIndexOf(".");
    let ext = extIndex !== -1 ? name.substring(extIndex) : "";
    let nameWithoutExt = extIndex !== -1 ? name.substring(0, extIndex) : "";
    let front = nameWithoutExt.substring(
      0,
      Math.floor((maxLength - ext.length) / 2)
    );
    let back = nameWithoutExt.substring(
      nameWithoutExt.length - Math.floor((maxLength - ext.length) / 2)
    );
    return front + "..." + back + ext;
  }

  // --- Khi chọn file, hiển thị tên ---
  $(".input__file").on("change", function () {
    let file = this.files[0];
    let inputId = $(this).attr("id");
    let labelId = inputId.replace("upload", "url");

    if (file) {
      $("#" + labelId).text(shortenFileName(file.name));
      $(this).removeClass("no-input");

      let index = parseInt(inputId.replace("file_upload_", ""));
      showNextFileInput(index);
    } else {
      $("#" + labelId).text("No file");
      $(this).addClass("no-input");
    }
  });

  // --- Ẩn các ô file trừ 1 & 5 ---
  for (let i = 2; i <= 4; i++)
    $("#file_upload_" + i)
      .closest("tr")
      .hide();
  for (let i = 6; i <= 8; i++)
    $("#file_upload_" + i)
      .closest("tr")
      .hide();

  function showNextFileInput(currentIndex) {
    if (
      (currentIndex >= 1 && currentIndex < 4) ||
      (currentIndex >= 5 && currentIndex < 8)
    ) {
      $("#file_upload_" + (currentIndex + 1))
        .closest("tr")
        .slideDown();
    }
  }

  // --- Khi nhấn nút Save ---
  $("#save__button").on("click", function () {
    // 1. Lấy dữ liệu từ các input
    let sendObj = {
      line: $("#line").val(),
      machine: $("#machine").val(),
      date_occur: $("#date_occur").val(),
      date_repair: $("#date_repair").val(),
      re_no: $("#re_no").val(),
      re_content: $("#re_content").val(),
      detail: $("#detail").val(),
      cause: $("#cause").val(),
      tre_detail: $("#tre_detail").val(),
      pro_id: $("#pro_id").val(),
      repair_time: $("#repair_time").val(),
      person_repair: $("#person_repair").val(),
      equip_status: $("#equip_status").val(),
    };

    // 2. Gửi dữ liệu chính lên server
    $.ajax({
      url: "./php/Maintenance/InsMaintenanceRecord.php",
      type: "POST",
      data: sendObj,
      success: function (response) {
        let res = JSON.parse(response);

        if (res.status === "INSERTED") {
          let newId = res.id; // Lấy ID mới insert
          console.log("Inserted record ID:", newId);

          // 3. Lấy dữ liệu bảng thời gian
          let TimeData = getTableData($("#time__table tbody tr"));

          // 4. Thêm newId vào đầu mỗi dòng
          for (let i = 0; i < TimeData.length; i++) {
            TimeData[i].unshift(newId); // index 0 = maintenance_record_id
          }

          // 5. Gửi dữ liệu thời gian lên server
          $.ajax({
            url: "./php/Maintenance/InsTime.php",
            type: "POST",
            data: JSON.stringify(TimeData),
            contentType: "application/json",
            success: function (resTime) {
              console.log("TimeData inserted successfully:", resTime);
            },
            error: function (xhr, status, error) {
              alert("Error inserting TimeData: " + error);
            },
          });
          uploadFiles(newId, function () {
            location.reload();
          });
        } else {
          alert("Error inserting maintenance record: " + res.message);
        }
      },
      error: function (xhr, status, error) {
        alert("Error inserting maintenance record: " + error);
      },
    });
  });

  // --- Upload tất cả file ---
  function uploadFiles(recordId, callback) {
    let uploadsDone = 0;
    let totalFiles = 0;

    for (let i = 1; i <= 8; i++) {
      let fileInput = document.getElementById("file_upload_" + i);
      if (fileInput.files.length > 0) totalFiles++;
    }

    if (totalFiles === 0) {
      callback();
      return;
    }

    for (let i = 1; i <= 8; i++) {
      let fileInput = document.getElementById("file_upload_" + i);
      if (fileInput.files.length > 0) {
        let formData = new FormData();
        formData.append("file", fileInput.files[0]);
        formData.append("record_id", recordId);
        formData.append("file_group", i <= 4 ? "before" : "after");

        console.log(
          "Uploading file " + i + " group: " + (i <= 4 ? "before" : "after")
        );

        $.ajax({
          url: "./php/Maintenance/FileUploadMaintenance.php",
          type: "POST",
          data: formData,
          processData: false,
          contentType: false,
          success: function (res) {
            console.log("Uploaded file " + i + ": " + res);
            uploadsDone++;
            if (uploadsDone === totalFiles) callback();
          },
          error: function (xhr, status, error) {
            console.log("Error uploading file " + i + ": " + error);
            uploadsDone++;
            if (uploadsDone === totalFiles) callback();
          },
        });
      }
    }
  }
});

function line() {
  var fileName = "./php/Maintenance/SelLineV1.php";
  var sendData = { dummy: "dummy" };
  myAjax.myAjax(fileName, sendData);

  // Danh sách select cần fill
  const selects = ["#line", "#line-number-filter"];

  selects.forEach(function (selector) {
    $(selector).empty(); // Xóa hết option cũ
    $(selector).append($("<option>").val(0).html("NO select"));
    ajaxReturnData.forEach(function (value) {
      $(selector).append($("<option>").val(value["id"]).html(value["line"]));
    });
  });
}

$("#line, #line-number-filter").on("change", function () {
  let line_id = $(this).val();
  machine(line_id);
});
function machine(line_id) {
  // Nếu line_id = 0 => chỉ hiển thị "NO select"
  if (line_id == 0) {
    const selects = ["#machine", "#machine-number-filter"];

    selects.forEach(function (selector) {
      $(selector).empty();
      $(selector).append($("<option>").val(0).html("NO select"));
    });

    return; // Không gọi AJAX nữa
  }
  var fileName = "./php/Maintenance/SelMachineV1.php";
  var sendData = { line_id: line_id };

  myAjax.myAjax(fileName, sendData);

  const selects = ["#machine", "#machine-number-filter"];

  selects.forEach(function (selector) {
    $(selector).empty();
    $(selector).append($("<option>").val(0).html("NO select"));

    ajaxReturnData.forEach(function (value) {
      $(selector).append($("<option>").val(value["id"]).html(value["machine"]));
    });
  });
}

function equipstatus() {
  var fileName = "./php/Maintenance/SelStatus.php";
  var sendData = { dummy: "dummy" };
  myAjax.myAjax(fileName, sendData);

  // Các select cần fill
  const selects = ["#equip_status", "#status-number-filter"];

  selects.forEach(function (selector) {
    $(selector).empty(); // Xóa option cũ
    $(selector).append($("<option>").val(0).html("NO select"));
    ajaxReturnData.forEach(function (value) {
      $(selector).append(
        $("<option>").val(value["id"]).html(value["equip_status"])
      );
    });
  });
}

$(function () {
  line();
  machine((line_id = 0));
  equipstatus();
  makeSummaryTable();
  $("#save__button").prop("disabled", true);
  $("#update").prop("disabled", true);
});

function makeSummaryTable() {
  var fileName = "./php/Maintenance/SelSummaryV2.php";

  // Lấy giá trị lọc
  var filterLine = $("#line-number-filter").val();
  var filterMachine = $("#machine-number-filter").val();
  var filterStatus = $("#status-number-filter").val();
  var startTerm = $("#start-term").val();
  var endTerm = $("#end-term").val();

  var sendData = {
    line: filterLine,
    machine: filterMachine,
    status: filterStatus,
    start_term: startTerm,
    end_term: endTerm,
  };

  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#summary__table tbody"));
}

// Gọi makeSummaryTable khi thay đổi select hoặc date
$(
  "#line-number-filter, #machine-number-filter, #status-number-filter, #start-term, #end-term"
).on("change", function () {
  makeSummaryTable();
});

function fillTableBody(data, tbodyDom) {
  $(tbodyDom).empty();

  data.forEach(function (trVal) {
    const newTr = $("<tr>");

    // Tạo các <td>
    Object.keys(trVal).forEach(function (key, index) {
      const value = trVal[key];
      const td = $("<td>");

      if (key === "duration") {
        td.append($("<input>").val(value));
      } else {
        td.text(value);
      }

      td.appendTo(newTr);
    });

    // Tô màu ô thứ 17 theo equip_status
    const status = trVal["equip_status"]
      ? trVal["equip_status"].toUpperCase()
      : "";
    const td17 = newTr.children("td").eq(16); // index 16 = ô 17
    if (status === "NG") td17.css("background-color", "red");
    else if (status === "FIXING") td17.css("background-color", "orange");
    else if (status === "TESTING") td17.css("background-color", "limegreen");

    $(newTr).appendTo(tbodyDom);
  });
}

// -------------------------   summary table tr click   -------------
// ===============================
// Khi click vào dòng
// ===============================
// Click chọn dòng trong summary table
$(document).on("click", "#summary__table tbody tr", function () {
  if (!$(this).hasClass("selected-record")) {
    // Bỏ chọn dòng cũ
    $("#summary__table tbody tr").removeClass("selected-record");
    $(this).addClass("selected-record");

    // Đặt id cho dòng được chọn
    $("#summary__table__selected").removeAttr("id");
    $(this).attr("id", "summary__table__selected");

    // Lấy ID record
    selectedRecordId = $(this).find("td").eq(0).text().trim();
    console.log("Selected Record ID:", selectedRecordId);

    // Hiện các ô upload file (nếu có)
    for (let i = 1; i <= 8; i++) {
      $("#file_upload_" + i)
        .closest("tr")
        .show();
    }

    // Load dữ liệu chi tiết record
    $.ajax({
      type: "POST",
      url: "./php/Maintenance/SelSelData.php",
      data: { targetId: selectedRecordId },
      dataType: "json",
      success: function (response) {
        if (response.status !== "success") {
          alert(response.message);
          return;
        }

        // Điền dữ liệu text vào form
        fillReadData(response.record);

        // Load file trước & sau
        fillFileArea(response.files_before, response.files_after);

        // Load bảng thời gian (nếu cần)
        makeTimeTable();
      },
      error: function (xhr, status, error) {
        console.error("AJAX Error:", error);
      },
    });

    $("#update__button").prop("disabled", false);
    $("#add_time__button").text("Add");
  } else {
    // Bỏ chọn dòng
    $(this).removeClass("selected-record");
    selectedRecordId = null;

    // Clear input
    $(".need-clear").val("");

    // Clear file preview
    for (let i = 1; i <= 8; i++) {
      $("#file_area_" + i).html("");
      $("#file_url_" + i).text("No file");
    }

    $("#update__button").prop("disabled", true);
    $("#add_time__button").text("Save");

    // Clear bảng thời gian
    $("#time__table tbody").empty();
  }
});

// Hàm điền dữ liệu text
function fillReadData(record) {
  if (!record) return;

  $("#line").val(record.line_id);

  machine(record.line_id);

  setTimeout(() => {
    $("#machine").val(record.machine_id);
  }, 100);

  $("#date_occur").val(
    record.date_occur && record.date_occur !== "0000-00-00"
      ? record.date_occur
      : ""
  );

  $("#date_repair").val(
    record.date_repair && record.date_repair !== "0000-00-00"
      ? record.date_repair
      : ""
  );

  $("#re_no").val(record.re_no);
  $("#re_content").val(record.re_content);
  $("#detail").val(record.detail);
  $("#cause").val(record.cause);
  $("#tre_detail").val(record.tre_detail);
  $("#repair_time").val(record.repair_time);
  $("#equip_status").val(record.equip_status_id);
  $("#person_repair").val(record.person_repair);
  $("#pro_id").val(record.pro_id);

  $(".need-clear").removeClass("no-input").addClass("complete-input");
}

// Hàm rút gọn tên file
function shortenFileName(name, maxLength = 18) {
  if (!name) return "";
  if (name.length <= maxLength) return name;
  let extIndex = name.lastIndexOf(".");
  let ext = extIndex !== -1 ? name.substring(extIndex) : "";
  let nameWithoutExt = extIndex !== -1 ? name.substring(0, extIndex) : "";
  let front = nameWithoutExt.substring(
    0,
    Math.floor((maxLength - ext.length) / 2)
  );
  let back = nameWithoutExt.substring(
    nameWithoutExt.length - Math.floor((maxLength - ext.length) / 2)
  );
  return front + "..." + back + ext;
}

// Hàm hiển thị file Before & After
function fillFileArea(filesBefore, filesAfter) {
  const basePath = "./upload/Maintenance/";

  // Hàm kiểm tra đuôi file
  function isImage(filename) {
    return /\.(jpg|jpeg|png|gif|bmp)$/i.test(filename);
  }

  // Hàm rút ngắn tên file
  function shortenFileName(name, maxLength = 15) {
    if (!name) return "";
    return name.length > maxLength ? name.slice(0, maxLength) + "..." : name;
  }

  // --- Before Repair ---
  for (let i = 0; i < 4; i++) {
    const container = $("#file_area_" + (i + 1));
    const label = $("#file_url_" + (i + 1));
    const file = filesBefore[i];

    if (file) {
      const ext = file.split(".").pop().toLowerCase();
      if (isImage(file)) {
        container.html(
          `<img src="${basePath}before/${file}" style="width:200px;height:200px;object-fit:contain;border:1px solid #ccc;padding:2px;">`
        );
      } else if (ext === "pdf") {
        container.html(
          `<a href="${basePath}before/${file}" target="_blank">📄 ${shortenFileName(
            file
          )}</a>`
        );
      } else {
        container.html(
          `<a href="${basePath}before/${file}" target="_blank">📁 ${shortenFileName(
            file
          )}</a>`
        );
      }
      label.text(shortenFileName(file));
    } else {
      container.html("");
      label.text("No file");
    }
  }

  // --- After Repair ---
  for (let i = 0; i < 4; i++) {
    const container = $("#file_area_" + (i + 5));
    const label = $("#file_url_" + (i + 5));
    const file = filesAfter[i];

    if (file) {
      const ext = file.split(".").pop().toLowerCase();
      if (isImage(file)) {
        container.html(
          `<img src="${basePath}after/${file}" style="width:200px;height:200px;object-fit:contain;border:1px solid #ccc;padding:2px;">`
        );
      } else if (ext === "pdf") {
        container.html(
          `<a href="${basePath}after/${file}" target="_blank">📄 ${shortenFileName(
            file
          )}</a>`
        );
      } else {
        container.html(
          `<a href="${basePath}after/${file}" target="_blank">📁 ${shortenFileName(
            file
          )}</a>`
        );
      }
      label.text(shortenFileName(file));
    } else {
      container.html("");
      label.text("No file");
    }
  }
}

// Click vào file trong file_area_before hoặc file_area_after
$(document).on(
  "click",
  "#file_area_before img, #file_area_before a, #file_area_after img, #file_area_after a",
  function (e) {
    e.stopPropagation();

    let src = $(this).attr("src") || $(this).attr("href"); // ảnh dùng src, link dùng href
    if (src) {
      window.open(src, "_blank"); // mở file mới tab
    }
  }
);

// ===============================
// Nút UPDATE
// ===============================
$(document).on("click", "#update__button", function () {
  let selectedRow = $("#summary__table tbody tr.selected-record");
  if (selectedRow.length === 0) {
    alert("Không tìm thấy ID để cập nhật!");
    return;
  }

  let recordId = selectedRow.find("td").eq(0).text().trim();
  if (!recordId) {
    alert("Không tìm thấy ID để cập nhật!");
    return;
  }

  // Lấy dữ liệu từ form, trim và nếu rỗng thì gửi null
  let sendObj = {
    record_id: recordId,
    line: $("#line").val().trim() || null,
    machine: $("#machine").val().trim() || null,
    date_occur: $("#date_occur").val().trim() || null,
    date_repair: $("#date_repair").val().trim() || null,
    re_no: $("#re_no").val().trim() || null,
    re_content: $("#re_content").val().trim() || null,
    detail: $("#detail").val().trim() || null,
    cause: $("#cause").val().trim() || null,
    tre_detail: $("#tre_detail").val().trim() || null,
    pro_id: $("#pro_id").val().trim() || null,
    repair_time: $("#repair_time").val().trim() || null,
    person_repair: $("#person_repair").val().trim() || null,
    equip_status: $("#equip_status").val().trim() || null,
  };

  $.ajax({
    url: "./php/Maintenance/UpdMaintenanceRecord.php",
    type: "POST",
    data: sendObj,
    success: function (res) {
      let response = JSON.parse(res);
      if (response.status === "UPDATED") {
        uploadFilesUpdate(recordId, function () {
          alert("Đã cập nhật thành công!");
          location.reload();
        });
      } else {
        alert("Error: " + response.message);
      }
    },
    error: function (xhr, status, error) {
      alert("Error: " + error);
    },
  });
});

// ===============================
// Upload file khi UPDATE
// ===============================
function uploadFilesUpdate(recordId, callback) {
  let totalFiles = 0;
  let done = 0;

  for (let i = 1; i <= 8; i++) {
    let fileInput = document.getElementById("file_upload_" + i);
    if (fileInput && fileInput.files.length > 0) totalFiles++;
  }

  if (totalFiles === 0) {
    callback();
    return;
  }

  for (let i = 1; i <= 8; i++) {
    let fileInput = document.getElementById("file_upload_" + i);
    if (fileInput && fileInput.files.length > 0) {
      let fd = new FormData();
      fd.append("file", fileInput.files[0]);
      fd.append("record_id", recordId);
      fd.append("file_group", i <= 4 ? "before" : "after");

      $.ajax({
        url: "./php/Maintenance/FileUploadMaintenance.php",
        type: "POST",
        data: fd,
        processData: false,
        contentType: false,
        success: function () {
          done++;
          if (done === totalFiles) callback();
        },
        error: function () {
          done++;
          if (done === totalFiles) callback();
        },
      });
    }
  }
}

function checkUpdate() {
  let hasEmpty = false;

  $(".save-data").each(function () {
    if ($(this).hasClass("no-input")) {
      hasEmpty = true;
      return false; // thoát vòng lặp sớm
    }
  });

  if (hasEmpty) {
    $("#update__button").prop("disabled", true); // ẩn nút
  } else {
    $("#update__button").prop("disabled", false); // hiện nút
  }
}
// =============================== Time input ==============================
// thêm dấu ":" vào chuỗi thời gian
function addColon(inputValue) {
  // 3桁、または4桁の時刻値にコロンを挿入する
  let returnVal;
  switch (inputValue.length) {
    case 3:
      returnVal = inputValue.substr(0, 1) + ":" + inputValue.substr(1, 2);
      break;
    case 4:
      returnVal = inputValue.substr(0, 2) + ":" + inputValue.substr(2, 2);
      break;
  }
  return returnVal;
}

function checkTimeValue(inputValue) {
  // 0:00 ~ 23:59 までに入っているか否か、判断する
  let flag = false;
  if (inputValue.substr(0, 1) == "1" && inputValue.length == 4) {
    // 1で始まる4桁時刻
    if (
      0 <= Number(inputValue.substr(1, 1)) &&
      Number(inputValue.substr(1, 1)) <= 9 &&
      0 <= Number(inputValue.substr(2, 2)) &&
      Number(inputValue.substr(2, 2) <= 59)
    ) {
      flag = true;
    } else {
      flag = false;
    }
  } else if (inputValue.substr(0, 1) == "2" && inputValue.length == 4) {
    // 2で始まる4桁時刻
    if (
      0 <= Number(inputValue.substr(1, 1)) &&
      Number(inputValue.substr(1, 1)) <= 3 &&
      0 <= Number(inputValue.substr(2, 2)) &&
      Number(inputValue.substr(2, 2) <= 59)
    ) {
      flag = true;
    } else {
      flag = false;
    }
  } else if (
    0 <= Number(inputValue.substr(0, 1)) &&
    Number(inputValue.substr(0, 1)) <= 9 &&
    inputValue.length == 3
  ) {
    // 3~9で始まる3桁時刻
    if (
      0 <= Number(inputValue.substr(1, 2)) &&
      Number(inputValue.substr(1, 2) <= 59)
    ) {
      flag = true;
    } else {
      flag = false;
    }
  } else {
    flag = false;
  }
  return flag;
}

$(document).on("keyup", "#time_start", function () {
  if (checkTimeValue($(this).val()) || cancelKeyupEvent) {
    $(this).removeClass("no-input").addClass("complete-input");
    cancelKeyupEvent = false;
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  add_time_check();
});
$(document).on("keydown", "#time_start", function (e) {
  if (e.keyCode == 13 && $("#time_start").hasClass("complete-input")) {
    $(this).val(addColon($(this).val()));
    cancelKeyupEvent = true;
    $("#time_end").focus();
    return false;
  }
  add_time_check();
});
$(document).on("keyup", "#time_end", function () {
  if (checkTimeValue($(this).val()) || cancelKeyupEvent) {
    $(this).removeClass("no-input").addClass("complete-input");
    cancelKeyupEvent = false;
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
  add_time_check();
});
$(document).on("keydown", "#time_end", function (e) {
  if (e.keyCode == 13 && $("#time_end").hasClass("complete-input")) {
    $(this).val(addColon($(this).val()));
    cancelKeyupEvent = true;
    $("#time_note").focus();
    return false;
  }
  add_time_check();
});
$(document).on("change", "#time_date", function () {
  $(this).removeClass("no-input").addClass("complete-input");
  add_time_check();
});
function add_time_check() {
  if (
    $("#time_date").hasClass("no-input") ||
    $("#time_start").hasClass("no-input") ||
    $("#time_end").hasClass("no-input")
  ) {
    $("#add_time__button").prop("disabled", true);
  } else {
    $("#add_time__button").prop("disabled", false);
  }
}

$(document).on("keydown", "#time_note", function (e) {
  if (e.keyCode == 13 || e.keyCode == 9) {
    $("#add_time__button").focus();
  }
});

$("#add_time__button").on("click", function () {
  let fileName;
  let sendData = {};

  switch ($(this).text()) {
    case "Save":
      let rawDate = $("#time_date").val(); // "YYYY-MM-DD"
      let parts = rawDate.split("-"); // ["YYYY", "MM", "DD"]
      let formattedDate = parts[2] + "-" + parts[1] + "-" + parts[0].slice(2); // "DD-MM-YY"
      $("<tr>")
        .append("<td></td>")
        .append($("<td>").append($("<input>").val(formattedDate))) // ngày đã format
        .append($("<td>").append($("<input>").val($("#time_start").val())))
        .append($("<td>").append($("<input>").val($("#time_end").val())))
        .append($("<td>").append($("<input>").val($("#time_note").val())))
        .appendTo("#time__table tbody");
      $(this).prop("disabled", true);
      $("#time_date")
        .val("")
        .removeClass("complete-input")
        .addClass("no-input");
      $("#time_start")
        .val("")
        .removeClass("complete-input")
        .addClass("no-input");
      $("#time_end").val("").removeClass("complete-input").addClass("no-input");
      $("#time_note").val("");
      break;

    case "Add":
      fileName = "./php/Maintenance/AddTime.php";
      sendData = {
        maintenance_record_id: selectedRecordId,
        time_date: $("#time_date").val(),
        time_start: $("#time_start").val(),
        time_end: $("#time_end").val(),
        time_note: $("#time_note").val(),
      };
      myAjax.myAjax(fileName, sendData);
      makeTimeTable();
      $("#time_date")
        .val("")
        .removeClass("complete-input")
        .addClass("no-input");
      $("#time_start")
        .val("")
        .removeClass("complete-input")
        .addClass("no-input");
      $("#time_end").val("").removeClass("complete-input").addClass("no-input");
      $("#time_note").val("");
      $(this).prop("disabled", true);
      break;
    default:
      // Không làm gì
      break;
  }

  // Cập nhật trạng thái nút Save/Update theo dữ liệu và editMode
  if (checkIsDataInputed() && !editMode) {
    $("#add_time__button").text("Save").prop("disabled", false);
  } else {
    $("#add_time__button").prop("disabled", true);
  }
});

// Hàm load bảng thời gian
function makeTimeTable() {
  if (!selectedRecordId) {
    console.error("No selected ID");
    return;
  }

  const sendData = { id: selectedRecordId };

  $.ajax({
    url: "./php/Maintenance/SelTime.php",
    type: "POST",
    data: sendData,
    dataType: "json",
    success: function (response) {
      console.log("SelTime Response:", response);

      if (!Array.isArray(response)) {
        console.error("Invalid response from server");
        return;
      }

      const tbody = $("#time__table tbody");
      tbody.empty();

      response.forEach((row) => {
        const tr = $("<tr>");
        Object.entries(row).forEach(([key, value]) => {
          if (key === "id") {
            tr.append($("<td>").text(value));
          } else {
            tr.append(
              $("<td>").append(
                $("<input>", { type: "text", value: value ?? "" })
              )
            );
          }
        });
        tbody.append(tr);
      });
    },
    error: function (xhr, status, error) {
      console.error("Ajax Error:", error);
    },
  });
}

function checkIsDataInputed() {
  let flag = true;

  $(".save-data").each(function (index, element) {
    if ($(this).hasClass("no-input")) {
      flag = false;
    }
  });
  return flag;
}

// repair time
$("#repair_time").on("input", function () {
  // Chỉ giữ lại số và d h m
  this.value = this.value.replace(/[^0-9dhm]/gi, "");
});

document
  .getElementById("repair_time")
  .addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
      e.preventDefault(); // tránh submit form hoặc nhảy tab mặc định

      let input = this.value.trim();
      const regex = /^(\d+d)?(\d+h)?(\d+m)?$/i;

      // Nếu chỉ nhập số, coi là giờ
      if (/^\d+$/.test(input)) {
        input = input + "h";
      }

      if (!regex.test(input) || input === "") {
        alert("Sai định dạng! Vui lòng nhập dạng: 3d7h59m");
        this.value = "";
        return;
      }

      // Tách giá trị
      let days = 0,
        hours = 0,
        minutes = 0;

      const dMatch = input.match(/(\d+)d/i);
      const hMatch = input.match(/(\d+)h/i);
      const mMatch = input.match(/(\d+)m/i);

      if (dMatch) days = parseInt(dMatch[1]);
      if (hMatch) hours = parseInt(hMatch[1]);
      if (mMatch) minutes = parseInt(mMatch[1]);

      // Cảnh báo nếu quá giờ hoặc phút
      if (hours > 7 || minutes > 59) {
        alert(
          "Lưu ý: 1 ngày đi làm có 8 tiếng, 1 tiếng chỉ có 60 phút\nNhấn OK và nhập lại nếu có nhầm lẫn"
        );
      }

      // Công thức tính: days*8 + hours + minutes/60
      const total = days * 8 + hours + minutes / 60;

      // Hiển thị kết quả ngay trong ô
      this.value = total.toFixed(2);
    }
  });
