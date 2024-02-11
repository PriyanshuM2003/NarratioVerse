import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { slug, accept } = req.body;

      if (!slug || typeof accept !== "boolean") {
        return res.status(400).json({ error: "Bad Request: Invalid parameters" });
      }

      const participant = await prisma.liveTalkParticipant.findFirst({
        where: {
          liveTalk: { slug },
        },
      });

      if (!participant) {
        return res.status(404).json({ error: "Participant not found" });
      }

      const updatedParticipant = await prisma.liveTalkParticipant.update({
        where: { id: participant.id },
        data: { accepted: accept },
      });

      return res.status(200).json({ message: "Invitation accepted successfully" });
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
