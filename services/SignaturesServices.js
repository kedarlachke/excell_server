/**
 * @author Kedar Lachke
 */

// Import section
import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';

import {
    eSignatureQuery
} from '../common/sqlQueries';


// Logged in user
var loginUser = {CLNT:"1002",LANG:"EN",USERNAME:"Sohan Patil",USERID:"SP0001",AUTH:{GRPID:"EXUSRS",GRPNM:"EMPLOYEE GROUP",}};


// Resolver function for query searchESignature(input) : [ESignature]
const searchESignature = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let exactMatch = args.exactMatch;
        let selectQuery;
    
        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : '',
            (typeof args.SIGNATUREID !== 'undefined' && args.SIGNATUREID.trim())?   args.SIGNATUREID.trim()   : '%%',
            (typeof args.CID !== 'undefined' && args.CID.trim())                ?   args.CID.trim()           : '%%',
            (typeof args.CIDSYS !== 'undefined' && args.CIDSYS.trim())          ?   args.CIDSYS.trim()        : '%%'
        ];
    
        if(exactMatch)
        {
            selectQuery = eSignatureQuery;
        }
        else
        {
            selectQuery = '';
        }

		 //console.log(selectQuery);
         //console.log(placeHolders);
         
        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders) ;
    
        return result;        
    } 
    catch (error) 
    {
        return error;    
    }

}


/******---------------------- Mutation Section --------------------- ******/

/**
 * CRUD Operations for ESignatures
 **/
// Resolver function for mutation ESignaturesCRUDOps(input) : String
const ESignaturesCRUDOps = async (args, context, info) =>
{//console.log("Hello Hello 1");

    try 
    {    
        loginUser = validations.getLoginData(context);
                            
        // Get the transaction from arguments
        let transaction = args.transaction;
        //console.log(args.transaction);
        

        let affectedRecords = 0;

        // If transaction is not available
        if(typeof transaction === 'undefined' || transaction.trim().length == 0)
            throw new Error("Transaction is required and can not be empty.");

        transaction = transaction.trim().toUpperCase();    
        
        if(transaction == "CREATE")     // Create 
        {

            // Validate input data
            //console.log(args.ESignatures);
            
            let ESignatures = await validateCREATEData(args.ESignatures);
            //console.log(ESignatures);
            // Check uniqueness of input data
            //let duplicateObj =  await checkDuplicateESignatures(ESignatures);

            // if all goes well, then create records
            
                affectedRecords = await createESignatures(ESignatures);
            

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let ESignatures = await validateUPDATEData(args.ESignatures);
            //console.log(ESignatures);
            

                affectedRecords = await updateESignatures(ESignatures);
            

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

        

// function for creating ESignatures records
const createESignatures = async (ESignatures) =>
{
    try 
    {   
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;
        let ESignaturesIDs = [];
//console.log('Hello hello');

        for(let i = 0; i < ESignatures.length; i++)
        {
            // form the data json
            dataJSON = ESignatures[i];
            ESignaturesIDs[i] = dataJSON.SIGNATUREID;

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("SIGNATURE", dataJSON);
            insertStatements.push(insertStatement);
           // //console.log("insertStatement => ");  //console.log(insertStatement);

        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(insertStatements);

        //return affectedRecords;  
        //console.log(ESignaturesIDs);
              
        return ESignaturesIDs;        

    } 
    catch (error) 
    {
        return error;    
    }
}


// function for updating ESignatures records
const updateESignatures = async (ESignatures) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;
        let ESignaturesIDs = [];

        for(let i = 0; i < ESignatures.length; i++)
        {
            // form the data json
            dataJSON = ESignatures[i];
            ESignaturesIDs[i] = dataJSON.SIGNATUREID;
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   ESignatures[i].CLNT,
                "LANG"    :   ESignatures[i].LANG,
                "SIGNATUREID"  :   ESignatures[i].SIGNATUREID
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("SIGNATURE", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);
            //console.log("updateStatement => ");  console.log(updateStatement);
        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        //return affectedRecords;    
        return ESignaturesIDs;

    } 
    catch (error) 
    {
        return error;    
    }
}

const validateCREATEData = async (ESignatures) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < ESignatures.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", ESignatures[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", ESignatures[i].LANG, "Language is required", validationObject);
            validations.checkNull("CID", ESignatures[i].CID, "Client Id is required", validationObject);
            //validations.checkNull("LSTNM", ESignatures[i].LSTNM, "Last name is required", validationObject);
            validations.checkNull("CIDSYS", ESignatures[i].CIDSYS, "Case Id is required", validationObject);
            //validations.checkNull("ESignaturesID", ESignatures[i].SIGNATUREID, "Signature id is required", validationObject);
            validations.checkNull("TAGOPEN", ESignatures[i].TAGOPEN, "Open Tags are required", validationObject);
            validations.checkNull("SIGNATURE", ESignatures[i].SIGNATURE, "Signature is required", validationObject);
            validations.checkNull("TAGOPEN", ESignatures[i].TAGCLOSE, "Closing Tags are required", validationObject);
            
            validations.checkMaxLength("TAGOPEN", ESignatures[i].TAGOPEN, 100, "Length of open tags should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("TAGCLOSE", ESignatures[i].TAGCLOSE, 100, "Length of closing tags should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("SIGNATURE", ESignatures[i].SIGNATURE, 100, "Length of signature should be less than or equal to 100 characters", validationObject);
            
                 
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
            
            for(let i = 0; i < ESignatures.length; i++)
            {
                // Get auto-generated number for ESignatures id
                nextNumber = await numberSeries.getNextSeriesNumber(ESignatures[i].CLNT, "NA", "CNTID");
                
                // Add auto-generated number as ESignatures id
                ESignatures[i].SIGNATUREID = nextNumber;
                
               

                // Add create params 
                ESignatures[i].CDATE = curDate;
                ESignatures[i].CTIME = curTime;
                ESignatures[i].ISDEL = "N";
                ESignatures[i].CUSER = loginUser.USERID.toLowerCase();
        
            }
        
            return ESignatures;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for updation
const validateUPDATEData = async (ESignatures) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < ESignatures.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", ESignatures[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", ESignatures[i].LANG, "Language is required", validationObject);
            validations.checkNull("CID", ESignatures[i].CID, "Client Id is required", validationObject);
            //validations.checkNull("LSTNM", ESignatures[i].LSTNM, "Last name is required", validationObject);
            validations.checkNull("CIDSYS", ESignatures[i].CIDSYS, "Case Id is required", validationObject);
            validations.checkNull("ESignaturesID", ESignatures[i].SIGNATUREID, "Signature id is required", validationObject);
            validations.checkNull("TAGOPEN", ESignatures[i].TAGOPEN, "Open Tags are required", validationObject);
            validations.checkNull("SIGNATURE", ESignatures[i].SIGNATURE, "Signature is required", validationObject);
            validations.checkNull("TAGOPEN", ESignatures[i].TAGCLOSE, "Closing Tags are required", validationObject);
            
            validations.checkMaxLength("TAGOPEN", ESignatures[i].TAGOPEN, 100, "Length of open tags should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("TAGCLOSE", ESignatures[i].TAGCLOSE, 100, "Length of closing tags should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("SIGNATURE", ESignatures[i].SIGNATURE, 100, "Length of signature should be less than or equal to 100 characters", validationObject);
            if(Object.keys(validationObject).length != 0)
                validationObjects[i] = validationObject;
                //console.log(validationObject);
                

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
            
            for(let i=0; i<ESignatures.length; i++)
            {                

              
                // Add update params 
                ESignatures[i].UDATE = curDate;
                ESignatures[i].UTIME = curTime;
                ESignatures[i].UUSER = loginUser.USERID.toLowerCase();        
            }
        
            return ESignatures;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

module.exports = {
    searchESignature,
    ESignaturesCRUDOps
};