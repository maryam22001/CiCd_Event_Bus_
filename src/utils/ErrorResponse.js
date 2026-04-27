/**For small, repetitive tasks that don't belong to any specific route. These are "pure" functions—they take an input and
 *  give an output without touching the database directly. */

/**
 * async functions , if an error happens, the app will hang or crash unless you use try/catch. Writing try/catch in every controller is repetitive. 
 * We'll use a Util to do it for us.
 */