var searchEl = document.querySelector('#city-search');
var submitEl = document.querySelector('.submit');
var cityEl = document.querySelector('.current-city');
var historyEl = document.querySelector('.history');


function init() {
    displayHistory();
}

var result = "No Results"
function citySearch() {
    var currentCity = searchEl.value.trim();
    var geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${currentCity}&limit=1&appid=bdd27e1d7a97f67b1f92d2980334ed0f`;


    fetch(geoUrl)
        .then(function (response) {
            
            if (response.ok) {
                return response.json();
            } else {
                cityEl.textContent = result;
                return;
            }
        })
        .then(function (data) {
            
            if (data.length !== 0) {
                for (var city of data) {
                    lat = city.lat;
                    lon = city.lon;
                }
                
                searchHistory(currentCity);
                weatherSearch(currentCity, lat, lon);
            } else {
                cityEl.textContent = result;
                return;
            }
        })
        .catch(function (err) {
            console.log(err);
        })
}


function weatherSearch(city, lat, lon) {
    var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=bdd27e1d7a97f67b1f92d2980334ed0f&units=imperial`;


    
    cityEl.innerHTML = null;

    fetch(weatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            
            var currentEl = document.createElement('section');
            var nameEl = document.createElement('h2');
            var dateEl = document.createElement('h3');
            var iconEl = document.createElement('img');
            var divEl = document.createElement('div')
            var tempEl = document.createElement('p');
            var humidEl = document.createElement('p');
            var windEl = document.createElement('p');
            var uviEl = document.createElement('p');
            var spanEl = document.createElement('span');
            var fiveDayEl = document.createElement('p');

            
            var now = moment().format('MM/DD/YYYY');
            
            var icon = data.current.weather[0].icon;
            var iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

            
            nameEl.textContent = city;
            dateEl.textContent = now;
            iconEl.src = iconUrl;
            tempEl.textContent = 'Temperature: ' + data.current.temp;
            humidEl.textContent = 'Humidity: ' + data.current.humidity;
            windEl.textContent = 'Wind Speed: ' + data.current.wind_speed;
            uviEl.textContent = 'UVI: ';
            spanEl.textContent = data.current.uvi
            fiveDayEl.textContent = '5 Day Forecast: ';

            
            divEl.className = 'current-list';

            
            if (data.current.uvi < 4) {
                spanEl.style.backgroundColor = 'green';
            } else if (data.current.uvi > 3 && data.current.uvi < 7) {
                spanEl.style.backgroundColor = 'orange';
            } else span.style.backgroundColor = 'red';

            
            uviEl.appendChild(spanEl);
            divEl.append(tempEl, humidEl, windEl, uviEl);
            currentEl.append(nameEl, dateEl, iconEl);
            cityEl.append(currentEl, divEl, fiveDayEl);

            
            for (i = 0; i < 5; i++) {
                var iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                var day = i + 1;
                var nextDay = data.daily[i];
                var icon = nextDay.weather[0].icon
                var date = moment().add(day, 'd').format('MM/DD/YYYY')
                var futureBlock = [date, iconUrl, nextDay.temp.max, nextDay.wind_speed, nextDay.humidity];
                displayFuture(futureBlock);
            };
        })
        .catch(function (err) {
            console.log(err);
        })
}


function displayFuture(arr) {
    var forecastEl = document.createElement('div');
    var fDateEl = document.createElement('h4');
    var fIconEl = document.createElement('img');
    var fTempEl = document.createElement('p');
    var fWindEl = document.createElement('p');
    var fHumidEl = document.createElement('p');

    fDateEl.textContent = arr[0];
    fIconEl.src = arr[1];
    fTempEl.textContent = 'Temp: ' + arr[2];
    fWindEl.textContent = 'Wind: ' + arr[3];
    fHumidEl.textContent = 'Humidity: ' + arr[4];

    forecastEl.className = 'five-days';

    forecastEl.append(fDateEl, fIconEl, fTempEl, fWindEl, fHumidEl);
    cityEl.appendChild(forecastEl);
}


function searchHistory(city) {
    var pastCities = JSON.parse(localStorage.getItem('search-history')) || [];

    
    for (i = 0; i < pastCities.length; i++) {
        if (pastCities[i] == city) {
            pastCities.splice(i, 1);
        }
    }
    
    if (city === '') {
        return;
    }
    pastCities.push(city);

    localStorage.setItem('search-history', JSON.stringify(pastCities))

    
    displayHistory();
}
function displayHistory() {
    var pastCities = JSON.parse(localStorage.getItem('search-history')) || [];

    
    historyEl.innerHTML = null;
    
    for (city of pastCities) {
        var pCityEl = document.createElement('button');

        pCityEl.textContent = city;

        historyEl.append(pCityEl);
    }
    
    var clearEl = document.createElement('button');
    clearEl.textContent = 'Clear History';
    historyEl.appendChild(clearEl);
}
submitEl.addEventListener('click', citySearch);

historyEl.addEventListener('click', function (event) {
    
    var button = event.target
    var currentCity = button.textContent;

   
    if (currentCity === 'Clear History') {
        historyEl.innerHTML = null;
        localStorage.clear();
        return;
    }
    
    var geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${currentCity}&limit=1&appid=bdd27e1d7a97f67b1f92d2980334ed0f`;
    fetch(geoUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                (cityEl.textContent = result);
                return;
            }
        })
        .then(function (data) {
            if (data.length !== 0) {
                for (var city of data) {
                    lat = city.lat;
                    lon = city.lon;
                }
                weatherSearch(currentCity, lat, lon);
            } else {
                cityEl.textContent = result;
                return;
            }
        })
        .catch(function (err) {
            console.log(err);
        })
});


init();