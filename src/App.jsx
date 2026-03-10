import { useEffect, useState } from "react"

function App() {

  const [mainTask, setmainTask] = useState(() => {
    const saved = localStorage.getItem("tasks");
    console.log("loaded tasks", saved)
    return saved ? JSON.parse(saved) : [];
  });
  const [title, settitle] = useState("")
  const [dueDate, setdueDate] = useState("")
  const [priority, setpriority] = useState("low")
  const [search, setsearch] = useState("")
  const [editIndex, seteditIndex] = useState(null)
  const [filter, setfilter] = useState("All Task")


  // useEffect(() => {
  //   const savedTasks = localStorage.getItem("tasks");
  //   if (savedTasks) {
  //     setmainTask(JSON.parse(savedTasks));
  //   } else {
  //     setmainTask([])
  //   }
  // }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(mainTask));
  }, [mainTask]);

  const submitHandler = (e) => {
    e.preventDefault()

    const newTask = {
      id: Date.now(),
      title,
      dueDate,
      priority,
      completed: false
    };

    const updatedTask = [...mainTask]
    if (editIndex !== null) {
      updatedTask[editIndex] = newTask
      setmainTask(updatedTask)
      seteditIndex(null)
    } else {
      if (title.trim() === "" || dueDate.trim() === "") return;
      setmainTask([...mainTask, newTask])
    }

    settitle("")
    setdueDate("")
    setpriority("low")
  }

  const filterTasks = mainTask.filter((t) => {
    const matchStatus =
      filter === "All Task" ||
      (filter === "Complete" && t.completed) ||
      (filter === "Pending" && !t.completed);

    const matchSearch = search === "" || t.title.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch;
  })

  const handleComplete = (index) => {
    const updatedTask = [...mainTask]
    updatedTask[index].completed = !updatedTask[index].completed
    setmainTask(updatedTask)
  }

  const cancelHandler = (e) => {
    e.preventDefault()
    settitle("")
    setdesc("")
    setdueDate("")
    setpriority("")
  }

  const handleEdit = (index) => {
    const taskToEdit = mainTask[index]
    settitle(taskToEdit.title)
    setdueDate(taskToEdit.dueDate)
    setpriority(taskToEdit.priority)
    seteditIndex(index)
  }

  const deleteTask = (id) => {
    const updatedTask = mainTask.filter(task => task.id !== id)
    setmainTask(updatedTask)
  }

  let renderTask = <h2>No Task Available</h2>
  // const searchTask = mainTask.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))

  // const taskToRender = search.trim() === "" ? filterTasks : searchTask
  const taskToRender = filterTasks

  if (taskToRender.length > 0) {
    renderTask = taskToRender.map((t, i) => {
      return (
        <li key={t.id}>
          <div className="task-item flex justify-between my-2 p-2 rounded-xl bg-gray-100">
            <div className="w-full overflow-hidden flex flex-col gap-2 ">
              <div className="whitespace-nowrap overflow-x-auto [scrollbar-width: none] [&::-webkit-scrollbar]:hidden w-5/6">
                <h3 className={t.completed ? "line-through  text-gray-500 font-medium text-xl" : "font-medium text-xl"}>{t.title}</h3>
              </div>
              <div className="flex gap-4">
                <h4>Due: {t.dueDate}</h4>
                <p>{t.priority} Priority</p>
              </div>
            </div>
            <div className="text-sm flex flex-col justify-around gap-1">
              {!t.completed && (
                <button
                  disabled={t.completed}
                  onClick={() => handleEdit(i)}
                  className="disabled:cursor-not-allowed bg-[#EB7655] px-4 rounded-xl shadow-[2px_2px_2px_0px_rgba(0,0,0,0.8)] active:shadow-[inset_2px_2px_2px_0px_rgba(0,0,0,0.8)]">Edit</button>
              )}
              <button
                onClick={() => deleteTask(t.id)}
                className="bg-[#718CBA] px-4 rounded-xl shadow-[2px_2px_2px_0px_rgba(0,0,0,0.8)] active:shadow-[inset_2px_2px_2px_0px_rgba(0,0,0,0.8)]">Delete</button>

              <button
                onClick={() => handleComplete(i)}
                className={`bg-[#E67B27] px-4 rounded-xl 
                shadow-[2px_2px_2px_0px_rgba(0,0,0,0.8)] 
                active:shadow-[inset_2px_2px_2px_0px_rgba(0,0,0,0.8)]
                ${t.completed ? 'line-through' : ''}`}>{t.completed ? "Completed" : "Complete"}</button>
            </div>
          </div>
        </li>
      )
    })
  }
  return (
    <>
      <main className="container w-screen h-screen" >
        <nav className="navbar w-screen h-16 mb-6 text-black text-2xl font-medium flex items-center justify-between px-10 shadow-[0px_3px_7px_5px_rgba(0,0,0,0.25)]">
          <h1 className="">TaskMaster</h1>
          <button className="px-2 rounded-full shadow-[1px_2px_3px_2px_rgba(0,0,0,0.3)]">B</button>
        </nav>
        <div className="w-screen h-full flex justify-between px-4 ">
          <div className="tasks w-2/5 h-135 shadow-[2px_3px_5px_5px_rgba(0,0,0,0.1)] rounded-2xl flex flex-col gap-2 p-4">
            <input
              className="bg-gray-100 p-2 rounded-xl"
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setsearch(e.target.value)}
            />
            <select
              value={filter}
              onChange={(e) => setfilter(e.target.value)}
              className="bg-gray-100 w-full rounded-lg px-2 py-2">
              <option value='All Task'>All Task</option>
              <option value='Complete'>Complete</option>
              <option value='Pending'>Pending</option>
            </select>
            <hr />
            <div className="task-list overflow-hidden w-full h-full overflow-y-auto [scrollbar-height:0] [&::-webkit-scrollbar]:hidden">
              <ul>
                {renderTask}
              </ul>
            </div>
          </div>
          <div
            className="add-task w-195 h-135 shadow-[2px_3px_5px_5px_rgba(0,0,0,0.1)] rounded-2xl flex flex-col gap-4 p-6">
            <h1 className="text-lg font-bold">Add New Task</h1>
            <div className="input">
              <label className="block">Task Name</label>
              <input
                className="bg-gray-100 w-full h-10 rounded-lg px-2"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => settitle(e.target.value)}
              />
            </div>
            <div className="input">
              <label className="block">Due Date</label>
              <input
                className="bg-gray-100 w-full h-10 rounded-lg px-2"
                type="date"
                placeholder="Due Date"
                value={dueDate}
                onChange={(e) => setdueDate(e.target.value)}
              />
            </div>
            <div className="input">
              <label className="block">Priority</label>
              <select
                className="bg-gray-100 w-full h-10 rounded-lg px-2"
                value={priority}
                onChange={(e) => setpriority(e.target.value)}

              >
                <option value='low'>Low</option>
                <option value='medium'>Medium</option>
                <option value='high'>High</option>
              </select>
            </div>
            <div className="buttons w-full pt-4 text-white flex justify-between align-center gap-4">
              <button
                onClick={submitHandler}
                className="w-1/2 h-12 rounded-xl bg-blue-500 shadow-[2px_2px_2px_0px_rgba(0,0,0,0.8)] active:shadow-[inset_2px_2px_2px_0px_rgba(0,0,0,0.8)]">Add New Task</button>

              <button
                onClick={cancelHandler}
                className="w-1/2 h-12 rounded-xl bg-blue-500 shadow-[2px_2px_2px_0px_rgba(0,0,0,0.8)] active:shadow-[inset_2px_2px_2px_0px_rgba(0,0,0,0.8)] ">Cancel</button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default App
