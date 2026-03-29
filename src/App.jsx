import { useState } from "react";
import "./App.css";
import TaskInput from "./assets/TaskInput";
import OverdueTasks from "./assets/OverdueTasks";
import CompletedTasks from "./assets/CompletedTasks";
import DailyTasks from "./assets/DailyTasks";
import TaskCalendar from "./assets/TaskCalender";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const filteredOverdueTasks = tasks.filter(
    (task) =>
      task.deadline < new Date().toISOString().split("T")[0] && !task.complete,
  );
  const completedTasks = tasks.filter(
    (task) => task.complete === true && task.deadline === selectedDate,
  );

  return (
    <main id='app-shell'>
      <section id='app-header' className='app-panel app-header-panel pad-16'>
        <h1>Task Workspace</h1>
        <p className='app-section-description'>
          タスク管理、日次確認、完了履歴をお手伝いします。
        </p>
      </section>

      <div id='app-layout'>
        <div id='app-left-column' className='app-column'>
          <TaskInput tasks={tasks} setTasks={setTasks} />
        </div>

        <div id='app-center-column' className='app-column'>
          <DailyTasks
            tasks={tasks}
            setTasks={setTasks}
            date={selectedDate}
            setDate={setSelectedDate}
          />

          {filteredOverdueTasks.length > 0 ? (
            <OverdueTasks
              tasks={tasks}
              setTasks={setTasks}
              filteredOverdueTasks={filteredOverdueTasks}
            />
          ) : (
            <section id='overdue-tasks' className='app-panel pad-16'>
              <h2>期限切れタスク一覧</h2>
              <p className='empty-message'>期限切れのtaskがありません</p>
            </section>
          )}

          {completedTasks.length > 0 ? (
            <CompletedTasks
              tasks={tasks}
              setTasks={setTasks}
              completedTasks={completedTasks}
              date={selectedDate}
            />
          ) : (
            <section id='completed-tasks' className='app-panel pad-16'>
              <h2>完了したタスク</h2>
              <p className='empty-message'>完了したtaskがありません</p>
            </section>
          )}
        </div>

        <div id='app-right-column' className='app-column'>
          <div id='calendar-panel' className='app-panel pad-16'>
            <TaskCalendar
              tasks={tasks}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
        </div>
      </div>

      <footer>
        <small>&copy; g-tatemichi.com all right reserved 2026</small>
      </footer>
    </main>
  );
}
