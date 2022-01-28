/**
 * @author Kedar Lachke
 */

// Import section
import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';
import client from '../services/clientServices';
import {
    searchRatecardQuery,
    checkDuplicateRatecardQuery,
    getRatecardDetailsQuery,
    getRatecardForClientQuery,
    checkDuplicateRatecardForClientQuery
} from '../common/sqlQueries';

/*******----------------- Query Section ------------------------ **********/

// Logged in user
var loginUser = {CLNT:"1002",LANG:"EN",USERNAME:"Sohan Patil",USERID:"SP0001",AUTH:{GRPID:"EXUSRS",GRPNM:"EMPLOYEE GROUP",}};


// Resolver function for query searchRatecards(input) : [Ratecards]
const searchRatecards = async (args, context, info) =>
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
            (typeof args.CLIENTID !== 'undefined' && args.CLIENTID.trim())        ?   args.CLIENTID.trim()    : '%%',
            (typeof args.CIDSYS !== 'undefined' && args.CIDSYS.trim())        ?   args.CIDSYS.trim()          : '%%',
            (typeof args.ITEMID !== 'undefined' && args.ITEMID.trim())            ?   args.ITEMID.trim()      : '%%',
            (typeof args.ITEMDECS !== 'undefined' && args.ITEMDECS.trim())        ?   args.ITEMDECS.trim()    : '%%',
            (typeof args.ISACTIVE !== 'undefined' && args.ISACTIVE.trim())        ?   args.ISACTIVE.trim()    : '%%'
            
        ];
    
        if(exactMatch)
        {
            selectQuery = searchRatecardQuery;
        }
        else
        {
            selectQuery = searchRatecardQuery;
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

// Function to check uniqueness of data
const checkDuplicateRatecards = async (ratecards) =>
{
    try 
    {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
    
        for(let i = 0; i < ratecards.length; i++)
        {
            placeHolders = [
                (typeof ratecards[i].CLNT !== 'undefined' && ratecards[i].CLNT.trim())        ?   ratecards[i].CLNT.trim()    : '',
                (typeof ratecards[i].LANG !== 'undefined' && ratecards[i].LANG.trim())        ?   ratecards[i].LANG.trim()    : '',
                (typeof ratecards[i].CLIENTID !== 'undefined' && ratecards[i].CLIENTID.trim())                ?   ratecards[i].CLIENTID.trim()        : '%%',
                (typeof ratecards[i].CIDSYS !== 'undefined' && ratecards[i].CIDSYS.trim())                    ?   ratecards[i].CIDSYS.trim()          : '%%',
                (typeof ratecards[i].ITEMID !== 'undefined' && ratecards[i].ITEMID.trim())                    ?   ratecards[i].ITEMID.trim()          : '%%'
            ];
           
            result = await dbServices.getTableData(checkDuplicateRatecardQuery, placeHolders)
            //console.log(result);
            
            
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

// function for creating Ratecards records
const createRatecards = async (Ratecards) =>
{
    try 
    {   
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;
        let ratecardIDs = [];

        for(let i = 0; i < Ratecards.length; i++)
        {
            // form the data json
            dataJSON = Ratecards[i];
            ratecardIDs[i] = dataJSON.ITEMID;

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("EXRATECARD", dataJSON);
            insertStatements.push(insertStatement);
            //console.log("insertStatement => ");  console.log(insertStatement);

        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(insertStatements);

        //return affectedRecords;        
        return ratecardIDs;        

    } 
    catch (error) 
    {
        return error;    
    }
}


// function for updating Ratecards records
const updateRatecards = async (Ratecards) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;
        let RatecardIDs = [];

        for(let i = 0; i < Ratecards.length; i++)
        {
            // form the data json
            dataJSON = Ratecards[i];
            RatecardIDs[i] = dataJSON.ITEMID;
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   Ratecards[i].CLNT,
                "LANG"    :   Ratecards[i].LANG,
                "CLIENTID":   Ratecards[i].CLIENTID,
                "CIDSYS"  :	  Ratecards[i].CIDSYS,
                "ITEMID"  :	  Ratecards[i].ITEMID
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("EXRATECARD", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);
            //console.log("updateStatement => ");  console.log(updateStatement);
        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        //return affectedRecords;    
        return RatecardIDs;

    } 
    catch (error) 
    {
        return error;    
    }
}

// function for logically deleting ratecards records
const logicalDeleteRatecards = async (ratecards) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;
        let ratecardIDs = [];

        for(let i = 0; i < ratecards.length; i++)
        {
            // form the data json
            dataJSON = {
                "CLNT"    :   ratecards[i].CLNT,
                "LANG"    :   ratecards[i].LANG,
                "CLIENTID":   ratecards[i].CLIENTID,
                "CIDSYS"  :	  ratecards[i].CIDSYS,
                "ITEMID"  :	  ratecards[i].ITEMID,
                "ISDEL"  :   "Y"
            }
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   ratecards[i].CLNT,
                "LANG"    :   ratecards[i].LANG,
                "CLIENTID":   ratecards[i].CLIENTID,
                "CIDSYS"  :	  ratecards[i].CIDSYS,
                "ITEMID"  :	  ratecards[i].ITEMID
            }

            ratecardIDs[i] = ratecards[i].ITEMID;

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("EXRATECARD", dataJSON, clauseJSON);
            
            
            updateStatements.push(updateStatement);
            //console.log("updateStatement => ");  console.log(updateStatement);
        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        //return affectedRecords;     
        return ratecardIDs;

    } 
    catch (error) 
    {
        return error;    
    }
}


// function for phyically deleting ratecards records
const physicalDeleteRatecards = async (ratecards) =>
{
    try 
    {   
        let deleteStatement;             
        let deleteStatements = [] ;
        let clauseJSON;
        let result;
        let affectedRecords = 0;
        let ratecardIDs = [];

        for(let i = 0; i < ratecards.length; i++)
        {
            // form the caluse json
            clauseJSON = {
                "CLNT"    :   ratecards[i].CLNT,
                "LANG"    :   ratecards[i].LANG,
                "CONTACTID"  :	  ratecards[i].CONTACTID
            }

            ratecardIDs[i] = ratecards[i].CONTACTID;
            
            // Get the delete statement
            deleteStatement = await dbServices.getDeleteStatement("EXRATECARD", clauseJSON);
            deleteStatements.push(deleteStatement);
            //console.log("deleteStatement => ");  console.log(deleteStatement);

        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(deleteStatements);

        //return affectedRecords;  
        return ratecardIDs;
              
    } 
    catch (error) 
    {
        return error;    
    }
}



// Validation funtion for creation
const validateCREATEData = async (ratecards) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < ratecards.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", ratecards[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", ratecards[i].LANG, "Language is required", validationObject);
            validations.checkNull("CLIENTID", ratecards[i].CLIENTID, "Client id is required", validationObject);
            //validations.checkNull("LSTNM", ratecards[i].LSTNM, "Last name is required", validationObject);
            validations.checkNull("CIDSYS", ratecards[i].CIDSYS, "Case Id is requied", validationObject);
            validations.checkNull("ITEMDECS", ratecards[i].ITEMDECS, "Service Description is required", validationObject);
            validations.checkNull("ITEMRATE", ratecards[i].ITEMRATE, "Service rate is required", validationObject);
            validations.checkNull("ISACTIVE", ratecards[i].ISACTIVE, "Status is required", validationObject);

            validations.checkMaxLength("ITEMDECS", ratecards[i].ITEMDECS, 150, "Length of Service Description should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("ITEMRATE", ratecards[i].ITEMRATE, 6, "Length of Service rate should be less than or equal to 6 characters", validationObject);
            
            validations.checkNumber("ITEMRATE", ratecards[i].ITEMRATE, "Service Rate should be a number", validationObject);
            
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
            
            for(let i = 0; i < ratecards.length; i++)
            {
                // Get auto-generated number for ratecards id
                nextNumber = await numberSeries.getNextSeriesNumber(ratecards[i].CLNT, "NA", "CNTID");
                
                // Add auto-generated number as ratecards id
                ratecards[i].ITEMID = nextNumber;
               
                // Add create params 
                ratecards[i].CDATE = curDate;
                ratecards[i].CTIME = curTime;
                ratecards[i].CUSER = loginUser.USERID;
                ratecards[i].ISDEL = "N";
        
            }
        
            return ratecards;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Validation funtion for creation
const validateUPDATEData = async (ratecards) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < ratecards.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", ratecards[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", ratecards[i].LANG, "Language is required", validationObject);
            validations.checkNull("CLIENTID", ratecards[i].CLIENTID, "Client id is required", validationObject);
            validations.checkNull("ITEMID", ratecards[i].ITEMID, "Service is required", validationObject);
            //validations.checkNull("CIDSYS", ratecards[i].CIDSYS, "Case Id is requied", validationObject);
            validations.checkNull("ITEMDECS", ratecards[i].ITEMDECS, "Service Description is required", validationObject);
            validations.checkNull("ITEMRATE", ratecards[i].ITEMRATE, "Service rate is required", validationObject);
            validations.checkNull("ISACTIVE", ratecards[i].ISACTIVE, "Status is required", validationObject);

            validations.checkMaxLength("ITEMDECS", ratecards[i].ITEMDECS, 150, "Length of Service Description should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("ITEMRATE", ratecards[i].ITEMRATE, 6, "Length of Service rate should be less than or equal to 6 characters", validationObject);
            
            validations.checkNumber("ITEMRATE", ratecards[i].ITEMRATE, "Service Rate should be a number", validationObject);
            
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
            
            for(let i = 0; i < ratecards.length; i++)
            {
                
                
                // Add auto-generated number as ratecards id
               // ratecards[i].ITEMID = nextNumber;
               
                // Add create params 
                ratecards[i].UDATE = curDate;
                ratecards[i].UTIME = curTime;
                ratecards[i].UUSER = loginUser.USERID;
                
        
            }
        
            return ratecards;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Validation funtion for deletion
const validateDELETEData = async (ratecards) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < ratecards.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", ratecards[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", ratecards[i].LANG, "Language is required", validationObject);
            validations.checkNull("CLIENTID", ratecards[i].CLIENTID, "Client id is required", validationObject);
            validations.checkNull("ITEMID", ratecards[i].ITEMID, "Service is required", validationObject);
            //validations.checkNull("CIDSYS", ratecards[i].CIDSYS, "Case Id is requied", validationObject);    
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
            
            for(let i=0; i<ratecards.length; i++)
            {                
                // Add delete params 
                ratecards[i].DDATE = curDate;
                ratecards[i].DTIME = curTime;
                ratecards[i].UUSER = loginUser.USERID;        
            }
        
            return ratecards;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

/**
 * CRUD Operations for ratecards
 **/
// Resolver function for mutation RatecardsCRUDOps(input) : String
const RatecardsCRUDOps = async (args, context, info) =>
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
            let ratecards = await validateCREATEData(args.ratecards);
            
            
            // Check uniqueness of input data
            
            
            let duplicateObj =  await checkDuplicateRatecards(ratecards);
            
            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createRatecards (ratecards);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let ratecards = await validateUPDATEData(args.ratecards);
            
            
            // Check availability of records
            let duplicateObj =  await checkDuplicateRatecards(ratecards);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != ratecards.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateRatecards(ratecards);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let ratecards = await validateDELETEData(args.ratecards);
      
      
            // Check availability of records
            let duplicateObj =  await checkDuplicateRatecards(ratecards);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != ratecards.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteRatecards(ratecards);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let ratecards = await validateDELETEData(args.ratecards);

            // Check availability of records
            let duplicateObj =  await checkDuplicateRatecards(ratecards);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != ratecards.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteRatecards(ratecards);
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





// Resolver function for query contactDetails(input) : [Contact]
const RatecardsDetails = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);
        
        let selectQuery = getRatecardDetailsQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : '',
            (typeof args.CLIENTID !== 'undefined' && args.CLIENTID.trim())      ?   args.CLIENTID.trim()      : '%%',
            (typeof args.CIDSYS !== 'undefined' && args.CIDSYS.trim())          ?   args.CIDSYS.trim()        : '%%',
            (typeof args.ITEMID !== 'undefined' && args.ITEMID.trim())          ?   args.ITEMID.trim()        : '%%',];
    
        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders) ;
        
      //  await  RateCardForClient(clientids);
        //console.log(result);
        return result;        
    } 
    catch (error) 
    {
        return error;    
    }

}

export const RateCardForClient =async (clientids) =>{
    
    try 
    {
        
        let insertStatement='';
        let insertStatements=[]; 
        for(let j=0;j<clientids.length;j++){
            
        let duplicateObj= await checkDuplicateRatecardForClient("1002","EN",clientids[j]);
        let selectQuery = getRatecardForClientQuery;
        let placeHolders = ['1002','EN','%OPEN%','%OPEN%'];
        let result = await dbServices.getTableData(selectQuery, placeHolders) ;
       if(!duplicateObj.isDuplicate){
      // for(var j=0;j<clients.length;j++){

       for(let i=0;i<result.length;i++){
           let res=result[i];
          let dataJSON={
            "CLNT": res.CLNT,
            "LANG": res.LANG,
            "CLIENTID": clientids[j],
            "CIDSYS": "OPEN",
            "ITEMDECS": res.ITEMDECS,
            "ITEMRATE": res.ITEMRATE,
            "ISACTIVE": res.ISACTIVE
        }
            insertStatement = await dbServices.getInsertStatement("EXRATECARD", dataJSON);
            insertStatements.push(insertStatement);
        }
    }
}
        affectedRecords = await dbServices.executeDMLTransactions(insertStatements);
        console.log(affectedRecords);
    
      // }
       
        return result;
        
    }catch (error) 
    {
        return error;    
    }
}


// Function to check uniqueness of data
const checkDuplicateRatecardForClient = async (CLNT,LANG,CLIENTID) =>
{
    
    try 
    {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
    
        
            placeHolders = [
                (typeof CLNT !== 'undefined' && CLNT.trim())        ?   CLNT.trim()    : '',
                (typeof LANG !== 'undefined' && LANG.trim())        ?   LANG.trim()    : '',
                (typeof CLIENTID !== 'undefined' && CLIENTID.trim())?   CLIENTID.trim(): '%%'];
            result = await dbServices.getTableData(checkDuplicateRatecardForClientQuery, placeHolders)
         
            console.log(result);
            
            if(parseInt(result[0].COUNT) > 0)
            {
                duplicateRecordsMessage = duplicateRecordsMessage + "Record " + (1) + ": Duplicate record found. "; 
                duplicateCount = duplicateCount + 1;       
           }
            else
            {
                recordsNotFoundMessage = recordsNotFoundMessage + "Record " + (1) + ": Record not found. ";
                
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
        console.log(error);
        
        throw error;

    }        

}




// Export functions
module.exports = {
    searchRatecards,
    RatecardsDetails,
    RatecardsCRUDOps,
    RateCardForClient
};