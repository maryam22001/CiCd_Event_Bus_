//5-the route map the urls to the Controllerfunctions
const express =require ("express");
const router =express.Router();
const { runSchema, validate } = require('../validations/runValidations.js');
const errorHandler = require('../middlewares/errorMiddleware.js');
const requestLogger = require("../middlewares/logger.js");

const{createRun,geyAllRuns,getRunById,updateRun,deleteRun}=require("../controllers/runController.js")

//POST / >create a new run
router.route('/').post(createRun);
router.route('/').get(geyAllRuns);
router.route('/:run_id').get(getRunById);
router.route('/:run_id').patch(updateRun);
router.route('/:run_id').delete(deleteRun);


module.exports=router;
