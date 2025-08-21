import jwt from "jsonwebtoken"

const auth = async (req, res, next) => {
    try {
        // Get token from cookie or authorization header
        let token;
        
        // Check for token in cookies first (more secure)
        if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        } 
        // Fallback to Authorization header
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Legacy support for token in headers.token
        else if (req.headers.token) {
            token = req.headers.token;
        }
        
        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false, 
                message: "Not authorized, no token provided"
            });
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user info to request object
        req.user = { id: decoded.id };
        req.body.userId = decoded.id; // For backward compatibility
        
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expired, please login again"
            });
        }
        
        res.status(401).json({
            success: false,
            message: "Not authorized to access this resource"
        });
    }
};

export { auth };