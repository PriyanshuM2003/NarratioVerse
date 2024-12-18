import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;
let global = globalThis as any;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
