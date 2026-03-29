import Task from "./Task";

export default function OverdueTasks({
  tasks,
  setTasks,
  filteredOverdueTasks,
}) {
  return (
    <section id='overdue-tasks' className='app-panel pad-16'>
      <h2>期限切れタスク一覧</h2>
      <div className='section-scroll-body'>
        <ul className='task-list'>
          {filteredOverdueTasks.map((task) => (
            <Task key={task.id} task={task} tasks={tasks} setTasks={setTasks} />
          ))}
        </ul>
      </div>
    </section>
  );
}
