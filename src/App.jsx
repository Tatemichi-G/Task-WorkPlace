import { useState } from "react";
import "./App.css";
import TodoInput from "./assets/TodoInput";
import OverdueTodos from "./assets/OverdueTodos";
import CompletedTodos from "./assets/CompletedTodos";
import DailyTasks from "./assets/DailyTasks";
import TaskCalendar from "./assets/TaskCalender";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const filteredOverdueTodos = todos.filter(
    (todo) =>
      todo.deadline < new Date().toISOString().split("T")[0] && !todo.complete,
  );
  const completedTodos = todos.filter(
    (todo) => todo.complete === true && todo.deadline === selectedDate,
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
          <TodoInput todos={todos} setTodos={setTodos} />
        </div>

        <div id='app-center-column' className='app-column'>
          <DailyTasks
            todos={todos}
            setTodos={setTodos}
            date={selectedDate}
            setDate={setSelectedDate}
          />

          {filteredOverdueTodos.length > 0 ? (
            <OverdueTodos
              todos={todos}
              setTodos={setTodos}
              filteredOverdueTodos={filteredOverdueTodos}
            />
          ) : (
            <section id='overdue-todos' className='app-panel pad-16'>
              <h2>期限切れタスク一覧</h2>
              <p className='empty-message'>期限切れのtodoがありません</p>
            </section>
          )}

          {completedTodos.length > 0 ? (
            <CompletedTodos
              todos={todos}
              setTodos={setTodos}
              completedTodos={completedTodos}
              date={selectedDate}
            />
          ) : (
            <section id='completed-todos' className='app-panel pad-16'>
              <h2>完了したTodo</h2>
              <p className='empty-message'>完了したtodoがありません</p>
            </section>
          )}
        </div>

        <div id='app-right-column' className='app-column'>
          <div id='calendar-panel' className='app-panel pad-16'>
            <TaskCalendar
              todos={todos}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
