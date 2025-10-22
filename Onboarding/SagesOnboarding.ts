import { PrismaClient } from "@/lib/generated/prisma";
import { checkConnection } from "@/lib/SagesDbConnect";
import { createNewClient } from "@/SagesFactory";
import { ClientCreateDO, ClientDO } from "@/types/ClientDOs";
import { SagesDbConnection } from "@/types/SagesDbConnection";
import { SchoolSystemDO } from "@/types/SchoolSystemDOs";



const OnBoardingErrorLabel = "ERREUR : SagesOnBoarding : ";

export async function BoardNewClient(schoolSystemInfos:SchoolSystemDO, clientData:ClientCreateDO) : Promise<boolean> {
    try {
        //Create the new client
        const newClientCreated:ClientDO|null = await createNewClient(clientData);
        if (!newClientCreated || newClientCreated===null) {
            throw new Error(OnBoardingErrorLabel + "BoardNewClient : createNewClient");
        };

        //Create the client Neon Project
        const projectName = process.env.NEON_PROJECT_NAME_START + schoolSystemInfos.code.toUpperCase() + "-" + newClientCreated.code.toUpperCase() + process.env.NEON_PROJECT_NAME_END;
        if(!projectName) {
            throw new Error(OnBoardingErrorLabel + "BoardNewClient : getting Project Name");
        };
        const neonAPIKey = process.env.NEON_BEARER_TOKEN;
        if(!neonAPIKey) {
            throw new Error(OnBoardingErrorLabel + "BoardNewClient : getting Neon API Key");
        };
        const api_call_url = process.env.NEON_API_PROJECTS_BASE_URL;
        if(!api_call_url) {
            throw new Error(OnBoardingErrorLabel + "BoardNewClient : getting Neon API call URL");
        };
        const neon_platform = process.env.NEON_PROJECT_CREATION_PLATFORM;
        if(!neon_platform) {
            throw new Error(OnBoardingErrorLabel + "BoardNewClient : getting Neon Project platform");
        };
        const neon_region= process.env.NEON_PROJECT_CREATION_REGION;
        if(!neon_region) {
            throw new Error(OnBoardingErrorLabel + "BoardNewClient : getting Neon Project region");
        };

        const response = await fetch(api_call_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${neonAPIKey}`,
            },
            body: JSON.stringify({
                project: {
                name: projectName,
                region_id: neon_region,
                platform_is: neon_platform
                }
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(OnBoardingErrorLabel + "BoardNewClient : Failed to Create Neon Project : " + errorData.message);
        };

        const clientJSONData = await response.json();
        const project_id = clientJSONData["project"]["id"];
        const connection_uri = clientJSONData["connection_uris"]["connection_uri"];

        //Update Client with Neo Project information

        //Add modules to the client

        //Add module pricing

        //Add module configs


        return true;
    }
    catch(error) {
        return false;
    }
}