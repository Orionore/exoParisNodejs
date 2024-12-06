import { Router } from 'express';
import {
    getWalkById,
    searchWalks,
    getByArrondissement,
    getSynthesis,
    createWalk,
    updateWalk,
    deleteWalk
} from '../controllers/walkController.js';
import { authenticateToken } from '../middleware/security.js';
import { register, login } from '../controllers/authController.js';

const router = Router();

router.get('/', (req, res) => {
    res.render('../template/home.ejs', { username: 'Utilisateur' });
});

// Routes pour les balades
router.get('/id/:id', getWalkById);
router.get('/search/:search', searchWalks);
router.get('/arrondissement/:num', getByArrondissement);
router.get('/synthese', getSynthesis);
router.get('/addwalk', (req, res) => {
    res.render('newWalk');
})
router.post('/add', authenticateToken, createWalk);
router.put('/update-one/:id', authenticateToken, updateWalk);
router.delete('/delete/:id', authenticateToken, deleteWalk);

router.post('/register', register);
router.post('/login', login);

export default router;