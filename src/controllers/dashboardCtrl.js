const Foundation = require("../models/Foundation");

const getFoundation = async (req, res) => {
    try {
        const { id } = req.foundation;
        const foundation = await Foundation.findById(id);

        if (!foundation) {
            return res.status(404).json({ msg: "Fundación no encontrada" });
        }

        let fundsRaised = foundation.allTransactions
        .filter(transaction => transaction.status === "approved") 
        .reduce((total, transaction) => total + transaction.amount, 0);

        // Estructurar la respuesta con solo los campos requeridos
        const responseData = {
            _id: foundation._id,
            foundation_name: foundation.foundation_name,
            profile_url: foundation.profile_url,
            description: foundation.description,
            fundsRaised: fundsRaised || 0,
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
