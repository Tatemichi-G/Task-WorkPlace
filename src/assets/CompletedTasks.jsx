import Task from "./Task";

const formatDisplayDate = (targetDate) => {
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, "0");
  const day = String(targetDate.getDate()).padStart(2, "0");
  return `${year}年 ${month}月 ${day}日`;
};

export default function CompletedTasks({
  tasks,
  setTasks,
  completedTasks,
  date,
}) {
  const displayDate = date ? formatDisplayDate(new Date(date)) : "";

  return (
    <section id='completed-tasks' className='app-panel pad-16'>
      <h2>{displayDate} の完了済</h2>
      <div className='section-scroll-body'>
        <ul className='task-list'>
          {completedTasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              tasks={tasks}
              setTasks={setTasks}
              showCompletedAt={true}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
