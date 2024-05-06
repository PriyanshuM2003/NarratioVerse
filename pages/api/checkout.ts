import Stripe from "stripe";
import prisma from "@/lib/prisma";
import jwt, { Secret } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { addMonths, addQuarters, addYears } from "date-fns";

interface PlanData {
  price: number;
  category: string;
  title: string;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const decoded = jwt.verify(
        token as string,
        process.env.JWT_SECRET_KEY as Secret
      ) as { id?: string };

      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { name: true, email: true },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const customer = await stripe.customers.create({
        name: user.name,
        email: user.email,
      });

      const { price, category, title }: PlanData = req.body;

      if (!price || !category || !title) {
        return res
          .status(400)
          .json({ error: "Please provide all required fields." });
      }

      const prod = await stripe.products.create({
        name: title,
        type: "service",
      });

      const priceObject = await stripe.prices.create({
        unit_amount: price * 100,
        currency: "inr",
        product: prod.id,
      });

      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceObject.id,
            quantity: 1,
          },
        ],
        mode: "payment",
        shipping_address_collection: {
          allowed_countries: ["IN"],
        },
        billing_address_collection: "required",
        success_url: `${process.env.NEXT_PUBLIC_HOST}/plans/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_HOST}/plans/checkout/cancel`,
      });

      const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY!;
      const sig = req.headers["stripe-signature"] as string;
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err: any) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      switch (event?.type) {
        case "checkout.session.completed":
          const chargeData = event.data.object;

          const expiryDate = calculateExpiryDate(title);

          await prisma.user.update({
            where: { id: decoded.id },
            data: {
              premium: category === "premium",
              creator: category === "creator",
              expiryDate: expiryDate,
            },
          });

          console.log("Subscription status updated successfully");
          return res.status(200).json({
            message: "Subscription status updated successfully",
            url: session.url,
          });

        default:
          console.log(`Unhandled event type: ${event?.type}`);
          return res.status(200).json({ received: true });
      }
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

function calculateExpiryDate(title: string): Date | null {
  let expiryDate = null;

  switch (title.toLowerCase()) {
    case "monthly":
      expiryDate = addMonths(new Date(), 1);
      break;
    case "quarterly":
      expiryDate = addQuarters(new Date(), 1);
      break;
    case "yearly":
      expiryDate = addYears(new Date(), 1);
      break;
  }

  return expiryDate;
}
