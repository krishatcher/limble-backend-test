import * as mariadb from "mariadb";

function Location(db_context, id, name) {
    this.id = id || 0;
    this.name = name || "";
    this._db_context = db_context || mariadb.createPool("");
}

Location.prototype.lookupLocation = async function() {
    await this.lookupLocation(this.id);
}

Location.prototype.lookupLocation = async function(id){
    const conn = await this._db_context.getConnection();

    try {
        let resultList = await conn.query("SELECT * FROM location WHERE id = ?", [id]);
        let result = resultList[0];

        this.id = result.id;
        this.name = result.name;
    } finally {
        await conn.end();
    }
}

Location.prototype.setName = function(name) {
    this.name = name;
}

Location.prototype.equals = function(otherLocation) {
    return otherLocation.name === this.name;
}

Location.prototype.fill = function(newFields) {
    for (let field in newFields) {
        if (this.hasOwnProperty(field) && newFields.hasOwnProperty(field)) {
            if (this[field] !== 'undefined') {
                this[field] = newFields[field];
            }
        }
    }
};

module.exports = Location;
