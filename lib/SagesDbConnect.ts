import { SagesDbConnection } from "@/types/SagesDbConnection";
import {prisma} from "./Client";

export async function checkConnection() : Promise<SagesDbConnection> {
    //console.log("Checking Connection");
    try {
        await prisma.$queryRaw`SELECT 1`;
        return {
            isConnected: true,
            connectionMessage: "Vous êtes connecté !",
            client: prisma
        }
    }
    catch (error) {
        return {
            isConnected: false,
            connectionMessage: error,
            client: null
        }
    }
}