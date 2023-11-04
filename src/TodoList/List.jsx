import { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../Config/config.axios";
import { debounce } from "lodash";
import { DebounceInput } from "react-debounce-input";

//

const Todolist = () => {
  const [todos, setTodos] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [searchh, setSearchh] = useState("");
  const input = useRef(null);

  const handleChange = (e) => {
    setTaskName(e.target.value);
  };

  // Debouncing
  const debouncedGetTodos = debounce(async (search) => {
    const res = await axiosInstance.get("/todos", {
      params: {
        q: search,
      },
    });
    setTodos(res.data);
  }, 1000);
  //
  const getTodos = async (search) => {
    const res = await axiosInstance.get("/todos", {
      params: {
        q: search,
      },
    });
    setTodos(res.data);
  };

  useEffect(() => {
    debouncedGetTodos(searchh);
  }, [searchh]);

  const handleSearch = (e) => {
    // console.log(e.target);
    setSearchh(e.target.value);
  };
  const handleDelete = async (id) => {
    const res = await axiosInstance.delete(`/todos/${id}`);
    getTodos();
  };
  // const handleEdit = (content) => {};
  const handleDone = async ({ isCompleted, id }) => {
    const res = await axiosInstance.patch(`/todos/${id}`, {
      isCompleted: !isCompleted,
    });
    getTodos();
  };

  const addTask = async (e) => {
    e.preventDefault();
    const res = await axiosInstance.post("/todos", {
      taskName,
      isCompleted: false,
    });
    // console.log(res.data);
    getTodos();
    setTaskName("");
    input.current.focus();
  };

  return (
    <div className="todolist">
      <div className="search" onSubmit={addTask}>
        {/* another Way ************** */}
        {/* <DebounceInput
          minLength={2}
          placeholder="Enter something here..."
          debounceTimeout={500}
          onChange={handleSearch}
          value={searchh}
        /> */}
        <input
          onChange={handleSearch}
          value={searchh}
          type="text"
          placeholder="Search ex: todo 1"
        />
      </div>
      <form className="addTask" onSubmit={addTask}>
        <input
          ref={input}
          value={taskName}
          type="text"
          onChange={handleChange}
          placeholder="Add a task........"
        />
        <button className="addtask-btn">Add Task</button>
      </form>
      <div className="lists">
        {todos?.map((todo, id) => (
          <div
            key={id}
            className={`list ${todo.isCompleted ? "completed" : ""}`}
          >
            <p> {todo.taskName}</p>
            <div className="span-btns">
              {!todo.isCompleted && (
                <span onClick={() => handleDone(todo)} title="completed">
                  ✓
                </span>
              )}
              <span
                className="delete-btn"
                onClick={() => handleDelete(todo.id)}
                title="delete"
              >
                x
              </span>
              <span
                className="edit-btn"
                onClick={() => handleEdit(todo)}
                title="edit"
              >
                ↻
              </span>
            </div>
          </div>
        ))}
        {!todos?.length && <h1>No Records</h1>}
      </div>
    </div>
  );
};

export default Todolist;
