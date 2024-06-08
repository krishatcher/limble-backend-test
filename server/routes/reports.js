const express = require('express')
const router = express.Router()

const reports_controller = require("../controllers/reports.js")

router.get('/reports/laborCostComparison', reports_controller.laborCostComparison);

module.exports = router
