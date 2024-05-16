import jwt from 'jsonwebtoken';
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, process.env.VERIFICATION_JWT_SECRET || '', (err, decoded) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate token' });
        }
        req.body.userId = decoded.userId;
        next();
    });
};
export default verifyToken;
