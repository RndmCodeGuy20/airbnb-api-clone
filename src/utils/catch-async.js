/**
 * @description - catchAsync is a utility function that wraps the
 * async function and catches any errors thrown by the async function.
 * @param {function} fn
 * @return {(function(*, *, *): void)|*}
 */
export const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    next(error);
  });
};
