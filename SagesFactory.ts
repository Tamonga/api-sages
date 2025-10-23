import { PrismaClient } from "./lib/generated/prisma";
import { checkConnection } from "./lib/SagesDbConnect";
import { decrypt } from "./lib/SagesJWT";
import { ClientCreateDO, ClientDO, ToClientDO } from "./types/ClientDOs";
import { ModuleDO, ToModuleDO } from "./types/ModuleDOs";
import { NeonProjectDO } from "./types/NeonProjectDOs";
import { SagesDbConnection } from "./types/SagesDbConnection";
import { SchoolSystemDO, ToSchoolSystemDO } from "./types/SchoolSystemDOs";

const SagesFactoryErrorLabel = "Erreur SagesFactory - ";

export async function getClientByCode(clientCode:string) : Promise<ClientDO|null> {
    try {
        const connexion: SagesDbConnection = await checkConnection();
        if (!connexion.isConnected || !connexion.client) {
            throw new Error(SagesFactoryErrorLabel + "La connexion à la base de données a échoué: " + connexion.connectionMessage);
        };
        const client : PrismaClient = connexion.client;
        const clientQueried = await client.sagesclient.findUnique({
            where : {
                code : clientCode
            }
        });
        if (!clientQueried || clientQueried === null) return null;
        return (ToClientDO(clientQueried));
    }
    catch(error) {
        throw new Error(SagesFactoryErrorLabel + "getClientByCode : " + error);
    }
}

export async function getAllSchoolSystems(clientCode:string) : Promise<SchoolSystemDO[]> {
    try {
        const connexion: SagesDbConnection = await checkConnection();
        if (!connexion.isConnected || !connexion.client) {
            throw new Error(SagesFactoryErrorLabel + "La connexion à la base de données a échoué: " + connexion.connectionMessage);
        };
        const client : PrismaClient = connexion.client;
        const schoolSystemsQueried = await client.sagesschoolsystem.findMany({
            where : {
                active : true
            }
        });
        const listSchoolSystems : SchoolSystemDO[] = [];
        schoolSystemsQueried.forEach(ss => {
            listSchoolSystems.push(ToSchoolSystemDO(ss));
        });
        return listSchoolSystems;
    }
    catch(error) {
        throw new Error(SagesFactoryErrorLabel + "getAllSchoolSystems : " + error);
    }
}



export async function checkClientCodeValidity(clientCode:string) : Promise<boolean> {
    try {
        const clientQueried = await getClientByCode(clientCode);
        if (!clientQueried || clientQueried===null) return false;
        return true;
    }
    catch(error) {
        //Maybe some error management here for administrative reasons
        return false;
    }
}

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

export async function getSchoolSystemById(schoolSystemId:string) : Promise<SchoolSystemDO|null> {
    try {
        const connexion: SagesDbConnection = await checkConnection();
        if (!connexion.isConnected || !connexion.client) {
            throw new Error(SagesFactoryErrorLabel + "La connexion à la base de données a échoué: " + connexion.connectionMessage);
        };
        const client : PrismaClient = connexion.client;
        const schoolSystemQueried = await client.sagesschoolsystem.findUnique({
            where : {
                id : schoolSystemId
            }
        });
        if (!schoolSystemQueried || schoolSystemQueried === null) return null;
        return (ToSchoolSystemDO(schoolSystemQueried));
    }
    catch(error) {
        throw new Error(SagesFactoryErrorLabel + "getSchoolSystemById : " + error);
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


export async function getNeonProjectDetails(encryptedData : string) : Promise<NeonProjectDO | null> {
    try {
        const details = await decrypt(encryptedData);
        if (!details.project_name || !details.project_id || !details.connection_uri) return null;
        return {
            project_id:details.project_id,
            project_name:details.project_name,
            connection_uri:details.connection_uri
        }
    }
    catch(error) {
        return null;
    }
}

export async function createNewClient(clientData:ClientCreateDO) : Promise<ClientDO|null> {
    try {
        const systemUser:string = process.env.SYSTEM_USER || "SAGES-SYSTEM"; 
        const connexion: SagesDbConnection = await checkConnection();
        if (!connexion.isConnected || !connexion.client) {
            throw new Error(SagesFactoryErrorLabel + "La connexion à la base de données a échoué: " + connexion.connectionMessage);
        };
        const client : PrismaClient = connexion.client;
        const schoolSystem = await getSchoolSystemById(clientData.schoolsystemid);
        if (!schoolSystem || schoolSystem===null) {
            throw new Error(SagesFactoryErrorLabel + "createNewClient : getSchoolSystemByCode : ");
        };
        
        // Create the client
        const createdClient = await client.sagesclient.create({
            data : {
                code:                   clientData.code,
                legalname:              clientData.legalname,
                shortname:              clientData.shortname,
                address:                clientData.address,
                website:                clientData.website,
                phone:                  clientData.phone,
                email:                  clientData.email,
                primarycontactname:     clientData.primarycontactname,
                primarycontactemail:    clientData.primarycontactemail,
                primarycontactphone:    clientData.primarycontactphone,
                othercontactinfos:      clientData.othercontactinfos,
                notes:                  clientData.notes,
                schoolsystemid:         clientData.schoolsystemid,
                createdby:              clientData.createdby,
                datecreated:            new Date()
            }
        });
        if(!createdClient || createdClient===null) {
            return null;
        };
        return ToClientDO(createdClient);
        

    }
    catch(error) {
        //return null;
        throw new Error(SagesFactoryErrorLabel + "addModuleToClient : " + error);
    }
}

