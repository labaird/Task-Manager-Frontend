import '../App.css';
import {TaskTable} from "../TaskTable/TaskTable";
import {useEffect, useState} from "react";
import {AddTaskField} from "./AddTask/AddTaskField";
import styles from './TaskManager.module.css';

export function TaskManager(props) {
    const {taskList} = props;
    const [tasks, setTasks] = useState(Object.values(taskList.tasks));

    useEffect(() => {
        setTasks(Object.values(taskList.tasks));
    }, [taskList]);
    taskList.onTasksChange = (tasks) => {
        setTasks(Object.values(tasks));
    };

    return (
        <div className={styles.TaskManager}>
            <header className={styles.TaskManagerHeader}>
                <h2>Task Manager</h2>
                <h3>{`Edit "${taskList.title}"`}</h3>
            </header>
            <AddTaskField taskDataSource={taskList}/>
            {tasks.length > 0 && <TaskTable taskDataSource={taskList} tasks={tasks} setTasks={setTasks}/>}
        </div>
    );
}

export default TaskManager;
