import { sagesclient } from "@/lib/generated/prisma";

export type ClientDO = {
    id:                     string;                           
    code:                   string;
    legalname:                   string;
    shortname:              string | null; 
    address:                string | null;    
    website:                string | null; 
    phone:                  string | null; 
    email:                  string | null; 
    primarycontactname:     string | null; 
    primarycontactemail:    string | null; 
    primarycontactphone:    string | null; 
    othercontactinfos:      string | null;  
    notes:                  string | null;
    schoolsystemid:         string;          
    createdby:              string;          
    datecreated:            Date;   
    modifiedby:             string | null;       
    datemodified:           Date | null;       
};

export function ToClientDO(sc:sagesclient) : ClientDO {
    return {
        id:                     sc.id,
        code:                   sc.code,
        legalname:              sc.legalname,
        shortname:              sc.shortname,
        address:                sc.address,
        website:                sc.website,
        phone:                  sc.phone,
        email:                  sc.email,
        primarycontactname:     sc.primarycontactname,
        primarycontactemail:    sc.primarycontactemail,
        primarycontactphone:    sc.primarycontactphone,
        othercontactinfos:      sc.othercontactinfos,
        notes:                  sc.notes,
        schoolsystemid:         sc.schoolsystemid,
        createdby:              sc.createdby,
        datecreated:            sc.datecreated,
        modifiedby:             sc.modifiedby,
        datemodified:           sc.datemodified
    }
}