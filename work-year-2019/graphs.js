'use strict';

const COLORS = [
  '#ff6183',
  '#37a3eb',
  '#ffcf57',
  '#4abfbf',
  '#9966ff',
  '#ffa142',
  '#dfe3ec'
];

google.charts.load('current', { 'packages': ['corechart'] });

google.charts.setOnLoadCallback(drawChart('PieChart', 'chart0', countPerRole, {
  backgroundColor: 'transparent',
  colors: COLORS,
  is3D: true,
  legend: { position: 'top', maxLines: 3 },
}));

google.charts.setOnLoadCallback(drawChart('BarChart', 'chart1', countPerRolePerProject, {
  backgroundColor: 'transparent',
  colors: COLORS,
  isStacked: 'percent',
  legend: { position: 'top', maxLines: 3 },
}));

google.charts.setOnLoadCallback(drawChart('ComboChart', 'chart2', projectWeeksPersons, {
  backgroundColor: 'transparent',
  colors: [COLORS[0], COLORS[1]],
  legend: { position: 'top', maxLines: 3 },
  series: { 1: { type: 'line' } },
  seriesType: 'bars',
}));

google.charts.setOnLoadCallback(drawChart('PieChart', 'chart3', countPerGender, {
  backgroundColor: 'transparent',
  colors: COLORS.slice(3, 5),
  legend: { position: 'top', maxLines: 3 },
  slices: {
    0: { offset: 0.1 },
    1: { offset: 0.1 },
  },
}));

google.charts.setOnLoadCallback(drawDiffChart('ColumnChart', 'chart4', countPerYearJoinedBefore, countPerYearJoinedAfter, {
  backgroundColor: 'transparent',
  colors: COLORS.slice(5, 6),
  legend: 'none',
}));

google.charts.setOnLoadCallback(drawChart('SteppedAreaChart', 'chart5', countPerEmailInitial, {
  backgroundColor: 'transparent',
  colors: COLORS,
  legend: 'none',
}));

function drawChart(charType, elementId, rows, options) {
  return function() {
    const chart = new google.visualization[charType](document.getElementById(elementId));
    const data = new google.visualization.arrayToDataTable(rows);
    chart.draw(data, options);
  }
}

function drawDiffChart(chartName, elementId, rows, newRows, options) {
  return function() {
    const chart = new google.visualization[chartName](document.getElementById(elementId));
    const data = google.visualization.arrayToDataTable(rows);
    const newData = google.visualization.arrayToDataTable(newRows);
    const diffData = chart.computeDiff(data, newData);
    chart.draw(diffData, options);
  }
}

// Map chart interactivity
// Based on https://developers.google.com/chart/interactive/docs/gallery/geochart
// Why? to avoid having to get a mapsApiKey
const tooltipSpan = document.getElementById('tooltip');

window.onmousemove = function(e) {
  const x = e.clientX;
  const y = e.clientY;
  const tooltipHeight = tooltipSpan.clientHeight;
  const tooltipWidth = tooltipSpan.clientWidth;
  tooltipSpan.style.top = (y - tooltipHeight- 15) + 'px';
  tooltipSpan.style.left = (x - tooltipWidth - 15) + 'px';
};

countPerLocation.forEach(function(countryCount) {
  const countryName = countryCount[0];
  const count = countryCount[1];
  const areas = document.querySelectorAll('.map-container [class="' + countryName.toLowerCase() + '"]');
  areas.forEach(function(area) {
    const currentVal = area.getAttribute('class');
    area.addEventListener('mouseover', function() {
      if (count) {
        tooltipSpan.classList.add('show');
        tooltipSpan.innerHTML = countryCount[0] + '<br>Count: ' + count;
        areas.forEach(function(countryArea) {
          countryArea.setAttribute('class', currentVal + ' selected')
        });
      } else {
        area.setAttribute('class', currentVal + ' selected')
      }
    });
    area.addEventListener('mouseout', function() {
      if (count) {
        tooltipSpan.classList.remove('show');
        areas.forEach(function(countryArea) {
          countryArea.setAttribute('class', currentVal.replace(' selected', ''));
        });
      } else {
        area.setAttribute('class', currentVal.replace(' selected', ''));
      }
    });
  })
});
