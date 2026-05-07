/**For small, repetitive tasks that don't belong to any specific route. These are "pure" functions—they take an input and
 *  give an output without touching the database directly. */

/**
 * async functions , if an error happens, the app will hang or crash unless you use try/catch. Writing try/catch in every controller is repetitive. 
 * We'll use a Util to do it for us.
 */
//9.add util >> repetitive task >> edit controller adding new util

// Standardized success response
exports.successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// Standardized error response
exports.errorResponse = (res, message = 'Error', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};
