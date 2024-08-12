const axios = require('axios');

const getWeatherData = async (req, res) => {
    const location = req.params.location;
    const apiKey = process.env.WEATHER_API_KEY;

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
        
        const data = response.data;

        res.json({
            location: data.name,
            temperature: data.main.temp,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            description: data.weather[0].description,
        });
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
};

module.exports = { getWeatherData };
