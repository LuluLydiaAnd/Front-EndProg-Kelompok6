import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

// membuat koneksi prisma ke database postgresql
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// menyimpan instance prisma secara global agar tidak dibuat berulang kali
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// menggunakan instance yang sudah ada atau membuat instance prisma baru
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

// menyimpan instance prisma saat development agar koneksi tidak menumpuk
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
