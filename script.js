document.getElementById('weatherForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const city = document.getElementById('city').value;
    getWeather(city);
});

async function getWeather(city) {
    const apiKey = 'bd5e378503939ddaee76f12ad7a97608';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const weatherResponse = await fetch(currentWeatherUrl);
        const weatherData = await weatherResponse.json();
        
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(weatherData);
        displayForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to retrieve weather data. Please try again.');
    }
}

function displayCurrentWeather(data) {
    if (data.cod !== 200) {
        alert('City not found. Please enter a valid city.');
        return;
    }

    const weatherSection = document.getElementById('currentWeather');
    weatherSection.innerHTML = `
        <h2>Current Weather in ${data.name}</h2>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Condition: ${data.weather[0].description}</p>
    `;
    weatherSection.style.display = 'block';
}

function displayForecast(data) {
    if (data.cod !== "200") {
        alert('Error retrieving forecast data.');
        return;
    }

    const labels = data.list.map(item => item.dt_txt);
    const temps = data.list.map(item => item.main.temp);
    
    const ctx = document.getElementById('forecastChart').getContext('2d');
    const forecastChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Date and Time'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            }
        }
    });

    const forecastSection = document.getElementById('forecast');
    forecastSection.style.display = 'block';
}
