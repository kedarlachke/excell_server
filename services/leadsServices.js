/**
 * @author 
 */

// Import section
import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';
import contactsServices from '../services/contactsServices';
import emailServices from '../services/emailServices';
import emailTemplateServices from '../services/emailTemplateServices';

import {
    searchAdminLeadsQuery, 
    searchUserLeadsQuery,
    searchDashboardLeadsQuery,
    checkDuplicateLeadsQuery,
    getLeadsDetailsQuery,
    leadsmaillist
} from '../common/sqlQueries';


// Logged in user
var loginUser = {CLNT:"1002",LANG:"EN",USERNAME:"Sohan Patil",USERID:"SP0001",AUTH:{GRPID:"EXUSRS",GRPNM:"EMPLOYEE GROUP",}};

// Resolver function for query searchLeads(input) : [Leads]
const searchLeads = async (args, context, info) =>
{

    loginUser = validations.getLoginData(context);



    try 
    {
        let isAdmin = args.isAdmin;
        let selectQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : '',
            (typeof args.FULLNM !== 'undefined' && args.FULLNM.trim())          ?   args.FULLNM.trim()        : '%%',
            (typeof args.OFFICENM !== 'undefined' && args.OFFICENM.trim())      ?   args.OFFICENM.trim()      : '%%',
            (typeof args.PHONE !== 'undefined' && args.PHONE.trim())            ?   args.PHONE.trim()         : '%%',
            (typeof args.EMAILID !== 'undefined' && args.EMAILID.trim())        ?   args.EMAILID.trim()       : '%%',
            (typeof args.TYPSERV !== 'undefined' && args.TYPSERV.trim())        ?   args.TYPSERV.trim()       : '%%',
            (typeof args.STATUS !== 'undefined' && args.STATUS.trim())          ?   args.STATUS.trim()        : '%%',
            (typeof args.CATCODE !== 'undefined' && args.CATCODE.trim())          ?   args.CATCODE.trim()        : '%%'
        ];
    
        if(isAdmin)
        {
            selectQuery = searchAdminLeadsQuery;
        }
        else
        {
            selectQuery = searchUserLeadsQuery;
    
            // Add placeholders for additional values 
            placeHolders.push(
                                (typeof args.ASSIGNTO !== 'undefined' && args.ASSIGNTO.trim()) ? args.ASSIGNTO.trim() : ''
                            );
            
        }
    
        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders) ;
    
        return result;        
    } 
    catch (error) 
    {
        return error;    
    }

}


const searchLeadsMails = async (args, context, info) =>
{
    try 
    {
        //let isAdmin = args.isAdmin;
        let selectQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : '',
            (typeof args.MAILFOR !== 'undefined' && args.MAILFOR.trim())          ?   args.MAILFOR.trim()        : '%%',
            (typeof args.MAILFORID !== 'undefined' && args.MAILFORID.trim())      ?   args.MAILFORID.trim()      : '%%',
            (typeof args.FROMDATE !== 'undefined' && args.FROMDATE.trim())            ?   args.FROMDATE.trim()         : '20010101',
            (typeof args.TODATE  !== 'undefined' && args.TODATE.trim())            ?   args.TODATE.trim()         : '99991231',
            (typeof args.CUSER !== 'undefined' && args.CUSER.trim())            ?   args.CUSER.trim()         : '%%',
        ];
    console.log(placeHolders);
        /*if(isAdmin)
        {
            selectQuery = searchAdminLeadsQuery;
        }
        else
        {*/
            selectQuery = leadsmaillist;
    
            // Add placeholders for additional values 
         /*   placeHolders.push(
                                (typeof args.ASSIGNTO !== 'undefined' && args.ASSIGNTO.trim()) ? args.ASSIGNTO.trim() : ''
                            );
            
        }*/
    
        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders) ;
        console.log(result);
    
        return result;        
    } 
    catch (error) 
    {
        return error;    
    }

}


// Resolver function for query searchDashboardLeads(input) : [Leads]
const searchDashboardLeads = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = searchDashboardLeadsQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : '',
            (typeof args.FULLNM !== 'undefined' && args.FULLNM.trim())          ?   args.FULLNM.trim()        : '%%',
            (typeof args.OFFICENM !== 'undefined' && args.OFFICENM.trim())      ?   args.OFFICENM.trim()      : '%%',
            (typeof args.PHONE !== 'undefined' && args.PHONE.trim())            ?   args.PHONE.trim()         : '%%',
            (typeof args.EMAILID !== 'undefined' && args.EMAILID.trim())        ?   args.EMAILID.trim()       : '%%',
            (typeof args.TYPSERV !== 'undefined' && args.TYPSERV.trim())        ?   args.TYPSERV.trim()       : '%%',
            (typeof args.STATUS !== 'undefined' && args.STATUS.trim())          ?   args.STATUS.trim()        : '%%'
        ];
    
        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders) ;
    
        return result;        
    } 
    catch (error) 
    {
        return error;    
    }

}


// Resolver function for query leadDetails(input) : [Lead]
const leadDetails = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = getLeadsDetailsQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : '',
            (typeof args.CID !== 'undefined' && args.CID.trim())              ?   args.CID.trim()          : ''
        ];
    
        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders) ;

        //console.log(result);

        return result;        
    } 
    catch (error) 
    {
        return error;    
    }

}




/**
 * CRUD Operations for Leads
 **/
// Resolver function for mutation LeadsCRUDOps(input) : String
const LeadsCRUDOps = async (args, context, info) =>
{
    try 
    {   
        loginUser = validations.getLoginData(context);

        // Get the transaction from arguments
        let transaction = args.transaction;

        let affectedRecords = 0;

        // If transaction is not available
        if(typeof transaction === 'undefined' || transaction.trim().length == 0)
            throw new Error("Transaction is required and can not be empty.");

        transaction = transaction.trim().toUpperCase();  
         
        
        if(transaction == "CREATE")     // Create 
        {

           // console.log('w1');
            // Validate input data
            let leads = await validateCREATEData(args.leads);

            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateLeads(leads);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                //console.log('w2');
                affectedRecords = await createLeads(leads);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let leads = await validateUPDATEData(args.leads);

            // Check availability of records
            let duplicateObj =  await checkDuplicateLeads(leads);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != leads.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateLeads(leads);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let leads = await validateDELETEData(args.leads);

            // Check availability of records
            let duplicateObj =  await checkDuplicateLeads(leads);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != leads.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteLeads(leads);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let leads = await validateDELETEData(args.leads);

            // Check availability of records
            let duplicateObj =  await checkDuplicateLeads(leads);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != leads.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteLeads(leads);
            }

        }
        else    // Throw invalid transaction error
        {
            throw new Error("Invalid transaction specified.");
        }

        return affectedRecords;        

    } 
    catch (error) 
    {
        return error;    
    }

}


// Validation funtion for creation
const validateCREATEData = async (leads) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < leads.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", leads[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", leads[i].LANG, "Language is required", validationObject);
            validations.checkNull("FRSTNM", leads[i].FRSTNM, "First name is required", validationObject);
            validations.checkNull("LSTNM", leads[i].LSTNM, "Last name is required", validationObject);
            
            validations.checkNull("MODEOFSRC", leads[i].MODEOFSRC, "Lead source is required", validationObject);

            //validations.checkNull("CATCODE", leads[i].CATCODE, "Category is required", validationObject);
            //validations.checkNull("TYPSERV", leads[i].TYPSERV, "Service type is required", validationObject);
            validations.checkNull("EMAILID", leads[i].EMAILID, "Email id is required", validationObject);
            //validations.checkNull("PHONE", leads[i].PHONE, "Phone Number is required", validationObject);

            validations.checkMaxLength("FRSTNM", leads[i].FRSTNM, 40, "Length of First name should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("LSTNM", leads[i].LSTNM, 40, "Length of Last name should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("ADDRESS", leads[i].ADDRESS, 300, "Length of Address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("CITY", leads[i].CITY, 50, "Length of City should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("EMAILID", leads[i].EMAILID, 128, "Length of Email id should be less than or equal to 128 characters", validationObject);
            validations.checkMaxLength("OFFICENM", leads[i].OFFICENM, 150, "Length of Business or Law Office should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("DESCRIPTION", leads[i].DESCRIPTION, 500, "Length of Business or Law Office should be less than or equal to 500 characters", validationObject);
            validations.checkMaxLength("ADDCOMMETS", leads[i].ADDCOMMETS, 500, "Length of Business or Law Office should be less than or equal to 500 characters", validationObject);
            validations.checkMaxLength("PHONE", leads[i].PHONE, 15, "Length of Phone Number should be less than or equal to 15 characters", validationObject);

            validations.checkEmail("EMAILID", leads[i].EMAILID, "Email id is not valid", validationObject);
            
            validations.checkNumber("PHONE", leads[i].PHONE, "Phone Number should be a number", validationObject);
            validations.checkNumber("ZIPCD", leads[i].ZIPCD, "Zip code should be a number", validationObject);
            
            if(Object.keys(validationObject).length != 0)
                validationObjects[i] = validationObject;

        }
        
        // if data is not valid, throw validation errors
        if(Object.keys(validationObjects).length != 0)
        {
            throw new Error(JSON.stringify(validationObjects));
        }
        else
        { 
            let nextNumber;
    
            // Get system date and time
            let curDate = sysDateTime.sysdate_yyyymmdd();
            let curTime = sysDateTime.systime_hh24mmss();
            
            for(let i = 0; i < leads.length; i++)
            {
                // Get auto-generated number for leads id
                nextNumber = await numberSeries.getNextSeriesNumber(leads[i].CLNT, "NA", "LEADID");
                
                // Add auto-generated number as leads id
                leads[i].CID = nextNumber;
                
                leads[i].FULLNM = leads[i].FRSTNM + " " + leads[i].LSTNM;
                //leads[i].CSOURCE = "LEADS";
                leads[i].STATUS = "01";

                // Add create params 
                leads[i].CDATE = curDate;
                leads[i].CTIME = curTime;
                leads[i].ISDEL = "N";

                leads[i].CUSER = loginUser.USERID.toLowerCase();

            }
        
            return leads;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Validation funtion for updation
const validateUPDATEData = async (leads) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < leads.length; i++)
        {
            let validationObject = {};

            validations.checkEmail("EMAILID", leads[i].EMAILID, "Email id is not valid", validationObject);
            
            validations.checkNumber("PHONE", leads[i].PHONE, "Phone Number should be a number", validationObject);
            validations.checkNumber("ZIPCD", leads[i].ZIPCD, "Zip code should be a number", validationObject);
            validations.checkMaxLength("FRSTNM", leads[i].FRSTNM, 40, "Length of First name should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("LSTNM", leads[i].LSTNM, 40, "Length of Last name should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("ADDRESS", leads[i].ADDRESS, 300, "Length of Address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("CITY", leads[i].CITY, 50, "Length of City should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("EMAILID", leads[i].EMAILID, 128, "Length of Email id should be less than or equal to 128 characters", validationObject);
            validations.checkMaxLength("OFFICENM", leads[i].OFFICENM, 150, "Length of Business or Law Office should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("DESCRIPTION", leads[i].DESCRIPTION, 500, "Length of Business or Law Office should be less than or equal to 500 characters", validationObject);
            validations.checkMaxLength("ADDCOMMETS", leads[i].ADDCOMMETS, 500, "Length of Business or Law Office should be less than or equal to 500 characters", validationObject);
            validations.checkMaxLength("PHONE", leads[i].PHONE, 15, "Length of Phone Number should be less than or equal to 15 characters", validationObject);




            validations.checkNull("CLNT", leads[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", leads[i].LANG, "Language is required", validationObject);
            validations.checkNull("CID", leads[i].CID, "Leads ID is required", validationObject);
            validations.checkNull("FRSTNM", leads[i].FRSTNM, "First name is required", validationObject);
            validations.checkNull("LSTNM", leads[i].LSTNM, "Last name is required", validationObject);
            validations.checkNull("MODEOFSRC", leads[i].MODEOFSRC, "Lead source is required", validationObject);
            //validations.checkNull("CATCODE", leads[i].CATCODE, "Category is required", validationObject);
            //validations.checkNull("TYPSERV", leads[i].TYPSERV, "Service type is required", validationObject);
            validations.checkNull("EMAILID", leads[i].EMAILID, "Email id is required", validationObject);
            //validations.checkNull("PHONE", leads[i].PHONE, "Phone Number is required", validationObject);



            if(Object.keys(validationObject).length != 0)
                validationObjects[i] = validationObject;

        }
        
        // if data is not valid, throw validation errors
        if(Object.keys(validationObjects).length != 0)
        {
            throw new Error(JSON.stringify(validationObjects));
        }
        else
        {
            // Get system date and time
            let curDate = sysDateTime.sysdate_yyyymmdd();
            let curTime = sysDateTime.systime_hh24mmss();
            
            for(let i=0; i<leads.length; i++)
            {                

                leads[i].FULLNM = leads[i].FRSTNM + " " + leads[i].LSTNM;

                // Add update params 
                leads[i].UDATE = curDate;
                leads[i].UTIME = curTime;
                leads[i].UUSER = loginUser.USERID.toLowerCase();
        
            }
        
            return leads;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Validation funtion for deletion
const validateDELETEData = async (leads) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < leads.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", leads[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", leads[i].LANG, "Language is required", validationObject);
            validations.checkNull("CID", leads[i].CID, "Leads ID is required", validationObject);

            if(Object.keys(validationObject).length != 0)
                validationObjects[i] = validationObject;

        }
        
        // if data is not valid, throw validation errors
        if(Object.keys(validationObjects).length != 0)
        {
            throw new Error(JSON.stringify(validationObjects));
        }
        else
        {
            // Get system date and time
            let curDate = sysDateTime.sysdate_yyyymmdd();
            let curTime = sysDateTime.systime_hh24mmss();
            
            for(let i=0; i<leads.length; i++)
            {                
                // Add delete params 
                leads[i].DDATE = curDate;
                leads[i].DTIME = curTime;
                leads[i].DUSER = loginUser.USERID.toLowerCase();
            }
        
            return leads;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Function to check uniqueness of data
const checkDuplicateLeads = async (leads) =>
{
    try 
    {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
    
        for(let i = 0; i < leads.length; i++)
        {
            placeHolders = [
                (typeof leads[i].CLNT !== 'undefined' && leads[i].CLNT.trim())        ?   leads[i].CLNT.trim()    : '',
                (typeof leads[i].LANG !== 'undefined' && leads[i].LANG.trim())        ?   leads[i].LANG.trim()    : '',
                (typeof leads[i].CID !== 'undefined' && leads[i].CID.trim())          ?   leads[i].CID.trim()     : ''
            ];
    
            result = await dbServices.getTableData(checkDuplicateLeadsQuery, placeHolders)
            
            if(parseInt(result[0].COUNT) > 0)
            {
                duplicateRecordsMessage = duplicateRecordsMessage + "Record " + (i+1) + ": Duplicate record found. "; 
                duplicateCount = duplicateCount + 1;       
            }
            else
            {
                recordsNotFoundMessage = recordsNotFoundMessage + "Record " + (i+1) + ": Record not found. ";
            }
    
        }
        
        // if duplicate records found
        if(parseInt(duplicateCount) != 0)
        {
            return {
                isDuplicate : true,
                duplicateRecordsMessage : duplicateRecordsMessage,          // For duplicate records
                recordsNotFoundMessage : recordsNotFoundMessage,            // For unavailable records
                duplicateCount : duplicateCount
            };
        }
        {
            return {
                isDuplicate : false,
                duplicateRecordsMessage : "",
                recordsNotFoundMessage : recordsNotFoundMessage,            // For unavailable records
                duplicateCount : duplicateCount
            };
        }        
    } 
    catch (error) 
    {
        throw error;    
    }        

}


/*// function for creating leads records
const createLeads = async (leads) =>
{
    try 
    {                        
        let insertDML = `
            INSERT INTO EXLEADS
            SET ?
        `;

        let valuesArray = leads;

        // Use database service to insert records in table 
        let recordsInserted = await dbServices.insertTableRecords(insertDML, valuesArray) ;
        //console.log("result => ");  console.log(result);

        return recordsInserted;        
    } 
    catch (error) 
    {
        throw error;    
    }

}*/

// function for creating leads records
const createLeads = async (leads) =>
{
    try 
    {   
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;
        let leadIDs = [] ;

        for(let i = 0; i < leads.length; i++)
        {
            // form the data json
            dataJSON = leads[i];
            leadIDs[i] = leads[i].CID;

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("EXLEADS", dataJSON);
            insertStatements.push(insertStatement);
            //console.log("insertStatement => ");  console.log(insertStatement);

            /****------ Block for Contacts -----***/

                // Check if contact already exists of not (using email id)
                let duplicateObj =  await contactsServices.checkDuplicateContactsEmail(dataJSON.CLNT, dataJSON.LANG, dataJSON.EMAILID);

                // if all goes well, then create records
                if(duplicateObj.isDuplicate)        // Update Contacts
                {
                    // for the data JSON
                    let contactsDataJSON = {	 
                        "CLNT":dataJSON.CLNT,
                        "LANG":dataJSON.LANG,
                        "FRSTNM":dataJSON.FRSTNM,
                        "LSTNM":dataJSON.LSTNM,
                        "CONTACTTYPE":"Lead",
                        "DISNAME":dataJSON.FULLNM,
                        "PHONE":dataJSON.PHONE,
                        "EMAILID":dataJSON.EMAILID,
                        "COMPANY":dataJSON.OFFICENM,
                        "ADDR":dataJSON.ADDRESS||'',
                        "CITY":dataJSON.CITY||'',
                        "STATE":dataJSON.STATE||'',
                        "PINC":dataJSON.ZIPCD||'',
                        "BESTTMCAL":dataJSON.BESTTMCAL,
                        "MODOFCON":dataJSON.MODOFCON,
                        //"CONTACTID":dataJSON.CID,
                        "UDATE" : sysDateTime.sysdate_yyyymmdd(),
                        "UTIME" : sysDateTime.systime_hh24mmss(),
                        "UUSER" : loginUser.USERID.toLowerCase(),
                        "ISDEL" : "N"
                    };

                    // for the clause JSON
                    let contactsClauseSON = {	 
                        "CLNT":dataJSON.CLNT,
                        "LANG":dataJSON.LANG,
                        "EMAILID":dataJSON.EMAILID
                    };
                    
                    // Get the update statement
                    let updateContactsStatement = await dbServices.getUpdateStatement("TCONTACTS", contactsDataJSON, contactsClauseSON);
                    insertStatements.push(updateContactsStatement);

                }
                else        // Create contacts
                {
                    // Get auto-generated number for contacts id
                    let nextNumber = await numberSeries.getNextSeriesNumber(dataJSON.CLNT, "NA", "CNTID");

                    // for the data JSON
                    let contactsDataJSON = {	 
                        "CLNT":dataJSON.CLNT,
                        "LANG":dataJSON.LANG,
                        "FRSTNM":dataJSON.FRSTNM,
                        "LSTNM":dataJSON.LSTNM,
                        "CONTACTTYPE":"Lead",
                        "DISNAME":dataJSON.FULLNM,
                        "PHONE":dataJSON.PHONE,
                        "EMAILID":dataJSON.EMAILID,
                        "COMPANY":dataJSON.OFFICENM,
                        "ADDR":dataJSON.ADDRESS||'',
                        "CITY":dataJSON.CITY||'',
                        "STATE":dataJSON.STATE||'',
                        "PINC":dataJSON.ZIPCD||'',
                        "BESTTMCAL":dataJSON.BESTTMCAL,
                        "MODOFCON":dataJSON.MODOFCON,
                        "CONTACTID":nextNumber,
                        "CDATE" : dataJSON.CDATE,
                        "CTIME" : dataJSON.CTIME,
                        "CUSER" : loginUser.USERID.toLowerCase(),
                        "ISDEL" : "N"
                    };

                    // Get the insert statement
                    let insertContactsStatement = await dbServices.getInsertStatement("TCONTACTS", contactsDataJSON);
                    insertStatements.push(insertContactsStatement);

                }
            
            /****------ Block for Contacts Ends-----***/

        }
        
        
        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(insertStatements);

        //console.log('w3');
        if(affectedRecords != 0 )
        {
            //console.log('w4');
            sendLeadsSubmissionMail(leads);
        }
        
        //return affectedRecords;    
        return leadIDs;    

    } 
    catch (error) 
    {
        return error;    
    }
}


// function for updating leads records
const updateLeads = async (leads) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;
        let leadIDs = [] ;

        for(let i = 0; i < leads.length; i++)
        {
            // form the data json
            dataJSON = leads[i];
            leadIDs[i] = leads[i].CID;
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   leads[i].CLNT,
                "LANG"    :   leads[i].LANG,
                "CID"  :	  leads[i].CID
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("EXLEADS", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);
            //console.log("updateStatement => ");  console.log(updateStatement);

            /****------ Block for Contacts -----***/

                // Check if contact already exists of not (using email id)
                let duplicateObj =  await contactsServices.checkDuplicateContactsEmail(dataJSON.CLNT, dataJSON.LANG, dataJSON.EMAILID);

                // if all goes well, then create records
                if(duplicateObj.isDuplicate)        // Update Contacts
                {
                    // for the data JSON
                    let contactsDataJSON = {	 
                        "CLNT":dataJSON.CLNT,
                        "LANG":dataJSON.LANG,
                        "FRSTNM":dataJSON.FRSTNM,
                        "LSTNM":dataJSON.LSTNM,
                        "CONTACTTYPE":"Lead",
                        "DISNAME":dataJSON.FULLNM,
                        "PHONE":dataJSON.PHONE,
                        "EMAILID":dataJSON.EMAILID,
                        "COMPANY":dataJSON.OFFICENM,
                        "ADDR":dataJSON.ADDRESS||'',
                        "CITY":dataJSON.CITY||'',
                        "STATE":dataJSON.STATE||'',
                        "PINC":dataJSON.ZIPCD||'',
                        "BESTTMCAL":dataJSON.BESTTMCAL,
                        "MODOFCON":dataJSON.MODOFCON,
                        //"CONTACTID":dataJSON.CID,
                        "UDATE" : dataJSON.UDATE,
                        "UTIME" : dataJSON.UTIME,
                        "UUSER" : loginUser.USERID.toLowerCase(),
                        "ISDEL" : "N"
                    };

                    // for the clause JSON
                    let contactsClauseSON = {	 
                        "CLNT":dataJSON.CLNT,
                        "LANG":dataJSON.LANG,
                        "EMAILID":dataJSON.EMAILID
                    };
                    
                    // Get the update statement
                    let updateContactsStatement = await dbServices.getUpdateStatement("TCONTACTS", contactsDataJSON, contactsClauseSON);

                    updateStatements.push(updateContactsStatement);

                }
                else        // Create contacts
                {
                    // Get auto-generated number for contacts id
                    let nextNumber = await numberSeries.getNextSeriesNumber(dataJSON.CLNT, "NA", "CNTID");

                    // for the data JSON
                    let contactsDataJSON = {	 
                        "CLNT":dataJSON.CLNT,
                        "LANG":dataJSON.LANG,
                        "FRSTNM":dataJSON.FRSTNM,
                        "LSTNM":dataJSON.LSTNM,
                        "CONTACTTYPE":"Lead",
                        "DISNAME":dataJSON.FULLNM,
                        "PHONE":dataJSON.PHONE,
                        "EMAILID":dataJSON.EMAILID,
                        "COMPANY":dataJSON.OFFICENM,
                        "ADDR":dataJSON.ADDRESS||'',
                        "CITY":dataJSON.CITY||'',
                        "STATE":dataJSON.STATE||'',
                        "PINC":dataJSON.ZIPCD||'',
                        "BESTTMCAL":dataJSON.BESTTMCAL,
                        "MODOFCON":dataJSON.MODOFCON,
                        "CONTACTID":nextNumber,
                        "CDATE" : sysDateTime.sysdate_yyyymmdd(),
                        "CTIME" : sysDateTime.systime_hh24mmss(),
                        "CUSER" : loginUser.USERID.toLowerCase(),
                        "ISDEL" : "N"
                    };

                    // Get the insert statement
                    let insertContactsStatement = await dbServices.getInsertStatement("TCONTACTS", contactsDataJSON);
                    updateStatements.push(insertContactsStatement);

                }
            
            /****------ Block for Contacts Ends-----***/

        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        //return affectedRecords;  
        return leadIDs;

    } 
    catch (error) 
    {
        return error;    
    }
}

// function for logically deleting leads records
const logicalDeleteLeads = async (leads) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;
        let leadIDs = [] ;

        for(let i = 0; i < leads.length; i++)
        {
            // form the data json
            dataJSON = {
                "ISDEL"   :   "Y",
                "DDATE"	  :   leads[i].DDATE,
                "DTIME"	  :   leads[i].DTIME,
                "DUSER"	  :   leads[i].DUSER
            }
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   leads[i].CLNT,
                "LANG"    :   leads[i].LANG,
                "CID"  :	  leads[i].CID
            }

            leadIDs[i] = leads[i].CID;

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("EXLEADS", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);
            //console.log("updateStatement => ");  console.log(updateStatement);
        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        //return affectedRecords;  
        return leadIDs;

    } 
    catch (error) 
    {
        return error;    
    }
}


// function for phyically deleting leads records
const physicalDeleteLeads = async (leads) =>
{
    try 
    {   
        let deleteStatement;             
        let deleteStatements = [] ;
        let clauseJSON;
        let result;
        let affectedRecords = 0;
        let leadIDs = [] ;

        for(let i = 0; i < leads.length; i++)
        {
            // form the caluse json
            clauseJSON = {
                "CLNT"    :   leads[i].CLNT,
                "LANG"    :   leads[i].LANG,
                "CID"  :	  leads[i].CID
            }

            leadIDs[i] = leads[i].CID;

            // Get the delete statement
            deleteStatement = await dbServices.getDeleteStatement("EXLEADS", clauseJSON);
            deleteStatements.push(deleteStatement);
            //console.log("deleteStatement => ");  console.log(deleteStatement);

        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(deleteStatements);

        //return affectedRecords; 
        return leadIDs;
               
    } 
    catch (error) 
    {
        return error;    
    }
}



// function for sending emails after leads creation
const sendLeadsSubmissionMail = async (leads) =>
{
    try 
    {   
        
 
        let mailMessage, template, mailOptions, info;
         let Sub='';
        for(let i = 0; i < leads.length; i++)
        {
           
            if((leads[i].MODEOFSRC=='EM' || leads[i].MODEOFSRC=='PH' || leads[i].MODEOFSRC=='WK')){
               
            console.log(leads[i].MODEOFSRC);
            // if(leads[i].MODEOFSRC=="WMS"){
                //console.log('K 1')
                Sub=`Message Delivered – Confirmation`;
                mailMessage =  `
                To, <br>`+leads[i].FULLNM+`<br><br> We have received your request. 
                <br> One of our representatives will contact you in the next 24 hours. 
                <br><br> We look forward to speaking to you. 
                <br><br> If this is urgent and you need immediate assistance, please call us directly at 1.888.666.0089 
                <br><br> We will be more than happy to assist you. 
                <div><br><br><b>Thank you</b>
                <br><b>Support Team</b>
                <br><b>Excell Investigations</b>
                <br><b>www.excellinvestigations.net</b></div>
            `;
            // }
            // else{
                
            //     Sub=`Message Delivered – Confirmation`;
            // mailMessage =  `
            //     To, <br>`+leads[i].FULLNM+`<br>`+leads[i].OFFICENM+`<br><br> We have received your request for a free consultation. 
            //     <br> One of our representatives will contact you in the next 24 hours. 
            //     <br><br> We look forward to speaking to you. 
            //     <br><br> If this is urgent and you need immediate assistance, please call us directly at 1.888.666.0089 
            //     <br><br> We will be more than happy to assist you. 
            //     <div><br><b>Thank you</b>
            //     <br><b>Support Team</b>
            //     <br><b>Excell Investigations</b>
            //     <br><b>www.excellinvestigations.net</b></div>
            // `;
            // }
            template = emailTemplateServices.emailTemplate(mailMessage);
            
            mailOptions = {
                from : `Excell Support <support@excellinvestigation.com>`,
                to : leads[i].EMAILID,
                cc : ``,        
                subject : Sub,
                html : template,
                attachments : []
            };
 
 
    
    
            info = await emailServices.sendEmails(mailOptions); 
          
    
        }
    }
    } 
    catch (error) 
    {
 
 
        return error;    
    }
}
/**
 * Update Leads Status
 **/
// resolver function for updating leads status
const UpdateLeadStatus = async (args, context, info) =>
{
    try 
    {   
        loginUser = validations.getLoginData(context);
        
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;
        let leadIDs = [];
        let leadstatus = args.leadstatus;

        for(let i = 0; i < leadstatus.length; i++)
        {

            // form the data json
            dataJSON = {
                "STATUS"    :   leadstatus[i].STATUS,
                "ASSIGNTO"  :   leadstatus[i].ASSIGNTO,
                "UDATE"     :   sysDateTime.sysdate_yyyymmdd(),
                "UTIME"     :   sysDateTime.systime_hh24mmss(),
                "UUSER"     :   loginUser.USERID.toLowerCase()
            };
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   leadstatus[i].CLNT,
                "LANG"    :   leadstatus[i].LANG,
                "CID"  :	  leadstatus[i].CID
            };

            leadIDs[i] = leadstatus[i].CID;

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("EXLEADS", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);
            //console.log("updateStatement => ");  console.log(updateStatement);

    }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        return leadIDs;        
    } 
    catch (error) 
    {
        return error;    
    }
}



// Export functions
module.exports = {
    searchLeads,
    searchDashboardLeads,
    leadDetails,
    LeadsCRUDOps,
    UpdateLeadStatus,
    searchLeadsMails
};
