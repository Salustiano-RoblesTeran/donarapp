const Fundation = require("../models/Fundation");

const getFundation = async (req, res) => {
    try {
        const { id } = req.fundation;
        const fundation = await Fundation.findById(id);

        if (!fundation) {
            return res.status(404).json({ msg: "Fundación no encontrada" });
        }

        // Estructurar la respuesta con solo los campos requeridos
        const responseData = {
            fundation_name: fundation.fundation_name,
            profile_url: fundation.profile_url,
            description: fundation.description,
            fundsRaised: fundation.fundsRaised,
            targetAmount: fundation.targetAmount,
            allTransactions: fundation.allTransactions
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
    getFundation
};
