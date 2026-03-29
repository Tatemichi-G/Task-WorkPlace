import Task from "./Task";

export default function DailyTasks({ tasks, setTasks, date, setDate }) {
  const formatDate = (targetDate) => {
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(targetDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (targetDate) => {
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(targetDate.getDate()).padStart(2, "0");
    return `${year}年 ${month}月 ${day}日`;
  };

  const handlePrevDate = () => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - 1);
    setDate(formatDate(currentDate));
  };

  const handleNextDate = () => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + 1);
    setDate(formatDate(currentDate));
  };

  const dailyTasks = tasks.filter(
    (task) => task.deadline === date && !task.complete,
  );
  const displayDate = date ? formatDisplayDate(new Date(date)) : "";

  return (
    <section id='daily-tasks' className='app-panel pad-16'>
      <h2>{displayDate} のタスク</h2>
      <div className='section-scroll-body'>
        <div className='daily-tasks-header'>
          <button className='daily-tasks-nav-button' onClick={handlePrevDate}>
            ＜
          </button>
          <input
            className='daily-tasks-date-input'
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button className='daily-tasks-nav-button' onClick={handleNextDate}>
            ＞
          </button>
        </div>
        <ul className='task-list'>
          {dailyTasks.length > 0 ? (
            dailyTasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                tasks={tasks}
                setTasks={setTasks}
                showStart={true}
              />
            ))
          ) : (
            <p className='empty-message'>本日のタスクはありません</p>
          )}
        </ul>
      </div>
    </section>
  );
}
