## **🌤️ My Sunshine ☁️**

**My Sunshine** is a sleek, glassmorphic weather web application that provides real-time weather updates and a 5-day forecast using the **OpenWeatherMap API**. Designed with smooth transitions, soft gradients, and a floating moon animation, this project combines functionality with an elegant user interface.

---

## 📖 **1. Project Description**

**My Sunshine** delivers accurate and up-to-date weather information in a visually captivating way.
Built using **HTML**, **CSS**, and **JavaScript**, the app allows users to:

* Search weather conditions by city name.
* View details such as temperature, humidity, wind speed, and weather type.
* Check a 5-day forecast with smooth animated cards.
  The app is fully responsive and remembers the last searched city using local storage.

---

## 🛠️ **2. Setup Instructions**

Follow these steps to set up and run the project locally:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/aditigodse10/Verto-Challenge/new/main/MySunshine.git
   cd MySunshine
   ```

2. **Get an API Key:**

   * Visit [OpenWeatherMap](https://openweathermap.org/api)
   * Create a free account and generate an **API key**
   * Replace the placeholder in `script.js`:

     ```js
     const API_KEY = "YOUR_API_KEY_HERE";
     ```

3. **Run the App Locally:**

   * Open `index.html` directly in your browser

     ```bash
     open index.html  # macOS/Linux  
     start index.html  # Windows
     ```
   * Or use a simple local server:

     ```bash
     python3 -m http.server 5500
     ```

     Then visit `http://localhost:5500` in your browser.

---

## 🧪 **3. Running Test Cases**

The app is purely front-end based and doesn’t include automated tests.
You can perform manual testing by checking the following cases:

| Test Case                       | Expected Result                       |
| ------------------------------- | ------------------------------------- |
| ✅ Valid city (e.g., “London”)   | Displays current weather and forecast |
| ❌ Invalid city (e.g., “xyzabc”) | Shows an error message gracefully     |
| 🔁 Refresh page                 | Last searched city reappears          |
| 📱 Mobile view                  | Layout remains responsive             |

---

## 💡 **4. Assumptions & Design Choices**

* **Design:** Night-sky inspired theme with glassmorphism and a floating moon animation.
* **Tech Stack:** HTML, CSS, and JavaScript (no external frameworks).
* **API:** Weather data fetched from **OpenWeatherMap API**.
* **Storage:** Browser local storage remembers the last searched city.
* **Error Handling:** Includes retry logic for failed API requests.
* **Goal:** Provide a functional yet aesthetically refined weather dashboard.
