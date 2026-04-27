//5-the route map the urls to the Controllerfunctions
const express =require ("express");
const router =express.Router();
const runController= require("../controllers/runController.js")

//POST / >create a new run
router.post('/',runController.createRun)

module.exports=router;
