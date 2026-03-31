import { useState } from "react";
import TodoList from "./TodoList";

const TodoApp = () => {
  // 1. تعريف State للمهام بقيمة ابتدائية كما هو مطلوب
  const [todos, setTodos] = useState(["code", "write"]);
  
  // 2. تعريف State لتخزين قيمة حقل الإدخال
  const [inputValue, setInputValue] = useState("");

  // دالة لإضافة مهمة جديدة
  const handleAddTodo = () => {
    if (inputValue.trim() !== "") {
      // تحديث المصفوفة بإضافة المهمة الجديدة مع الاحتفاظ بالقديمة
      setTodos([...todos, inputValue]);
      setInputValue(""); // تفريغ الحقل بعد الإضافة
    }
  };

  return (
    <div className="todo-section local-todos">
      <h2>📝 My Local Todos</h2>
      
      {/* عرض العدد الإجمالي للمهام */}
      <p className="todo-count">Total Todos: <strong>{todos.length}</strong></p>

      <div className="input-group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button onClick={handleAddTodo} className="add-btn">Add Todo</button>
      </div>

      {/* تمرير state كـ props للمكون الابن */}
      <TodoList todos={todos} />
    </div>
  );
};

export default TodoApp;