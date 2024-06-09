const asyncHandler = require("express-async-handler");
const mariadb = require("mariadb");

let db_context = mariadb.createPool("");

exports.laborCostComparison = asyncHandler(async (req, res) => {
    // required param
    let cost_comparison = _sanitizeCostComparison(req.query.costComparisonBy);
    if (!cost_comparison.found) {
        res.status(400).send("Parameter 'costComparisonBy' required.")
    }

    // optional params
    let completion_status = _sanitizeCompletionStatus(req.query.completionStatus);
    let worker_id_list = _sanitizeNumberList(req.query.workerIdList);
    let location_id_list = _sanitizeNumberList(req.query.locationIdList);

    db_context = req._db_context;
    // TODO: lookup data utilizing the cleaned params

    // TODO: return the result set as JSON
    res.send("NOT IMPLEMENTED: Labor Cost Comparison");
});

exports._sanitizeCostComparison = (dirty_value) => {
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

exports._sanitizeCompletionStatus = (dirty_value) => {
    // optional parameter, default is "both" so we'll set that here
    let clean_value = completionFilter.both;

    if (dirty_value.toLowerCase() === "complete") {
        clean_value = completionFilter.complete;
    } else if (dirty_value.toLowerCase() === "incomplete") {
        clean_value = completionFilter.incomplete;
    }

    return clean_value;
}

exports._sanitizeNumberList = (dirty_value) => {
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

exports._sanitizeNumber = (dirty_value) => {
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
