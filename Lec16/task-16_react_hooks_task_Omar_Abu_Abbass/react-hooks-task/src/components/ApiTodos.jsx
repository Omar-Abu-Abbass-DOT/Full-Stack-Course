import { useState, useEffect } from "react";

const ApiTodos = () => {
  const [apiTodos, setApiTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // استخدام useEffect لجلب البيانات عند أول تحميل للمكون (مصفوفة فارغة [])
  useEffect(() => {
    // استخدمت limit=5 لكي لا يتم جلب 200 مهمة وتشويه شكل الواجهة
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
      .then((response) => response.json())
      .then((data) => {
        setApiTodos(data);
        setLoading(false); // إيقاف التحميل بعد وصول البيانات
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="todo-section api-todos">
      <h2>🌐 Initial Todos (from API)</h2>
      
      {loading ? (
        <p className="loading-msg">Loading API data...</p>
      ) : (
        <ul className="todo-list">
          {apiTodos.map((todo) => (
            <li key={todo.id} className="todo-item api-item">
              {todo.title} {todo.completed ? "✅" : "⏳"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApiTodos;