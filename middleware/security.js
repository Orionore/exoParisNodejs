import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    console.log('Headers reçus:', req.headers);
    const authHeader = req.headers['authorization'];
    console.log('Token reçu:', authHeader);

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentification requise' });
    }


    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token décodé:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.log('Erreur de vérification:', error.message);
        return res.status(403).json({ message: 'Token invalide' });
    }
};