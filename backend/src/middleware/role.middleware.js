// runs after 'protect' middleware, it checks what role the logged-in user has. It blocks user who don't have permission

export const allowRoles = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }
    next() ; 
  };
};
