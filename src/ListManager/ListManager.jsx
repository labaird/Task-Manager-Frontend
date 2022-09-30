import {useEffect, useState} from "react";
import TaskManager from "../TaskManager/TaskManager";
import styles from './ListManager.module.css';

export function ListManager (props) {
    const {taskListStore} = props;
    const [rerender, setRerender] = useState(0);
    const [addListTitle, setAddListTitle] = useState('');
    const [error, setError] = useState({
        hasError: false,
        errorMessage: '',
    });
    const [selectedList, setSelectedList] = useState(null);

    useEffect(() => {
        taskListStore.onChange = () => {
            setRerender(rerender + 1);
        };
    }, [taskListStore, rerender, setRerender]);

    function handleChange (event) {
        setAddListTitle(event.target.value);
    }

    function handleClick () {
        if (taskListStore.lists[addListTitle]) {
            setError({
                hasError: true,
                errorMessage: `List called "${addListTitle}" already exists. Please choose a unique name.`
            });
            return;
        }

        if (addListTitle.trim() === '') {
            setError({
                hasError: true,
                errorMessage: 'List title cannot be blank. Please try again.',
            });
            return;
        }

        taskListStore.addList(addListTitle);
        // setListTitle('');
    }

    function handleEditClick (list) {
        setSelectedList(list);
    }

    function handleDeleteClick (listTitle) {
        taskListStore.deleteList(listTitle);
    }

    return (
        <>
            <h1 className={styles.header}>Task Manager</h1>
            <section className={styles.Lists}>
                {error.hasError && <div className={styles.error}>{error.errorMessage}</div>}
                <label htmlFor='New List Title'>New List Title:</label>
                <input onChange={handleChange} id='New List Title' value={addListTitle}></input>
                <button onClick={handleClick}>Add New List</button>
                {Object.keys(taskListStore.lists).map((listTitle) => {
                    return (
                        <div key={listTitle}>
                            {listTitle}
                            <button onClick={() => handleEditClick(taskListStore.lists[listTitle])}>Edit</button>
                            <button onClick={() => handleDeleteClick(listTitle)}>Delete</button>
                        </div>);
                })}
            </section>
            {selectedList && (
                <div className={styles.TaskManagerContainer}>
                    <TaskManager taskList={selectedList} />
                </div>
            )}
        </>
    );
}