const API_KEY = "9b84c9e107c209b7e08e256f7b022312"; 

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('weatherForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const location = document.getElementById('locationInput').value;

        if (!location) {
            alert('Please enter a location');
            return;
        }

        try {
            const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`);
            const weatherData = await weatherResponse.json();

            if (weatherData.cod !== 200) {
                throw new Error(weatherData.message);
            }

            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`);
            const forecastData = await forecastResponse.json();

            if (forecastData.cod !== '200') {
                throw new Error(forecastData.message);
            }

            const weatherResult = document.getElementById('weatherResult');
            weatherResult.style.display = 'block';
            weatherResult.innerHTML = `
                <h2>${weatherData.name}</h2>
                <p>Temperature: ${weatherData.main.temp}°C</p>
                <p>Humidity: ${weatherData.main.humidity}%</p>
                <p>Wind Speed: ${weatherData.wind.speed} m/s</p>
                <p>Description: ${weatherData.weather[0].description}</p>
                <p id="localTime"></p>
            `;

            const hourlyForecastElement = document.getElementById('hourlyForecast');
            const hourlyForecast = forecastData.list
                .filter(item => {
                    const forecastTime = new Date(item.dt * 1000);
                    return forecastTime >= new Date() && forecastTime <= new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
                })
                .map(hour => `
                    <div class="forecast-item">
                        <p>Time: ${new Date(hour.dt * 1000).toLocaleTimeString()}</p>
                        <p>Temperature: ${hour.main.temp}°C</p>
                        <p>Description: ${hour.weather[0].description}</p>
                        <p>Humidity: ${hour.main.humidity}%</p>
                        <p>Wind Speed: ${hour.wind.speed} m/s</p>
                    </div>
                `)
                .join('');
            hourlyForecastElement.innerHTML = `
                <h3>Hourly Forecast (Next 7 Hours)</h3>
                ${hourlyForecast}
            `;
            document.getElementById('hourlyButton').style.display = 'inline-block';
            document.getElementById('dailyButton').style.display = 'inline-block';

            const dailyForecastElement = document.getElementById('dailyForecast');
            const dailyForecast = forecastData.list
                .filter(item => new Date(item.dt * 1000).getHours() === 12) 
                .map(day => `
                    <div class="forecast-item">
                        <p>Date: ${new Date(day.dt * 1000).toLocaleDateString()}</p>
                        <p>Temperature: ${day.main.temp}°C</p>
                        <p>Description: ${day.weather[0].description}</p>
                        <p>Humidity: ${day.main.humidity}%</p>
                        <p>Wind Speed: ${day.wind.speed} m/s</p>
                    </div>
                `)
                .join('');
            dailyForecastElement.innerHTML = `
                <h3>Daily Forecast (Next 5 Days)</h3>
                ${dailyForecast}
            `;

            document.getElementById('localTime').textContent = `Local Time: ${new Date().toLocaleString()}`;

            const mapButton = document.getElementById('mapButton');
            const cityName = encodeURIComponent(weatherData.name);
            mapButton.style.display = 'inline-block';
            mapButton.onclick = function() {
                window.open(`https://www.google.com/maps/search/?api=1&query=${cityName}`, '_blank');
            };

        } catch (error) {
            alert(`An error occurred: ${error.message}`);
            console.error(error);
        }
    });
});
