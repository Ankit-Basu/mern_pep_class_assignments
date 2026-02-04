export const authMiddleware = (req, res, next) => {
  console.log("Auth checked");
  next();
};
