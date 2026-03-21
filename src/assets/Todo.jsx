import { useState } from "react";

export default function Todo({
  todo,
  todos,
  setTodos,
  showCompletedAt,
  showStart,
}) {
  const [changeMode, setChangeMode] = useState(null);

  const [changeProperty, setChangeProperty] = useState({
    todo: "",
    deadline: "",
    complete: false,
    scheduled_start: "",
    scheduled_end: "",
  });

  /* 元々タグとタイトルだけだったけど、開始・終了時刻も変更できるようにするため、配列展開で渡す形に変える。
  const handleChangeTodo = (id, property, value, property2, value2) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        if (property2) {
          return { ...todo, [property]: value, [property2]: value2 };
        }
        return { ...todo, [property]: value };
      }
      return todo;
    });
    */

  const handleChangeTodo = (id, updates) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, ...updates };
      }
      return todo;
    });
    setTodos(newTodos);

    // console.log(newTodos);
    // console.log(Array.isArray(newTodos));

    /* ！！！重要！！！
todosの中身は配列
[
  { id: 〇〇, todo: "〇〇", deadline: "〇〇〇〇-〇〇-〇〇", complete: false },
  { id: 〇〇, todo: "〇〇", deadline: "〇〇〇〇-〇〇-〇〇", complete: false },
  { id: 〇〇, todo: "〇〇", deadline: "〇〇〇〇-〇〇-〇〇", complete: false },
]  

newTodosの中身も配列
[
  { id: 〇〇, todo: "〇〇", deadline: "〇〇〇〇-〇〇-〇〇", complete: false }
]
違うのは、map() の中で該当する1件だけ更新された「新しい配列」になっていること。
配列対配列なのでそのままsetTodos(newTodos)で更新できる。

setTodos({ ...todos, newTodos }) だと、
配列をオブジェクトとして展開してしまって、
{
  0: {...},
  1: {...},
  newTodos: [...]
}
オブジェクト対配列になってしまうから壊れる。
*/

    setChangeProperty({
      todo: "",
      deadline: "",
      complete: false,
      scheduled_start: "",
      scheduled_end: "",
    });
    setChangeMode(null);
  };

  const handleChangeMode = (id) => {
    // setChangeMode(id === changeMode ? null : id);
    if (id === changeMode) {
      setChangeMode(null);
      setChangeProperty({
        todo: "",
        deadline: "",
        complete: false,
        scheduled_start: "",
        scheduled_end: "",
      });
      return;
    }

    setChangeMode(id);
    setChangeProperty({
      todo: todo.todo,
      deadline: todo.deadline,
      complete: todo.complete,
      scheduled_start: todo.scheduled_start || "",
      scheduled_end: todo.scheduled_end || "",
    });
  };

  const handleStartToggle = () => {
    if (!todo.start) {
      handleChangeTodo(todo.id, {
        start: true,
        started_at: new Date().toLocaleString(),
      });
    } else {
      handleChangeTodo(todo.id, { start: false, scheduled_start: "" });
    }
  };

  const handleChangeDelete = (todo) => {
    const newTodos = todos.filter((target) => target.id !== todo.id);
    setTodos(newTodos);
  };

  return (
    <>
      <li className='todo-item'>
        <div className='todo-main-row'>
          <input
            type='checkbox'
            className='todo-checkbox'
            checked={todo.complete}
            onChange={() => {
              handleChangeTodo(todo.id, {
                complete: !todo.complete,
                completed_at: !todo.complete ? new Date().toLocaleString() : "",
              });
            }}
          />

          <h4 className='todo-title'>{todo.todo}</h4>
          <p className='todo-tag'>{todo.tag}</p>
          {showStart ? (
            <button
              className='todo-status-button'
              onClick={() => handleStartToggle()}
            >
              {todo.start ? "着手中" : "未着手"}
            </button>
          ) : (
            <p className='todo-meta-text'>
              {showCompletedAt ? todo.completed_at : todo.deadline}
            </p>
          )}
          <div className='todo-action-group'>
            <button
              className='todo-edit-button'
              onClick={() => handleChangeMode(todo.id)}
            >
              編集
            </button>
            <button
              className='todo-delete-button'
              onClick={() => handleChangeDelete(todo)}
            >
              削除
            </button>
          </div>
        </div>

        {changeMode === todo.id && (
          <div className='todo-edit-row'>
            <input
              className='todo-edit-input'
              type='text'
              value={changeProperty.todo}
              onChange={(e) =>
                setChangeProperty({
                  ...changeProperty,
                  todo: e.target.value,
                })
              }
            />
            <input
              className='todo-edit-input'
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
              className='todo-edit-input'
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
              className='todo-edit-input'
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
                // 変更されたプロパティだけをupdatesオブジェクトに追加 空の値で上書きを防ぐ
                if (changeProperty.todo) {
                  updates.todo = changeProperty.todo;
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

                handleChangeTodo(todo.id, updates);
              }}
              className='todo-save-button'
            >
              保存
            </button>
          </div>
        )}
      </li>
    </>
  );
}
