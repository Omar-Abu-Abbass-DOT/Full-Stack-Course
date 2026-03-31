# ⚛️ React Hooks: State Management & Side Effects

## 🎯 Project Overview
This project is a comprehensive practice task demonstrating core React hooks (`useState` and `useEffect`), State Lifting, and Conditional Rendering. It features a fully functional local Todo application alongside an API-driven Todo list.

## ✅ Accomplished Lesson Objectives
- **State Management (`useState`):** Built an interactive local Todo list initialized with default values (`["code", "write"]`). Successfully handled input state and array manipulation to add new items dynamically.
- **Side Effects (`useEffect`):** Created a dedicated `<ApiTodos />` component that fetches initial data from the JSONPlaceholder API during the component's mount phase using `fetch`.
- **Component Architecture:** Structured the app cleanly with isolated components (`TodoApp`, `TodoList`, `TodoItem`) and properly lifted state to pass data down via **Props**.
- **Conditional Rendering:** Implemented dynamic UI responses, such as displaying a fallback message when the todo list is empty and showing a loading state while API data is being fetched.
- **UI Enhancements:** Displayed the total count of local todos and applied modern, responsive CSS Grid/Flexbox styling.

task-16_react_hooks_task_Omar_Abu_Abbass/
│
├── index.html            
├── package.json          
├── vite.config.js        
├── README.md             
│
└── src/
    ├── main.jsx          
    ├── App.jsx           
    ├── App.css           
    │
    └── components/       
        ├── TodoApp.jsx    # (لإدارة المهام المحلية)
        ├── TodoList.jsx   # (لعرض القائمة)
        ├── TodoItem.jsx   # (لعرض المهمة الواحدة)
        └── ApiTodos.jsx   # (المكون الجديد لجلب البيانات عبر useEffect)

## 🚀 How to Run Locally
1. Navigate to the project directory in your terminal.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

---
**Developed by:** Omar Abu Abbass