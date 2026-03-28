import { useState } from 'react';

const ToDoList = () => {

    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    const addTask = () => {
        if (newTask.trim() !== ''){
            setTasks([...tasks,{id:Date.now(),text:newTask,completed:false}]);
            setNewTask('');
        }
    }

    const deleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    }

    const toggleComplete = (taskId) => {
        setTasks(tasks.map(task => task.id === taskId ? {...task, completed:!task.completed}:task))
    }

    return (
        <div>
            <input type="text" value={newTask} onChange = {(e) => setNewTask(e.target.value)}/>
            <button onClick={addTask}>Ajouter</button>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        {task.text}
                        <button onClick={() => deleteTask(task.id)}>x</button>
                        <input type="checkbox" onChange={() => toggleComplete(task.id) }/>
                    </li>
                )

                

                )}
            </ul>
        </div>
    );
};

export default ToDoList;