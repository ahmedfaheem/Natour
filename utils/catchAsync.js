module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch((e) => next(e));
};

// const catchAsync = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch((e) => next(e));
//   };
// };
