import * as Task from "./task.model.js";
import * as Worker from "./worker.model.js";
import * as mariadb from "mariadb";

function LoggedTime(db_context, id, time_seconds, task_id, worker_id) {
    this.id = id || 0;
    this.time_seconds = time_seconds  || 0;
    this.task_id = task_id || 0;
    this.worker_id = worker_id || 0;
    this._db_context = db_context || mariadb.createPool("");

    this.task = new Task();
    this.worker = new Worker();
}

LoggedTime.prototype.lookupLoggedTime = async function () {
    await this.lookupLoggedTime(this.id);
}

LoggedTime.prototype.lookupLoggedTime = async function(id) {
    const conn = await this._db_context.getConnection();

    try {
        let resultList = await conn.query("SELECT * FROM logged_time WHERE id = ?", [id]);
        let result = resultList[0];

        this.id = result.id;
        this.time_seconds = result.time_seconds;
        this.task_id = result.task_id;
        this.worker_id = result.worker_id;
    } finally {
        await conn.end();
    }

    if (this.task_id != null && this.task_id > 0) await this.task.lookupTask(this.task_id);
    if (this.worker_id != null && this.worker_id > 0) await this.worker.lookupWorker(this.worker_id);
}

LoggedTime.prototype.setTime = function(time) {
    this.time_seconds = time;
}

LoggedTime.prototype.setTask = async function(task_id) {
    this.task_id = task_id;

    if (this.task_id != null && this.task_id > 0) await this.task.lookupTask(this.task_id);
}

LoggedTime.prototype.setWorker = async function(worker_id) {
    this.worker_id = worker_id;

    if (this.worker_id != null && this.worker_id > 0) await this.worker.lookupWorker(this.worker_id);
}

LoggedTime.prototype.equals = function(otherLoggedTime) {
    return otherLoggedTime.time_seconds === this.time_seconds
        && otherLoggedTime.task_id === this.task_id
        && otherLoggedTime.worker_id === this.worker_id;
}

LoggedTime.prototype.fill = function(newFields) {
    for (let field in newFields) {
        if (this.hasOwnProperty(field) && newFields.hasOwnProperty(field)) {
            if (this[field] !== 'undefined') {
                this[field] = newFields[field];
            }
        }
    }
};

module.exports = LoggedTime;
