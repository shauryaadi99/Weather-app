````markdown
# 🌤️ Weather App

A beautiful, responsive weather app built with React and Tailwind CSS. Supports both light and dark themes, shows weather for today, tomorrow, and the day after, and lets you search or randomize Indian cities with a single click.

![Weather App Screenshot](./public/screenshot.png) <!-- Replace with your actual image path -->

---

## ✨ Features

- 🔍 **Search Weather by City**
- 🎲 **Random Indian City Button**
- 🌗 **Dark / Light Theme Toggle**
- 📆 **3-Day Forecast: Today, Tomorrow, Day After**
- ⏳ **Animated Loading Indicator**
- 📱 **Mobile-Responsive Design**
- 🎨 **Smooth transitions and hover effects**

---

## 🚀 Demo

Try it live here 👉 [Live Demo](https://your-deployment-link.com) <!-- Replace with actual link -->

---

## 🧪 Tech Stack

- ⚛️ **React** – Component-based UI
- 🌬️ **Tailwind CSS** – Modern utility-first CSS
- 📦 **Vite / CRA** – Lightning-fast bundler (specify what you used)
- 🌦️ **OpenWeatherMap API** – Real-time weather data

---

## 🔧 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weather-app.git
   cd weather-app
````

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create a `.env` file in the root directory**

   ```
   REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key
   ```

   > ⚠️ Make sure you **prefix with `REACT_APP_`** if you're using Create React App.
   > For **Vite**, use: `VITE_WEATHER_API_KEY=...`

4. **Run the app**

   ```bash
   npm start
   # or
   yarn dev
   ```

---

## 📸 Screenshots

| Light Mode                        | Dark Mode                       |
| --------------------------------- | ------------------------------- |
| ![Light](./public/light-mode.png) | ![Dark](./public/dark-mode.png) |

---

## 📌 Environment Variables

| Variable                                              | Required | Description                                                        |
| ----------------------------------------------------- | -------- | ------------------------------------------------------------------ |
| `REACT_APP_WEATHER_API_KEY` or `VITE_WEATHER_API_KEY` | ✅        | Your API key from [OpenWeatherMap](https://openweathermap.org/api) |

---

## 🙌 Credits

* Weather data by [OpenWeatherMap](https://openweathermap.org/)
* Icons via [OpenWeatherMap Icon API](https://openweathermap.org/weather-conditions)
* UI powered by [Tailwind CSS](https://tailwindcss.com/)

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 💡 Future Improvements

* Add location-based auto weather
* Support more days forecast
* Internationalize for global users
* Add animations for transitions

---

> Built with 💙 by [Shaurya Aditya Verma](https://github.com/shauryaadi99/)

```

---

Let me know:
- If you're using CRA or Vite (I’ll adjust `.env`/build steps)
- If you'd like badges (build, license, etc.)
- Or if you want help with deployment (e.g., to Vercel, Netlify, etc.)

```
