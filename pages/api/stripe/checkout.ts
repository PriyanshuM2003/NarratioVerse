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
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

      const { price, category, title }: PlanData = req.body;

      if (!price || !category || !title) {
        return res
          .status(400)
          .json({ error: "Please provide all required fields." });
      }
      const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY!;
      const sig = req.headers["stripe-signature"] as string;
      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err: any) {
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
      }

      const eventType = event.type;

      if (
        eventType !== "checkout.session.completed" &&
        eventType !== "checkout.session.async_payment_succeeded"
      ) {
        return res.status(500).json({ error: "Invalid event type" });
      }

      try {
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
          default:
            return res.status(400).json({ error: "Invalid title" });
        }

        await prisma.user.update({
          where: { id: decoded.id },
          data: {
            premium: category === "premium" ? true : false,
            creator: category === "creator" ? true : false,
            expiryDate: expiryDate,
          },
        });

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "inr",
                product_data: {
                  name: title,
                  description: `Narratioverse ${category} ${title} Plan`,
                },
                unit_amount: price * 100,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${process.env.NEXT_PUBLIC_HOST}/plans/checkout/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_HOST}/plans/checkout/cancel`,
        });

        return res.status(200).json({
          message: "Subscription status updated successfully",
          url: session.url,
        });
      } catch (error) {
        console.error("Error updating subscription status:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error handling webhook event:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
