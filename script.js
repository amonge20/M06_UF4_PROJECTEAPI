document.getElementById('search-btn').addEventListener('click', function() {
  var cityInput = document.getElementById('city');
  var city = cityInput.value;

  var apiKey = 'e63fd944917ef2279103139a0ffc1785'; // Reemplaza con tu clave de API de OpenWeatherMap

  fetch('http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      displayWeatherData(data);
    })
    .catch(function(error) {
      console.log(error);
    });
});

function displayWeatherData(data) {
  var weatherDataElement = document.getElementById('weather-data');
  weatherDataElement.innerHTML = '';

  var cityElement = document.createElement('h2');
  cityElement.textContent = data.city.name;
  weatherDataElement.appendChild(cityElement);

  var forecastList = data.list;
  var hoursData = {};
  for (var i = 0; i < forecastList.length; i++) {
    var forecast = forecastList[i];

    var date = new Date(forecast.dt_txt);
    var day = date.toLocaleDateString(undefined, { weekday: 'long' });
    var hour = date.getHours();

    if (!hoursData.hasOwnProperty(day)) {
      hoursData[day] = {};
    }

    if (!hoursData[day].hasOwnProperty(hour)) {
      hoursData[day][hour] = {
        temperatures: [],
        descriptions: []
      };
    }

    hoursData[day][hour].temperatures.push(forecast.main.temp - 273.15);
    hoursData[day][hour].descriptions.push(forecast.weather[0].description);
  }

  for (var day in hoursData) {
    var forecastElement = document.createElement('div');
    forecastElement.classList.add('forecast');

    var dayElement = document.createElement('h3');
    dayElement.textContent = day;
    forecastElement.appendChild(dayElement);

    var chartElement = document.createElement('canvas');
    forecastElement.appendChild(chartElement);

    weatherDataElement.appendChild(forecastElement);

    var labels = [];
    var temperatureData = [];
    var minTemperatureData = [];
    var maxTemperatureData = [];
    for (var hour in hoursData[day]) {
      labels.push(hour + ':00');
      var temperatures = hoursData[day][hour].temperatures;
      var minTemperature = Math.min(...temperatures);
      var maxTemperature = Math.max(...temperatures);
      var averageTemperature = getAverage(temperatures);
      temperatureData.push(averageTemperature);
      minTemperatureData.push(minTemperature);
      maxTemperatureData.push(maxTemperature);
    }

    var chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Temperatura Promedio',
          data: temperatureData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Temperatura Mínima',
          data: minTemperatureData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 1
        },
        {
          label: 'Temperatura Máxima',
          data: maxTemperatureData,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 1
        }
      ]
    };

    var chartOptions = {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value, index, values) {
              return value + '°C';
            }
          }
        }
      }
    };

    new Chart(chartElement, {
      type: 'line',
      data: chartData,
      options: chartOptions
    });
  }

  weatherDataElement.style.display = 'block';
}

function getAverage(arr) {
  var sum = arr.reduce(function(a, b) {
    return a + b;
  }, 0);
  return sum / arr.length;
}