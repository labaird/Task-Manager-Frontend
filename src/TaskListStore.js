import {TaskList} from "./TaskManager/TaskList";


export class TaskListStore {
    constructor () {
        this.lists = {};
    }

    addList (listTitle) {
        if (listTitle.trim() === '') {
            throw new Error('list title cannot be blank. Please try again.');
        }

        if (this.lists[listTitle]) {
            throw new Error(`list called "${listTitle}" already exists. Please choose a unique name.`)
        }

        this.lists[listTitle] = new TaskList(listTitle);

        if (this.onChange !== undefined) {
            this.onChange();
        }
    }

    deleteList (listTitle) {
        if (!this.lists[listTitle]) {
            throw new Error (`list called "${listTitle}" does not exist.`)
        }

        delete this.lists[listTitle];

        if (this.onChange !== undefined) {
            this.onChange();
        }
    }
}