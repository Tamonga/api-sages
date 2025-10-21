import { PrismaClient } from "./lib/generated/prisma";
import { checkConnection } from "./lib/SagesDbConnect";
import { ModuleDO, ToModuleDO } from "./types/ModuleDOs";
import { SagesDbConnection } from "./types/SagesDbConnection";
import { SchoolSystemDO, ToSchoolSystemDO } from "./types/SchoolSystemDOs";

const SagesFactoryErrorLabel = "Erreur SagesFactory - ";

export async function getSchoolSystemByCode(schoolSystemCode:string) : Promise<SchoolSystemDO|null> {
    try {
        const connexion: SagesDbConnection = await checkConnection();
        if (!connexion.isConnected || !connexion.client) {
            throw new Error(SagesFactoryErrorLabel + "La connexion à la base de données a échoué: " + connexion.connectionMessage);
        };
        const client : PrismaClient = connexion.client;
        const schoolSystemQueried = await client.sagesschoolsystem.findUnique({
            where : {
                code : schoolSystemCode
            }
        });
        if (!schoolSystemQueried || schoolSystemQueried === null) return null;
        return (ToSchoolSystemDO(schoolSystemQueried));
    }
    catch(error) {
        throw new Error(SagesFactoryErrorLabel + "getSchoolSystemByCode : " + error);
    }
}

export async function getModuleByCode(moduleCode:string) : Promise<ModuleDO|null> {
    try {
        const connexion: SagesDbConnection = await checkConnection();
        if (!connexion.isConnected || !connexion.client) {
            throw new Error(SagesFactoryErrorLabel + "La connexion à la base de données a échoué: " + connexion.connectionMessage);
        };
        const client : PrismaClient = connexion.client;
        const moduleQueried = await client.sagesmodule.findUnique({
            where : {
                code : moduleCode
            }
        });
        if (!moduleQueried || moduleQueried === null) return null;
        return (ToModuleDO(moduleQueried));
    }
    catch(error) {
        throw new Error(SagesFactoryErrorLabel + "getModuleByCode : " + error);
    }
}

export async function addModuleToClient(moduleId:string, clientId:string) : Promise<boolean> {
    try {
        const systemUser:string = process.env.SYSTEM_USER || "SAGES-SYSTEM"; 
        const connexion: SagesDbConnection = await checkConnection();
        if (!connexion.isConnected || !connexion.client) {
            throw new Error(SagesFactoryErrorLabel + "La connexion à la base de données a échoué: " + connexion.connectionMessage);
        };
        const client : PrismaClient = connexion.client;
        const insertedCLientModule = await client.sagesclientmodule.create({
            data : {
                effectivedate : new Date(),
                clientid : clientId,
                moduleid : moduleId,
                createdby : systemUser,
                datecreated : new Date()
            }
        });
        if (!insertedCLientModule || insertedCLientModule === null) return false;
        return true;

    }
    catch(error) {
        throw new Error(SagesFactoryErrorLabel + "addModuleToClient : " + error);
    }
}

