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
  var sendData = {
    dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  $("#line option").remove();
  $("#line").append($("<option>").val(0).html("NO select"));
  ajaxReturnData.forEach(function (value) {
    $("#line").append($("<option>").val(value["id"]).html(value["line"]));
  });
}

function equipstatus() {
  var fileName = "./php/Maintenance/SelStatus.php";
  var sendData = {
    dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  $("#equip_status option").remove();
  $("#equip_status").append($("<option>").val(0).html("NO select"));
  ajaxReturnData.forEach(function (value) {
    $("#equip_status").append(
      $("<option>").val(value["id"]).html(value["equip_status"])
    );
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
  var sendData = {
    dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#summary__table tbody"));
}

function fillTableBody(data, tbodyDom) {
  $(tbodyDom).empty();
  data.forEach(function (trVal) {
    let newTr = $("<tr>");
    Object.keys(trVal).forEach(function (tdVal) {
      if (tdVal == "duration") {
        $("<td>").append($("<input>").val(trVal[tdVal])).appendTo(newTr);
      } else {
        $("<td>").html(trVal[tdVal]).appendTo(newTr);
      }
    });

    $(newTr).appendTo(tbodyDom);
  });
}

// -------------------------   summary table tr click   -------------
$(document).on("click", "#summary__table tbody tr", function () {
  // Kiểm tra dòng đã chọn chưa
  if (!$(this).hasClass("selected-record")) {
    // Xóa class cũ
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");

    // Đặt id cho dòng được chọn
    $("#summary__table__selected").removeAttr("id");
    $(this).attr("id", "summary__table__selected");

    // Lấy ID record
    const recordId = $(this).find("td").eq(0).html();
    // Hiển thị tất cả các ô nhập file
    for (let i = 1; i <= 8; i++) {
      $("#file_upload_" + i)
        .closest("tr")
        .show();
    }

    // Gọi Ajax lấy dữ liệu chi tiết
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

        // 1️⃣ Điền dữ liệu text vào form
        fillReadData(response.record);

        // 2️⃣ Hiển thị file Before & After
        fillFileArea(response.files_before, response.files_after);
      },
      error: function (xhr, status, error) {
        console.error("AJAX Error:", error);
      },
    });
  } else {
    // Bỏ chọn dòng
    $(this).removeClass("selected-record");
    $(this).removeAttr("id");
    $("#insert").prop("disabled", false);

    // Xóa dữ liệu text
    $(".need-clear").val("");

    // Xóa file preview
    for (let i = 1; i <= 8; i++) {
      $("#file_area_" + i).html("");
      $("#file_url_" + i).text("No file");
    }
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

  // --- Before Repair ---
  for (let i = 0; i < 4; i++) {
    const container = $("#file_area_" + (i + 1));
    const label = $("#file_url_" + (i + 1));
    if (filesBefore[i]) {
      container.html(
        `<img src="${basePath}before/${filesBefore[i]}" style="width:200px; height:200px; object-fit:contain; border:1px solid #ccc; padding:2px;">`
      );
      label.text(shortenFileName(filesBefore[i]));
    } else {
      container.html("");
      label.text("No file");
    }
  }

  // --- After Repair ---
  for (let i = 0; i < 4; i++) {
    const container = $("#file_area_" + (i + 5));
    const label = $("#file_url_" + (i + 5));
    if (filesAfter[i]) {
      container.html(
        `<img src="${basePath}after/${filesAfter[i]}" style="width:180px; height:180px; object-fit:contain; border:1px solid #ccc; padding:2px;">`
      );
      label.text(shortenFileName(filesAfter[i]));
    } else {
      container.html("");
      label.text("No file");
    }
  }
}

const overlay = $("#imageOverlay");
const overlayImg = $("#imageOverlay img");

$(document).on(
  "click",
  "#file_area_before img, #file_area_after img",
  function (e) {
    e.stopPropagation(); // chặn click lan ra ngoài
    const src = $(this).attr("src");

    // Gán ảnh và bật overlay
    overlayImg.attr("src", src);
    overlay.addClass("active");
  }
);

// Click ra ngoài overlay → ẩn overlay
$(document).on("click", function () {
  if (overlay.hasClass("active")) {
    overlay.removeClass("active");
  }
});

// Click vào ảnh trong overlay → ẩn overlay
overlayImg.on("click", function (e) {
  e.stopPropagation(); // chặn click lan ra ngoài overlay
  overlay.removeClass("active");
});
