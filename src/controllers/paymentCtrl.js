import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import dotenv from "dotenv";
dotenv.config();

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// Crear una orden (preferencia)
export const createOrder = async (req, res) => {
  const { title, amount, description } = req.body;

  try {
    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: "donation",
            title,
            unit_price: amount,
            quantity: 1,
            description,
          },
        ],
        back_urls: {
          success: "http://localhost:3000/success",
          failure: "http://localhost:3000/failure",
          pending: "http://localhost:3000/pending",
        },
        notification_url:
          "https://ed01-2802-8010-941e-5c00-1cf7-1700-f1b0-67f0.ngrok-free.app/webhook",
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
export const reciveWebhook = async (req, res) => {
  const body = req.body;


  console.log("Body del webhook:", body);
  console.log("ID de pago:", body.id);

  try {
    // Obtener el pago usando el ID recibido en el webhook
    const payment = await new Payment(client).get({ id: body.data.id });

    // Verificar que el estado del pago sea aprobado
    if (payment.status === "approved") {
      // Formatear la información de la donación
      const donation = {
        id: payment.id,
        amount: payment.transaction_amount,
        message: payment.description,
      };

      console.log(donation); //! BASE DE DATOS!

    } else {
      return res.status(200).json({ success: false, message: "Pago no aprobado" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
