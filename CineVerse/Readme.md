# 🎬 **Aditi’s CineVerse** 🍿

**Aditi’s CineVerse** is a beautifully crafted web app for movie lovers — discover trending films, search any title, and curate your personal watchlist with ease.
Designed with soft pastel tones, subtle animations, and a parallax hero header, it blends cinematic flair with a polished, modern UI.

---

## 📖 **1. Project Description**

**CineVerse** allows users to explore and manage their favorite movies in an interactive, aesthetic environment.
Built entirely with **HTML**, **Tailwind CSS**, and **Vanilla JavaScript**, the app provides a smooth, reactive experience — no frameworks required.

Users can:

* 🔍 **Search** any movie title using the **OMDb API**
* ❤️ **Add** or **Remove** movies from their personal **Watchlist**
* 🧾 **Browse** curated *Popular Now* movies
* 💾 Automatically **save data locally** — your watchlist persists even after refresh
* ⚡ Experience real-time UI updates, including animated toasts and live button toggles

---

## 🛠️ **2. Setup Instructions**

Follow these steps to run the project locally:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/aditigodse10/cineverse.git  
   cd cineverse
   ```

2. **Project Files**

   Ensure your folder has the following structure:

   ```
   cineverse/
   ├── index.html
   ├── styles.css
   ├── script.js
   ```

3. **API Key**

   The app uses the **OMDb API** for movie data.

   * Get your free API key at: [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)
   * Replace the key in `script.js`:

     ```js
     const OMDB_API_KEY = "YOUR_API_KEY_HERE";
     ```

4. **Run Locally**

   * Open `index.html` directly in your browser,
     **or** use a simple local server:

     ```bash
     python3 -m http.server 5500
     ```

   * Then visit 👉 `http://localhost:5500`

---

## 🧪 **3. Running Test Cases**

| Test Case                                   | Expected Result                                |
| ------------------------------------------- | ---------------------------------------------- |
| ✅ Search for valid title (e.g. “Inception”) | Displays accurate results from OMDb            |
| ❌ Search invalid title                      | Shows “No movies found” message                |
| ❤️ Add to Watchlist                         | Movie added and button toggles to “Remove”     |
| 💔 Remove from Watchlist                    | Movie removed and button toggles back to “Add” |
| ❌ Cancel Search                             | Returns to “Popular Now” movie list            |
| 🔁 Refresh page                             | Watchlist persists via localStorage            |

---

## 💡 **4. Assumptions & Design Choices**

* **Design Language:** Pastel *baby pink* & *butter yellow* palette, with soft glassy gradients.
* **Hero Section:** Parallax curtain animation for cinematic feel.
* **UI Interactions:**

  * Real-time Add/Remove state switching
  * Toast notifications for quick feedback
  * Smooth transitions and hover effects
* **Tech Stack:**

  * HTML5
  * Tailwind CSS
  * Vanilla JavaScript
  * OMDb API for movie data
  * LocalStorage for persistence
* **Performance:** Lightweight single-page architecture with debounce search.

---
