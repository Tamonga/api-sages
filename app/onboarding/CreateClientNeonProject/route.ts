import { getClientById, getSchoolSystemById } from "@/SagesFactory";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest)  {
    try {
        const body = await request.json();
        if(!body) return NextResponse.json("Requête invalide", { status: 400 });
        const clientInfos = {
            clientid : body.clientid
        };
        if (!clientInfos.clientid) return NextResponse.json("Identification du client invalide", { status: 400 });
        const clientQueried = await getClientById(clientInfos.clientid);
        if(!clientQueried) return NextResponse.json("Client non identifiable", { status: 400 });
        const schoolSystemQueried = await getSchoolSystemById(clientQueried.schoolsystemid);
        if(!schoolSystemQueried) return NextResponse.json("Système d'éducation non identifiable", { status: 400 });
        const ProjectName = process.env.NEON_PROJECT_NAME_START! as string + schoolSystemQueried.code.toUpperCase() + "-" + clientQueried.code.toUpperCase() + 
                            process.env.NEON_PROJECT_NAME_END! as string;
        const RegionId = process.env.NEON_PROJECT_CREATION_REGION! as string;
        const PlatformId = process.env.NEON_PROJECT_CREATION_PLATFORM! as string;
        const NeonAPIKey = process.env.NEON_BEARER_TOKEN! as string;
        const ApiCallUrl = process.env.NEON_API_PROJECTS_BASE_URL! as string;
        const response = await fetch(ApiCallUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${NeonAPIKey}`,
            },
            body: JSON.stringify({
                project: {
                name: ProjectName,
                region_id: RegionId,
                platform_is: PlatformId
                }
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error("Erreur - Création du projet Neon : " + errorData.message);
        };

        const NeonProjectDetails = await response.json();
        return NextResponse.json({message:"La création du projet neon a réussi", NeonProject : NeonProjectDetails},{status:200});

    }
    catch(error) {
        //Maybe some error management here for administrative reasons
        return NextResponse.json({message : "Erreur SAGES API (CreateClientNeonProject) : " + error}, { status: 500 });
    }
}