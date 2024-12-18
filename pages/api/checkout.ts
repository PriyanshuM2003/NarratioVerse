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
        process.env.ACCESS_TOKEN_SECRET as Secret
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

      const prod = await stripe.products.create({
        name: `Narratioverse ${category} ${title} plan.`,
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

      // const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY!;
      // const sig = req.headers["stripe-signature"] as string;
      // let event: Stripe.Event;

      // try {
      //   const payload = req.body;
      //   event = stripe.webhooks.constructEvent(
      //     JSON.stringify(payload),
      //     sig,
      //     endpointSecret
      //   );
      // } catch (err: any) {
      //   return res.status(400).json({ error: `Webhook Error: ${err.message}` });
      // }

      // const eventType = event.type;
      // switch (eventType) {
      //   case "checkout.session.completed":
      let planData = await prisma.planData.findFirst({
        where: { userId: decoded.id },
      });

      if (!planData) {
        planData = await prisma.planData.create({
          data: {
            userId: decoded.id,
            paymentStatus: false,
            amount: price,
            currency: "INR",
            category,
            type: title,
            expiryDate: expiryDate,
          },
        });
      }

      await prisma.planData.update({
        where: { id: planData.id },
        data: {
          paymentStatus: true,
          amount: price,
          currency: "INR",
          category,
          type: title,
          expiryDate: expiryDate,
        },
      });

      await prisma.user.update({
        where: { id: decoded.id },
        data: {
          premium: category === "premium" ? true : false,
          creator: category === "creator" ? true : false,
        },
      });
      //     break;
      //   default:
      //     return res.status(500).json({ error: "Invalid event type" });
      // }
      return res.status(200).json({
        message: "Subscription status updated successfully",
        url: session.url,
      });
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
