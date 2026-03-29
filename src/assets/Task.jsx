import { useState } from "react";

export default function Task({
  task,
  tasks,
  setTasks,
  showCompletedAt,
  showStart,
}) {
  const [changeMode, setChangeMode] = useState(null);

  const [changeProperty, setChangeProperty] = useState({
    task: "",
    deadline: "",
    complete: false,
    scheduled_start: "",
    scheduled_end: "",
  });

  const resetChangeProperty = () => {
    setChangeProperty({
      task: "",
      deadline: "",
      complete: false,
      scheduled_start: "",
      scheduled_end: "",
    });
  };

  const handleChangeTask = (id, updates) => {
    const newTasks = tasks.map((currentTask) => {
      if (currentTask.id === id) {
        return { ...currentTask, ...updates };
      }
      return currentTask;
    });

    setTasks(newTasks);
    resetChangeProperty();
    setChangeMode(null);
  };

  const handleChangeMode = (id) => {
    if (id === changeMode) {
      setChangeMode(null);
      resetChangeProperty();
      return;
    }

    setChangeMode(id);
    setChangeProperty({
      task: task.task,
      deadline: task.deadline,
      complete: task.complete,
      scheduled_start: task.scheduled_start || "",
      scheduled_end: task.scheduled_end || "",
    });
  };

  const handleStartToggle = () => {
    if (!task.start) {
      handleChangeTask(task.id, {
        start: true,
        started_at: new Date().toLocaleString(),
      });
    } else {
      handleChangeTask(task.id, { start: false, scheduled_start: "" });
    }
  };

  const handleChangeDelete = (targetTask) => {
    const newTasks = tasks.filter((currentTask) => currentTask.id !== targetTask.id);
    setTasks(newTasks);
  };

  return (
    <li className='task-item'>
      <div className='task-main-row'>
        <input
          type='checkbox'
          className='task-checkbox'
          checked={task.complete}
          onChange={() => {
            handleChangeTask(task.id, {
              complete: !task.complete,
              completed_at: !task.complete ? new Date().toLocaleString() : "",
            });
          }}
        />

        <h4 className='task-title'>{task.task}</h4>
        <p className='task-tag'>{task.tag}</p>
        {showStart ? (
          <button
            className='task-status-button'
            onClick={() => handleStartToggle()}
          >
            {task.start ? "着手中" : "未着手"}
          </button>
        ) : (
          <p className='task-meta-text'>
            {showCompletedAt ? task.completed_at : task.deadline}
          </p>
        )}
        <div className='task-action-group'>
          <button
            className='task-edit-button'
            onClick={() => handleChangeMode(task.id)}
          >
            編集
          </button>
          <button
            className='task-delete-button'
            onClick={() => handleChangeDelete(task)}
          >
            削除
          </button>
        </div>
      </div>

      {changeMode === task.id && (
        <div className='task-edit-row'>
          <input
            className='task-edit-input'
            type='text'
            value={changeProperty.task}
            onChange={(e) =>
              setChangeProperty({
                ...changeProperty,
                task: e.target.value,
              })
            }
          />
          <input
            className='task-edit-input'
            type='date'
            value={changeProperty.deadline}
            onChange={(e) =>
              setChangeProperty({
                ...changeProperty,
                deadline: e.target.value,
              })
            }
          />
          <input
            className='task-edit-input'
            type='time'
            value={changeProperty.scheduled_start}
            onChange={(e) =>
              setChangeProperty({
                ...changeProperty,
                scheduled_start: e.target.value,
              })
            }
          />
          <input
            className='task-edit-input'
            type='time'
            value={changeProperty.scheduled_end}
            onChange={(e) =>
              setChangeProperty({
                ...changeProperty,
                scheduled_end: e.target.value,
              })
            }
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              const updates = {};

              if (changeProperty.task) {
                updates.task = changeProperty.task;
              }

              if (changeProperty.deadline) {
                updates.deadline = changeProperty.deadline;
              }

              if (changeProperty.scheduled_start) {
                updates.scheduled_start = changeProperty.scheduled_start;
              }

              if (changeProperty.scheduled_end) {
                updates.scheduled_end = changeProperty.scheduled_end;
              }

              if (Object.keys(updates).length === 0) {
                return;
              }

              handleChangeTask(task.id, updates);
            }}
            className='task-save-button'
          >
            保存
          </button>
        </div>
      )}
    </li>
  );
}
