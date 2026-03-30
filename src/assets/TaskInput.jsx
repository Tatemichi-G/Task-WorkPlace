import { useState } from "react";
import { createTask } from "./phpApi";

export default function TaskInput({ tasks, setTasks }) {
  const createInitialInput = () => ({
    tag: "",
    task: "",
    deadline: "",
    scheduled_start: "",
    scheduled_end: "",
  });

  const [input, setInput] = useState(createInitialInput());
  const [error, setError] = useState("");

  const handleChange = (e, property) => {
    setInput({ ...input, [property]: e.target.value });
  };

  const addTask = async () => {
    try {
      const data = await createTask({
        tag: input.tag,
        task: input.task,
        deadline: input.deadline,
        scheduled_start: input.scheduled_start,
        scheduled_end: input.scheduled_end,
      });

      setTasks((current) => [...current, data.task]);
      setInput(createInitialInput());
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // PHP側に合わせて、必須なのは task と deadline だけにする。
    if (!input.task || !input.deadline) {
      setError("タスクと期日を入力してください");
      return;
    }

    await addTask();
  };

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;

    setInput({
      ...input,
      scheduled_start: newStartTime,
      scheduled_end: input.scheduled_end || newStartTime,
    });
  };

  return (
    <section id="make-tasks" className="app-panel pad-16">
      <form id="task-form" onSubmit={handleSubmit}>
        <h2>タスク作成</h2>
        <p className="task-input-label">タグを入力</p>
        <input
          className="task-input-field"
          type="text"
          placeholder="タグを入力"
          value={input.tag}
          onChange={(e) => {
            handleChange(e, "tag");
          }}
        />
        <p className="task-input-label">タスクを入力</p>
        <input
          className="task-input-field"
          type="text"
          placeholder="taskを入力"
          value={input.task}
          onChange={(e) => {
            handleChange(e, "task");
          }}
        />
        <p className="task-input-label">〆切を入力</p>
        <input
          className="task-input-field"
          type="date"
          placeholder="〆切を入力"
          value={input.deadline}
          onChange={(e) => {
            handleChange(e, "deadline");
          }}
        />

        <p className="task-input-label">予定時間を入力</p>
        <input
          className="task-input-field"
          type="time"
          placeholder="開始時間を入力"
          value={input.scheduled_start}
          onChange={handleStartTimeChange}
        />
        <input
          className="task-input-field"
          type="time"
          placeholder="終了時間を入力"
          value={input.scheduled_end}
          onChange={(e) =>
            setInput({
              ...input,
              scheduled_end: e.target.value,
            })
          }
        />

        {error && <p className="task-input-error">{error}</p>}

        <button className="task-submit-button" type="submit">
          Taskを追加
        </button>
      </form>
    </section>
  );
}
