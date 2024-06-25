import expressAsyncHandler from "express-async-handler";

let db_context = null;

const laborCostComparison = expressAsyncHandler(async (req, res) => {
    console.info("hit laborCostComparison method");
    // required param
    let cost_comparison = this._sanitizeCostComparison(req.query.costComparisonBy);
    if (!cost_comparison.found) {
        res.status(400).send("Parameter 'costComparisonBy' required.");
        return
    }

    // optional params
    let completion_status = this._sanitizeCompletionStatus(req.query.completionStatus);
    let worker_id_list = this._sanitizeNumberList(req.query.workerIdList);
    let location_id_list = this._sanitizeNumberList(req.query.locationIdList);

    db_context = req._db_context;
    let result = [];

    if (cost_comparison === "worker") {
        // By worker: the total cost of that worker across all tasks and locations

        result = getCostsByWorker(completion_status, worker_id_list.clean_list.join(","), location_id_list.clean_list.join(","));
    } else {
        // `cost_comparison` value has been sanitized, we know it's only one of two possible values
        // By location: the total labor cost for tasks tied to a given location

        result = getCostsByLocation(completion_status, worker_id_list.clean_list.join(","), location_id_list.clean_list.join(","));
    }

    res.status(200).send(JSON.stringify(result));
});

const _sanitizeCostComparison = (dirty_value) => {
    let found = false;
    let clean_value = "";

    if (dirty_value.toLowerCase() === "worker") {
        clean_value = "worker";
        found = true;
    } else if (dirty_value.toLowerCase() === "location") {
        clean_value = "location";
        found = true;
    }

    return {clean_value, found};
}

const _sanitizeCompletionStatus = (dirty_value) => {
    // optional parameter, default is "both" so we'll set that here
    let clean_value = completionFilter.both;

    if (dirty_value.toLowerCase() === "complete") {
        clean_value = completionFilter.complete;
    } else if (dirty_value.toLowerCase() === "incomplete") {
        clean_value = completionFilter.incomplete;
    }

    return clean_value;
}

const _sanitizeNumberList = (dirty_value) => {
    let found = false;
    let clean_list = [];

    if (dirty_value.length > 0 ) {
        let dirty_list = dirty_value.split(",");
        if (dirty_list.length > 0) {
            for (let i = 0; i < dirty_list.length; i++) {
                let result = this._sanitizeNumber(dirty_list[i]);

                if (result.found) {
                    found = result.found;
                    clean_list.push(result.clean_value);
                }
            }
        }
    }

    return {clean_list, found};
}

const _sanitizeNumber = (dirty_value) => {
    let found = false;
    let clean_value = 0;

    if (!isNaN(dirty_value)) {
        if (dirty_value > 0) {
            found = true;
            clean_value = Math.floor(dirty_value);
        }
    }

    return {clean_value, found};
}

const completionFilter = Object.freeze({
    complete:   Symbol("complete"),
    incomplete: Symbol("incomplete"),
    both:       Symbol("both")
})

const getCostsByWorker = async function(completion_status, worker_id_list, location_id_list) {
    const conn = await this._db_context.getConnection();
    let result = [];

    try {
        let query_string = "CALL report_total_cost_by_worker @completion_status='" + completion_status + "', @worker_id_list='" + worker_id_list + "', @location_id_list='" + location_id_list + "';";
        result = await conn.query(query_string);
    } finally {
        await conn.end();
    }

    return result;
}

const getCostsByLocation = async function(completion_status, worker_id_list, location_id_list) {
    const conn = await this._db_context.getConnection();
    let result = [];

    try {
        let query_string = "CALL report_total_cost_by_location @completion_status='" + completion_status + "', @worker_id_list='" + worker_id_list + "', @location_id_list='" + location_id_list + "';";
        result = await conn.query(query_string);
    } finally {
        await conn.end();
    }

    return result;
}

export default {
    laborCostComparison,
    _sanitizeCompletionStatus,
    _sanitizeCostComparison,
    _sanitizeNumber,
    _sanitizeNumberList
};