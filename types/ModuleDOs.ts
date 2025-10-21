import { sagesmodule } from "@/lib/generated/prisma";

export type ModuleDO = {
    id:                     string;                           
    code:                   string;
    name:                   string;
    description:            string | null;          
    createdby:              string;            
    datecreated:            Date;   
    modifiedby:             string | null;       
    datemodified:           Date | null;       
};

export function ToModuleDO(module:sagesmodule) : ModuleDO {
    return {
        id:                     module.id,
        code:                   module.code,
        name:                   module.name,
        description:            module.description,
        createdby:              module.createdby,
        datecreated:            module.datecreated,
        modifiedby:             module.modifiedby,
        datemodified:           module.datemodified
    }
}