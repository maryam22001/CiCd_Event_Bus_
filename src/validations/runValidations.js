//-add some validations 
/**The Problem: Manual checks become a nightmare as your app grows. If you have 20 fields, you'll have 20 if statements. It's messy and prone to bugs.
The Solution (Yup): Yup is a Schema Builder. You define a "Shape" for your data, and Yup checks the whole object at once. It’s cleaner, faster, and much more powerful. */

//validation > as a filter to ensure data is exactly what the database expects

//10 we dont need the validation runValidations :
/**We don't want the validation logic inside our Controller. We want it in a Middleware so it stops the request before it even reaches the Controller. */

//define the shape of a pipline run 

const yup = require('yup');

// 1. Existing Create Schema
const createRunSchema = yup.object({
  body: yup.object({
    runId: yup.string().required(),
    repo: yup.string().required(),
    branch: yup.string().required(),
    status: yup.string().oneOf(['success', 'failure', 'cancelled', 'in_progress']),
  })
});

// 2. Update Schema (Everything is optional!)
// .partial() makes all fields optional so the user can send only 1 field
const updateRunSchema = yup.object({
  body: yup.object({
    status: yup.string().oneOf(['success', 'failure', 'cancelled', 'in_progress']),
    totalDurationMs: yup.number().positive(),
  }).noUnknown() // Prevents user from sending random garbage fields
});

// 3. ID Schema (Validates the URL parameters)
const idSchema = yup.object({
  params: yup.object({
    id: yup.string().length(24, "Invalid ID format") // MongoDB IDs are 24 chars
  })
});

// 4. The Validation Middleware
const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    }, { abortEarly: false }); // abortEarly: false means it collects ALL errors, not just the first one it finds
    return next();
  } catch (err) {
    err.statusCode = 400; // Set status to 400 Bad Request for validation failures
    return next(err); // Pass it to the global error handler
  }
};

module.exports = { createRunSchema, updateRunSchema, idSchema, validate };
