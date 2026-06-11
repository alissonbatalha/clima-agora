const apiKey = "dc9982331721ad2f7c8c74d35c86381a";

const searchBtn = document.getElementById('search');
const cityInput = document.getElementById('city');
const loadingElement = document.getElementById('weather-loading');
const errorElement = document.getElementById('weather-error');
const errorMessage = document.getElementById('error-message');
const resultElement = document.getElementById('container__weather-data');
const weatherIcon = document.getElementById('weather-icon');
const countryFlag = document.getElementById('weather-country-flag');

const countryNames = new Intl.DisplayNames(['pt-BR'], { type: 'region' });

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWeatherData(city) {
    loadingElement.style.display = 'flex';
    errorElement.style.display = 'none';
    resultElement.style.display = 'none';

    try {
        const [response] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`),
            delay(1200)
        ]);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Cidade não encontrada. Verifique a grafia.');
            }
            throw new Error('Erro ao buscar dados. Tente novamente mais tarde.');
        }

        const data = await response.json();
        renderWeather(data);

    } catch (error) {
        errorMessage.textContent = error.message;
        errorElement.style.display = 'flex';
        resultElement.style.display = 'none';
    } finally {
        loadingElement.style.display = 'none';
    }
}

function renderWeather(data) {
    const cityNameEl = document.getElementById('weather-city-name');
    const tempEl = document.getElementById('weather-temp');
    const descEl = document.getElementById('weather-description');
    const humidityEl = document.getElementById('weather-humidity');
    const windEl = document.getElementById('weather-wind');
    
    let fullCountryName = data.sys.country;
    try {
        fullCountryName = countryNames.of(data.sys.country) || data.sys.country;
    } catch (e) {
        fullCountryName = data.sys.country;
    }

    cityNameEl.textContent = `${data.name}, ${fullCountryName}`;
    tempEl.textContent = `${Math.round(data.main.temp)}°C`;
    descEl.textContent = data.weather[0].description;
    humidityEl.textContent = `${data.main.humidity}%`;
    windEl.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;

    if (data.sys.country) {
        countryFlag.src = `https://flagsapi.com/${data.sys.country}/flat/64.png`;
        countryFlag.style.display = 'inline-block';
    } else {
        countryFlag.style.display = 'none';
    }

    if (data.weather[0].icon) {
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIcon.style.display = 'block';
    } else {
        weatherIcon.style.display = 'none';
    }

    resultElement.style.display = 'block';
}

function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    } else {
        errorMessage.textContent = 'Por favor, introduza o nome de uma cidade.';
        errorElement.style.display = 'flex';
        resultElement.style.display = 'none';
    }
}

if (searchBtn) {
    searchBtn.addEventListener('click', handleSearch);
}

if (cityInput) {
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}
