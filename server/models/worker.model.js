import * as mariadb from "mariadb";

function Worker(db_context, id, username, hourly_wage) {
    this.id = id || null;
    this.username = username || null;
    this.hourly_wage = hourly_wage || null;
    this._db_context = db_context || mariadb.createPool("");
}

Worker.prototype.lookupWorker = async function() {
    await this.lookupWorker(this.id);
}

Worker.prototype.lookupWorker = async function(id) {
    const conn = await this._db_context.getConnection();

    try {
        let resultList = await conn.query("SELECT * FROM workers WHERE id = ?", [id]);
        let result = resultList[0];
        this.id = result.id;
        this.username = result.username;
        this.hourly_wage = result.hourly_wage;
    } finally {
        await conn.end();
    }
}

Worker.prototype.setUsername = function(username) {
    this.username = username;
}

Worker.prototype.setWage = function(hourly_wage) {
    this.hourly_wage = hourly_wage;
}

Worker.prototype.equals = function(otherWorker) {
    return otherWorker.username === this.username
        && otherWorker.hourly_wage === this.hourly_wage;
}

Worker.prototype.fill = function(newFields) {
    for (let field in newFields) {
        if (this.hasOwnProperty(field) && newFields.hasOwnProperty(field)) {
            if (this[field] !== 'undefined') {
                this[field] = newFields[field];
            }
        }
    }
};

module.exports = Worker;
