
import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getClientByCode, getClientNeonProjectDetails } from "@/SagesFactory";
import { decrypt } from "@/lib/SagesJWT";
import { NeonProjectDO } from "@/types/NeonProjectDOs";

export async function POST(request: NextRequest, { params }: { params: Promise<{ClientCode: string }> }) {
    try {
        const clientCode = (await params).ClientCode;
        if(!clientCode) return NextResponse.json("Requête invalide (code client)", { status: 400 });
        const clientQueried = await getClientByCode(clientCode);
        if(!clientQueried || clientQueried===null) return NextResponse.json("Client invalide", { status: 400 });
        const neonProjectDetails = await getClientNeonProjectDetails(clientQueried.id);
        if(!neonProjectDetails || neonProjectDetails===null) return NextResponse.json("Projet Neon invalide", { status: 400 });
        const neonProjectDetailsDecrypted = decrypt(neonProjectDetails)! as unknown as NeonProjectDO;
        if(!neonProjectDetailsDecrypted) return NextResponse.json("Projet Neon invalide (non décrypté)", { status: 400 });
        const sql = neon(neonProjectDetailsDecrypted.connection_uri);
        try {
            await sql`
                CREATE TABLE IF NOT EXISTS TESTATBLE (
                    id SERIAL PRIMARY KEY,
                    comment TEXT NOT NULL
                );
            `;
            } catch (error) {
                throw new Error("Erreur - Création de la table : " + error);
            }
        }
    catch(error){
        throw new Error("Erreur - Création de la table: " + error);
    }

}
