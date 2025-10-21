import { sagesschoolsystem } from "@/lib/generated/prisma";

export type SchoolSystemDO = {
    id:                     string;                           
    code:                   string;
    name:                   string;
    description:            string | null;          
    createdby:              string;            
    datecreated:            Date;   
    modifiedby:             string | null;       
    datemodified:           Date | null;       
};

export function ToSchoolSystemDO(ss:sagesschoolsystem) : SchoolSystemDO {
    return {
        id:                     ss.id,
        code:                   ss.code,
        name:                   ss.name,
        description:            ss.description,
        createdby:              ss.createdby,
        datecreated:            ss.datecreated,
        modifiedby:             ss.modifiedby,
        datemodified:           ss.datemodified
    }
}