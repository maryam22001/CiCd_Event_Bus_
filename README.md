[Figma Design](https://daily-suite-71815228.figma.site/)

cicd-event-bus-backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── runController.js      
│   │   └── statsController.js     
│   ├── models/
│   │   ├── PipelineRun.js
│   │   └── StageStats.js          
│   ├── routes/
│   │   ├── runRoutes.js
│   │   └── statsRoutes.js         
│   ├── services/
│   │   └── statsService.js        
│   ├── utils/
│   │   └── apiResponse.js
│   ├── validations/
│   │   └── runValidation.js
│   └── app.js
├── server.js
├── .env
└── package.json