import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {

      const { slug } = req.query;
      const liveTalk = await prisma.liveTalk.findUnique({
        where: {
          slug,
        },
        include: {
          hostUser: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
          participants: {
            where: {
              accepted: true,
            },
            include: {
              guestUser: {
                select: {
                  id: true,
                  name: true,
                  profileImage: true,
                },
              },
            },
          },
        },
      });

      if (!liveTalk) {
        return res.status(404).json({ error: "Live talk not found" });
      }

      return res.status(200).json({ initiateLiveTalk: liveTalk });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error fetching live talk:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
