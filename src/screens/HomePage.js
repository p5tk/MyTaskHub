import React, { useState, useEffect, useRef } from "react";
import {
  FaCircle,
  FaCheckCircle,
  FaCheckDouble,
  FaTimes,
  FaEdit,
} from "react-icons/fa";
import dayjs from "dayjs";

const HomePage = () => {
  const [todos, setTodos] = useState(
    JSON.parse(localStorage.getItem("todos")) || []
  );
  const [todoText, setTodoText] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editableText, setEditableText] = useState("");
  const remainingTasks = todos.filter((todo) => !todo.completed).length;
  const [filter, setFilter] = useState(localStorage.getItem("filter") || "all");
  const [hasCompletedTasks, setHasCompletedTasks] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
    const hasCompleted = todos.some((todo) => todo.completed);
    setHasCompletedTasks(hasCompleted);
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("filter", filter);
  }, [filter]);

  const addTodo = () => {
    if (todoText.trim() !== "") {
      setTodos([
        ...todos,
        { text: todoText, completed: false, color: getRandomColor() },
      ]);
      setTodoText("");
    }
  };

  const deleteTodo = (index) => {
    const updatedTodos = [...todos];
    updatedTodos.splice(index, 1);
    setTodos(updatedTodos);
  };

  const editTodo = (index) => {
    setEditIndex(index);
    setEditableText(todos[index].text);
  };

  const saveEditedTodo = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].text = editableText;
    setTodos(updatedTodos);
    setEditIndex(null);
  };

  const toggleComplete = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
  };

  const toggleSelectAll = () => {
    // Check if all tasks are already completed
    const allCompleted = todos.every((todo) => todo.completed);

    const updatedTodos = todos.map((todo) => ({
      ...todo,
      completed: !allCompleted,
    }));

    setTodos(updatedTodos);
  };

  //handle enter key event for task input
  const handleInputKeyPress = (index, event) => {
    if (event.key === "Enter") {
      saveEditedTodo(index);
    }
  };

  const clearCompletedTasks = () => {
    const remainingTasks = todos.filter((todo) => !todo.completed);
    setTodos(remainingTasks);
  };

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  return (
    <div
      className="h-screen pt-16 px-4"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="md:w-1/2 mx-auto">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">MyTaskHub</h1>
          <p className="font-bold">{dayjs().format("DD.MM.YYYY (ddd)")}</p>
        </div>
      </div>
      <div className="md:w-4/5 lg:w-1/2 mx-auto shadow-lg">
        <div className="flex items-center bg-white border-2">
          {todos.length > 0 && (
            <FaCheckDouble
              color="black"
              className={`ml-5 ${
                todos.every((todo) => todo.completed) ? "text-blue-500" : ""
              }`}
              onClick={toggleSelectAll}
            />
          )}
          <input
            type="text"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            placeholder="What needs to be done?"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTodo();
              }
            }}
            className="pl-5 border-2 flex-1 py-4 outline-none border-none"
          />
        </div>

        {todos.length > 0 && (
          <ul
            className="h-[25rem] overflow-y-scroll scrollbar-hide bg-white"
            style={{ scrollbarWidth: "none" }}
          >
            {todos
              .filter((todo) => {
                if (filter === "completed") {
                  return todo.completed;
                } else if (filter === "remaining") {
                  return !todo.completed;
                }
                return true;
              })
              .map((todo, index) => (
                <li key={index}>
                  <div className="flex flex-row items-center justify-between bg-white py-4 pr-4 group border-2">
                    <div className="flex flex-1 items-center">
                      <div
                        onClick={() => toggleComplete(index)}
                        className="pr-4 flex items-center"
                      >
                        <div
                          style={{ backgroundColor: todo.color }}
                          className="w-1 mr-4"
                        >
                          &nbsp;
                        </div>
                        {todo.completed ? (
                          <FaCheckCircle size={20} color="#9dbb32" />
                        ) : (
                          <FaCircle size={20} color="#9dbb32" />
                        )}
                      </div>
                      {editIndex === index ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editableText}
                          onChange={(e) => setEditableText(e.target.value)}
                          onBlur={() => saveEditedTodo(index)}
                          onKeyPress={(e) => handleInputKeyPress(index, e)}
                          autoFocus
                          className="outline-none flex-1"
                        />
                      ) : todo.completed ? (
                        <s>{todo.text}</s>
                      ) : (
                        <span>{todo.text}</span>
                      )}
                    </div>

                    <div
                      className={`flex space-x-4 py-1 px-2 rounded-md group-hover:opacity-100 group-hover:visible opacity-0 invisible transition-opacity ease-in-out duration-300`}
                    >
                      <FaEdit onClick={() => editTodo(index)} />
                      <FaTimes onClick={() => deleteTodo(index)} />
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        )}
        {todos.length > 0 && (
          <div className="bg-lightblue flex flex-col md:flex-row items-center justify-between py-4 px-8">
            <p>
              <span className="font-bold">{remainingTasks}</span> items left
            </p>
            <div className="flex-grow flex justify-center mb-2 md:mb-0">
              <button
                className={`mx-2 ${
                  filter === "all" ? "text-blue-500 underline" : ""
                }`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`mx-2 ${
                  filter === "completed" ? "text-blue-500 underline" : ""
                }`}
                onClick={() => setFilter("completed")}
              >
                Completed
              </button>
              <button
                className={`mx-2 ${
                  filter === "remaining" ? "text-blue-500 underline" : ""
                }`}
                onClick={() => setFilter("remaining")}
              >
                Remaining
              </button>
            </div>
            <div className="w-full md:w-32">
              {hasCompletedTasks && (
                <button
                  className="w-full md:ml-auto"
                  onClick={clearCompletedTasks}
                >
                  Clear Completed
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
