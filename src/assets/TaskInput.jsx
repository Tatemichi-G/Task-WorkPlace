import { useState } from "react";

export default function TaskInput({ tasks, setTasks }) {
  const createInitialInput = () => ({
    id: Date.now(),
    tag: "",
    task: "",
    deadline: "",
    scheduled_start: "",
    scheduled_end: "",
    start: false,
    started_at: "",
    complete: false,
    completed_at: "",
  });

  const [input, setInput] = useState(createInitialInput);
  const [error, setError] = useState("");

  const handleChange = (e, property) => {
    setInput({ ...input, [property]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input.tag || !input.task || !input.deadline) {
      setError("全ての項目を入力してください");
      return;
    }

    setTasks([...tasks, input]);
    setInput(createInitialInput());
    setError("");
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
    <section id='make-tasks' className='app-panel pad-16'>
      <form id='task-form' onSubmit={(e) => handleSubmit(e)}>
        <h2>タスク作成</h2>
        <p className='task-input-label'>タグを入力</p>
        <input
          className='task-input-field'
          type='text'
          placeholder='タグを入力'
          value={input.tag}
          onChange={(e) => {
            handleChange(e, "tag");
          }}
        />
        <p className='task-input-label'>タスクを入力</p>
        <input
          className='task-input-field'
          type='text'
          placeholder='taskを入力'
          value={input.task}
          onChange={(e) => {
            handleChange(e, "task");
          }}
        />
        <p className='task-input-label'>〆切を入力</p>
        <input
          className='task-input-field'
          type='date'
          placeholder='〆切を入力'
          value={input.deadline}
          onChange={(e) => {
            handleChange(e, "deadline");
          }}
        />

        <p className='task-input-label'>予定時間を入力</p>
        <input
          className='task-input-field'
          type='time'
          placeholder='開始時間を入力'
          value={input.scheduled_start}
          onChange={handleStartTimeChange}
        />
        <input
          className='task-input-field'
          type='time'
          placeholder='終了時間を入力'
          value={input.scheduled_end}
          onChange={(e) =>
            setInput({
              ...input,
              scheduled_end: e.target.value,
            })
          }
        />

        {error && <p className='task-input-error'>{error}</p>}

        <button className='task-submit-button' type='submit'>
          Taskを追加
        </button>
      </form>
    </section>
  );
}
