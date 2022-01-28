/**
 * @author 
 */

// Import section
import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';
import { isNullOrUndefined } from 'util';
import {emailTemplate} from './emailTemplateServices'
import emailServices from '../services/emailServices';
const pdftempate=require('./HtmlTemplate')
const pdf=require('html-pdf')
import {
    checkDuplicateContractsQuery,
    getContractDetailsQuery,
    getContractTemplateQuery,
    getClientDetailsQuery
} from '../common/sqlQueries';


// Logged in user
var loginUser = {CLNT:"1002",LANG:"EN",USERNAME:"Sohan Patil",USERID:"SP0001",AUTH:{GRPID:"EXUSRS",GRPNM:"EMPLOYEE GROUP",}};


/*******----------------- Query Section ------------------------ **********/

// Resolver function for query contractDetails(input) : [Contract]
const contractDetails = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = getContractDetailsQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())        ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())        ?   args.LANG.trim()          : '',
            (typeof args.CIDSYS !== 'undefined' && args.CIDSYS.trim())    ?   args.CIDSYS.trim()     : ''
        ];
    
        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders) ;

        // Convert Blob Buffer to String
        if(result.length !=0)
        {
            let customContractBuffer = result[0].CUSTOMCON;
    
            if(!isNullOrUndefined(customContractBuffer))
                result[0].CUSTOMCON = Buffer.from(customContractBuffer).toString();

        }

        return result;        
    } 
    catch (error) 
    {
        return error;    
    }

}


// Resolver function for query contractDetails(input) : [Contract]
const contractTemplate = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = getContractTemplateQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())        ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())        ?   args.LANG.trim()          : '',
            (typeof args.SERVICETYPE !== 'undefined' && args.SERVICETYPE.trim())    ?   args.SERVICETYPE.trim()     : ''
        ];
    
        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders) ;

        // Convert Blob Buffer to String
        if(result.length !=0)
        {
            let customContractBuffer = result[0].CONTRACTDETAILS;
    
            if(!isNullOrUndefined(customContractBuffer))
                result[0].CONTRACTDETAILS = Buffer.from(customContractBuffer).toString();

        }


        return result;        
    } 
    catch (error) 
    {
        return error;    
    }

}


/******---------------------- Mutation Section --------------------- ******/

/**
 * CRUD Operations for Contracts
 **/
// Resolver function for mutation ContractsCRUDOps(input) : String




const clientDetails = async (CLNT,LANG,CLNTID,EMAILID) =>
{
    try 
    {
        

        let selectQuery = getClientDetailsQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (CLNT !== 'undefined' && CLNT.trim())              ?   CLNT.trim()          : '',
            (LANG !== 'undefined' && LANG.trim())              ?   LANG.trim()          : '',
            (CLNTID !== 'undefined' && CLNTID.trim())          ?   CLNTID.trim()        : '%%',
            (EMAILID !== 'undefined' && EMAILID.trim())        ?   EMAILID.trim()       : '%%'            
        ];
    
        // Use database service to get table data
        console.log(placeHolders)
        let result = await dbServices.getTableData(selectQuery, placeHolders) ;

        //console.log(result);

        return result;        
    } 
    catch (error) 
    {
        console.log(error)
        return error;    
    }

}

const sendReminderMail = async (contract,client) =>
{
    let bstr
    console.log('in remider wqe')
    try 
    {   
        let template, mailOptions
        console.log(contract) 
        if(contract.TYPOFCONTRACT==='PROCESS'){       
        bstr =await pdftempate.ProcessContract(contract.FULLNM,contract.CONTACTTYPE,contract.TOTAL,contract.RATEPERH,contract.RATEPERM,contract.OTHER,contract.MAXH)
        }
        if(contract.TYPOFCONTRACT==='ASSET'){       
            bstr =await pdftempate.AssetContract(contract.FULLNM,contract.CONTACTTYPE,contract.TOTAL,contract.RATEPERH,contract.RATEPERM,contract.OTHER,contract.MAXH)
            } 
        if(contract.TYPOFCONTRACT==='INFIDELITY'){       
                bstr =await pdftempate.InfidelityContract(contract.FULLNM,contract.CONTACTTYPE,contract.TOTAL,contract.RATEPERH,contract.RATEPERM,contract.OTHER,contract.MAXH)
        }
        if(contract.TYPOFCONTRACT==='LOCATE'){       
                    bstr =await pdftempate.LocateContract(contract.FULLNM,contract.CONTACTTYPE,contract.TOTAL,contract.RATEPERH,contract.RATEPERM,contract.OTHER,contract.MAXH)
        }
        if(contract.TYPOFCONTRACT==='CUSTOM'){       
            bstr =await pdftempate.CUSTOM(contract.CUSTOMCON)
        }              
            let pdfbuffer=pdf.create(bstr,pdftempate.config).toBuffer(async(error,buffer)=>{
                console.log('2')
                if(error){
                    return Promise.reject();
                }
                
                template=contract.MAILBODY
                //`Dear ${client.FIRSTNM+' '+client.LASTNM},<br/>
                //<p>Please check the attached contract and if any modification required please revert back.</p>`
                console.log(template)
                template= emailTemplate(template)
                console.log(contract.TO)
                mailOptions = {
                    from : "support@excellinvestigation.com",
                    to : contract._TO,
                    //to : invoiceInfo[0].CUSTMAIL,
                    cc : `Kedar Lachke <kedarlachke1@gmail.com>,${contract.CC}`,
                    bcc: contract.BCC,        
                    subject : contract.SUBJECT,
                    html : template,
                    attachments : [{'filename': 'contract.pdf', 'content': buffer}]
                };
                console.log(mailOptions)
                // Send email
                
                info = await emailServices.sendEmails(mailOptions); 
                return Promise.resolve();
            })
            
            
            //console.log(info);  
            
        

    } 
    catch (error) 
    {console.log('error')
        console.log(error);
        return error;    
    }
}

const MailContract =async (args, context, info)=>{
    loginUser = validations.getLoginData(context);
    let affectedRecords=0
    let transaction = args.transaction;
    let contracts=await validateContract(args.contracts)
    let duplicateObj =  await checkDuplicateContracts(contracts);
        console.log(duplicateObj)
    if(duplicateObj.isDuplicate)
            {   console.log(transaction)
                affectedRecords = await updateContracts(contracts);
            }
            else{console.log(transaction)
                affectedRecords = await createContracts(contracts);
            }
        if(affectedRecords>0){
    let clients =await  clientDetails(contracts[0].CLNT,contracts[0].LANG,contracts[0].CLIENTID,'')
    
     sendReminderMail(contracts[0],clients[0])
    return 'Contract is mailed to client'
        }else{
            return 'some thing went wrong'
        }
}


const ContractsCRUDOps = async (args, context, info) =>
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

            // Validate input data
            let contracts = await validateContract(args.contracts);

            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateContracts(contracts);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createContracts(contracts);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let contracts = await validateContract(args.contracts);

            // Check availability of records
            let duplicateObj =  await checkDuplicateContracts(contracts);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != contracts.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateContracts(contracts);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let contracts = await validateDELETEData(args.contracts);

            // Check availability of records
            let duplicateObj =  await checkDuplicateContracts(contracts);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != contracts.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteContracts(contracts);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let contracts = await validateDELETEData(args.contracts);

            // Check availability of records
            let duplicateObj =  await checkDuplicateContracts(contracts);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != contracts.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteContracts(contracts);
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

const validateContract= async(contracts)=>{
    let validationObjects = {};

        for(let i = 0; i < contracts.length; i++)
        {
            let validationObject = {};
            if(contracts[i].TYPOFCONTRACT!='CUSTOM'){
            
            validations.checkNull("CLNT", contracts[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", contracts[i].LANG, "LANG is required", validationObject);
            validations.checkNull("CLIENTID", contracts[i].CLIENTID, "CLIENTID is required", validationObject);
            validations.checkNull("CIDSYS", contracts[i].CIDSYS, "CIDSYS is required", validationObject);
            validations.checkNull("CONTACTTYPE", contracts[i].CONTACTTYPE, "required", validationObject);
            validations.checkNull("FULLNM", contracts[i].FULLNM, "required", validationObject);
            validations.checkNull("TOTAL", contracts[i].TOTAL, "required", validationObject);
            validations.checkNull("RATEPERH", contracts[i].RATEPERH, "required", validationObject);
            validations.checkNull("RATEPERM", contracts[i].RATEPERM, "required", validationObject);
            validations.checkNull("MAXH", contracts[i].MAXH, "required", validationObject);
            validations.checkNull("OTHER", contracts[i].OTHER, "required", validationObject);
            validations.checkNull("SERVICETYPE", contracts[i].SERVICETYPE, "required", validationObject);
            }else{
                validations.checkNull("CUSTOMCON", contracts[i].CUSTOMCON, "required", validationObject);
            }
            
            if(Object.keys(validationObject).length != 0)
                validationObjects[i] = validationObject;
        
        }
        if(Object.keys(validationObjects).length != 0)
        {
            throw new Error(JSON.stringify(validationObjects));
        }else 
            return contracts
}
const validateCREATEData = async (contracts) =>
{
    try 
    {
        let validationObjects = {};

        /*for(let i = 0; i < contracts.length; i++)
        {
            let validationObject = {};

        }*/
        
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
            
            for(let i = 0; i < contracts.length; i++)
            {
                // Get auto-generated number for contracts id
                //nextNumber = await numberSeries.getNextSeriesNumber(contracts[i].CLNT, "NA", "CNTRID");
                
                // Add auto-generated number as contracts id
                //contracts[i].CONTRACTID = nextNumber;
                
                // Add create params 
                contracts[i].CDATE = curDate;
                contracts[i].CTIME = curTime;
                contracts[i].ISDEL = "N";
                contracts[i].CUSER = loginUser.USERID.toLowerCase();
        
                // convert CUSTOMCON to Buffer
                if(!isNullOrUndefined(contracts[i].CUSTOMCON))
                    contracts[i].CUSTOMCON = Buffer.from(contracts[i].CUSTOMCON);
            }
        
            return contracts;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for updation
const validateUPDATEData = async (contracts) =>
{
    try 
    {
        let validationObjects = {};

        /* for(let i = 0; i < contracts.length; i++)
        {
            let validationObject = {};

        } */
        
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
            
            for(let i=0; i<contracts.length; i++)
            {                

                // Add update params 
                contracts[i].UDATE = curDate;
                contracts[i].UTIME = curTime;        
                contracts[i].UUSER = loginUser.USERID.toLowerCase();

                // convert CUSTOMCON to Buffer
                if(!isNullOrUndefined(contracts[i].CUSTOMCON))
                    contracts[i].CUSTOMCON = Buffer.from(contracts[i].CUSTOMCON);
            }
        
            return contracts;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for deletion
const validateDELETEData = async (contracts) =>
{
    try 
    {
        let validationObjects = {};

        /* for(let i = 0; i < contracts.length; i++)
        {
            let validationObject = {};

        } */
        
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
            
            for(let i=0; i<contracts.length; i++)
            {                
                // Add delete params 
                contracts[i].DDATE = curDate;
                contracts[i].DTIME = curTime;
                contracts[i].DUSER = loginUser.USERID.toLowerCase();        
            }
        
            return contracts;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Function to check uniqueness of data
const checkDuplicateContracts = async (contracts) =>
{
    try 
    {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
    
        for(let i = 0; i < contracts.length; i++)
        {
            placeHolders = [
                (typeof contracts[i].CLNT !== 'undefined' && contracts[i].CLNT.trim())        ?   contracts[i].CLNT.trim()    : '',
                (typeof contracts[i].LANG !== 'undefined' && contracts[i].LANG.trim())        ?   contracts[i].LANG.trim()    : '',
                (typeof contracts[i].CIDSYS !== 'undefined' && contracts[i].CIDSYS.trim())    ?   contracts[i].CIDSYS.trim()  : ''
            ];
    
            result = await dbServices.getTableData(checkDuplicateContractsQuery, placeHolders)
            
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




// function for creating contracts records
const createContracts = async (contracts) =>
{
    try 
    {   
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < contracts.length; i++)
        {
            // form the data json
            dataJSON = contracts[i];

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("TCONTRACTCOM", dataJSON);
            insertStatements.push(insertStatement);
            //console.log("insertStatement => ");  console.log(insertStatement);

        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(insertStatements);

        return affectedRecords;        

    } 
    catch (error) 
    {
        return error;    
    }
}


// function for updating contracts records
const updateContracts = async (contracts) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < contracts.length; i++)
        {
            // form the data json
            dataJSON = contracts[i];
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   contracts[i].CLNT,
                "LANG"    :   contracts[i].LANG,
                "CIDSYS"  :	  contracts[i].CIDSYS
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("TCONTRACTCOM", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);
            //console.log("updateStatement => ");  console.log(updateStatement);
        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        return affectedRecords;        
    } 
    catch (error) 
    {
        return error;    
    }
}


// function for logically deleting contracts records
const logicalDeleteContracts = async (contracts) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < contracts.length; i++)
        {
            // form the data json
            dataJSON = {
                "ISDEL"   :   "Y",
                "DDATE"	  :   contracts[i].DDATE,
                "DTIME"	  :   contracts[i].DTIME,
                "DUSER"	  :   loginUser.USERID.toLowerCase()
            }
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   contracts[i].CLNT,
                "LANG"    :   contracts[i].LANG,
                "CIDSYS"  :	  contracts[i].CIDSYS
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("TCONTRACTCOM", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);
            //console.log("updateStatement => ");  console.log(updateStatement);
        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        return affectedRecords;        
    } 
    catch (error) 
    {
        return error;    
    }
}


// function for phyically deleting contracts records
const physicalDeleteContracts = async (contracts) =>
{
    try 
    {   
        let deleteStatement;             
        let deleteStatements = [] ;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < contracts.length; i++)
        {
            // form the caluse json
            clauseJSON = {
                "CLNT"    :   contracts[i].CLNT,
                "LANG"    :   contracts[i].LANG,
                "CIDSYS"  :	  contracts[i].CIDSYS
            }

            // Get the delete statement
            deleteStatement = await dbServices.getDeleteStatement("TCONTRACTCOM", clauseJSON);
            deleteStatements.push(deleteStatement);
            //console.log("deleteStatement => ");  console.log(deleteStatement);

        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(deleteStatements);

        return affectedRecords;        
    } 
    catch (error) 
    {
        return error;    
    }
}


// Export functions
module.exports = {
    contractDetails,
    contractTemplate,
    ContractsCRUDOps,
    MailContract
};

