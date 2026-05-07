const express = require('express');
const router = express.Router();
const{getFlakyStages,getRepoStats,getRepoSummary}=require('../controllers/statsController.js')

// GET /api/stats/flaky 
 router.route('/flaky').get(getFlakyStages);

// GET /api/stats/:repo/summary
router.route('/:repo/summary').get(getRepoSummary);

// GET /api/stats/:repo -
router.route('/:repo').get(getRepoStats);

module.exports = router;