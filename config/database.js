import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
        throw new Error('La variable d\'environnement MONGODB_URI n\'est pas définie');
    }

    try {
        const connection = await mongoose.connect(mongoURI);

        console.log(`MongoDB connecté à : ${connection.connection.host}`);
        console.log(`Base de données : ${connection.connection.db.databaseName}`);

        const collections = await connection.connection.db.listCollections().toArray();
        console.log('Collections disponibles :');
        collections.forEach(collection => {
            console.log(`- ${collection.name}`);
        });

        const baladesCollection = collections.find(c => c.name === 'balades');
        if (baladesCollection) {
            const count = await connection.connection.db.collection('balades').countDocuments();
            console.log(`Nombre de documents dans la collection 'balades': ${count}`);
        } else {
            console.warn('Attention : La collection "balades" n\'existe pas dans la base de données');
        }

        return connection;
    } catch (error) {
        console.error('Erreur de connexion MongoDB:', error.message);
        throw error;
    }
};

export default connectDB;