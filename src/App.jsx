import React, { useEffect, useState, useRef } from "react";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// List of random Indian cities for the dice button
const randomIndianCities = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Ahmedabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Jaipur",
  "Lucknow",
];

export default function Weather() {
  const [city, setCity] = useState("London");
  const [weatherData, setWeatherData] = useState({
    today: null,
    tomorrow: null,
    dayAfterTomorrow: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  // Controlled input state for city search
  const [inputCity, setInputCity] = useState("");
  // Ref for the input field to update placeholder on dice click
  const inputRef = useRef(null);

  // Toggle theme dark/light
  const toggleTheme = () => setDarkMode((d) => !d);

  // On clicking dice: pick random Indian city & set input placeholder
  const randomizeCity = () => {
    const randomCity =
      randomIndianCities[Math.floor(Math.random() * randomIndianCities.length)];
    setInputCity(randomCity); // set value
    if (inputRef.current) {
      inputRef.current.placeholder = "Enter city name"; // reset placeholder
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get lat/lon for the city
        const geoRes = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
        );
        const geoData = await geoRes.json();
        if (!geoData.length) throw new Error("City not found");
        const { lat, lon } = geoData[0];

        // Fetch current weather and forecast simultaneously
        const [todayRes, forecastRes] = await Promise.all([
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          ),
          fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          ),
        ]);

        if (!todayRes.ok) throw new Error("Failed to fetch today's weather");
        if (!forecastRes.ok) throw new Error("Failed to fetch forecast");

        const todayData = await todayRes.json();
        const forecastData = await forecastRes.json();

        const todayDate = new Date();
        const tomorrowDate = new Date(todayDate);
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        const dayAfterTomorrowDate = new Date(todayDate);
        dayAfterTomorrowDate.setDate(dayAfterTomorrowDate.getDate() + 2);

        // Helper: Find forecast closest to 12:00 PM of the given date
        function getForecastForDate(date) {
          const targetHour = 12;
          const targetDateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD

          const candidates = forecastData.list.filter((item) => {
            const itemDate = new Date(item.dt * 1000);
            return itemDate.toISOString().startsWith(targetDateStr);
          });

          if (!candidates.length) return null;

          let closest = candidates[0];
          let minHourDiff = Math.abs(
            new Date(candidates[0].dt * 1000).getHours() - targetHour
          );

          for (let c of candidates) {
            const hourDiff = Math.abs(
              new Date(c.dt * 1000).getHours() - targetHour
            );
            if (hourDiff < minHourDiff) {
              minHourDiff = hourDiff;
              closest = c;
            }
          }
          return closest;
        }

        const tomorrowForecast = getForecastForDate(tomorrowDate);
        const dayAfterTomorrowForecast =
          getForecastForDate(dayAfterTomorrowDate);

        setWeatherData({
          today: todayData,
          tomorrow: tomorrowForecast,
          dayAfterTomorrow: dayAfterTomorrowForecast,
        });
      } catch (err) {
        setError(err.message);
        setWeatherData({ today: null, tomorrow: null, dayAfterTomorrow: null });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedCity = inputCity.trim();
    if (trimmedCity) {
      setCity(trimmedCity);
      setInputCity(""); // clear input value
      if (inputRef.current) {
        inputRef.current.placeholder = "Enter city name"; // reset placeholder
      }
    }
  };

  // Helper to safely get weather info from different data shapes
  const getWeatherInfo = (data) => {
    if (!data) return null;

    // For current weather data
    if (data.weather && data.main) {
      return {
        icon: data.weather[0]?.icon,
        description: data.weather[0]?.description,
        temp: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind?.speed,
      };
    }

    // For forecast data
    if (data.weather && data.main) {
      return {
        icon: data.weather[0]?.icon,
        description: data.weather[0]?.description,
        temp: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind?.speed,
      };
    }

    return null;
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-10 transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-blue-50 via-blue-100 to-white"
      }`}
    >
      <div
        className={`w-full max-w-4xl p-6 sm:p-8 rounded-3xl shadow-2xl border backdrop-blur-xl transition-all duration-300 ${
          darkMode
            ? "border-white/20 text-white bg-white/10"
            : "border-blue-200 text-gray-800 bg-white/40"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-wide">🌤 Weather App</h1>
          <button
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
              darkMode
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-blue-200 hover:bg-blue-300 text-gray-800"
            }`}
            title="Toggle Theme"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <input
            ref={inputRef}
            type="text"
            name="city"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Enter city..."
            className={`w-full sm:w-auto flex-grow px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              darkMode
                ? "bg-white/10 text-white placeholder-white/50"
                : "bg-white text-gray-800 placeholder-gray-500"
            }`}
          />
          <button
            type="submit"
            className={`px-6 py-3 rounded-lg font-semibold shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 hover:scale-105 ${
              darkMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Search
          </button>
          <button
            type="button"
            onClick={randomizeCity}
            className={`p-3 rounded-full text-xl transition hover:scale-110 ${
              darkMode
                ? "text-white hover:bg-white/10"
                : "text-gray-800 hover:bg-blue-100"
            }`}
            title="Random Indian city"
          >
            🎲
          </button>
        </form>

        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <p className="text-center text-red-400 font-semibold">
            Error: {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <p className="text-center text-lg font-medium mb-4">
              Showing weather for: <span className="font-semibold">{city}</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {["today", "tomorrow", "dayAfterTomorrow"].map((dayKey) => {
                const data = weatherData[dayKey];
                if (!data) return null;

                const info = getWeatherInfo(data);
                if (!info) return null;

                let dayLabel = dayKey;
                if (dayKey === "dayAfterTomorrow")
                  dayLabel = "Day After Tomorrow";
                else
                  dayLabel = dayKey.charAt(0).toUpperCase() + dayKey.slice(1);

                return (
                  <div
                    key={dayKey}
                    className={`rounded-xl p-6 shadow-md flex flex-col items-center transition-transform duration-300 hover:scale-[1.03] ${
                      darkMode ? "bg-white/5" : "bg-white/80 hover:bg-white"
                    }`}
                  >
                    <h2 className="text-center text-xl font-semibold mb-4">
                      {dayLabel}
                    </h2>
                    <img
                      src={`https://openweathermap.org/img/wn/${info.icon}@4x.png`}
                      alt={info.description}
                      className="w-24 h-24"
                    />
                    <p className="text-4xl font-bold mt-2">
                      {Math.round(info.temp)}°C
                    </p>
                    <p className="capitalize text-lg opacity-80 mb-4">
                      {info.description}
                    </p>
                    <div className="text-sm space-y-1">
                      <p>💧 Humidity: {info.humidity}%</p>
                      <p>🔽 Pressure: {info.pressure} hPa</p>
                      <p>💨 Wind: {info.windSpeed} m/s</p>
                      <p>🌡 Feels like: {Math.round(info.feelsLike)}°C</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
