import TodoItem from "./TodoItem";

const TodoList = ({ todos }) => {
  // Conditional Rendering: رسالة في حال عدم وجود مهام
  if (todos.length === 0) {
    return <p className="empty-msg">No todos available. Add some!</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo, index) => (
        // استخدام index كـ key لأن المهام هنا عبارة عن نصوص بسيطة
        <TodoItem key={index} todo={todo} />
      ))}
    </ul>
  );
};

export default TodoList;