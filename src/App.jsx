import { useEffect, useState } from "react";
import "./App.css";
import TaskInput from "./assets/TaskInput";
import OverdueTasks from "./assets/OverdueTasks";
import CompletedTasks from "./assets/CompletedTasks";
import DailyTasks from "./assets/DailyTasks";
import TaskCalendar from "./assets/TaskCalender";
import {
  fetchMe,
  fetchTaskList,
  login,
  logout,
  signup,
} from "./assets/phpApi";

function AuthPanel({ onLoginSuccess }) {
  const [loginMode, setLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (loginMode) {
        const data = await login(email, password);
        onLoginSuccess(data.user);
      } else {
        const data = await signup(email, password);
        setMessage(`${data.message} 続けてログインしてください。`);
        setLoginMode(true);
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id='auth-screen'>
      <section className='auth-card'>
        <div className='auth-card-header'>
          <p className='auth-eyebrow'>TASK WORKPLACE</p>
          <h1>ログインして作業を始める</h1>
          <p className='auth-description'>
            テストユーザーは example@example.com / 123456 です。
          </p>
        </div>

        <div className='auth-tab-row'>
          <button
            className={`auth-tab-button ${loginMode ? "active" : ""}`}
            type='button'
            onClick={() => {
              setLoginMode(true);
              setMessage("");
            }}
          >
            ログイン
          </button>
          <button
            className={`auth-tab-button ${!loginMode ? "active" : ""}`}
            type='button'
            onClick={() => {
              setLoginMode(false);
              setMessage("");
            }}
          >
            新規登録
          </button>
        </div>

        <form className='auth-form-panel' onSubmit={handleSubmit}>
          <label className='auth-field-label' htmlFor='auth-email'>
            メールアドレス
          </label>
          <input
            id='auth-email'
            className='auth-field'
            type='email'
            value={email}
            placeholder='example@example.com'
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className='auth-field-label' htmlFor='auth-password'>
            パスワード
          </label>
          <input
            id='auth-password'
            className='auth-field'
            type='password'
            value={password}
            placeholder='6文字以上で入力'
            onChange={(e) => setPassword(e.target.value)}
          />

          {message && <p className='auth-message'>{message}</p>}

          <button className='auth-submit-button' type='submit' disabled={loading}>
            {loading
              ? "送信中..."
              : loginMode
                ? "ログイン"
                : "アカウントを作成"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [error, setError] = useState("");
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const data = await fetchMe();
        setSession(data.user ?? null);
      } catch (error) {
        setSession(null);
        setError(error.message);
      } finally {
        setLoadingSession(false);
      }
    }

    checkSession();
  }, []);

  useEffect(() => {
    if (!session) {
      setTasks([]);
      return;
    }

    async function loadTasks() {
      try {
        setError("");
        const data = await fetchTaskList();
        setTasks(data.taskList);
      } catch (error) {
        setError(error.message);
      }
    }

    loadTasks();
  }, [session]);

  const handleLoginSuccess = (user) => {
    setSession(user);
    setError("");
  };

  const handleLogout = async () => {
    try {
      await logout();
      setSession(null);
      setTasks([]);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  const filteredOverdueTasks = tasks.filter(
    (task) =>
      task.deadline < new Date().toISOString().split("T")[0] && !task.complete,
  );
  const completedTasks = tasks.filter(
    (task) => task.complete === true && task.deadline === selectedDate,
  );

  if (loadingSession) {
    return (
      <main id='auth-screen'>
        <section className='auth-card auth-loading-card'>
          <div className='auth-card-header'>
            <p className='auth-eyebrow'>TASK WORKPLACE</p>
            <h1>セッションを確認しています</h1>
            <p className='auth-description'>少しだけお待ちください。</p>
          </div>
        </section>
      </main>
    );
  }

  if (!session) {
    return <AuthPanel onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <main id='app-shell'>
      <section id='app-header' className='app-panel app-header-panel pad-16'>
        <div className='app-header-top-row'>
          <div>
            <h1>Task Workspace</h1>
            <p className='app-section-description'>
              タスク管理、日次確認、完了履歴をお手伝いします。
            </p>
          </div>

          <div className='app-session-icon-box'>
            <button
              className='app-session-icon'
              type='button'
              onClick={handleLogout}
              title={`${session?.email} / ログアウト`}
            >
              {(session?.email ?? "T").slice(0, 1).toUpperCase()}
            </button>
            <p className='app-session-caption'>{session?.email}</p>
          </div>
        </div>

        {error && <p className='app-error-message'>{error}</p>}
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
