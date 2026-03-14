# ⚛️ React Fundamentals & Component Basics

## 🎯 Project Overview
This project is a practice task demonstrating the core fundamentals of **React.js**. It was built using **Vite** for a fast and optimized development experience. The application showcases the implementation of a Single Page Application (SPA) using reusable functional components, JSX syntax, and dynamic data passing via props.

## ✅ Completed Tasks
1. **Project Setup:** Initialized a modern React environment using Vite (`npm create vite@latest`).
2. **Component Architecture:** Created `<Header />`, `<Footer />`, and `<Card />` inside the `src/components/` folder. All components follow React best practices and naming conventions (Capitalized).
3. **Dynamic Props:** Passed `title` and `image` data dynamically from the parent `App` component to render 3 unique cards using a single reusable `<Card />` component.
4. **Styling & Events:** Applied responsive Flexbox styling for a clean UI, and integrated an `onClick` event handler inside the Card component to demonstrate React event handling (camelCase).

## 📂 Project Structure
```text
Task-15_React_Fundamentals_And_Component_Basics_Omar_Abu_Abbass/
│
├── index.html            # Main HTML file
├── package.json          # Project dependencies
├── vite.config.js        # Vite configuration
├── screenshots/
│   └── react-practice-task_Preview.png  # Project preview image
├── README.md             # Project documentation (This file)
│
└── src/
    ├── main.jsx          # React Entry Point
    ├── App.jsx           # Main Parent Component
    ├── App.css           # Global and Layout Styling
    │
    └── components/       # Reusable UI Components
        ├── Header.jsx  
        ├── Card.jsx    
        └── Footer.jsx

Author
Omar Abu Abbass
Junior Developer & IoT Specialist