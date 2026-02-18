const isProvider = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.role !== "provider") {
        return res.status(403).json({ message: "Access denied: Providers only" });
    }
    next();
};

export default isProvider;