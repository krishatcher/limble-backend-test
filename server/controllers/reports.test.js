const sum = require("./reports.js");

test('A bad value passed to \'sanitizeNumber\' will come back not found', () => {
    let result = sum._sanitizeNumber("not a number");

    expect(result.found).toBe(false);
    expect(result.clean_value).toBe(0);
})

test('A good value passed to \'sanitizeNumber\' will come back found and clean', () => {
    let result = sum._sanitizeNumber("5");

    expect(result.found).toBe(true);
    expect(result.clean_value).toBe(5);
})

test('A clean list passed to \'sanitizeNumberList\' will come back found and clean', () => {
    let result = sum._sanitizeNumberList("5,4,62,5,7,33,745");

    expect(result.found).toBe(true);
    expect(result.clean_list.toString()).toBe([5,4,62,5,7,33,745].toString());
})

test('A mixed list passed to \'sanitizeNumberList\' will come back found and clean', () => {
    let result = sum._sanitizeNumberList("5,4,sffa,62,ffs,5,7,ffa,33,,745");

    expect(result.found).toBe(true);
    expect(result.clean_list.toString()).toBe([5,4,62,5,7,33,745].toString());
})

test('A dirty list passed to \'sanitizeNumberList\' will come back not found', () => {
    let result = sum._sanitizeNumberList("sffa,,ffs,ffa,,");

    expect(result.found).toBe(false);
    expect(result.clean_list.toString()).toBe([].toString());
})

test('The value \'Worker\' passed to \'sanitizeCostComparison\' will come back found and clean', () => {
    let result = sum._sanitizeCostComparison("Worker");

    expect(result.found).toBe(true);
    expect(result.clean_value).toBe("worker");
})

test('The value \'LOCATION\' passed to \'sanitizeCostComparison\' will come back found and clean', () => {
    let result = sum._sanitizeCostComparison("LOCATION");

    expect(result.found).toBe(true);
    expect(result.clean_value).toBe("location");
})

test('The value \'ga0898sgw\' passed to \'sanitizeCostComparison\' will come back found and clean', () => {
    let result = sum._sanitizeCostComparison("ga0898sgw");

    expect(result.found).toBe(false);
    expect(result.clean_value).toBe("");
})

test('The value \'Complete\' passed to \'sanitizeCompletionStatus\' will come back standardized', () => {
    let result = sum._sanitizeCompletionStatus("Complete");
    let expected = Symbol("complete");

    expect(result.toString()).toBe(expected.toString());
})

test('The value \'INCOMPLETE\' passed to \'sanitizeCompletionStatus\' will come back standardized', () => {
    let result = sum._sanitizeCompletionStatus("INCOMPLETE");
    let expected = Symbol("incomplete");

    expect(result.toString()).toBe(expected.toString());
})

test('The value \'wetyyx64342ghg\' passed to \'sanitizeCompletionStatus\' will come back standardized', () => {
    let result = sum._sanitizeCompletionStatus("wetyyx64342ghg");
    let expected = Symbol("both");

    expect(result.toString()).toBe(expected.toString());
})

