import { checkClientCodeValidity } from "@/SagesFactory";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest)  {
    try {
        const body = await request.json();
        if(!body) return NextResponse.json("Requête invalide", { status: 400 });
        const clientCodeRequest = {
            ClientCode : body.ClientCode
        }
        if (!clientCodeRequest.ClientCode) return NextResponse.json("Requête invalide", { status: 400 });
        const isClientCodeExist = await checkClientCodeValidity(clientCodeRequest.ClientCode);
        return NextResponse.json({isClientCodeExist:isClientCodeExist},{status:200});
    }
    catch(error) {
        //Maybe some error management here for administrative reasons
        return NextResponse.json({message : error}, { status: 500 });
    }
}