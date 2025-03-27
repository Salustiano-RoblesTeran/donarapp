const  { MercadoPagoConfig, Preference, Payment } =  require("mercadopago");
const dotenv = require("dotenv");
const Fundation = require("../models/Fundation")
dotenv.config();

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// Crear una orden (preferencia)
const createDonation = async (req, res) => {
  const { fundationId, title, amount, description } = req.body;

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
          fundation_id: fundationId,
          message: description
        },
        back_urls: {
          success: "http://localhost:3000/api/payments/success",
          failure: "http://localhost:3000/api/payments/failure",
          pending: "http://localhost:3000/api/payments/pending",
        },
        notification_url: "https://7ead-138-204-159-142.ngrok-free.app/api/payments/webhook",
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

    const fundationData = payment.metadata;
    console.log(fundationData.fundation_id, payment.transaction_amount, fundationData.message);

    const fundation = await Fundation.findById(fundationData.fundation_id);

    if (!fundation) {
      return res.status(400).json({ success: false, message: "No existe una fundación con ese ID." });
    }

    // Formatear la información de la donación
    const donation = {
      status: payment.status,
      amount: payment.transaction_amount,
      title: payment.description,
      description: fundationData.message,
      date: new Date(),
    };

    console.log("donation", donation);

    // Agregar la donación a las transacciones de la fundación
    fundation.allTransactions.push(donation);

    // Actualizar el total recaudado en el campo 'fundsRaised'
    fundation.fundsRaised += payment.transaction_amount;

    // Guardar la fundación con la nueva transacción y el total recaudado actualizado
    await fundation.save();

    return res.status(200).json(fundation);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



const getTransaction = async (req, res) => {
  try {
    const { fundationId } = req.params;

    // Buscar la fundación por ID
    const fundation = await Fundation.findById(fundationId);

    // Verificar si la fundación existe
    if (!fundation) {
      return res.status(404).json({ message: "Fundación no encontrada." });
    }

    // Obtener las transacciones de la fundación (campo allTransactions)
    const transactions = fundation.allTransactions;

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

