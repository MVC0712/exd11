let fileName;
let sendData = new Object();
let ajaxReturnData;
let ctx = document.getElementById('chart_area').getContext('2d');
let chart = null;

const myAjax = {
  myAjax: function (fileName, sendData) {
    $.ajax({
      type: "POST",
      url: "./php/"+fileName,
      dataType: "json",
      data: sendData,
      async: false,
    })
      .done(function (data) {
        ajaxReturnData = data;
      })
      .fail(function (err) {
        alert(err.responseText);
      });
  },
};

const getTwoDigits = (value) => value < 10 ? `0${value}` : value;
const getDateTime = (date) => {
    const day = getTwoDigits(date.getDate());
    const month = getTwoDigits(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = getTwoDigits(date.getHours());
    const mins = getTwoDigits(date.getMinutes());
    return `${year}-${month}-${day} ${hours}:${mins}:00`;
};
const getDate = (date) => {
  const day = getTwoDigits(date.getDate());
  const month = getTwoDigits(date.getMonth() + 1);
  const year = date.getFullYear();
  return `${day}-${month}`;
}
var now = new Date();
var MonthLastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
var MonthFirstDate = new Date(now.getFullYear(), (now.getMonth() + 12) % 12, 1);
var formatDateComponent = function(dateComponent) {
  return (dateComponent < 10 ? '0' : '') + dateComponent;
};
var formatDate = function(date) {
  return date.getFullYear()  + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate()) ;
};

$(function() {
  $("#month").val(now.getFullYear() + '-' + formatDateComponent(now.getMonth() + 1));

makeSummaryTable();
drawChart();
});
$(document).on("keyup", "#search", function (e) {
  makeSummaryTable();
  deleteChart(chart);
  drawChart();
});
$(document).on("change", "#month", function (e) {
  makeSummaryTable();
  deleteChart(chart);
  drawChart();
});
function makeSummaryTable() {
  var now = new Date($("#month").val());
  var MonthLastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  var MonthFirstDate = new Date(now.getFullYear(), (now.getMonth() + 12) % 12, 1);
  var fileName = "SelSummary.php";
  var sendData = {
    start_term : formatDate(MonthFirstDate),
    end_term : formatDate(MonthLastDate),
    search : $("#search").val(),
  };
  myAjax.myAjax(fileName, sendData);
  var data = ajaxReturnData;
  fillTableBody(data, $("#summary__table tbody"));

  $("#order").html(calculateColumnAverage(5, 'num'));
  $("#cut").html(calculateColumnAverage(6, 'num'));
  $("#ng").html(calculateColumnAverage(7, 'num'));
  $("#ok").html(calculateColumnAverage(8, 'num'));
  $("#ok_order").html(calculateColumnAverage(9) + '%');
  $("#packed").html(calculateColumnAverage(10, 'num'));
  $("#packed_order").html(calculateColumnAverage(11) + '%');
  $("#import").html(calculateColumnAverage(12, 'num'));
  $("#import_order").html(calculateColumnAverage(13) + '%');
};

function fillTableBody(data, tbodyDom) {
  $(tbodyDom).empty();
  data.forEach(function(trVal) {
    let newTr = $("<tr>");
    Object.keys(trVal).forEach(function(tdVal, index) {
      $("<td>").html(trVal[tdVal]).appendTo(newTr);
    });
    $(newTr).appendTo(tbodyDom);
});
};

function drawChartData() {
  var now = new Date($("#month").val());
  var MonthLastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  var MonthFirstDate = new Date(now.getFullYear(), (now.getMonth() + 12) % 12, 1);
  var fileName = "SelSummaryForChart.php";
  var sendData = {
    start_term : formatDate(MonthFirstDate),
    end_term : formatDate(MonthLastDate),
    search : $("#search").val(),
  };
  myAjax.myAjax(fileName, sendData);
  
  // Tách dữ liệu thành các mảng
  const labels = ajaxReturnData.map(item => item.production_number);
  const production_quantity = ajaxReturnData.map(item => item.production_quantity);
  const total_ok = ajaxReturnData.map(item => item.total_ok);
  const packed = ajaxReturnData.map(item => item.packed);
  const import_q = ajaxReturnData.map(item => item.import_q);
  return data = {
    labels: labels, // Nhãn từ dữ liệu
    datasets: [
        {
            label: 'Order',
            data: production_quantity, // Dữ liệu số lượng sản xuất
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        },
        {
            label: 'OK',
            data: total_ok, // Dữ liệu OK
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
        },
        {
            label: 'Packed',
            data: packed, // Dữ liệu đóng gói
            backgroundColor: 'rgba(255, 159, 64, 0.6)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
        },
        {
            label: 'Import',
            data: import_q, // Dữ liệu nhập khẩu
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        }
    ]
};

};

function deleteChart(chart) {
  chart.destroy();
};

function drawChart() { 
  data = drawChartData();
  const chartHeight = data.labels.length * 50;
  document.getElementById('chart_area').style.height = `${chartHeight}px`;
  chart = new Chart(ctx, {
    type: 'bar', // Bar chart type
    data: data, // Your data
    options: {
      responsive: true,
      maintainAspectRatio: false, // Allow the chart to adjust height
      indexAxis: 'y', // Horizontal Bar Chart
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            autoSkip: false
          },
          grid: {
            display: false
          }
        },
        y: {
          stacked: false,
          ticks: {
            autoSkip: false,
            padding: 30, // Add more space between y-axis labels
            font: {
              size: 12 // Increase font size for readability
            }
          },
          grid: {
            display: true // Hide grid lines
          }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        },
      },
      barPercentage: 0.8, // Reduce bar width to create more spacing
      categoryPercentage: 0.9 // Increase space between bars
    }
  });
};

function calculateColumnAverage(columnIndex, type) {
  let total = 0;
  let count = 0;

  $("#summary__table tbody tr").each(function() {
    const cellValue = parseFloat($(this).find("td").eq(columnIndex).text());
    if (!isNaN(cellValue)) {
      total += cellValue;
      count++;
    }
  });
  if (type == 'num') {
    return total;
  } else {
    return count > 0 ? Math.ceil(total / count) : 0; // Trả về 0 nếu không có giá trị
  }
  
}

