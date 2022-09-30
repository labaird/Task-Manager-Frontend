function copyTask(taskObj) {
    const result = {};
    const keys = Object.keys(taskObj);

    for (let i = 0; i < keys.length; i = i + 1) {
        const taskObjValue = taskObj[keys[i]];
        if (typeof taskObjValue === 'object') {
            if (taskObjValue === null) {
                result[keys[i]] = null;
            } else {
                result[keys[i]] = copyTask(taskObjValue);
            }
        } else {
            result[keys[i]] = taskObjValue;
        }
    }

    return result;
}

export class TaskList {
    constructor(title) {
        this.title = title;
        this.tasks = {};
        this.nextId = 0;
    }

    addTask(desc, isComplete = false) {
        if (typeof desc !== 'string' || desc === '') {
            throw new Error(`Task description of [${desc }] is not valid. Please rewrite and try again`);
        }

        if (typeof isComplete !== 'undefined' && typeof isComplete !== 'boolean') {
            throw new Error(`task completion status of [${isComplete }] is not valid. Please try again.`)
        }

        const id = this.nextId
        const newTask = {
            id: id,
            desc: desc,
            isComplete: isComplete,
        }

        this.tasks[id] = newTask;
        this.nextId = id + 1;

        if (this.onTasksChange) {
            this.onTasksChange(this.tasks);
        }

        return newTask;
    }

    updateTaskStatus(id, newStatus) {
        const newTask = copyTask(this.tasks[id]);

        if (this.tasks[id].isComplete !== newStatus) {
            newTask.isComplete = newStatus;
            this.tasks[id] = newTask;
        }

        if (this.onTasksChange) {
            this.onTasksChange(this.tasks);
        }
    }

    updateTaskDescription(id, newDescription) {
        if (typeof newDescription !== 'string' || newDescription === '') {
            throw new Error(`Task description of [${newDescription}] is not valid. Please rewrite and try again`);
        }
        const newTask = copyTask(this.tasks[id]);

        if (newDescription !== newTask.desc) {
            newTask.desc = newDescription;
            this.tasks[id] = newTask;
        }

        if (this.onTasksChange) {
            this.onTasksChange(this.tasks);
        }
    }

    deleteTask(id) {
        const deletedTask = this.tasks[id];

        delete this.tasks[id];

        if (this.onTasksChange) {
            this.onTasksChange(this.tasks);
        }

        return deletedTask;
    }
}