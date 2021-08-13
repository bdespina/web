let allActivities = {};
let countActivities = 0;
let users = {};
let dateStats = {
  month: {},
  day: {},
  hour: {},
  year: {}
};
const allMonths = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
allMonths.forEach((key) => {
  dateStats.month[key] = 0;
});
const allDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];
allDays.forEach((key) => {
  dateStats.day[key] = 0;
});
const allHours = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23'
];
allHours.forEach((key) => {
  dateStats.hour[key] = 0;
});
let heatmapData = [];
let heatmapMax = 0;
let map;
let heatmapLayer;


function dataProcess(data, keepMapControls) {
  allActivities = {};
  users = {};
  dateStats = {
    month: {},
    day: {},
    hour: {},
    year: {}
  };
  allMonths.forEach((key) => {
    dateStats.month[key] = 0;
  });
  allDays.forEach((key) => {
    dateStats.day[key] = 0;
  });
  allHours.forEach((key) => {
    dateStats.hour[key] = 0;
  });
  heatmapData = [];
  heatmapMax = 0;

  data.forEach((o) => {
    // User statistics
    if (!(o.userId in users)) {
      users[o.userId] = 0;
    }
    users[o.userId] += 1;

    const momentObject = moment(o.timestampMs, 'x');
    const month = momentObject.format('MMMM');
    const day = momentObject.format('dddd');
    const hour = momentObject.format('HH');
    const year = momentObject.format('YYYY');

    // Date statistics
    dateStats.month[month] += 1;
    dateStats.day[day] += 1;
    dateStats.hour[hour] += 1;

    if (!(year in dateStats.year)) {
      dateStats.year[year] = 0;
    }
    dateStats.year[year] += 1;

    // Activities statistics
    if (o.activityType === null) {
      return;
    }

    if (!(o.activityType in allActivities)) {
      allActivities[o.activityType] = 0;
    }

    allActivities[o.activityType] += 1;
    countActivities += 1;

    const latlon = heatmapData.find((row) => {
      return o.latitude === row.lat
            && o.longitude === row.lon;
    });

    if (latlon) {
      latlon.count += 1;

      if (latlon.count > heatmapMax) {
        heatmapMax = latlon.count;
      }
    } else {
      heatmapData.push({
        lat: o.latitude,
        lon: o.longitude,
        count: 1,
        year: year,
        month: month,
        day: day,
        hour: hour,
        activity: o.activityType
      });
    }
  });

  const stats = {};
  Object.keys(allActivities).forEach((key) => {
    stats[key] = allActivities[key] / countActivities;
  });

  if (!keepMapControls) {
    // Map controls
    createControls(dateStats, allMonths, allDays, allHours, allActivities);
  }

  // Stats tables
  createStatsTable(stats);

  // Heatmap
  createHeatmap(heatmapData, heatmapMax);
}

function createStatsTable(stats) {
  const activitiesRows= Object.keys(stats).map((key) => {
    return `<tr><td>${key}</td><td>${(stats[key] * 100).toFixed(2)}</td></tr>`
  });
  const userActivities = $('.user-activities').find('tbody');
  userActivities.html(activitiesRows);

  const userRows = Object.keys(users).map((key) => {
    return `<tr><td>${key}</td><td>${users[key]}</td></tr>`;
  });
  const userRecords = $('.user-records').find('tbody');
  userRecords.html(userRows);

  const monthRows = Object.keys(dateStats.month).sort((a, b) => {
    return allMonths.indexOf(a) - allMonths.indexOf(b);
  }).map((key) => {
    return `<tr><td>${key}</td><td>${dateStats.month[key]}</td></tr>`;
  });
  const monthRecords = $('.month-records').find('tbody');
  monthRecords.html(monthRows);

  const dayRows = Object.keys(dateStats.day).sort((a, b) => {
    return allDays.indexOf(a) - allDays.indexOf(b);
  }).map((key) => {
    return `<tr><td>${key}</td><td>${dateStats.day[key]}</td></tr>`;
  });
  const dayRecords = $('.day-records').find('tbody');
  dayRecords.html(dayRows);

  const hourRows = Object.keys(dateStats.hour).sort().map((key) => {
    return `<tr><td>${key}</td><td>${dateStats.hour[key]}</td></tr>`;
  });
  const hourRecords = $('.hour-records').find('tbody');
  hourRecords.html(hourRows);

  const yearRows = Object.keys(dateStats.year).sort().map((key) => {
    return `<tr><td>${key}</td><td>${dateStats.year[key]}</td></tr>`;
  });
  const yearRecords = $('.year-records').find('tbody');
  yearRecords.html(yearRows);
}

function createControls(dateStats, allMonths, allDays, allHours, allActivities) {
  const controls = $('.controls');

  const years = Object.keys(dateStats.year).map((key) => {
    return `<option value="${key}">${key}</option>`;
  });
  years.unshift('<option value=""></option');
  controls.find('.year').html(years);

  const months = allMonths.map((key) => {
    return `<option value="${key}">${key}</option>`;
  });
  months.unshift('<option value=""></option');
  controls.find('.month').html(months);

  const days = allDays.map((key) => {
    return `<option value="${key}">${key}</option>`;
  });
  days.unshift('<option value=""></option');
  controls.find('.day').html(days);

  const hours = allHours.map((key) => {
    return `<option value="${key}">${key}</option>`;
  });
  hours.unshift('<option value=""></option');
  controls.find('.hour').html(hours);

  const activities = Object.keys(allActivities).map((key) => {
    return `<option value="${key}">${key}</option>`;
  });
  activities.unshift('<option value=""></option');
  controls.find('.activity').html(activities);
}

function createHeatmap(heatmapData, heatmapMax) {
  const displayData = {
    max: heatmapMax,
    data: heatmapData
  };
  const cfg = {
    radius: 40,
    maxOpacity: 0.8,
    scaleRadius: false,
    userLocalExtrema: false,
    latField: 'lat',
    lngField: 'lon',
    valueField: 'count'
  };

  if (!map) {
    map = L.map('map');
    const tiles = new L.TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png');
    map.addLayer(tiles);
    map.setView([38.2304620, 21.7531500], 12);
  }

  if (!heatmapLayer) {
    heatmapLayer = new HeatmapOverlay(cfg);
    map.addLayer(heatmapLayer);
  }

  heatmapLayer.setData(displayData);
}

function filterData(filterOptions) {
  $.ajax({
    method: 'POST',
    url: '/api/data/query',
    data: {
      query: filterOptions
    }
  }).then((response) => {
    console.log(response);
    if (response.status === 'ok') {
      dataProcess(response.data, true);
    }
  }).catch((error) => {
    console.error(error);
  });
}

function loadData() {
  $.ajax({
    method: 'GET',
    url: '/api/data/all'
  }).then((response) => {
    dataProcess(response.data);
  }).catch((error) => {
    console.error(error);
  });
}

$(() => {
  const container = $('.container');
  const controls = container.find('.controls');

  // Filter control
  container.on('click', '.filter', () => {
    const yearStart = container.find('.year.start').val();
    const yearEnd = container.find('.year.end').val();
    const monthStart = container.find('.month.start').val();
    const monthEnd = container.find('.month.end').val();
    const dayStart = container.find('.day.end').val();
    const dayEnd = container.find('.day.end').val();
    const hourStart = container.find('.hour.end').val();
    const hourEnd = container.find('.hour.end').val();
    const activities = container.find('.activity').val();

    const filterOptions = {
      yearStart,
      yearEnd,
      monthStart,
      monthEnd,
      dayStart,
      dayEnd,
      hourStart,
      hourEnd,
      activities
    };
    filterData(filterOptions);
  });

  // Filter clear control
  container.on('click', '.clear', () => {
    controls.find('select').val('');

    $.ajax({
      method: 'GET',
      url: '/api/data/all'
    }).then((response) => {
      dataProcess(response.data);
    }).catch((error) => {
      console.error(error);
    });
  });

  // Fetch admin data
  loadData();

  const message = $('.message');

  // Export data
  $('.export-data').on('click', () => {
    const yearStart = container.find('.year.start').val();
    const yearEnd = container.find('.year.end').val();
    const monthStart = container.find('.month.start').val();
    const monthEnd = container.find('.month.end').val();
    const dayStart = container.find('.day.end').val();
    const dayEnd = container.find('.day.end').val();
    const hourStart = container.find('.hour.end').val();
    const hourEnd = container.find('.hour.end').val();
    const activities = container.find('.activity').val();

    const filterOptions = {
      yearStart,
      yearEnd,
      monthStart,
      monthEnd,
      dayStart,
      dayEnd,
      hourStart,
      hourEnd,
      activities
    };

    $.ajax({
      url: '/api/data/export',
      method: 'POST',
      data: {
        query: filterOptions
      }
    }).then((response) => {
      if (response.status === 'ok') {
        window.location.href = `/api/data/export/${response.path}`;
      }
    }).catch((error) => {
      message.text(error.message);
    });
  });

  // Delete data
  $('.delete-data').on('click', () => {
    $.ajax({
      url: '/api/data',
      method: 'DELETE'
    }).then((response) => {
      message.text(response.message);
      loadData();
    }).catch((error) => {
      message.text(error.message);
    });
  });
});
