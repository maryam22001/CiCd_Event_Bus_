/**claculate the average duration or faluire rate stage across 1000
 * runs everyy time somne loads  the dashboa will kill the server performance 
 * >>instead: create a "snapshot" document that will update inreamently
 */
/**
 *  Pipline    -------> Raw log      ----> every run is stored here 
 *  StageStats -------> The insight  ----> sm like daily report 
        |
        |
        |
 I want to fetch the on document (stagestat with the avgDuration)

*/

/***
 * ┌──────────────┬────────────┬────────────┬──────────┬──────────────┐
│ Repo         │ Stage Name │ Total Runs │ Failures │ Flaky Score  │
├──────────────┼────────────┼────────────┼──────────┼──────────────┤
│ maryam/app   │ build      │ 100        │ 2        │ 0.02 (2%)    │
│ maryam/app   │ test       │ 100        │ 30       │ 0.30 (30%)   │
└──────────────┴────────────┴────────────┴──────────┴──────────────┘
 * 
 */


const mongoose = require('mongoose');

const StageStatsSchema = new mongoose.Schema({
  repo: { 
    type: String, 
    required: true 
  },
  stage_name: { 
    type: String, 
    required: true 
  },
  
  // Counters
  total_runs: { 
    type: Number, 
    default: 0 
  },
  failure_count: { 
    type: Number, 
    default: 0 
  },
  
  // Calculated metrics
  flakiness_score: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 1
  },
  
  // Duration tracking
  total_duration_ms: {
    type: Number,
    default: 0
  },
  avg_duration_ms: { 
    type: Number, 
    default: 0 
  },
  
  last_updated: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt automatically
});

// Compound unique index: one stats document per repo+stage combination
StageStatsSchema.index({ repo: 1, stage_name: 1 }, { unique: true });

module.exports = mongoose.model('StageStats', StageStatsSchema);