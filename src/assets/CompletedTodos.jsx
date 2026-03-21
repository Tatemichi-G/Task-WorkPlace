import Todo from "./Todo";

const formatDisplayDate = (targetDate) => {
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, "0");
  const day = String(targetDate.getDate()).padStart(2, "0");
  return `${year}年 ${month}月 ${day}日`;
};

export default function CompletedTodos({
  todos,
  setTodos,
  completedTodos,
  date,
}) {
  const displayDate = date ? formatDisplayDate(new Date(date)) : "";

  return (
    <section id='completed-todos' className='app-panel pad-16'>
      <h2>{displayDate} の完了済</h2>
      <div className='section-scroll-body'>
        <ul className='todo-list'>
          {completedTodos.map((todo) => (
            <Todo
              key={todo.id}
              todo={todo}
              todos={todos}
              setTodos={setTodos}
              showCompletedAt={true}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
