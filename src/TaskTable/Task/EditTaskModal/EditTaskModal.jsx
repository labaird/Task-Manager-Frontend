import React from "react";
import styles from './EditTaskModal.module.css';

function copyTasks (tasksArray) {
    return tasksArray.map((task) => {
        const {desc, isComplete} = task;

        return {
            desc: desc,
            isComplete: isComplete
        }
    })
}

function updateTasks (tasksArray, taskIndex, taskDesc, taskIsComplete) {
    const newTasks = copyTasks(tasksArray);

    newTasks[taskIndex] = {
        desc: taskDesc,
        isComplete: taskIsComplete
    }

    return newTasks;
}

export function EditTaskModal (props) {
    const {tasks, setTasks, selectedTaskIndex, selectedTaskDescription, setSelectedTaskDescription, selectedTaskIsComplete, setSelectedTaskIsComplete} = props;

    function handleClick () {
        setSelectedTaskIsComplete(!selectedTaskIsComplete);
        setTasks(updateTasks(tasks, selectedTaskIndex, selectedTaskDescription, selectedTaskIsComplete));
    }

    function handleOnChange () {

    }

    return (
        <aside className={styles.EditTaskModal}>
            <header>Edit Task</header>
            <input onChange={handleOnChange} value={selectedTaskDescription} />
            <button onClick={handleClick}>{selectedTaskIsComplete? 'complete' : 'incomplete'}</button>
        </aside>
    );
}