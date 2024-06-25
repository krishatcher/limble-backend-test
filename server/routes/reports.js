import express from "express";
import reports from "../controllers/reports.js";

const router = express.Router()

router.get('/reports/laborCostComparison', async (req, res, next) =>  reports.laborCostComparison);


export default router;
