import React, {useState} from 'react';

export function AddTaskField (props) {
    const {taskDataSource} = props;
    const [taskDescription, setTaskDescription] = useState('');

    function handleChange (event) {
        setTaskDescription(event.target.value);
    }

    function handleClick () {
        taskDataSource.addTask(taskDescription);
        setTaskDescription('');
    }

    return (
        <div>
            <label htmlFor={'addTaskField'}>Add Task</label>
            <input id={'addTaskField'} onChange={handleChange} type='text' value={taskDescription}></input>
            <button onClick={handleClick} disabled={taskDescription.trim() === ''}>Add Task</button>
        </div>
    );
}
