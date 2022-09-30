import React from "react";
import styles from './TaskTable.module.css';
import {Task} from "./Task/Task";

export function TaskTable(props) {
    let {tasks, setTasks, taskDataSource} = props;

    if (!tasks) {
        tasks = [];
    }

    return (
        <table className={styles.ToDoTable}>
            <thead>
                <tr>
                    <th>Task</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map((task) => {
                    return (
                        <Task taskDataSource={taskDataSource} task={task} setTasks={setTasks} key={task.id} />
                    );
                })}
            </tbody>
        </table>
    );
}