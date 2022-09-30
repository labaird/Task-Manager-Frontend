import React, {useEffect, useState} from "react";
import styles from './Task.module.css';
import {EditTaskModal} from "./EditTaskModal/EditTaskModal";

export function Task (props) {
    const {taskDataSource, task, setTasks, toggleEditTasksModal, index} = props;
    const {id, desc, isComplete} = task;
    const [taskDescription, setTaskDescription] = useState(desc);

    useEffect(() => {
        setTaskDescription(desc);
    }, [task]);

    const inputIsInvalid = taskDescription.trim() === '';

    function handleStatusClick () {
        taskDataSource.updateTaskStatus(id, !isComplete);
    }

    function handleUpdateClick () {
        taskDataSource.updateTaskDescription(id, taskDescription);
        alert('task updated!');
    }

    function handleChange (event) {
        setTaskDescription(event.target.value);
    }

    function handleDeleteClick () {
        taskDataSource.deleteTask(id);
    }

    return (
        <tr>
            <td className={styles.inputDataCell}>
                <input className={`${styles.taskDescription} ${inputIsInvalid ? styles.error : ''}`} onChange={handleChange} value={taskDescription}></input>
                {inputIsInvalid && <div className={styles.warning}>!</div>}
            </td>
            <td>
                <button onClick={handleStatusClick}>
                    {isComplete ? 'complete' : 'incomplete'}
                </button>
            </td>
            <td>
                <button onClick={handleUpdateClick} disabled={inputIsInvalid}>Update</button>
            </td>
            <td>
                <button onClick={handleDeleteClick} disabled={inputIsInvalid}>Delete</button>
            </td>
        </tr>
    );
}
