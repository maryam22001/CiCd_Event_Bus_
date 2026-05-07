const express =require("express")
const router =express.Router()
const {handleWebhook} = require("../controllers/webhookController.js")


router.route('/github').post(handleWebhook)

module.exports=router;