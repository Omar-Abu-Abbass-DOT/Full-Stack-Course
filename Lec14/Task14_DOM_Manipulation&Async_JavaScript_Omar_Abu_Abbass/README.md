# DOM Manipulation & Async JavaScript - Bookora - Dynamic SPA Book Store

## Project Overview
This project serves as a comprehensive assignment submission for the **DOM Manipulation & Async JavaScript** lecture. **Bookora** is a dynamic, fully responsive Single Page Application (SPA) that simulates an e-commerce bookstore for developers. It practically demonstrates deep knowledge of DOM tree manipulation, asynchronous data fetching, and state management using purely Vanilla JavaScript (No frameworks).


## 🚀 Key Features & Technical Implementations

* **Asynchronous JavaScript (API & Fallback):**
  * Utilizes `async/await` and `Promises` to handle data fetching smoothly.
  * Implements a robust **Hybrid Fetching Strategy**: Attempts to fetch live data via the ITBook API, but automatically falls back to local Mock Data if the network fails or CORS blocks the request, ensuring 100% uptime.
  * Includes a dynamic loading spinner (`Loader`) to enhance perceived performance during async operations.

* **Advanced DOM Manipulation:**
  * Uses `document.createElement`, `appendChild`, and `innerHTML` to dynamically generate the book grid and shopping cart items.
  * Extensively uses Event Listeners (`click`, `submit`, `keydown`) for user interactions and `e.preventDefault()` for form handling.

* **Single Page Application (SPA) Architecture:**
  * Navigates between features (Store, Cart, Auth Modal) by toggling CSS classes (`.hidden`) via JavaScript, ensuring zero page reloads.

* **Interactive Shopping Cart:**
  * State management utilizing a JavaScript Array to track cart items.
  * Real-time DOM updates: Updates cart badge count, calculates the total price dynamically (parsing string to float), and allows item removal.

* **Extra Features (Bonus):**
  * **Dark/Light Mode:** A seamless theme switcher using CSS variables and `data-theme` attributes, with preferences saved to `localStorage`.
  * **Authentication System:** A simulated Login/Register modal that uses `localStorage` as a mock database, complete with custom JS-based Toast notifications for user feedback.

## 💻 Technologies Used
* **JavaScript (ES6+):** For Async operations, DOM API, LocalStorage, and Event Handling.
* **HTML5:** Semantic structure.
* **CSS3:** Flexbox & CSS Grid for a fully responsive layout, CSS Variables for theming, and custom keyframe animations.

## 📂 Project Structure
```text
Task14_DOM_Manipulation&Async_JavaScript_Omar_Abu_Abbass/
│
├── index.html            # Main SPA layout and structure
├── style.css             # Styling, Layouts, Themes, and Animations
├── script.js             # Async logic, DOM manipulation, Cart & Auth state
│
├── assets/               # Project images and icons
│   └── logo.png          # Brand logo
│
├── preview/              # Media for README documentation
│   ├── light_mode.png    # Full page screenshot (Light Mode)
│   ├── dark_mode.png     # Full page screenshot (Dark Mode)
│   └── demo_video(DRIVE).mp4    # 8-minute presentation video
│
└── README.md             # Project documentation (This file)

Author
Omar Abu Abbass
Junior Developer & IoT Specialist