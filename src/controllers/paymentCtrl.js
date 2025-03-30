const  { MercadoPagoConfig, Preference, Payment } =  require("mercadopago");
const dotenv = require("dotenv");
const Foundation = require("../models/Foundation")
dotenv.config();

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// Crear una orden (preferencia)
const createDonation = async (req, res) => {
  const { foundationId, title, amount, description } = req.body;

  try {
    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: 'Donation',
            unit_price: amount,
            quantity: 1,
            title,
          },
        ],
        metadata: {
          foundation_id: foundationId,
          message: description
        },
        back_urls: {
          success: "https://donargg.netlify.app/api/payments/success",
          failure: "https://donargg.netlify.app/api/payments/failure",
          pending: "https://donargg.netlify.app/api/payments/pending",
        },
        notification_url: "https://donargg.netlify.app/api/payments/webhook",
        auto_return: "approved",
      },
    })

    res.json({ success: true, url: preference.init_point });
  } catch (error) {
    console.error("Error al obtener la URL de pago:", error);
    res.status(500).json({ error: error.message });
  }
};

// Recibir el webhook de Mercado Pago
const reciveWebhook = async (req, res) => {
  const body = req.body;

  try {
    // Obtener el pago usando el ID recibido en el webhook
    const payment = await new Payment(client).get({ id: body.data.id });

    const foundationData = payment.metadata;

    const foundation = await Foundation.findById(foundationData.foundation_id);

    if (!foundation) {
      return res.status(400).json({ success: false, message: "No existe una fundación con ese ID." });
    }

    // Formatear la información de la donación
    const donation = {
      status: payment.status,
      amount: payment.transaction_amount,
      title: payment.description,
      description: foundationData.message,
      date: new Date(),
    };


    // Agregar la donación a las transacciones de la fundación
    foundation.allTransactions.push(donation);

    // Actualizar el total recaudado en el campo 'fundsRaised'
    foundation.fundsRaised += payment.transaction_amount;

    // Guardar la fundación con la nueva transacción y el total recaudado actualizado
    await foundation.save();

    return res.status(200).json(foundation);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



const getTransaction = async (req, res) => {
  try {
    const { foundationId } = req.params;

    // Buscar la fundación por ID
    const foundation = await Foundation.findById(foundationId);

    // Verificar si la fundación existe
    if (!foundation) {
      return res.status(404).json({ message: "Fundación no encontrada." });
    }

    // Obtener las transacciones de la fundación (campo allTransactions)
    const transactions = foundation.allTransactions;

    // Calcular el total recaudado sumando los montos de las transacciones
    const totalRaised = transactions.reduce((total, transaction) => total + transaction.amount, 0);

    res.json({
      success: true,
      totalRaised,
      transactions,
    });

  } catch (error) {
    res.status(500).json({ message: "Error al obtener las transacciones", error });
  }
};




module.exports = {
  reciveWebhook,
  createDonation,
  getTransaction
}

