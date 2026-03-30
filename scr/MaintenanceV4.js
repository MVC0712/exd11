var ajaxReturnData;

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

$(document).on("keyup", "#machine", function () {
  if ($(this).val().length != 0) {
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

$(document).on("keyup", "#result", function () {
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
    let sendObj = {
      line: $("#line").val(),
      machine: $("#machine").val(),
      date_occur: $("#date_occur").val(),
      date_repair: $("#date_repair").val(),
      re_no: $("#re_no").val(),
      re_content: $("#re_content").val(),
      result: $("#result").val(),
      cause: $("#cause").val(),
      tre_detail: $("#tre_detail").val(),
      pro_id: $("#pro_id").val(),
      repair_time: $("#repair_time").val(),
      person_repair: $("#person_repair").val(),
      equip_status: $("#equip_status").val(),
    };

    $.ajax({
      url: "./php/Maintenance/InsMaintenanceRecord.php",
      type: "POST",
      data: sendObj,
      success: function (response) {
        let res = JSON.parse(response);
        if (res.status === "INSERTED") {
          let newId = res.id;
          console.log("Inserted record ID:", newId);
          uploadFiles(newId, function () {
            location.reload();
          });
        } else {
          alert("Error: " + res.message);
        }
      },
      error: function (xhr, status, error) {
        alert("Error: " + error);
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
  const selects = ["#line", "#line-number-fileter"];

  selects.forEach(function (selector) {
    $(selector).empty(); // Xóa hết option cũ
    $(selector).append($("<option>").val(0).html("NO select"));
    ajaxReturnData.forEach(function (value) {
      $(selector).append($("<option>").val(value["id"]).html(value["line"]));
    });
  });
}

function equipstatus() {
  var fileName = "./php/Maintenance/SelStatus.php";
  var sendData = { dummy: "dummy" };
  myAjax.myAjax(fileName, sendData);

  // Các select cần fill
  const selects = ["#equip_status", "#status-number-fileter"];

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
  equipstatus();
  makeSummaryTable();
  $("#save__button").prop("disabled", true);
  $("#update").prop("disabled", true);
});

function makeSummaryTable() {
  var fileName = "./php/Maintenance/SelSummaryV1.php";

  // Lấy giá trị lọc
  var filterLine = $("#line-number-fileter").val();
  var filterStatus = $("#status-number-fileter").val();
  var startTerm = $("#start-term").val();
  var endTerm = $("#end-term").val();

  var sendData = {
    line: filterLine,
    status: filterStatus,
    start_term: startTerm,
    end_term: endTerm,
  };

  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#summary__table tbody"));
}

// Gọi makeSummaryTable khi thay đổi select hoặc date
$("#line-number-fileter, #status-number-fileter, #start-term, #end-term").on(
  "change",
  function () {
    makeSummaryTable();
  }
);

function fillTableBody(data, tbodyDom) {
  $(tbodyDom).empty();
  data.forEach(function (trVal) {
    let newTr = $("<tr>");

    // Tô màu theo equip_status
    const status = trVal["equip_status"]
      ? trVal["equip_status"].toUpperCase()
      : "";
    if (status === "NG") {
      newTr.css("background-color", "red"); // ddor
    } else if (status === "FIXING") {
      newTr.css("background-color", "orange"); // cam
    } else if (status === "TESTING") {
      newTr.css("background-color", "limegreen"); // xanh lá nhạt
    }
    // OK hoặc các trạng thái khác → màu mặc định

    Object.keys(trVal).forEach(function (tdVal) {
      if (tdVal === "duration") {
        $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
      } else {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
      }
    });

    $(newTr).appendTo(tbodyDom);
  });
}

// -------------------------   summary table tr click   -------------
// ===============================
// Khi click vào dòng
// ===============================
$(document).on("click", "#summary__table tbody tr", function () {
  if (!$(this).hasClass("selected-record")) {
    // Bỏ chọn dòng cũ
    $("#summary__table tbody tr").removeClass("selected-record");
    $(this).addClass("selected-record");

    // Đặt id cho dòng được chọn
    $("#summary__table__selected").removeAttr("id");
    $(this).attr("id", "summary__table__selected");

    // Lấy ID record
    const recordId = $(this).find("td").eq(0).html();

    // Hiện các ô upload file
    for (let i = 1; i <= 8; i++) {
      $("#file_upload_" + i)
        .closest("tr")
        .show();
    }

    // Load dữ liệu chi tiết
    $.ajax({
      type: "POST",
      url: "./php/Maintenance/SelSelData.php",
      data: { targetId: recordId },
      dataType: "json",
      success: function (response) {
        if (response.status !== "success") {
          alert(response.message);
          return;
        }

        // Điền dữ liệu text
        fillReadData(response.record);

        // Load file before & after
        fillFileArea(response.files_before, response.files_after);
      },
      error: function (xhr, status, error) {
        console.error("AJAX Error:", error);
      },
    });

    $("#update__button").prop("disabled", false);
  } else {
    // Bỏ chọn dòng
    $(this).removeClass("selected-record");
    $("#update_record_id").val("");

    // Clear input
    $(".need-clear").val("");

    // Clear file preview
    for (let i = 1; i <= 8; i++) {
      $("#file_area_" + i).html("");
      $("#file_url_" + i).text("No file");
    }

    $("#update__button").prop("disabled", true);
  }
});

// Hàm điền dữ liệu text
function fillReadData(record) {
  if (!record) return;

  $("#line").val(record.line_id);
  $("#machine").val(record.machine);
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
  $("#result").val(record.result);
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
$("#update__button").on("click", function () {
  let recordId = $("#summary__table__selected").find("td").eq(0).html();
  if (!recordId) {
    alert("Không tìm thấy ID để cập nhật!");
    return;
  }

  let sendObj = {
    record_id: recordId,
    line: $("#line").val(),
    machine: $("#machine").val(),
    date_occur: $("#date_occur").val(),
    date_repair: $("#date_repair").val(),
    re_no: $("#re_no").val(),
    re_content: $("#re_content").val(),
    result: $("#result").val(),
    cause: $("#cause").val(),
    tre_detail: $("#tre_detail").val(),
    pro_id: $("#pro_id").val(),
    repair_time: $("#repair_time").val(),
    person_repair: $("#person_repair").val(),
    equip_status: $("#equip_status").val(),
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
