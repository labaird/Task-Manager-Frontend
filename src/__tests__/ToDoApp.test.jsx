import React from 'react';
import {render, screen, waitFor, within} from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskManager from '../TaskManager/TaskManager';
import {TaskTable} from "../TaskTable/TaskTable";
import {Task} from "../TaskTable/Task/Task";
import {TaskList} from "../TaskManager/TaskList";
import userEvent from "@testing-library/user-event";
import {TaskListStore} from "../TaskListStore";
import {ListManager} from "../ListManager/ListManager";
import { act } from 'react-dom/test-utils';


function setUpUserEvent(component) {
  return {
    user: userEvent.setup(),
    ...render(component),
  }
}

describe('as a user, I want to add a task', () => {
    let user;

    beforeEach(() => {
        const testDataSource = new TaskList();
        user = setUpUserEvent(
            <TaskManager taskList={testDataSource} />
        ).user;
    });

    test('when successful, task gets added to the task list', async () => {
        const input = screen.getByRole('textbox',{name: 'Add Task'});
        await user.type(input, 'new todo');
        expect(input).toHaveValue('new todo');

        const addTaskButton = screen.getByRole('button', {name: 'Add Task'});
        await user.click(addTaskButton);
        expect(screen.getByDisplayValue('new todo')).toBeInTheDocument();
    });

    test('if the user did not add a description, the Add Task button should be disabled and user cannot add a task', async () => {
        const addTaskButton = screen.getByRole('button', {name: 'Add Task'});

        expect(addTaskButton).toBeDisabled();

        await user.click(addTaskButton);
        expect(screen.queryAllByRole('tablerow')).toEqual([]);
    })
});

describe('as a user, I want to edit a task', () => {
    let user;
    let testTaskDescription;
    let chosenTask;

    beforeEach(() => {
        const testDataSource = new TaskList();
        testTaskDescription = 'description should change';
        testDataSource.addTask(testTaskDescription);
        user = setUpUserEvent(
            <TaskManager taskList={testDataSource} />
        ).user;
        chosenTask = screen.getByDisplayValue(testTaskDescription);
    });

    test('on success, the task description changes', async () => {
        const newText = 'description has changed!';
        const updateButton = screen.getByRole('button', {name: 'Update'});


        await user.clear(chosenTask);
        expect(chosenTask).toHaveValue('');

        await user.type(chosenTask, newText);
        await user.click(updateButton);
        expect(chosenTask).toHaveValue(newText);
    });

    test('if the user leaves the task description blank, the update button should be disabled and a warning message should be displayed', async () => {
        const updateButton = screen.getByRole('button', {name: 'Update'});

        await user.clear(chosenTask);

        expect(updateButton).toBeDisabled();
        expect(screen.getByText('!')).toBeInTheDocument();
    });

    test('if the user only adds spacing to the description, the update button will still be disabled and a warning message should be displayed', async () => {
        const updateButton = screen.getByRole('button', {name: 'Update'});

        await user.clear(chosenTask);
        await user.type(chosenTask, '   ');

        expect(updateButton).toBeDisabled();
        expect(screen.getByText('!')).toBeInTheDocument();
    })
});

describe('as a user, I want to delete a task', () => {
    let user;
    let testTaskDescription = 'task to be deleted';
    let chosenTask;

    beforeEach(() => {
        const testDataSource = new TaskList();
        testDataSource.addTask(testTaskDescription);
        user = setUpUserEvent(
            <TaskManager taskList={testDataSource} />
        ).user;
        chosenTask = screen.queryByDisplayValue(testTaskDescription);
    });

    test('on success, the task no longer exists', async () => {
        const deleteButton = screen.getByRole('button', {name: 'Delete'});

        await user.click(deleteButton);
        expect(chosenTask).not.toBeInTheDocument();
    });
});

test('As a user, I want to add a new list', async () => {
    const taskListStore = new TaskListStore();
    const user = setUpUserEvent(<ListManager taskListStore={taskListStore} />).user;
    const addListInput = screen.getByRole('textbox', {name: 'New List Title'});
    const addListButton = screen.getByRole('button', {name: 'Add New List'});
    expect(screen.queryByText('my new list')).not.toBeInTheDocument();

    await user.type(addListInput, 'my new list');
    await user.click(addListButton);
    expect(addListInput).toHaveDisplayValue('');
    expect(screen.getByText('my new list')).toBeInTheDocument();

    expect(screen.queryByText('my other new list')).not.toBeInTheDocument();

    await user.type(addListInput, 'my other new list');
    await user.click(addListButton);
    expect(addListInput).toHaveDisplayValue('');
    expect(screen.getByText('my other new list')).toBeInTheDocument();

    act(() => {
        taskListStore.addList('my third list');
    });
    await waitFor(() => {screen.getByText('my third list')});
    expect(screen.getByText('my third list')).toBeInTheDocument();

    const duplicateListTitle = 'my other new list';
    await user.type(addListInput, duplicateListTitle);
    await user.click(addListButton);
    expect(screen.getByText(`list called "${duplicateListTitle}" already exists. Please choose a unique name.`)).toBeInTheDocument();
});

test('As a user, I want to add new tasks to each of the lists', async () => {
    const taskListStore = new TaskListStore();
    const user = setUpUserEvent(<ListManager taskListStore={taskListStore} />).user;
    const addListInput = screen.getByRole('textbox', {name: 'New List Title'});
    const addListButton = screen.getByRole('button', {name: 'Add New List'});

    expect(screen.queryByText('my new list')).not.toBeInTheDocument();
    await user.type(addListInput, 'my new list');
    await user.click(addListButton);
    expect(addListInput).toHaveDisplayValue('');
    const firstList = screen.getByText('my new list');
    expect(firstList).toBeInTheDocument();
    const firstListEditButton = within(firstList).getByText('Edit');
    await user.click(firstListEditButton);
    expect(screen.getByText('Task Manager')).toBeInTheDocument();
    const input = screen.getByRole('textbox',{name: 'Add Task'});
    await user.type(input, 'new todo');
    expect(input).toHaveValue('new todo');

    const addTaskButton = screen.getByRole('button', {name: 'Add Task'});
    await user.click(addTaskButton);
    expect(screen.getByDisplayValue('new todo')).toBeInTheDocument();



    const secondList = screen.queryByText('my other new list');
    expect(secondList).not.toBeInTheDocument();
    await user.type(addListInput, 'my other new list');
    await user.click(addListButton);
    expect(addListInput).toHaveDisplayValue('');
    expect(screen.getByText('my other new list')).toBeInTheDocument();

    act(() => {
        taskListStore.addList('my third list');
    });
    await waitFor(() => {screen.getByText('my third list')});
    const thirdList = screen.getByText('my third list');
    expect(thirdList).toBeInTheDocument();
})