import { PrismaClient } from "@/lib/generated/prisma";

export type SagesDbConnection = {
    isConnected:        boolean;
    connectionMessage:  unknown;
    client:             PrismaClient | null;
}