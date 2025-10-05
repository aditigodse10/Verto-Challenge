const API_KEY = "adab38d3a1a258e29b87ae1cb49930c6";
const CURRENT_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?q=";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast?q=";

const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const weatherDisplay = document.getElementById('weather-display');
const forecastContainer = document.getElementById('forecast-container');
const forecastSection = document.getElementById('forecast-section');
const loadingIndicator = document.getElementById('loading-indicator');
const errorMessage = document.getElementById('error-message');

function getWeatherIcon(code) {
    if (code >= 200 && code < 300) return '⛈️'; 
    if (code >= 300 && code < 400) return '☔'; 
    if (code >= 500 && code < 600) return '🌧️'; 
    if (code >= 600 && code < 700) return '❄️'; 
    if (code >= 700 && code < 800) return '🌫️'; 
    if (code === 800) return '☀️'; 
    if (code === 801 || code === 802) return '🌤️'; 
    if (code >= 803 && code < 900) return '☁️'; 
    return '❓';
}
function setStatus(state, message = '') {
    loadingIndicator.style.display = 'none';
    errorMessage.style.display = 'none';
    weatherDisplay.style.display = 'none';
    forecastSection.style.display = 'none';
    
    weatherDisplay.style.opacity = '0';
    forecastSection.style.opacity = '0';

    if (state === 'loading') {
        loadingIndicator.style.display = 'block';
        loadingIndicator.style.opacity = '1';
    } else if (state === 'error') {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.style.opacity = '1';
    }
}
function displayWeather(data) {
    const icon = getWeatherIcon(data.weather[0].id);
    const tempC = Math.round(data.main.temp);
    const condition = data.weather[0].description.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    const currentDate = new Date();
    const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = currentDate.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    weatherDisplay.innerHTML = `
        <!-- Main Icon at the top -->
        <span class="weather-icon-main" style="color: ${data.weather[0].main === 'Clear' ? 'var(--icon-color)' : 'var(--primary-text)'};">${icon}</span>

        <div class="weather-top">
            <p class="temperature">${tempC}°C</p>
            <div class="city-name">${data.name}, ${data.sys.country}</div>
        </div>
        
        <div class="condition-details">${dayName}, ${dateStr}</div>
        <div class="condition-details">${condition}</div>
        
        <div class="details">
            <div class="detail-item">Min <strong>${Math.round(data.main.temp_min)}°C</strong></div>
            <div class="detail-item">Max <strong>${Math.round(data.main.temp_max)}°C</strong></div>
            <div class="detail-item">Humidity <strong>${data.main.humidity}%</strong></div>
            <div class="detail-item">Wind <strong>${Math.round(data.wind.speed)} m/s</strong></div>
        </div>
    `;
    weatherDisplay.style.display = 'block';
    weatherDisplay.style.opacity = '1';
}

function displayForecast(data) {
    forecastContainer.innerHTML = '';
    
    const dailyData = {};
    
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        if (!dailyData[dayKey]) {
             dailyData[dayKey] = {
                day: dayKey,
                icon: getWeatherIcon(item.weather[0].id),
                temp_max: item.main.temp_max 
            };
        }
    });
    const forecastDays = Object.values(dailyData).slice(1, 7); 
    
    if (forecastDays.length > 0) {
         forecastDays.forEach((day, index) => {
            const card = document.createElement('div');
            card.className = 'day-card';
            card.style.animation = `fadeIn 0.4s ease-out ${0.1 * index}s forwards`;
            
            card.innerHTML = `
                <div class="day">${day.day}</div>
                <div class="icon">${day.icon}</div>
                <div class="temp-range">${Math.round(day.temp_max)}°C</div>
            `;
            forecastContainer.appendChild(card);
        });
        forecastSection.style.display = 'block';
        forecastSection.style.opacity = '1';
    }
}
async function fetchWeather(city) {
    if (!city) return setStatus('error', 'Please enter a city name.');

    setStatus('loading');

    const currentUrl = `${CURRENT_WEATHER_URL}${city}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `${FORECAST_URL}${city}&appid=${API_KEY}&units=metric`;
    
    const maxRetries = 3;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            const [currentResponse, forecastResponse] = await Promise.all([
                fetch(currentUrl),
                fetch(forecastUrl)
            ]);

            if (currentResponse.status === 404 || forecastResponse.status === 404) {
                throw new Error(`City "${city}" not found. Check spelling.`);
            }
            if (!currentResponse.ok || !forecastResponse.ok) {
                throw new Error(`API error (${currentResponse.status}). Retrying...`);
            }

            const currentData = await currentResponse.json();
            const forecastData = await forecastResponse.json();
            
            setStatus('clear'); 
            displayWeather(currentData);
            displayForecast(forecastData);

            localStorage.setItem('lastCity', city);
            return; 

        } catch (error) {
            console.error("Error fetching weather data:", error.message);
            if (i === maxRetries - 1) {
                 setStatus('error', error.message.replace(/\s*\(.*\)\s*/, ''));
            } else {
                const delay = Math.pow(2, i) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
}
function initializeApp() {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        cityInput.value = lastCity;
        fetchWeather(lastCity);
    } else {
         cityInput.value = 'New York'; 
         fetchWeather('New York');
    }
}
searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    fetchWeather(city);
});

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        searchButton.click();
    }
});

document.addEventListener('DOMContentLoaded', initializeApp);
