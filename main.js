import express from "express";
import connectDB from './config/database.js';
import router from "./routes/routes.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 1235;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'template'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

// **** Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Une erreur est survenue sur le serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée'
    });
});

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Serveur démarré sur http://localhost:${port}`);
        });
    })
    .catch(error => {
        console.error('Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    });

process.on('unhandledRejection', (err) => {
    console.error('Erreur non gérée:', err);
});

export default app;