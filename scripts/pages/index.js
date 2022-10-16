'use strict';
import 'https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js';
import {
	WeatherApi,
	getImageForCity
} from '../Api/api.js';
import {
	showTime,
	convertTimeEpoch,
	getDayName
} from '../utility.js';
let weather = new WeatherApi();
var map;

function changeBackgroundBySearch(text) {
	getImageForCity(text, src => {
		$('<img/>').attr('src', `${src}`).on('load', function() {
			$(this).remove(); // prevent memory leaks as @benweet suggested
			$(document.body).css('background-image', `url(${src})`);
			$('.spinner').hide();
		});
	}, $('.spinner'));
}
$('.searchTools li').click(function(e) {
	$('.searchTools li').removeClass('active');
	if(e.delegateTarget.classList.contains('searchCity')) {
		$('.mapContainer').removeClass('d-block');
		$('.mapContainer').animate({
			opacity: 0
		}, 0, function() {
			$('.mapContainer').slideUp(500);
		});
		$('.searchCity').addClass('active');
		if($('.searchContainer').hasClass('d-block')) {
			$('.searchTools li').removeClass('active');
			$('.searchContainer').removeClass('d-block');
			$('.searchContainer').animate({
				opacity: 0
			}, 0, function() {
				$('.searchContainer').slideUp(500);
			});
			$('.searchTools li').removeClass('active');
		} else {
			$('.searchContainer').slideDown(500).animate({
				opacity: 1
			}, 0, function() {
				$('.searchContainer').addClass('d-block');
			});
			e.delegateTarget.classList.add('active');
		}
	} else if(e.delegateTarget.classList.contains('mapSearch')) {
		$('.searchContainer').removeClass('d-block');
		$('.searchContainer').animate({
			opacity: 0
		}, 0, function() {
			$('.searchContainer').slideUp(500);
		});
		$('.mapSearch').addClass('active');
		if($('.mapContainer').hasClass('d-block')) {
			$('.searchTools li').removeClass('active');
			$('.mapContainer').removeClass('d-block');
			$('.mapContainer').animate({
				opacity: 0
			}, 0, function() {
				$('.mapContainer').slideUp(500);
			});
			$('.searchTools li').removeClass('active');
		} else {
			$('.mapContainer').slideDown(500).animate({
				opacity: 1
			}, 0, function() {
				$('.mapContainer').addClass('d-block');
			});
			if(map != null) {
				map.resize();
			}
		}
		e.delegateTarget.classList.add('active');
	}
	switchDisplay();
});
$('.weather-section li').click(function(e) {
	$('.weather-section li').removeClass('active');
	e.delegateTarget.classList.add('active');
	switchDisplay();
});

function currentIsAcrive() {
	if($('.currentBtn').hasClass('active')) {
		return true;
	} else {
		return false;
	}
}
$('.searchContainer input').on('input', function(e) {});
$('.searchBtn').click(async () => {
	if($('.searchContainer input').val().trim() != '') {
		checkWeather($('.searchContainer input').val());
	} else {}
});

function checkWeather(q) {
	weather.getforecast(q).then(res => {
		if(res.error == null) {
			userWeatherData(res);
			changeBackgroundBySearch(`${res.location.country}`);
		} else {
			if(res.error.code == 1003) {
				$('.searchContainer input').focus();
			} else {
				// alert (res.error.message);
			}
		}
	}).catch(e => {
		console.log(e);
	});
}
$(document).ready(function() {
	setMap();
	showTime();
});

function userWeatherData(data) {
	var cartona = ''
	const {
		location,
		current,
		forecast
	} = data
	const days = forecast.forecastday
	for(let day = 0; day < days.length; day++) {
		let forecastDay = convertTimeEpoch(days[day].date_epoch)
		let nameOfDay = getDayName(days[day].date_epoch)
		let maxtemp_f = days[day].day.maxtemp_f + '°F'
		let maxtemp_c = days[day].day.maxtemp_c + '°C'
		let mintemp_f = days[day].day.mintemp_f + '°F'
		let mintemp_c = days[day].day.mintemp_c + '°C'
		cartona += `
    <div class="dayContainer">
    <div class="head d-flex gap-5">
      <div>${forecastDay}</div>
      <div>${nameOfDay}</div>
    </div>
    <div class="body">
      <p>Max Temp<p>
      <div>${maxtemp_c}</div>
      <div>${maxtemp_f}</div>
      <p>Min Temp<p>
      <div>${mintemp_c}</div>
      <div>${mintemp_f}</div>
    </div>
  </div>`
	}
	$('.weather .forecast .container').html(cartona)
	var currentDate = convertTimeEpoch(current.last_updated_epoch)
	var nameOfDay = getDayName(current.last_updated_epoch)
	var temp_c = current.temp_c
	var temp_f = current.temp_f
	$('.dayContainer .date').html(currentDate)
	$('.dayContainer .day').html(nameOfDay)
	$('.dayContainer .tempC').html(`${temp_c} °C`)
	$('.dayContainer .tempF').html(`${temp_f} °F`)
	$('.dayContainer .country').html(location.country)
	$('.dayContainer .region').html(location.region)
}

function switchDisplay() {
	if(currentIsAcrive()) {
		$('.current').slideDown();
		$('.forecast').slideUp();
	} else {
		$('.forecast').slideDown();
		$('.current').slideUp();
	}
}

function setMap() {
	navigator.geolocation.getCurrentPosition(function(pos) {
		checkWeather(`${coordsToPercent (pos.coords.latitude)},${coordsToPercent (pos.coords.longitude)}`)
		mapboxgl.accessToken = 'pk.eyJ1IjoibXVobWQwMSIsImEiOiJjbDlhZTAzcm4wOG9tNDVsZXEyOGxpOXA4In0.TCd3kq4jyv-VCD5bcBuVVw';
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/outdoors-v10?optimize=true',
			center: [pos.coords.longitude, pos.coords.latitude],
			zoom: 6,
		})
		$('.searchMapBtn').click(function() {
			const {
				lng,
				lat
			} = map.getCenter();
			map.resize();
			checkWeather(`${coordsToPercent (lat)},${coordsToPercent (lng)}`);
		})
	}, err => {
		let session = showTime();
		if(session == 'PM') {
			getImageForCity('pm', src => {
				$('<img/>').attr('src', `${src}`).on('load', function() {
					$(this).remove(); // prevent memory leaks as @benweet suggested
					$(document.body).css('background-image', `url(${src})`);
					$('.spinner').hide();
				});
			}, $('.spinner'));
		} else {
			getImageForCity('fayrouz singer', src => {
				$('<img/>').attr('src', `${src}`).on('load', function() {
					$(this).remove(); // prevent memory leaks as @benweet suggested
					$(document.body).css('background-image', `url(${src})`);
					$('.spinner').hide();
				});
			}, $('.spinner'));
		}
	}, {
		enapleHighAccuracy: true,
		timeout: 5000
	});
}

function coordsToPercent(c) {
	return Math.floor(c * 100) / 100;
}
// This is just a sample script. Paste your real code (javascript or HTML) here.
if('this_is' == /an_example/) {
	of_beautifier();
} else {
	var a = b ? (c % d) : e[f];
}
