import Todo from "./Todo";

export default function OverdueTodos({
  todos,
  setTodos,
  filteredOverdueTodos,
}) {
  return (
    <section id='overdue-todos' className='app-panel pad-16'>
      <h2>期限切れタスク一覧</h2>
      <div className='section-scroll-body'>
        <ul className='todo-list'>
          {filteredOverdueTodos.map((todo) => (
            <Todo key={todo.id} todo={todo} todos={todos} setTodos={setTodos} />
          ))}
        </ul>
      </div>
    </section>
  );
}
