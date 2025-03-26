const  { MercadoPagoConfig, Preference, Payment } =  require("mercadopago");
const dotenv = require("dotenv");
const Transaction = require("../models/Transaction");
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
        notification_url: "https://57db-138-204-159-135.ngrok-free.app/api/payments/webhook",
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
      console.log(fundationData.fundation_id, payment.transaction_amount, fundationData.message)

      console.log(fundationData.fundation_id)

      const fundationExist = await Fundation.findById(fundationData.fundation_id);

      console.log(fundationExist)

      if (!fundationExist) {
        return res.status(400).json({ success: false, message: "No existe una fundación con ese ID." });
      }


      if (!fundationData || !fundationData.fundation_id || !fundationData.message) {
        console.error("Error: Metadata incompleta", fundationData);
        return res.status(400).json({ success: false, message: "Metadata incompleta" });
      }

      
      // Formatear la información de la donación
      const donation = {
        fundationId: fundationData.fundation_id,
        status: payment.status,
        amount: payment.transaction_amount,
        title: payment.description,
        description: fundationData.message 
      };

      console.log(donation)


      const newTransaction = new Transaction(donation);
      await newTransaction.save();

      console.log("guardado en la base de datos")

      return res.status(200).json({ succes: true});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


const getTransaction = async (req, res) => {
  try {
    const { fundationId } = req.params;

    // Buscar las transacciones de la fundación por el id
    const transactions = await Transaction.find({ fundationId });

    console.log(transactions);

    // Verificar si no hay transacciones
    if (!transactions || transactions.length === 0) {
      return res.json({
        success: true,
        totalRaised: 0,
        transactions: [],
      });
    }

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

