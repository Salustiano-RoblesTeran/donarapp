const  { MercadoPagoConfig, Preference, Payment } =  require("mercadopago");
const dotenv = require("dotenv");
const Transaction = require("../models/Transaction");
const User = require("../models/User")
dotenv.config();

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// Crear una orden (preferencia)
const createDonation = async (req, res) => {
  const { userId, title, amount, description } = req.body;

  try {
    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: "donation",
            unit_price: amount,
            quantity: 1,
            title,
          },
        ],
        metadata: {
          userId,
          message: description
        },
        back_urls: {
          success: "http://localhost:3000/api/payments/success",
          failure: "http://localhost:3000/api/payments/failure",
          pending: "http://localhost:3000/api/payments/pending",
        },
        notification_url: "https://9bbc-190-50-232-199.ngrok-free.app/api/payments/webhook",
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

    console.log("payment: ",payment)

    // Verificar que el estado del pago sea aprobado
    if (payment.status === "approved") {
      const userData = payment.metadata;
      console.log("userId", userData.user_id, userData.message)
      if (userData === null) {
        return res.status(400).json({ success: false, message: "Falta el ID de usuario en la metadata" });
      }
      // Formatear la información de la donación
      const donation = {
        orderId: userData.user_id,  
        status: payment.status,
        amount: payment.transaction_amount,
        title: payment.description,
        description: userData.message
      };

      console.log(donation)


      const newPayment = new Transaction(donation);
      await newPayment.save();

      const user = await User.findById(userData.user_id);
      if (!user) {
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }

      user.transactions.push(newPayment._id); // Agregar la transacción al usuario
      await user.save(); // Guardar cambios en el usuario

      return res.status(200).json({ succes: true});

    } else {
      return res.status(200).json({ success: false, message: "Pago no aprobado" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const dashboard = async (req, res) => {
  try {
    const uid = req.usuario._id; // Asegúrate de que `req.usuario` contiene `_id`

    console.log("User ID:", uid);

    // Obtener usuario y popular las transacciones
    const transaction = await User.findById(uid).populate("transactions"); 

    if (!transaction) {
      return res.status(404).json({ message: "No se encontraron transacciones" });
    }

    console.log("Transactions:", transaction);
    
    res.json({ transactions: transaction.transactions });
  } catch (error) {
    console.error("Error en dashboard:", error);
    res.status(500).json({ message: "Error al obtener las transacciones", error });
  }
};


const transaction = async (req, res) => {

}

module.exports = {
  reciveWebhook,
  createDonation,
  getUser,
  dashboard,
  transaction
}