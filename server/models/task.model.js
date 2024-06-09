import * as mariadb from "mariadb";

function Task(db_context, id, description, is_complete, location_id) {
    this.id = id || 0;
    this.description = description || "";
    this.is_complete = is_complete || false;
    this.location_id = location_id || 0;
    this._db_context = db_context || mariadb.createPool("");
}

Task.prototype.lookupTask = async function() {
    await this.lookupTask(this.id);
}

Task.prototype.lookupTask = async function(id) {
    const conn = await this._db_context.getConnection();

    try {
        let resultList = await conn.query("SELECT * FROM tasks WHERE id = ?", [id]);
        let result = resultList[0];
        this.id = result.id;
        this.description = result.description;
        this.is_complete = result.is_complete;
        this.location_id = result.location_id;
    } finally {
        await conn.end();
    }
}

Task.prototype.setComplete = function() {
    this.is_complete = true;
}

Task.prototype.setNotComplete = function() {
    this.is_complete = false;
}

Task.prototype.setDescription = function(description) {
    this.description = description;
}

Task.prototype.setLocation = function(location_id) {
    this.location_id = location_id;

    // TODO: populate a `Location` property...
}

Task.prototype.equals = function(otherTask) {
    return otherTask.description === this.description
        && otherTask.location_id === this.location_id
        && otherTask.is_complete === this.is_complete;
}

Task.prototype.fill = function(newFields) {
    for (let field in newFields) {
        if (this.hasOwnProperty(field) && newFields.hasOwnProperty(field)) {
            if (this[field] !== 'undefined') {
                this[field] = newFields[field];
            }
        }
    }
};

module.exports = Task;
