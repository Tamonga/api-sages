import { checkClientCodeValidity, createNewClient } from "@/SagesFactory";
import { ClientCreateDO, ToClientDO } from "@/types/ClientDOs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest)  {
    try {
        const body = await request.json();
        if(!body) return NextResponse.json("Requête invalide", { status: 400 });
        const clientInfos : ClientCreateDO = {
            code: body.code,              
            legalname : body.legalname,             
            shortname : body.shortname,             
            address :  body.address,              
            website : body.website,               
            phone : body.phone,                
            email : body.email,                
            primarycontactname : body.primarycontacname,    
            primarycontactemail : body.primarycontactemail,    
            primarycontactphone : body.primarycontactphone,    
            othercontactinfos : body.othercontactinfos,    
            notes : body.notes,                
            schoolsystemid : body.schoolsystemId,       
            createdby : body.createdby   
        }
        //Mandatory information missing to create the client    
        if (!clientInfos.code || !clientInfos.legalname || clientInfos.schoolsystemid || !clientInfos.createdby) 
            return NextResponse.json("Requête invalide", { status: 400 });
        const isClientCodeExist = await checkClientCodeValidity(clientInfos.code);
        //The client code provided exists
        if(isClientCodeExist) return NextResponse.json({message:"Code client non valide", client : null},{status:200});
        //The client code provided exists - Create the client
        const clientCreated = await createNewClient(clientInfos);
        //Client not created
        if (!clientCreated) return NextResponse.json({message:"La création du client a échoué", client : null},{status:200});
        // Client créé
        return NextResponse.json({message:"La création du client a réussi", client : clientCreated},{status:200});

    }
    catch(error) {
        //Maybe some error management here for administrative reasons
        return NextResponse.json({message : "Erreur SAGES API (CreateClient) : " + error}, { status: 500 });
    }
}