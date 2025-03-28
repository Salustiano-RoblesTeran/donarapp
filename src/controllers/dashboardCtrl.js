const Foundation = require("../models/Foundation");

const getFoundation = async (req, res) => {
    try {
        const { id } = req.foundation;
        const foundation = await Foundation.findById(id);

        if (!foundation) {
            return res.status(404).json({ msg: "Fundación no encontrada" });
        }

        // Estructurar la respuesta con solo los campos requeridos
        const responseData = {
            foundation_name: foundation.foundation_name,
            profile_url: foundation.profile_url,
            description: foundation.description,
            fundsRaised: foundation.fundsRaised,
            targetAmount: foundation.targetAmount,
            allTransactions: foundation.allTransactions
        };

        return res.json(responseData);

    } catch (error) {
        console.error('Error al obtener la fundación:', error);
        res.status(500).json({
            msg: "Hubo un error al procesar la solicitud"
        });
    }
};


module.exports = {
    getFoundation
};
