import mongoose from 'mongoose';

const walkSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    arrondissement: { type: Number, required: true },
    texte_intro: { type: String, required: true },
    date_publication: { type: Date, default: Date.now }
}, { collection: 'balades' });

const Walk = mongoose.model('Walk', walkSchema);

export const getWalkById = async (req, res) => {
    try {
        const walk = await Walk.findById(req.params.id);
        if (!walk) {
            return res.status(404).json({ message: 'Balade non trouvée' });
        }
        res.json(walk);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const searchWalks = async (req, res) => {
    try {
        const searchTerm = req.params.search;
        const walks = await Walk.find({
            $or: [
                { nom: { $regex: searchTerm, $options: 'i' } },
                { texte_intro: { $regex: searchTerm, $options: 'i' } }
            ]
        });
        res.json(walks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getByArrondissement = async (req, res) => {
    try {
        const num = parseInt(req.params.num);
        const walks = await Walk.find({ arrondissement: num });
        res.json(walks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSynthesis = async (req, res) => {
    try {
        console.log('Attempting to fetch walks...');
        const walks = await Walk.find({});
        console.log('Walks fetched:', walks);
        res.json(walks);
    } catch (error) {
        console.error('Error in getSynthesis:', error);
        res.status(500).json({ message: error.message });
    }
};

export const createWalk = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'Authentification requise' });
        }

        const walk = new Walk(req.body);
        const savedWalk = await walk.save();
        res.status(201).json(savedWalk);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateWalk = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'Authentification requise' });
        }

        const updatedWalk = await Walk.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedWalk);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteWalk = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'Authentification requise' });
        }

        await Walk.findByIdAndDelete(req.params.id);
        res.json({ message: 'Balade supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};