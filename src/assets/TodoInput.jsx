import { useState } from "react";

export default function TodoInput({ todos, setTodos }) {
  const [input, setInput] = useState({
    id: "",
    tag: "",
    todo: "",
    deadline: "",
    scheduled_start: "",
    scheduled_end: "",
    start: false,
    started_at: "",
    complete: false,
    completed_at: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e, property) => {
    setInput({ ...input, [property]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input.tag || !input.todo || !input.deadline) {
      setError("全ての項目を入力してください");
      return;
    }

    setTodos([...todos, input]);
    setInput({
      id: Date.now(),
      tag: "",
      todo: "",
      deadline: "",
      scheduled_start: "",
      scheduled_end: "",
      start: false,
      started_at: "",
      complete: false,
      completed_at: "",
    });
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
    <section id='make-todos' className='app-panel pad-16'>
      <form id='todo-form' onSubmit={(e) => handleSubmit(e)}>
        <h2>Todo作成</h2>
        <p className='todo-input-label'>タグを入力</p>
        <input
          className='todo-input-field'
          type='text'
          placeholder='タグを入力'
          value={input.tag}
          onChange={(e) => {
            handleChange(e, "tag");
          }}
        />
        <p className='todo-input-label'>todoを入力</p>
        <input
          className='todo-input-field'
          type='text'
          placeholder='todoを入力'
          value={input.todo}
          onChange={(e) => {
            handleChange(e, "todo");
          }}
        />
        <p className='todo-input-label'>〆切を入力</p>
        <input
          className='todo-input-field'
          type='date'
          placeholder='〆切を入力'
          value={input.deadline}
          onChange={(e) => {
            handleChange(e, "deadline");
          }}
        />

        <p className='todo-input-label'>予定時間を入力</p>
        <input
          className='todo-input-field'
          type='time'
          placeholder='開始時間を入力'
          value={input.scheduled_start}
          onChange={handleStartTimeChange}
        />
        <input
          className='todo-input-field'
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

        {error && <p className='todo-input-error'>{error}</p>}

        <button className='todo-submit-button' type='submit'>
          Todoを追加
        </button>

        {/* <p>確認用</p>
        <pre
          style={{
            border: "1px solid gray",
            height: 200,
            width: 300,
            whiteSpace: "pre-wrap",
          }}
        >
          {input.tag} /{input.todo} /{input.deadline} / todo配列：{todos.length}
        </pre> */}
      </form>
    </section>
  );
}
