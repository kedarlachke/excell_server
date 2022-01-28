/**
 * @author 
 */

// Import section
import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';

import {
    searchAdminCasesQuery, 
    searchUserCasesQuery,
    checkDuplicateCasesQuery,
    getCaseDetailsQuery
} from '../common/sqlQueries';


// Logged in user
var loginUser = {CLNT:"1002",LANG:"EN",USERNAME:"Sohan Patil",USERID:"SP0001",AUTH:{GRPID:"EXUSRS",GRPNM:"EMPLOYEE GROUP",}};


// Resolver function for query searchCases(input) : [Cases]
const searchCases = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let isAdmin = args.isAdmin;
        let selectQuery;
    
        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : '',
            (typeof args.FIRSTNM !== 'undefined' && args.FIRSTNM.trim())        ?   args.FIRSTNM.trim()       : '%%',
            (typeof args.LASTNM !== 'undefined' && args.LASTNM.trim())          ?   args.LASTNM.trim()        : '%%',
            (typeof args.EMAILID !== 'undefined' && args.EMAILID.trim())        ?   args.EMAILID.trim()       : '%%',
            (typeof args.PHONE !== 'undefined' && args.PHONE.trim())            ?   args.PHONE.trim()         : '%%'
        ];
    
        if(isAdmin)
        {
            selectQuery = searchAdminCasesQuery;
        }
        else
        {
            selectQuery = searchUserCasesQuery;
    
            // Add placeholders for additional values 
            placeHolders.push(
                                (typeof args.ASSIGNUSER !== 'undefined' && args.ASSIGNUSER.trim())  ?   args.ASSIGNUSER.trim()    : ''
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


// Resolver function for query caseDetails(input) : [Case]
const caseDetails = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = getCaseDetailsQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : '',
            (typeof args.CIDSYS !== 'undefined' && args.CIDSYS.trim())          ?   args.CIDSYS.trim()        : ''
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
 * CRUD Operations for all cases
 **/
const CasesCRUDOps = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        // Get the typeof Case from arguments
        let typeofCase = args.typeofCase;

        let affectedRecords = 0;

        // If typeof Case is not available
        if(typeof typeofCase === 'undefined' || typeofCase == null || typeofCase.trim().length == 0)
            throw new Error("Typeof Case is required and can not be empty.");

        typeofCase = typeofCase.trim().toUpperCase();    

        switch (typeofCase) {
            case "PROCESS_SERVER":  // Process Server Case 
                affectedRecords = await ProcessServerCRUDOps(args, context, info);                
                break;

            case "ASSET_SEARCH":    // Asset Search Case 
                affectedRecords = await AssetSearchCRUDOps(args, context, info);
                break;

            case "INFIDELITY":      // Infidelity Case 
                affectedRecords = await InfidelityCRUDOps(args, context, info);
                break;

            case "CHILD_CUSTODY":   // Child Custody Case 
                affectedRecords = await ChildCustodyCRUDOps(args, context, info);
                break;

            case "LOCATE_PEOPLE":   // Locate People Case
                affectedRecords = await LocatePeopleCRUDOps(args, context, info);
                break;

            case "WORKERS_COMP":   // Worker's Comp Case
                affectedRecords = await WorkersCompCRUDOps(args, context, info);
                break;

            case "OTHER_CASE":   // Other Case
                affectedRecords = await OtherCaseCRUDOps(args, context, info);
                break;
                
            default:                // Throw invalid case error
                throw new Error("Invalid case specified.");
                break;
        }

        return affectedRecords;                

    } 
    catch (error) 
    {
        return error;
    }    
}

/*** CRUD Operations for Process Server Case ***/
// Resolver function for mutation ProcessServerCRUDOps(input) : String
const ProcessServerCRUDOps = async (args, context, info) =>
{
    try 
    {   
        
        loginUser = validations.getLoginData(context);

        // Get the transaction from arguments
        let transaction = args.transaction;

        let affectedRecords = 0;

        // If transaction is not available
        if(typeof transaction === 'undefined' || transaction == null || transaction.trim().length == 0)
            throw new Error("Transaction is required and can not be empty.");

        transaction = transaction.trim().toUpperCase();    
        
        if(transaction == "CREATE")     // Create 
        {

            // Validate input data
            let cases = await validateCREATEProcessServerData(args.cases);

            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createCases(cases);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let cases = await validateUPDATEProcessServerData(args.cases);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cases.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateCases(cases);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let cases = await validateDELETEProcessServerData(args.cases);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cases.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteCases(cases);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let cases = await validateDELETEProcessServerData(args.cases);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != cases.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteCases(cases);
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
        throw error;    
    }

}


// Validation funtion for creation
const validateCREATEProcessServerData = async (cases) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < cases.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("LTDTTOSERV", cases[i].LTDTTOSERV, "Last Date To Serve is required", validationObject);
            validations.checkNull("HOURSOFWK", cases[i].HOURSOFWK, "Work Hours is required", validationObject);
            validations.checkNull("CASEDT", cases[i].CASEDT, "Case Date is required", validationObject);
           // validations.checkNull("AT", cases[i].AT, "Time of hearing is required", validationObject);
            validations.checkNull("LSTNM", cases[i].LSTNM, "Last Name is required", validationObject);
            validations.checkNull("PRIORITY", cases[i].PRIORITY, "Priority Status is required", validationObject);
            validations.checkNull("FILENO", cases[i].FILENO, "File is required", validationObject);
            validations.checkNull("TYPE", cases[i].TYPE, "Type of document is required", validationObject);
            validations.checkNull("COURTNM", cases[i].COURTNM, "Court is required", validationObject);
            validations.checkNull("FRSTNM", cases[i].FRSTNM, "First Name is required", validationObject);
            validations.checkNull("BTTMTOSERV", cases[i].BTTMTOSERV, "Best Time To Serve is required", validationObject);
            //By Kedar//validations.checkNull("DEPT", cases[i].DEPT, "Department is required", validationObject);
            validations.checkNull("SEX", cases[i].SEX, "Gender is required", validationObject);
            validations.checkNull("PLMKATTPAT", cases[i].PLMKATTPAT, "Make Attempt At is required", validationObject);

            validations.checkMaxLength("HEIGHT", cases[i].HEIGHT, 6, "Length of Height should be less than or equal to 6 characters", validationObject);
            validations.checkMaxLength("FILENO", cases[i].FILENO, 20, "Length of File should be less than or equal to 20 characters", validationObject);
            validations.checkMaxLength("HAIRCOLOR", cases[i].HAIRCOLOR, 100, "Length of Hair Color should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("TYPE", cases[i].TYPE, 100, "Length of Type of document should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("COURTNM", cases[i].COURTNM, 100, "Length of Court should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("FRSTNM", cases[i].FRSTNM, 150, "Length of First Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("DEPT", cases[i].DEPT, 50, "Length of Department should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CASETL", cases[i].CASETL, 120, "Length of Case Title should be less than or equal to 120 characters", validationObject);
            validations.checkMaxLength("WEIGHT", cases[i].WEIGHT, 6, "Length of Weight should be less than or equal to 6 characters", validationObject);
            validations.checkMaxLength("LSTNM", cases[i].LSTNM, 150, "Length of Last Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("RACE", cases[i].RACE, 50, "Length of Race should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("HEARINGSETFOR", cases[i].HEARINGSETFOR, 120, "Length of Hearing Set For should be less than or equal to 120 characters", validationObject);
            validations.checkMaxLength("PLMKATTPAT", cases[i].PLMKATTPAT, 100, "Length of Make Attempt At should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("AT", cases[i].AT, 150, "Length of Time of hearing should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("RESADDRESS", cases[i].RESADDRESS, 300, "Length of Residence Address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("BUSADDRESS", cases[i].BUSADDRESS, 300, "Length of Business Address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("MISCELIST", cases[i].MISCELIST, 200, "Length of Miscellaneous Instructions should be less than or equal to 200 characters", validationObject);
            validations.checkMaxLength("CID", cases[i].CID, 10, "Length of Case ID should be less than or equal to 10 characters", validationObject);

            validations.checkNumber("AGE", cases[i].AGE, "Age should be a number", validationObject);
            validations.checkNumber("HOURSOFWK", cases[i].HOURSOFWK, "Work Hours should be a number", validationObject);

            // ==> Check date validation pending    LTDTTOSERV,     CASEDT
            
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
            
            for(let i = 0; i < cases.length; i++)
            {
                // Get auto-generated number for case id
                nextNumber = await numberSeries.getNextSeriesNumber(cases[i].CLNT, "NA", "CASEID");
                
                // Add auto-generated number as case id
                cases[i].CIDSYS = nextNumber;
        
                // Add create params 
                cases[i].CDATE = curDate;
                cases[i].CTIME = curTime;
                cases[i].ISDEL = "N";
                cases[i].CUSER = loginUser.USERID.toLowerCase();
                
                // Add additional information
                cases[i].SERVICETYP = "Process Server";
                cases[i].STATUS = "08";
            }
        
            return cases;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Validation funtion for updation
const validateUPDATEProcessServerData = async (cases) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < cases.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("CLIENTID", cases[i].CLIENTID, "Client ID is required", validationObject);
            validations.checkNull("CIDSYS", cases[i].CIDSYS, "System Case ID is required", validationObject);

            validations.checkNull("LTDTTOSERV", cases[i].LTDTTOSERV, "Last Date To Serve is required", validationObject);
            //By Kedar//validations.checkNull("HOURSOFWK", cases[i].HOURSOFWK, "Hours of Work is required", validationObject);
            validations.checkNull("CASEDT", cases[i].CASEDT, "Case Date is required", validationObject);
           // validations.checkNull("AT", cases[i].AT, "Time of hearing is required", validationObject);
            validations.checkNull("LSTNM", cases[i].LSTNM, "Last Name is required", validationObject);
            validations.checkNull("PRIORITY", cases[i].PRIORITY, "Priority Status is required", validationObject);
            validations.checkNull("FILENO", cases[i].FILENO, "File is required", validationObject);
            validations.checkNull("TYPE", cases[i].TYPE, "Type of document is required", validationObject);
            validations.checkNull("COURTNM", cases[i].COURTNM, "Court is required", validationObject);
            validations.checkNull("FRSTNM", cases[i].FRSTNM, "First Name is required", validationObject);
            validations.checkNull("BTTMTOSERV", cases[i].BTTMTOSERV, "Best Time To Serve is required", validationObject);
            //By Kedar//validations.checkNull("DEPT", cases[i].DEPT, "Department is required", validationObject);
            validations.checkNull("SEX", cases[i].SEX, "Gender is required", validationObject);
            validations.checkNull("PLMKATTPAT", cases[i].PLMKATTPAT, "Make Attempt At is required", validationObject);

            validations.checkMaxLength("HEIGHT", cases[i].HEIGHT, 6, "Length of Height should be less than or equal to 6 characters", validationObject);
            validations.checkMaxLength("FILENO", cases[i].FILENO, 20, "Length of File should be less than or equal to 20 characters", validationObject);
            validations.checkMaxLength("HAIRCOLOR", cases[i].HAIRCOLOR, 100, "Length of Hair Color should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("TYPE", cases[i].TYPE, 100, "Length of Type of document should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("COURTNM", cases[i].COURTNM, 100, "Length of Court should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("FRSTNM", cases[i].FRSTNM, 150, "Length of First Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("DEPT", cases[i].DEPT, 50, "Length of Department should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CASETL", cases[i].CASETL, 120, "Length of Case Title should be less than or equal to 120 characters", validationObject);
            validations.checkMaxLength("WEIGHT", cases[i].WEIGHT, 6, "Length of Weight should be less than or equal to 6 characters", validationObject);
            validations.checkMaxLength("LSTNM", cases[i].LSTNM, 150, "Length of Last Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("RACE", cases[i].RACE, 50, "Length of Race should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("HEARINGSETFOR", cases[i].HEARINGSETFOR, 120, "Length of Hearing Set For should be less than or equal to 120 characters", validationObject);
            validations.checkMaxLength("PLMKATTPAT", cases[i].PLMKATTPAT, 100, "Length of Make Attempt At should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("AT", cases[i].AT, 150, "Length of Time of hearing should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("RESADDRESS", cases[i].RESADDRESS, 300, "Length of Residence Address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("BUSADDRESS", cases[i].BUSADDRESS, 300, "Length of Business Address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("MISCELIST", cases[i].MISCELIST, 200, "Length of Miscellaneous Instructions should be less than or equal to 200 characters", validationObject);
            validations.checkMaxLength("CID", cases[i].CID, 10, "Length of Case ID should be less than or equal to 10 characters", validationObject);

            validations.checkNumber("AGE", cases[i].AGE, "Age should be a number", validationObject);
            validations.checkNumber("HOURSOFWK", cases[i].HOURSOFWK, "Work Hours should be a number", validationObject);

            // ==> Check date validation pending    LTDTTOSERV,     CASEDT
            
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
            
            for(let i=0; i<cases.length; i++)
            {                
                // Add update params 
                cases[i].UDATE = curDate;
                cases[i].UTIME = curTime;
                cases[i].UUSER = loginUser.USERID.toLowerCase();        
        
            }
        
            return cases;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Validation funtion for deletion
const validateDELETEProcessServerData = async (cases) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < cases.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", cases[i].CIDSYS, "System Case ID is required", validationObject);

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
            
            for(let i=0; i<cases.length; i++)
            {                
                // Add delete params 
                cases[i].DDATE = curDate;
                cases[i].DTIME = curTime;
                cases[i].DUSER = loginUser.USERID.toLowerCase();        
            }
        
            return cases;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}







/*** CRUD Operations for Asset Search Case ***/
// Resolver function for mutation AssetSearchCRUDOps(input) : String
const AssetSearchCRUDOps = async (args, context, info) =>
{
    try 
    {   
        loginUser = validations.getLoginData(context);

        // Get the transaction from arguments
        let transaction = args.transaction;

        let affectedRecords = 0;

        // If transaction is not available
        if(typeof transaction === 'undefined' || transaction == null || transaction.trim().length == 0)
            throw new Error("Transaction is required and can not be empty.");

        transaction = transaction.trim().toUpperCase();    
        
        if(transaction == "CREATE")     // Create 
        {

            // Validate input data
            let cases = await validateCREATEAssetSearchData(args.cases);

            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createCases(cases);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let cases = await validateUPDATEAssetSearchData(args.cases);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cases.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateCases(cases);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let cases = await validateDELETEAssetSearchData(args.cases);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cases.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteCases(cases);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let cases = await validateDELETEAssetSearchData(args.cases);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != cases.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteCases(cases);
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
        throw error;    
    }

}


// Validation funtion for creation
const validateCREATEAssetSearchData = async (cases) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < cases.length; i++)
        {
            let validationObject = {};

            if(cases[i].OTHER == "Y")
            //validations.checkNull("OTHERINFO", cases[i].OTHERINFO, "Other info is required", validationObject);

            validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("FRSTNM", cases[i].FRSTNM, "First Name is required", validationObject);
            validations.checkNull("LSTNM", cases[i].LSTNM, "Last Name is required", validationObject);
            //validations.checkNull("SPOUSE", cases[i].SPOUSE, "Spouse is required", validationObject);
            //validations.checkNull("CASEDT", cases[i].CASEDT, "Case Date is required", validationObject);
            //validations.checkNull("AKA", cases[i].AKA, "AKA is required", validationObject);
            //validations.checkNull("PRIORITY", cases[i].PRIORITY, "Priority Status is required", validationObject);
            validations.checkNull("DOB", cases[i].DOB, "Date of Birth is required", validationObject);
            //validations.checkNull("BUSINESSTYP", cases[i].BUSINESSTYP, "Type of Business is required", validationObject);
            //validations.checkNull("BUSINESSNM", cases[i].BUSINESSNM, "Name of Business is required", validationObject);
            //validations.checkNull("BUSINESSTXID", cases[i].BUSINESSTXID, "Tax ID of Business is required", validationObject);
            //validations.checkNull("CITY2", cases[i].CITY2, "City is required", validationObject);
            //validations.checkNull("ZIPCD2", cases[i].ZIPCD2, "Zip is required", validationObject);
            //validations.checkNull("DRIVERLINCSUB", cases[i].DRIVERLINCSUB, "Driver’s License Subject is required", validationObject);
            //validations.checkNull("CITY", cases[i].CITY, "City is required", validationObject);
            //validations.checkNull("EMPID", cases[i].EMPID, "Employed By is required", validationObject);
            //validations.checkNull("ZIPCD", cases[i].ZIPCD, "Zip is required", validationObject);
            //validations.checkNull("BUSADDRESS", cases[i].BUSADDRESS, "Last Known Business Address is required", validationObject);
            //validations.checkNull("EMPCITY", cases[i].EMPCITY, "Employee City is required", validationObject);
            //validations.checkNull("EMPZIPCD", cases[i].EMPZIPCD, "Employee Zip is required", validationObject);
            //validations.checkNull("RESADDRESS", cases[i].RESADDRESS, "Last Known Residential Address is required", validationObject);
            //validations.checkNull("SECURITYSUB", cases[i].SECURITYSUB, "Social Security Subject is required", validationObject);
            //validations.checkNull("DRIVERLINCSPOS", cases[i].DRIVERLINCSPOS, "Spouse Driver's License is required", validationObject);
            //validations.checkNull("ADJADDRESS", cases[i].ADJADDRESS, "Employer's Address is required", validationObject);
            //validations.checkNull("PHONE2", cases[i].PHONE2, "Phone is required", validationObject);
            //validations.checkNull("STATE2", cases[i].STATE2, "State is required", validationObject);
            //validations.checkNull("PHONE", cases[i].PHONE, "Phone is required", validationObject);
            //validations.checkNull("SECURITYSPOS", cases[i].SECURITYSPOS, "Social Security Spouse is required", validationObject);
            //validations.checkNull("EMPPHONE", cases[i].EMPPHONE, "Employee Phone is required", validationObject);
            //validations.checkNull("STATE", cases[i].STATE, "State is required", validationObject);
            //validations.checkNull("EMPSTATE", cases[i].EMPSTATE, "Employee State is required", validationObject);
            //validations.checkNull("CRTJDGMT", cases[i].CRTJDGMT, "Select YES / NO", validationObject);
            //validations.checkNull("HELPRCVRY", cases[i].HELPRCVRY, "Select YES / NO", validationObject);

            validations.checkMaxLength("SECURITYSPOS", cases[i].SECURITYSPOS, 100, "Length of Social Security Spouse should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("SPOUSE", cases[i].SPOUSE, 150, "Length of Spouse should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("OTHERINFO", cases[i].OTHERINFO, 100, "Length of Other Info should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("BUSINESSNM", cases[i].BUSINESSNM, 150, "Length of Business Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("BUSINESSTXID", cases[i].BUSINESSTXID, 100, "Length of Business Tax ID should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("CITY2", cases[i].CITY2, 50, "Length of City should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("FRSTNM", cases[i].FRSTNM, 150, "Length of First Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("CASETL", cases[i].CASETL, 120, "Length of Case Title should be less than or equal to 120 characters", validationObject);
            validations.checkMaxLength("CITY", cases[i].CITY, 50, "Length of City should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("EMPID", cases[i].EMPID, 128, "Length of Employed By should be less than or equal to 128 characters", validationObject);
            validations.checkMaxLength("DRIVERLINCSUB", cases[i].DRIVERLINCSUB, 100, "Length of Driver’s License Subject should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("AKA", cases[i].AKA, 150, "Length of AKA should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("BUSADDRESS", cases[i].BUSADDRESS, 300, "Length of Last known business address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("EMPCITY", cases[i].EMPCITY, 50, "Length of City should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("RESADDRESS", cases[i].RESADDRESS, 300, "Length of Residence Address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("SECURITYSUB", cases[i].SECURITYSUB, 100, "Length of Social security subject should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("LSTNM", cases[i].LSTNM, 150, "Length of Last Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("CID", cases[i].CID, 10, "Length of Case id should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("DRIVERLINCSPOS", cases[i].DRIVERLINCSPOS, 100, "Length of Spouse Driver’s License should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("ADJADDRESS", cases[i].ADJADDRESS, 300, "Length of Employer's Address should be less than or equal to 300 characters", validationObject);

            validations.checkMaxLength("PHONE", cases[i].PHONE, 15, "Length of Phone should be less than or equal to 15 characters", validationObject);
            validations.checkMaxLength("PHONE2", cases[i].PHONE2, 15, "Length of Phone should be less than or equal to 15 characters", validationObject);
            validations.checkMaxLength("EMPPHONE", cases[i].EMPPHONE, 15, "Length of Phone should be less than or equal to 15 characters", validationObject);
            validations.checkMaxLength("ZIPCD", cases[i].ZIPCD, 10, "Length of Zip should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("ZIPCD2", cases[i].ZIPCD2, 10, "Length of Zip should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("EMPZIPCD", cases[i].EMPZIPCD, 10, "Length of Zip should be less than or equal to 10 characters", validationObject);

            validations.checkNumber("ZIPCD", cases[i].ZIPCD, "Zip should be a number", validationObject);
            validations.checkNumber("ZIPCD2", cases[i].ZIPCD2, "Zip should be a number", validationObject);
            validations.checkNumber("EMPZIPCD", cases[i].EMPZIPCD, "Zip should be a number", validationObject);
            validations.checkNumber("PHONE", cases[i].PHONE, "Phone should be a number", validationObject);
            validations.checkNumber("PHONE2", cases[i].PHONE2, "Phone should be a number", validationObject);
            validations.checkNumber("EMPPHONE", cases[i].EMPPHONE, "Phone should be a number", validationObject);

            // ==> Check date validation pending    LTDTTOSERV,     CASEDT
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
            
            for(let i = 0; i < cases.length; i++)
            {
                // Get auto-generated number for case id
                nextNumber = await numberSeries.getNextSeriesNumber(cases[i].CLNT, "NA", "CASEID");
                
                // Add auto-generated number as case id
                cases[i].CIDSYS = nextNumber;
        
                // Add create params 
                cases[i].CDATE = curDate;
                cases[i].CTIME = curTime;
                cases[i].ISDEL = "N";
                cases[i].CUSER = loginUser.USERID.toLowerCase();
                
                // Add additional information
                cases[i].SERVICETYP = "Asset Search";
                cases[i].STATUS = "08";
            }
        
            return cases;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Validation funtion for updation
const validateUPDATEAssetSearchData = async (cases) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < cases.length; i++)
        {
            let validationObject = {};

            if(cases[i].OTHER == "Y")
            //validations.checkNull("OTHERINFO", cases[i].OTHERINFO, "Other info is required", validationObject);

            validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", cases[i].CIDSYS, "System Case ID is required", validationObject);
            validations.checkNull("FRSTNM", cases[i].FRSTNM, "First Name is required", validationObject);
            validations.checkNull("LSTNM", cases[i].LSTNM, "Last Name is required", validationObject);
            //validations.checkNull("SPOUSE", cases[i].SPOUSE, "Spouse is required", validationObject);
            //validations.checkNull("CASEDT", cases[i].CASEDT, "Case Date is required", validationObject);
            //validations.checkNull("AKA", cases[i].AKA, "AKA is required", validationObject);
            //validations.checkNull("PRIORITY", cases[i].PRIORITY, "Priority Status is required", validationObject);
            validations.checkNull("DOB", cases[i].DOB, "Date of Birth is required", validationObject);
            //validations.checkNull("BUSINESSTYP", cases[i].BUSINESSTYP, "Type of Business is required", validationObject);
            //validations.checkNull("BUSINESSNM", cases[i].BUSINESSNM, "Name of Business is required", validationObject);
            //validations.checkNull("BUSINESSTXID", cases[i].BUSINESSTXID, "Tax ID of Business is required", validationObject);
            //validations.checkNull("CITY2", cases[i].CITY2, "City is required", validationObject);
            //validations.checkNull("ZIPCD2", cases[i].ZIPCD2, "Zip is required", validationObject);
            //validations.checkNull("DRIVERLINCSUB", cases[i].DRIVERLINCSUB, "Driver’s License Subject is required", validationObject);
            //validations.checkNull("CITY", cases[i].CITY, "City is required", validationObject);
            //validations.checkNull("EMPID", cases[i].EMPID, "Employed By is required", validationObject);
            //validations.checkNull("ZIPCD", cases[i].ZIPCD, "Zip is required", validationObject);
            //validations.checkNull("BUSADDRESS", cases[i].BUSADDRESS, "Last Known Business Address is required", validationObject);
            //validations.checkNull("EMPCITY", cases[i].EMPCITY, "Employee City is required", validationObject);
            //validations.checkNull("EMPZIPCD", cases[i].EMPZIPCD, "Employee Zip is required", validationObject);
            //validations.checkNull("RESADDRESS", cases[i].RESADDRESS, "Last Known Residential Address is required", validationObject);
            //validations.checkNull("SECURITYSUB", cases[i].SECURITYSUB, "Social Security Subject is required", validationObject);
            //validations.checkNull("DRIVERLINCSPOS", cases[i].DRIVERLINCSPOS, "Spouse Driver's License is required", validationObject);
            //validations.checkNull("ADJADDRESS", cases[i].ADJADDRESS, "Employer's Address is required", validationObject);
            //validations.checkNull("PHONE2", cases[i].PHONE2, "Phone is required", validationObject);
            //validations.checkNull("STATE2", cases[i].STATE2, "State is required", validationObject);
            //validations.checkNull("PHONE", cases[i].PHONE, "Phone is required", validationObject);
            //validations.checkNull("SECURITYSPOS", cases[i].SECURITYSPOS, "Social Security Spouse is required", validationObject);
            //validations.checkNull("EMPPHONE", cases[i].EMPPHONE, "Employee Phone is required", validationObject);
            //validations.checkNull("STATE", cases[i].STATE, "State is required", validationObject);
            //validations.checkNull("EMPSTATE", cases[i].EMPSTATE, "Employee State is required", validationObject);
            //validations.checkNull("CRTJDGMT", cases[i].CRTJDGMT, "Select YES / NO", validationObject);
            //validations.checkNull("HELPRCVRY", cases[i].HELPRCVRY, "Select YES / NO", validationObject);

            validations.checkMaxLength("SECURITYSPOS", cases[i].SECURITYSPOS, 100, "Length of Social Security Spouse should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("SPOUSE", cases[i].SPOUSE, 150, "Length of Spouse should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("OTHERINFO", cases[i].OTHERINFO, 100, "Length of Other Info should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("BUSINESSNM", cases[i].BUSINESSNM, 150, "Length of Business Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("BUSINESSTXID", cases[i].BUSINESSTXID, 100, "Length of Business Tax ID should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("CITY2", cases[i].CITY2, 50, "Length of City should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("FRSTNM", cases[i].FRSTNM, 150, "Length of First Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("CASETL", cases[i].CASETL, 120, "Length of Case Title should be less than or equal to 120 characters", validationObject);
            validations.checkMaxLength("CITY", cases[i].CITY, 50, "Length of City should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("EMPID", cases[i].EMPID, 128, "Length of Employed By should be less than or equal to 128 characters", validationObject);
            validations.checkMaxLength("DRIVERLINCSUB", cases[i].DRIVERLINCSUB, 100, "Length of Driver’s License Subject should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("AKA", cases[i].AKA, 150, "Length of AKA should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("BUSADDRESS", cases[i].BUSADDRESS, 300, "Length of Last known business address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("EMPCITY", cases[i].EMPCITY, 50, "Length of City should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("RESADDRESS", cases[i].RESADDRESS, 300, "Length of Residence Address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("SECURITYSUB", cases[i].SECURITYSUB, 100, "Length of Social security subject should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("LSTNM", cases[i].LSTNM, 150, "Length of Last Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("CID", cases[i].CID, 10, "Length of Case id should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("DRIVERLINCSPOS", cases[i].DRIVERLINCSPOS, 100, "Length of Spouse Driver’s License should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("ADJADDRESS", cases[i].ADJADDRESS, 300, "Length of Employer's Address should be less than or equal to 300 characters", validationObject);

            validations.checkMaxLength("PHONE", cases[i].PHONE, 15, "Length of Phone should be less than or equal to 15 characters", validationObject);
            validations.checkMaxLength("PHONE2", cases[i].PHONE2, 15, "Length of Phone should be less than or equal to 15 characters", validationObject);
            validations.checkMaxLength("EMPPHONE", cases[i].EMPPHONE, 15, "Length of Phone should be less than or equal to 15 characters", validationObject);
            validations.checkMaxLength("ZIPCD", cases[i].ZIPCD, 10, "Length of Zip should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("ZIPCD2", cases[i].ZIPCD2, 10, "Length of Zip should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("EMPZIPCD", cases[i].EMPZIPCD, 10, "Length of Zip should be less than or equal to 10 characters", validationObject);

            validations.checkNumber("ZIPCD", cases[i].ZIPCD, "Zip should be a number", validationObject);
            validations.checkNumber("ZIPCD2", cases[i].ZIPCD2, "Zip should be a number", validationObject);
            validations.checkNumber("EMPZIPCD", cases[i].EMPZIPCD, "Zip should be a number", validationObject);
            validations.checkNumber("PHONE", cases[i].PHONE, "Phone should be a number", validationObject);
            validations.checkNumber("PHONE2", cases[i].PHONE2, "Phone should be a number", validationObject);
            validations.checkNumber("EMPPHONE", cases[i].EMPPHONE, "Phone should be a number", validationObject);

            // ==> Check date validation pending    LTDTTOSERV,     CASEDT
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
            
            for(let i=0; i<cases.length; i++)
            {                
                // Add update params 
                cases[i].UDATE = curDate;
                cases[i].UTIME = curTime;
                cases[i].UUSER = loginUser.USERID.toLowerCase();        
            }
        
            return cases;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Validation funtion for deletion
const validateDELETEAssetSearchData = async (cases) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < cases.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", cases[i].CIDSYS, "System Case ID is required", validationObject);

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
            
            for(let i=0; i<cases.length; i++)
            {                
                // Add delete params 
                cases[i].DDATE = curDate;
                cases[i].DTIME = curTime;
                cases[i].DUSER = loginUser.USERID.toLowerCase();                
            }
        
            return cases;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}






/*** CRUD Operations for Infidelity Case ***/
// Resolver function for mutation InfidelityCRUDOps(input) : String
const InfidelityCRUDOps = async (args, context, info) =>
{
    try 
    {   
        
        loginUser = validations.getLoginData(context);

        // Get the transaction from arguments
        let transaction = args.transaction;

        let affectedRecords = 0;

        // If transaction is not available
        if(typeof transaction === 'undefined' || transaction == null || transaction.trim().length == 0)
            throw new Error("Transaction is required and can not be empty.");

        transaction = transaction.trim().toUpperCase();    
        
        if(transaction == "CREATE")     // Create 
        {

            // Validate input data
            let cases = await validateCREATEInfidelityData(args.cases);
            
            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createCases(cases);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let cases = await validateUPDATEInfidelityData(args.cases);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cases.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateCases(cases);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let cases = await validateDELETEInfidelityData(args.cases);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cases.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteCases(cases);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let cases = await validateDELETEInfidelityData(args.cases);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != cases.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteCases(cases);
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
        throw error;    
    }

}


// Validation funtion for creation
const validateCREATEInfidelityData = async (cases) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < cases.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("FRSTNM", cases[i].FRSTNM, "First Name is required", validationObject);
            validations.checkNull("LSTNM", cases[i].LSTNM, "Last Name is required", validationObject);
            validations.checkNull("PRIORITY", cases[i].PRIORITY, "Priority Status is required", validationObject);
            validations.checkNull("CASEDT", cases[i].CASEDT, "Case Date is required", validationObject);
            validations.checkNull("SURSTARTDT", cases[i].SURSTARTDT, "Surveillance (Start date) is mandatory", validationObject);
            validations.checkNull("SURENDDT", cases[i].SURENDDT, "Surveillance (End date) is mandatory", validationObject);
            //By Kedar//validations.checkNull("ISGPSNEEDED", cases[i].ISGPSNEEDED, "Select Y/N", validationObject);
            validations.checkNull("ACTIONDETAILS", cases[i].ACTIONDETAILS, "Action details are required", validationObject);
            //By Kedar//validations.checkNull("DAYSFORSUR", cases[i].DAYSFORSUR, "Specific days are required", validationObject);
            validations.checkNull("ISIFTWOINVESTIGATORS", cases[i].ISIFTWOINVESTIGATORS, "Select Y/N", validationObject);
            validations.checkNull("ISPREVIOUSSUR", cases[i].ISPREVIOUSSUR, "Select Y/N", validationObject);
            validations.checkNull("ISBEYONDTMACTIVE", cases[i].ISBEYONDTMACTIVE, "Select Y/N", validationObject);
            validations.checkNull("BUDGET", cases[i].BUDGET, "Budget is required", validationObject);
            validations.checkNull("LICENSEPLATE", cases[i].LICENSEPLATE, "License Plate is required", validationObject);
            validations.checkNull("CMAKE", cases[i].CMAKE, "Make is required", validationObject);
            validations.checkNull("CMODEL", cases[i].CMODEL, "Model is required", validationObject);
            validations.checkNull("CDESCRIPTION", cases[i].CDESCRIPTION, "Description is required", validationObject);
            validations.checkNull("LTDTTOSERV", cases[i].LTDTTOSERV, "Last Date To Serve is required", validationObject);
            validations.checkNull("SEX", cases[i].SEX, "Select sex", validationObject);

            validations.checkMaxLength("CID", cases[i].CID, 10, "Length of Case id should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("CASETL", cases[i].CASETL, 120, "Length of Case Title should be less than or equal to 120 characters", validationObject);
            validations.checkMaxLength("ISGPSNEEDED", cases[i].ISGPSNEEDED, 1, "Length of GPS needed should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("ACTIONDETAILS", cases[i].ACTIONDETAILS, 300, "Length of action details should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("DAYSFORSUR", cases[i].DAYSFORSUR, 100, "Length of days should be less than or equal to 100 characters", validationObject);            
            validations.checkMaxLength("ISIFTWOINVESTIGATORS", cases[i].ISIFTWOINVESTIGATORS, 50, "Length of two investigators should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("FRSTNM", cases[i].FRSTNM, 150, "Length of First Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("LSTNM", cases[i].LSTNM, 150, "Length of Last Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("BUSADDRESS", cases[i].BUSADDRESS, 300, "Length of Last known business address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("RESADDRESS", cases[i].RESADDRESS, 300, "Length of Residence Address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("ISPREVIOUSSUR", cases[i].ISPREVIOUSSUR, 1, "Length of previous surveillance should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("ISBEYONDTMACTIVE", cases[i].ISBEYONDTMACTIVE, 1, "Length of permission to go beyond should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("BUDGET", cases[i].BUDGET, 100, "Length of budget should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("HEARABOUTUS", cases[i].HEARABOUTUS, 200, "Length of heard about us should be less than or equal to 200 characters", validationObject);
            validations.checkMaxLength("LICENSEPLATE", cases[i].LICENSEPLATE, 50, "Length of License Plate should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CMAKE", cases[i].CMAKE, 50, "Length of make should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CMODEL", cases[i].CMODEL, 50, "Length of model should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CDESCRIPTION", cases[i].CDESCRIPTION, 300, "Length of description should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("HEIGHT", cases[i].HEIGHT, 6, "Length of height should be less than or equal to 6 characters", validationObject);
            validations.checkMaxLength("FILENO", cases[i].FILENO, 20, "Length of file should be less than or equal to 20 characters", validationObject);
            validations.checkMaxLength("HAIRCOLOR", cases[i].HAIRCOLOR, 100, "Length of hair color should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("TYPE", cases[i].TYPE, 100, "Length of type should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("COURTNM", cases[i].COURTNM, 100, "Length of court should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("DEPT", cases[i].DEPT, 50, "Length of department should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("WEIGHT", cases[i].WEIGHT, 6, "Length of weight should be less than or equal to 6 characters", validationObject);
            validations.checkMaxLength("RACE", cases[i].RACE, 50, "Length of race should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("AT", cases[i].AT, 150, "Length of AT should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("PLMKATTPAT", cases[i].PLMKATTPAT, 100, "Length of Make Attempt At should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("MISCELIST", cases[i].MISCELIST, 200, "Length of Miscellaneous Instructions should be less than or equal to 200 characters", validationObject);

            validations.checkNumber("AGE", cases[i].AGE, "Age should be a number", validationObject);
            validations.checkNumber("HOURSOFWK", cases[i].HOURSOFWK, "Hours Of Work should be a number", validationObject);

            if(Object.keys(validationObject).length == 0)            
                validations.isDateGreater("SURSTARTDT", cases[i].SURSTARTDT, "SURENDDT", cases[i].SURENDDT, "Surveillance (Start date) should be less than Surveillance (End date)", validationObject); 

            // ==> Check date validation pending    LTDTTOSERV,     CASEDT
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
            
            for(let i = 0; i < cases.length; i++)
            {
                // Get auto-generated number for case id
                nextNumber = await numberSeries.getNextSeriesNumber(cases[i].CLNT, "NA", "CASEID");
                
                // Add auto-generated number as case id
                cases[i].CIDSYS = nextNumber;
        
                // Add create params 
                cases[i].CDATE = curDate;
                cases[i].CTIME = curTime;
                cases[i].ISDEL = "N";
                cases[i].CUSER = loginUser.USERID.toLowerCase();
                
                // Add additional information
                cases[i].SERVICETYP = "Infidelity";
                cases[i].STATUS = "08";
                cases[i].ISCLOSED = "N";

            }
        
            return cases;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Validation funtion for updation
const validateUPDATEInfidelityData = async (cases) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < cases.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", cases[i].CIDSYS, "System Case ID is required", validationObject);

            validations.checkNull("FRSTNM", cases[i].FRSTNM, "First Name is required", validationObject);
            validations.checkNull("LSTNM", cases[i].LSTNM, "Last Name is required", validationObject);
            validations.checkNull("PRIORITY", cases[i].PRIORITY, "Priority Status is required", validationObject);
            validations.checkNull("CASEDT", cases[i].CASEDT, "Case Date is required", validationObject);
            validations.checkNull("SURSTARTDT", cases[i].SURSTARTDT, "Surveillance (Start date) is mandatory", validationObject);
            validations.checkNull("SURENDDT", cases[i].SURENDDT, "Surveillance (End date) is mandatory", validationObject);
            //By Kedar//validations.checkNull("ISGPSNEEDED", cases[i].ISGPSNEEDED, "Select Y/N", validationObject);
            validations.checkNull("ACTIONDETAILS", cases[i].ACTIONDETAILS, "Action details are required", validationObject);
            //By Kedar//validations.checkNull("DAYSFORSUR", cases[i].DAYSFORSUR, "Specific days are required", validationObject);
            validations.checkNull("ISIFTWOINVESTIGATORS", cases[i].ISIFTWOINVESTIGATORS, "Select Y/N", validationObject);
            validations.checkNull("ISPREVIOUSSUR", cases[i].ISPREVIOUSSUR, "Select Y/N", validationObject);
            validations.checkNull("ISBEYONDTMACTIVE", cases[i].ISBEYONDTMACTIVE, "Select Y/N", validationObject);
            validations.checkNull("BUDGET", cases[i].BUDGET, "Budget is required", validationObject);
            validations.checkNull("LICENSEPLATE", cases[i].LICENSEPLATE, "License Plate is required", validationObject);
            validations.checkNull("CMAKE", cases[i].CMAKE, "Make is required", validationObject);
            validations.checkNull("CMODEL", cases[i].CMODEL, "Model is required", validationObject);
            validations.checkNull("CDESCRIPTION", cases[i].CDESCRIPTION, "Description is required", validationObject);
            validations.checkNull("LTDTTOSERV", cases[i].LTDTTOSERV, "Last Date To Serve is required", validationObject);
            validations.checkNull("SEX", cases[i].SEX, "Select sex", validationObject);

            validations.checkMaxLength("CID", cases[i].CID, 10, "Length of Case id should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("CASETL", cases[i].CASETL, 120, "Length of Case Title should be less than or equal to 120 characters", validationObject);
            validations.checkMaxLength("ISGPSNEEDED", cases[i].ISGPSNEEDED, 1, "Length of GPS needed should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("ACTIONDETAILS", cases[i].ACTIONDETAILS, 300, "Length of action details should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("DAYSFORSUR", cases[i].DAYSFORSUR, 100, "Length of days should be less than or equal to 100 characters", validationObject);            
            validations.checkMaxLength("ISIFTWOINVESTIGATORS", cases[i].ISIFTWOINVESTIGATORS, 50, "Length of two investigators should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("FRSTNM", cases[i].FRSTNM, 150, "Length of First Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("LSTNM", cases[i].LSTNM, 150, "Length of Last Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("BUSADDRESS", cases[i].BUSADDRESS, 300, "Length of Last known business address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("RESADDRESS", cases[i].RESADDRESS, 300, "Length of Residence Address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("ISPREVIOUSSUR", cases[i].ISPREVIOUSSUR, 1, "Length of previous surveillance should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("ISBEYONDTMACTIVE", cases[i].ISBEYONDTMACTIVE, 1, "Length of permission to go beyond should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("BUDGET", cases[i].BUDGET, 100, "Length of budget should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("HEARABOUTUS", cases[i].HEARABOUTUS, 200, "Length of heard about us should be less than or equal to 200 characters", validationObject);
            validations.checkMaxLength("LICENSEPLATE", cases[i].LICENSEPLATE, 50, "Length of License Plate should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CMAKE", cases[i].CMAKE, 50, "Length of make should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CMODEL", cases[i].CMODEL, 50, "Length of model should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CDESCRIPTION", cases[i].CDESCRIPTION, 300, "Length of description should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("HEIGHT", cases[i].HEIGHT, 6, "Length of height should be less than or equal to 6 characters", validationObject);
            validations.checkMaxLength("FILENO", cases[i].FILENO, 20, "Length of file should be less than or equal to 20 characters", validationObject);
            validations.checkMaxLength("HAIRCOLOR", cases[i].HAIRCOLOR, 100, "Length of hair color should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("TYPE", cases[i].TYPE, 100, "Length of type should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("COURTNM", cases[i].COURTNM, 100, "Length of court should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("DEPT", cases[i].DEPT, 50, "Length of department should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("WEIGHT", cases[i].WEIGHT, 6, "Length of weight should be less than or equal to 6 characters", validationObject);
            validations.checkMaxLength("RACE", cases[i].RACE, 50, "Length of race should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("AT", cases[i].AT, 150, "Length of AT should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("PLMKATTPAT", cases[i].PLMKATTPAT, 100, "Length of Make Attempt At should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("MISCELIST", cases[i].MISCELIST, 200, "Length of Miscellaneous Instructions should be less than or equal to 200 characters", validationObject);

            validations.checkNumber("AGE", cases[i].AGE, "Age should be a number", validationObject);
            validations.checkNumber("HOURSOFWK", cases[i].HOURSOFWK, "Hours Of Work should be a number", validationObject);

            if(Object.keys(validationObject).length == 0)            
                validations.isDateGreater("SURSTARTDT", cases[i].SURSTARTDT, "SURENDDT", cases[i].SURENDDT, "Surveillance (Start date) should be less than Surveillance (End date)", validationObject); 

            // ==> Check date validation pending    LTDTTOSERV,     CASEDT
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
            
            for(let i=0; i<cases.length; i++)
            {                
                // Add update params 
                cases[i].UDATE = curDate;
                cases[i].UTIME = curTime;
                cases[i].UUSER = loginUser.USERID.toLowerCase();                
            }
        
            return cases;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Validation funtion for deletion
const validateDELETEInfidelityData = async (cases) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < cases.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", cases[i].CIDSYS, "System Case ID is required", validationObject);

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
            
            for(let i=0; i<cases.length; i++)
            {                
                // Add delete params 
                cases[i].DDATE = curDate;
                cases[i].DTIME = curTime;
                cases[i].DUSER = loginUser.USERID.toLowerCase();        
            }
        
            return cases;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}



/*** CRUD Operations for Child Custody Case ***/
// Resolver function for mutation ChildCustodyCRUDOps(input) : String
const ChildCustodyCRUDOps = async (args, context, info) =>
{
    try 
    {   
        loginUser = validations.getLoginData(context);

        // Get the transaction from arguments
        let transaction = args.transaction;

        let affectedRecords = 0;

        // If transaction is not available
        if(typeof transaction === 'undefined' || transaction == null || transaction.trim().length == 0)
            throw new Error("Transaction is required and can not be empty.");

        transaction = transaction.trim().toUpperCase();    
        
        if(transaction == "CREATE")     // Create 
        {

            // Validate input data
            let cases = await validateCREATEChildCustodyData(args.cases);

            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createCases(cases);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let cases = await validateUPDATEChildCustodyData(args.cases);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cases.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateCases(cases);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let cases = await validateDELETEChildCustodyData(args.cases);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cases.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteCases(cases);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let cases = await validateDELETEChildCustodyData(args.cases);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != cases.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteCases(cases);
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
        throw error;    
    }

}


// Validation funtion for creation
const validateCREATEChildCustodyData = async (cases) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < cases.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("FRSTNM", cases[i].FRSTNM, "First Name is required", validationObject);
            validations.checkNull("LSTNM", cases[i].LSTNM, "Last Name is required", validationObject);
            validations.checkNull("PRIORITY", cases[i].PRIORITY, "Priority Status is required", validationObject);
            validations.checkNull("EXPCUSTSITUATION", cases[i].EXPCUSTSITUATION, "With whom is the child living? Custody situation is required", validationObject);
            validations.checkNull("CASEDT", cases[i].CASEDT, "Case Date is required", validationObject);
            validations.checkNull("EXPNEGSUBINVOLVE", cases[i].EXPNEGSUBINVOLVE, "Enter the negative things the subject is involved", validationObject);
            validations.checkNull("SURSTARTDT", cases[i].SURSTARTDT, "Surveillance (Start date) is mandatory", validationObject);
            validations.checkNull("SURENDDT", cases[i].SURENDDT, "Surveillance (End date) is mandatory", validationObject);
            validations.checkNull("ISGPSNEEDED", cases[i].ISGPSNEEDED, "Select Y/N", validationObject);
            validations.checkNull("ACTIONDETAILS", cases[i].ACTIONDETAILS, "Action details are required", validationObject);
            validations.checkNull("ISIFTWOINVESTIGATORS", cases[i].ISIFTWOINVESTIGATORS, "Select Y/N", validationObject);
            validations.checkNull("ISPREVIOUSSUR", cases[i].ISPREVIOUSSUR, "Select Y/N", validationObject);
            validations.checkNull("ISBEYONDTMACTIVE", cases[i].ISBEYONDTMACTIVE, "Select Y/N", validationObject);
            validations.checkNull("BUDGET", cases[i].BUDGET, "Budget is required", validationObject);
            validations.checkNull("LICENSEPLATE", cases[i].LICENSEPLATE, "License Plate is required", validationObject);
            validations.checkNull("CMAKE", cases[i].CMAKE, "Make is required", validationObject);
            validations.checkNull("CMODEL", cases[i].CMODEL, "Model is required", validationObject);
            validations.checkNull("CDESCRIPTION", cases[i].CDESCRIPTION, "Description is required", validationObject);
            validations.checkNull("LTDTTOSERV", cases[i].LTDTTOSERV, "Last Date To Serve is required", validationObject);
            validations.checkNull("SEX", cases[i].SEX, "Select sex", validationObject);

            validations.checkMaxLength("CID", cases[i].CID, 10, "Length of Case id should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("CASETL", cases[i].CASETL, 120, "Length of Case Title should be less than or equal to 120 characters", validationObject);
            validations.checkMaxLength("EXPCUSTSITUATION", cases[i].EXPCUSTSITUATION, 300, "Length of custody situation should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("EXPNEGSUBINVOLVE", cases[i].EXPNEGSUBINVOLVE, 300, "Length of Negative things should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("ISGPSNEEDED", cases[i].ISGPSNEEDED, 1, "Length of GPS needed should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("ACTIONDETAILS", cases[i].ACTIONDETAILS, 300, "Length of action details should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("DAYSFORSUR", cases[i].DAYSFORSUR, 100, "Length of days should be less than or equal to 100 characters", validationObject);            
            validations.checkMaxLength("ISIFTWOINVESTIGATORS", cases[i].ISIFTWOINVESTIGATORS, 50, "Length of two investigators should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("FRSTNM", cases[i].FRSTNM, 150, "Length of First Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("LSTNM", cases[i].LSTNM, 150, "Length of Last Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("BUSADDRESS", cases[i].BUSADDRESS, 300, "Length of Last known business address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("RESADDRESS", cases[i].RESADDRESS, 300, "Length of Residence Address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("ISPREVIOUSSUR", cases[i].ISPREVIOUSSUR, 1, "Length of previous surveillance should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("ISBEYONDTMACTIVE", cases[i].ISBEYONDTMACTIVE, 1, "Length of permission to go beyond should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("BUDGET", cases[i].BUDGET, 100, "Length of budget should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("HEARABOUTUS", cases[i].HEARABOUTUS, 200, "Length of heard about us should be less than or equal to 200 characters", validationObject);
            validations.checkMaxLength("LICENSEPLATE", cases[i].LICENSEPLATE, 50, "Length of License Plate should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CMAKE", cases[i].CMAKE, 50, "Length of make should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CMODEL", cases[i].CMODEL, 50, "Length of model should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CDESCRIPTION", cases[i].CDESCRIPTION, 300, "Length of description should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("HEIGHT", cases[i].HEIGHT, 6, "Length of height should be less than or equal to 6 characters", validationObject);
            validations.checkMaxLength("FILENO", cases[i].FILENO, 20, "Length of file should be less than or equal to 20 characters", validationObject);
            validations.checkMaxLength("HAIRCOLOR", cases[i].HAIRCOLOR, 100, "Length of hair color should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("TYPE", cases[i].TYPE, 100, "Length of type should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("COURTNM", cases[i].COURTNM, 100, "Length of court should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("DEPT", cases[i].DEPT, 50, "Length of department should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("WEIGHT", cases[i].WEIGHT, 6, "Length of weight should be less than or equal to 6 characters", validationObject);
            validations.checkMaxLength("RACE", cases[i].RACE, 50, "Length of race should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("AT", cases[i].AT, 150, "Length of AT should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("PLMKATTPAT", cases[i].PLMKATTPAT, 100, "Length of Make Attempt At should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("MISCELIST", cases[i].MISCELIST, 200, "Length of Miscellaneous Instructions should be less than or equal to 200 characters", validationObject);

            validations.checkNumber("AGE", cases[i].AGE, "Age should be a number", validationObject);
            validations.checkNumber("HOURSOFWK", cases[i].HOURSOFWK, "Hours Of Work should be a number", validationObject);

            if(Object.keys(validationObject).length == 0)            
                validations.isDateGreater("SURSTARTDT", cases[i].SURSTARTDT, "SURENDDT", cases[i].SURENDDT, "Surveillance (Start date) should be less than Surveillance (End date)", validationObject); 

            // ==> Check date validation pending    LTDTTOSERV,     CASEDT
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
            
            for(let i = 0; i < cases.length; i++)
            {
                // Get auto-generated number for case id
                nextNumber = await numberSeries.getNextSeriesNumber(cases[i].CLNT, "NA", "CASEID");
                
                // Add auto-generated number as case id
                cases[i].CIDSYS = nextNumber;
        
                // Add create params 
                cases[i].CDATE = curDate;
                cases[i].CTIME = curTime;
                cases[i].ISDEL = "N";
                cases[i].CUSER = loginUser.USERID.toLowerCase();
                
                // Add additional information
                cases[i].SERVICETYP = "Child Custody";
                cases[i].STATUS = "08";
                cases[i].ISCLOSED = "N";

            }
        
            return cases;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Validation funtion for updation
const validateUPDATEChildCustodyData = async (cases) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < cases.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", cases[i].CIDSYS, "System Case ID is required", validationObject);

            validations.checkNull("FRSTNM", cases[i].FRSTNM, "First Name is required", validationObject);
            validations.checkNull("LSTNM", cases[i].LSTNM, "Last Name is required", validationObject);
            validations.checkNull("PRIORITY", cases[i].PRIORITY, "Priority Status is required", validationObject);
            validations.checkNull("EXPCUSTSITUATION", cases[i].EXPCUSTSITUATION, "With whom is the child living? Custody situation is required", validationObject);
            validations.checkNull("CASEDT", cases[i].CASEDT, "Case Date is required", validationObject);
            validations.checkNull("EXPNEGSUBINVOLVE", cases[i].EXPNEGSUBINVOLVE, "Enter the negative things the subject is involved", validationObject);
            validations.checkNull("SURSTARTDT", cases[i].SURSTARTDT, "Surveillance (Start date) is mandatory", validationObject);
            validations.checkNull("SURENDDT", cases[i].SURENDDT, "Surveillance (End date) is mandatory", validationObject);
            validations.checkNull("ISGPSNEEDED", cases[i].ISGPSNEEDED, "Select Y/N", validationObject);
            validations.checkNull("ACTIONDETAILS", cases[i].ACTIONDETAILS, "Action details are required", validationObject);
            validations.checkNull("ISIFTWOINVESTIGATORS", cases[i].ISIFTWOINVESTIGATORS, "Select Y/N", validationObject);
            validations.checkNull("ISPREVIOUSSUR", cases[i].ISPREVIOUSSUR, "Select Y/N", validationObject);
            validations.checkNull("ISBEYONDTMACTIVE", cases[i].ISBEYONDTMACTIVE, "Select Y/N", validationObject);
            validations.checkNull("BUDGET", cases[i].BUDGET, "Budget is required", validationObject);
            validations.checkNull("LICENSEPLATE", cases[i].LICENSEPLATE, "License Plate is required", validationObject);
            validations.checkNull("CMAKE", cases[i].CMAKE, "Make is required", validationObject);
            validations.checkNull("CMODEL", cases[i].CMODEL, "Model is required", validationObject);
            validations.checkNull("CDESCRIPTION", cases[i].CDESCRIPTION, "Description is required", validationObject);
            validations.checkNull("LTDTTOSERV", cases[i].LTDTTOSERV, "Last Date To Serve is required", validationObject);
            validations.checkNull("SEX", cases[i].SEX, "Select sex", validationObject);

            validations.checkMaxLength("CID", cases[i].CID, 10, "Length of Case id should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("CASETL", cases[i].CASETL, 120, "Length of Case Title should be less than or equal to 120 characters", validationObject);
            validations.checkMaxLength("EXPCUSTSITUATION", cases[i].EXPCUSTSITUATION, 300, "Length of custody situation should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("EXPNEGSUBINVOLVE", cases[i].EXPNEGSUBINVOLVE, 300, "Length of Negative things should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("ISGPSNEEDED", cases[i].ISGPSNEEDED, 1, "Length of GPS needed should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("ACTIONDETAILS", cases[i].ACTIONDETAILS, 300, "Length of action details should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("DAYSFORSUR", cases[i].DAYSFORSUR, 100, "Length of days should be less than or equal to 100 characters", validationObject);            
            validations.checkMaxLength("ISIFTWOINVESTIGATORS", cases[i].ISIFTWOINVESTIGATORS, 50, "Length of two investigators should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("FRSTNM", cases[i].FRSTNM, 150, "Length of First Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("LSTNM", cases[i].LSTNM, 150, "Length of Last Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("BUSADDRESS", cases[i].BUSADDRESS, 300, "Length of Last known business address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("RESADDRESS", cases[i].RESADDRESS, 300, "Length of Residence Address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("ISPREVIOUSSUR", cases[i].ISPREVIOUSSUR, 1, "Length of previous surveillance should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("ISBEYONDTMACTIVE", cases[i].ISBEYONDTMACTIVE, 1, "Length of permission to go beyond should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("BUDGET", cases[i].BUDGET, 100, "Length of budget should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("HEARABOUTUS", cases[i].HEARABOUTUS, 200, "Length of heard about us should be less than or equal to 200 characters", validationObject);
            validations.checkMaxLength("LICENSEPLATE", cases[i].LICENSEPLATE, 50, "Length of License Plate should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CMAKE", cases[i].CMAKE, 50, "Length of make should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CMODEL", cases[i].CMODEL, 50, "Length of model should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CDESCRIPTION", cases[i].CDESCRIPTION, 300, "Length of description should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("HEIGHT", cases[i].HEIGHT, 6, "Length of height should be less than or equal to 6 characters", validationObject);
            validations.checkMaxLength("FILENO", cases[i].FILENO, 20, "Length of file should be less than or equal to 20 characters", validationObject);
            validations.checkMaxLength("HAIRCOLOR", cases[i].HAIRCOLOR, 100, "Length of hair color should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("TYPE", cases[i].TYPE, 100, "Length of type should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("COURTNM", cases[i].COURTNM, 100, "Length of court should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("DEPT", cases[i].DEPT, 50, "Length of department should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("WEIGHT", cases[i].WEIGHT, 6, "Length of weight should be less than or equal to 6 characters", validationObject);
            validations.checkMaxLength("RACE", cases[i].RACE, 50, "Length of race should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("AT", cases[i].AT, 150, "Length of AT should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("PLMKATTPAT", cases[i].PLMKATTPAT, 100, "Length of Make Attempt At should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("MISCELIST", cases[i].MISCELIST, 200, "Length of Miscellaneous Instructions should be less than or equal to 200 characters", validationObject);

            validations.checkNumber("AGE", cases[i].AGE, "Age should be a number", validationObject);
            validations.checkNumber("HOURSOFWK", cases[i].HOURSOFWK, "Hours Of Work should be a number", validationObject);

            if(Object.keys(validationObject).length == 0)            
                validations.isDateGreater("SURSTARTDT", cases[i].SURSTARTDT, "SURENDDT", cases[i].SURENDDT, "Surveillance (Start date) should be less than Surveillance (End date)", validationObject); 

            // ==> Check date validation pending    LTDTTOSERV,     CASEDT
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
            
            for(let i=0; i<cases.length; i++)
            {                
                // Add update params 
                cases[i].UDATE = curDate;
                cases[i].UTIME = curTime;
                cases[i].UUSER = loginUser.USERID.toLowerCase();        
            }
        
            return cases;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Validation funtion for deletion
const validateDELETEChildCustodyData = async (cases) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < cases.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", cases[i].CIDSYS, "System Case ID is required", validationObject);

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
            
            for(let i=0; i<cases.length; i++)
            {                
                // Add delete params 
                cases[i].DDATE = curDate;
                cases[i].DTIME = curTime;
                cases[i].DUSER = loginUser.USERID.toLowerCase();               
            }
        
            return cases;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}




/*** CRUD Operations for Locate People Case ***/
// Resolver function for mutation LocatePeopleCRUDOps(input) : String
const LocatePeopleCRUDOps = async (args, context, info) =>
{
    try 
    {    
        loginUser = validations.getLoginData(context);

        // Get the transaction from arguments
        let transaction = args.transaction;

        let affectedRecords = 0;

        // If transaction is not available
        if(typeof transaction === 'undefined' || transaction == null || transaction.trim().length == 0)
            throw new Error("Transaction is required and can not be empty.");

        transaction = transaction.trim().toUpperCase();    
        
        if(transaction == "CREATE")     // Create 
        {

            // Validate input data
            let cases = await validateCREATELocatePeopleData(args.cases);

            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createCases(cases);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let cases = await validateUPDATELocatePeopleData(args.cases);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cases.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateCases(cases);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let cases = await validateDELETELocatePeopleData(args.cases);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cases.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteCases(cases);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let cases = await validateDELETELocatePeopleData(args.cases);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != cases.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteCases(cases);
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
        throw error;    
    }

}


// Validation funtion for creation
const validateCREATELocatePeopleData = async (cases) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < cases.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("FRSTNM", cases[i].FRSTNM, "First Name is required", validationObject);
            validations.checkNull("LSTNM", cases[i].LSTNM, "Last Name is required", validationObject);
           // validations.checkNull("SPOUSE", cases[i].SPOUSE, "Spouse is required", validationObject);
           // validations.checkNull("CASEDT", cases[i].CASEDT, "Case Date is required", validationObject);
            //validations.checkNull("AKA", cases[i].AKA, "AKA is required", validationObject);
            //validations.checkNull("PRIORITY", cases[i].PRIORITY, "Priority Status is required", validationObject);
            validations.checkNull("DOB", cases[i].DOB, "Date of Birth is required", validationObject);
            //validations.checkNull("BUSINESSTYP", cases[i].BUSINESSTYP, "Type of Business is required", validationObject);
            //validations.checkNull("BUSINESSNM", cases[i].BUSINESSNM, "Name of Business is required", validationObject);
            ///validations.checkNull("BUSINESSTXID", cases[i].BUSINESSTXID, "Tax ID of Business is required", validationObject);
            //validations.checkNull("CITY2", cases[i].CITY2, "City is required", validationObject);
            ///validations.checkNull("ZIPCD2", cases[i].ZIPCD2, "Zip is required", validationObject);
            //validations.checkNull("DRIVERLINCSUB", cases[i].DRIVERLINCSUB, "Driver’s License Subject is required", validationObject);
            ///validations.checkNull("CITY", cases[i].CITY, "City is required", validationObject);
           // validations.checkNull("EMPID", cases[i].EMPID, "Employed By is required", validationObject);
            //validations.checkNull("ZIPCD", cases[i].ZIPCD, "Zip is required", validationObject);
            //validations.checkNull("BUSADDRESS", cases[i].BUSADDRESS, "Last Known Business Address is required", validationObject);
            //validations.checkNull("EMPCITY", cases[i].EMPCITY, "Employee City is required", validationObject);
            ///validations.checkNull("EMPZIPCD", cases[i].EMPZIPCD, "Employee Zip is required", validationObject);
            //validations.checkNull("RESADDRESS", cases[i].RESADDRESS, "Last Known Residential Address is required", validationObject);
            //validations.checkNull("SECURITYSUB", cases[i].SECURITYSUB, "Social Security Subject is required", validationObject);
            ///validations.checkNull("DRIVERLINCSPOS", cases[i].DRIVERLINCSPOS, "Spouse Driver's License is required", validationObject);
            //validations.checkNull("ADJADDRESS", cases[i].ADJADDRESS, "Employer's Address is required", validationObject);
            //validations.checkNull("PHONE2", cases[i].PHONE2, "Phone is required", validationObject);
            ///validations.checkNull("STATE2", cases[i].STATE2, "State is required", validationObject);
            ///validations.checkNull("PHONE", cases[i].PHONE, "Phone is required", validationObject);
            //validations.checkNull("SECURITYSPOS", cases[i].SECURITYSPOS, "Social Security Subject is required", validationObject);
            //validations.checkNull("EMPPHONE", cases[i].EMPPHONE, "Employee Phone is required", validationObject);
            //validations.checkNull("STATE", cases[i].STATE, "State is required", validationObject);
            //validations.checkNull("EMPSTATE", cases[i].EMPSTATE, "Employee State is required", validationObject);

            validations.checkMaxLength("SECURITYSPOS", cases[i].SECURITYSPOS, 100, "Length of Social Security Spouse should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("SPOUSE", cases[i].SPOUSE, 150, "Length of Spouse should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("BUSINESSNM", cases[i].BUSINESSNM, 150, "Length of Business Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("BUSINESSTXID", cases[i].BUSINESSTXID, 100, "Length of Business Tax ID should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("CITY2", cases[i].CITY2, 50, "Length of City should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("FRSTNM", cases[i].FRSTNM, 150, "Length of First Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("CASETL", cases[i].CASETL, 120, "Length of Case Title should be less than or equal to 120 characters", validationObject);
            validations.checkMaxLength("CITY", cases[i].CITY, 50, "Length of City should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("EMPID", cases[i].EMPID, 128, "Length of Employed By should be less than or equal to 128 characters", validationObject);
            validations.checkMaxLength("DRIVERLINCSUB", cases[i].DRIVERLINCSUB, 100, "Length of Driver’s License Subject should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("AKA", cases[i].AKA, 150, "Length of AKA should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("BUSADDRESS", cases[i].BUSADDRESS, 300, "Length of Last known business address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("EMPCITY", cases[i].EMPCITY, 50, "Length of City should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("RESADDRESS", cases[i].RESADDRESS, 300, "Length of Residence Address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("SECURITYSUB", cases[i].SECURITYSUB, 100, "Length of Social security subject should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("LSTNM", cases[i].LSTNM, 150, "Length of Last Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("CID", cases[i].CID, 10, "Length of Case id should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("DRIVERLINCSPOS", cases[i].DRIVERLINCSPOS, 100, "Length of Spouse Driver’s License should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("ADJADDRESS", cases[i].ADJADDRESS, 300, "Length of Employer's Address should be less than or equal to 300 characters", validationObject);

            validations.checkMaxLength("LSTPERSON", cases[i].LSTPERSON, 300, "Length of Last person seen with should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("FRQTLOCATION", cases[i].FRQTLOCATION, 300, "Length of Frequent locations should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("HOOBBIES", cases[i].HOOBBIES, 300, "Length of hobbies should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("POTLADDRESS", cases[i].POTLADDRESS, 300, "Length of Address list should be less than or equal to 300 characters", validationObject);

            validations.checkNumber("ZIPCD", cases[i].ZIPCD, "Zip should be a number", validationObject);
            validations.checkNumber("ZIPCD2", cases[i].ZIPCD2, "Zip should be a number", validationObject);
            validations.checkNumber("EMPZIPCD", cases[i].EMPZIPCD, "Zip should be a number", validationObject);
            validations.checkNumber("PHONE", cases[i].PHONE, "Phone should be a number", validationObject);
            validations.checkNumber("PHONE2", cases[i].PHONE2, "Phone should be a number", validationObject);
            validations.checkNumber("EMPPHONE", cases[i].EMPPHONE, "Phone should be a number", validationObject);

            // ==> Check date validation pending    LTDTTOSERV,     CASEDT
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
            
            for(let i = 0; i < cases.length; i++)
            {
                // Get auto-generated number for case id
                nextNumber = await numberSeries.getNextSeriesNumber(cases[i].CLNT, "NA", "CASEID");
                
                // Add auto-generated number as case id
                cases[i].CIDSYS = nextNumber;
        
                // Add create params 
                cases[i].CDATE = curDate;
                cases[i].CTIME = curTime;
                cases[i].ISDEL = "N";
                cases[i].CUSER = loginUser.USERID.toLowerCase();
                
                // Add additional information
                cases[i].SERVICETYP = "Locate People";
                cases[i].STATUS = "08";
            }
        
            return cases;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Validation funtion for updation
const validateUPDATELocatePeopleData = async (cases) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < cases.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", cases[i].CIDSYS, "System Case ID is required", validationObject);

            validations.checkNull("FRSTNM", cases[i].FRSTNM, "First Name is required", validationObject);
            validations.checkNull("LSTNM", cases[i].LSTNM, "Last Name is required", validationObject);
            //validations.checkNull("SPOUSE", cases[i].SPOUSE, "Spouse is required", validationObject);
            //validations.checkNull("CASEDT", cases[i].CASEDT, "Case Date is required", validationObject);
            //validations.checkNull("AKA", cases[i].AKA, "AKA is required", validationObject);
            //validations.checkNull("PRIORITY", cases[i].PRIORITY, "Priority Status is required", validationObject);
            // validations.checkNull("DOB", cases[i].DOB, "Date of Birth is required", validationObject);
            // validations.checkNull("BUSINESSTYP", cases[i].BUSINESSTYP, "Type of Business is required", validationObject);
            // validations.checkNull("BUSINESSNM", cases[i].BUSINESSNM, "Name of Business is required", validationObject);
            // validations.checkNull("BUSINESSTXID", cases[i].BUSINESSTXID, "Tax ID of Business is required", validationObject);
            // validations.checkNull("CITY2", cases[i].CITY2, "City is required", validationObject);
            // validations.checkNull("ZIPCD2", cases[i].ZIPCD2, "Zip is required", validationObject);
            // validations.checkNull("DRIVERLINCSUB", cases[i].DRIVERLINCSUB, "Driver’s License Subject is required", validationObject);
            // validations.checkNull("CITY", cases[i].CITY, "City is required", validationObject);
            // validations.checkNull("EMPID", cases[i].EMPID, "Employed By is required", validationObject);
            // validations.checkNull("ZIPCD", cases[i].ZIPCD, "Zip is required", validationObject);
            // validations.checkNull("BUSADDRESS", cases[i].BUSADDRESS, "Last Known Business Address is required", validationObject);
            // validations.checkNull("EMPCITY", cases[i].EMPCITY, "Employee City is required", validationObject);
            // validations.checkNull("EMPZIPCD", cases[i].EMPZIPCD, "Employee Zip is required", validationObject);
            // validations.checkNull("RESADDRESS", cases[i].RESADDRESS, "Last Known Residential Address is required", validationObject);
            // validations.checkNull("SECURITYSUB", cases[i].SECURITYSUB, "Social Security Subject is required", validationObject);
            // validations.checkNull("DRIVERLINCSPOS", cases[i].DRIVERLINCSPOS, "Spouse Driver's License is required", validationObject);
            // validations.checkNull("ADJADDRESS", cases[i].ADJADDRESS, "Employer's Address is required", validationObject);
            // validations.checkNull("PHONE2", cases[i].PHONE2, "Phone is required", validationObject);
            // validations.checkNull("STATE2", cases[i].STATE2, "State is required", validationObject);
            // validations.checkNull("PHONE", cases[i].PHONE, "Phone is required", validationObject);
            // validations.checkNull("SECURITYSPOS", cases[i].SECURITYSPOS, "Social Security Subject is required", validationObject);
            // validations.checkNull("EMPPHONE", cases[i].EMPPHONE, "Employee Phone is required", validationObject);
            // validations.checkNull("STATE", cases[i].STATE, "State is required", validationObject);
            // validations.checkNull("EMPSTATE", cases[i].EMPSTATE, "Employee State is required", validationObject);

            validations.checkMaxLength("SECURITYSPOS", cases[i].SECURITYSPOS, 100, "Length of Social Security Spouse should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("SPOUSE", cases[i].SPOUSE, 150, "Length of Spouse should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("BUSINESSNM", cases[i].BUSINESSNM, 150, "Length of Business Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("BUSINESSTXID", cases[i].BUSINESSTXID, 100, "Length of Business Tax ID should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("CITY2", cases[i].CITY2, 50, "Length of City should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("FRSTNM", cases[i].FRSTNM, 150, "Length of First Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("CASETL", cases[i].CASETL, 120, "Length of Case Title should be less than or equal to 120 characters", validationObject);
            validations.checkMaxLength("CITY", cases[i].CITY, 50, "Length of City should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("EMPID", cases[i].EMPID, 128, "Length of Employed By should be less than or equal to 128 characters", validationObject);
            validations.checkMaxLength("DRIVERLINCSUB", cases[i].DRIVERLINCSUB, 100, "Length of Driver’s License Subject should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("AKA", cases[i].AKA, 150, "Length of AKA should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("BUSADDRESS", cases[i].BUSADDRESS, 300, "Length of Last known business address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("EMPCITY", cases[i].EMPCITY, 50, "Length of City should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("RESADDRESS", cases[i].RESADDRESS, 300, "Length of Residence Address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("SECURITYSUB", cases[i].SECURITYSUB, 100, "Length of Social security subject should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("LSTNM", cases[i].LSTNM, 150, "Length of Last Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("CID", cases[i].CID, 10, "Length of Case id should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("DRIVERLINCSPOS", cases[i].DRIVERLINCSPOS, 100, "Length of Spouse Driver’s License should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("ADJADDRESS", cases[i].ADJADDRESS, 300, "Length of Employer's Address should be less than or equal to 300 characters", validationObject);

            validations.checkMaxLength("LSTPERSON", cases[i].LSTPERSON, 300, "Length of Last person seen with should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("FRQTLOCATION", cases[i].FRQTLOCATION, 300, "Length of Frequent locations should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("HOOBBIES", cases[i].HOOBBIES, 300, "Length of hobbies should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("POTLADDRESS", cases[i].POTLADDRESS, 300, "Length of Address list should be less than or equal to 300 characters", validationObject);

            validations.checkNumber("ZIPCD", cases[i].ZIPCD, "Zip should be a number", validationObject);
            validations.checkNumber("ZIPCD2", cases[i].ZIPCD2, "Zip should be a number", validationObject);
            validations.checkNumber("EMPZIPCD", cases[i].EMPZIPCD, "Zip should be a number", validationObject);
            validations.checkNumber("PHONE", cases[i].PHONE, "Phone should be a number", validationObject);
            validations.checkNumber("PHONE2", cases[i].PHONE2, "Phone should be a number", validationObject);
            validations.checkNumber("EMPPHONE", cases[i].EMPPHONE, "Phone should be a number", validationObject);

            // ==> Check date validation pending    LTDTTOSERV,     CASEDT
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
            
            for(let i=0; i<cases.length; i++)
            {                
                // Add update params 
                cases[i].UDATE = curDate;
                cases[i].UTIME = curTime;
                cases[i].UUSER = loginUser.USERID.toLowerCase();        
            }
        
            return cases;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Validation funtion for deletion
const validateDELETELocatePeopleData = async (cases) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < cases.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", cases[i].CIDSYS, "System Case ID is required", validationObject);

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
            
            for(let i=0; i<cases.length; i++)
            {                
                // Add delete params 
                cases[i].DDATE = curDate;
                cases[i].DTIME = curTime;
                cases[i].DUSER = loginUser.USERID.toLowerCase();
            }
        
            return cases;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}



/*** CRUD Operations for Worker's Comp Case ***/
// Resolver function for mutation WorkersCompCRUDOps(input) : String
const WorkersCompCRUDOps = async (args, context, info) =>
{
    try 
    {   
        
        loginUser = validations.getLoginData(context);

        // Get the transaction from arguments
        let transaction = args.transaction;

        let affectedRecords = 0;

        // If transaction is not available
        if(typeof transaction === 'undefined' || transaction == null || transaction.trim().length == 0)
            throw new Error("Transaction is required and can not be empty.");

        transaction = transaction.trim().toUpperCase();    
        
        if(transaction == "CREATE")     // Create 
        {

            // Validate input data
            let cases = await validateCREATEWorkersCompData(args.cases);
            
            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createCases(cases);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let cases = await validateUPDATEWorkersCompData(args.cases);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cases.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateCases(cases);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let cases = await validateDELETEWorkersCompData(args.cases);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cases.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteCases(cases);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let cases = await validateDELETEWorkersCompData(args.cases);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != cases.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteCases(cases);
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
        throw error;    
    }

}


// Validation funtion for creation
const validateCREATEWorkersCompData = async (cases) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < cases.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("FRSTNM", cases[i].FRSTNM, "First Name is required", validationObject);
            validations.checkNull("LSTNM", cases[i].LSTNM, "Last Name is required", validationObject);
            validations.checkNull("PRIORITY", cases[i].PRIORITY, "Priority Status is required", validationObject);
            validations.checkNull("CASEDT", cases[i].CASEDT, "Case Date is required", validationObject);
            validations.checkNull("SURSTARTDT", cases[i].SURSTARTDT, "Surveillance (Start date) is mandatory", validationObject);
            validations.checkNull("SURENDDT", cases[i].SURENDDT, "Surveillance (End date) is mandatory", validationObject);
            //By Kedar//validations.checkNull("ISGPSNEEDED", cases[i].ISGPSNEEDED, "Select Y/N", validationObject);
            validations.checkNull("ACTIONDETAILS", cases[i].ACTIONDETAILS, "Action details are required", validationObject);
            //By Kedar//validations.checkNull("DAYSFORSUR", cases[i].DAYSFORSUR, "Specific days are required", validationObject);
            validations.checkNull("ISIFTWOINVESTIGATORS", cases[i].ISIFTWOINVESTIGATORS, "Select Y/N", validationObject);
            validations.checkNull("ISPREVIOUSSUR", cases[i].ISPREVIOUSSUR, "Select Y/N", validationObject);
            validations.checkNull("ISBEYONDTMACTIVE", cases[i].ISBEYONDTMACTIVE, "Select Y/N", validationObject);
            validations.checkNull("BUDGET", cases[i].BUDGET, "Budget is required", validationObject);
            validations.checkNull("LICENSEPLATE", cases[i].LICENSEPLATE, "License Plate is required", validationObject);
            validations.checkNull("CMAKE", cases[i].CMAKE, "Make is required", validationObject);
            validations.checkNull("CMODEL", cases[i].CMODEL, "Model is required", validationObject);
            validations.checkNull("CDESCRIPTION", cases[i].CDESCRIPTION, "Description is required", validationObject);
            validations.checkNull("LTDTTOSERV", cases[i].LTDTTOSERV, "Last Date To Serve is required", validationObject);
            validations.checkNull("SEX", cases[i].SEX, "Select sex", validationObject);
            //By Kedar//
            /*validations.checkNull("ADJFIRSTNM", cases[i].ADJFIRSTNM, "First Name is required", validationObject);
            validations.checkNull("ADJLASTNM", cases[i].ADJLASTNM, "Last Name is required", validationObject);
            validations.checkNull("PHONE", cases[i].PHONE, "Phone number is required", validationObject);
            validations.checkNull("EMAIL", cases[i].EMAIL, "Email is required", validationObject);
            validations.checkNull("ADJADDRESS", cases[i].ADJADDRESS, "Address is required", validationObject);
            validations.checkNull("CITY", cases[i].CITY, "City is required", validationObject);
            validations.checkNull("ZIPCD", cases[i].ZIPCD, "Zip code is required", validationObject);
            validations.checkNull("CLAIM", cases[i].CLAIM, "Claim is required", validationObject);
            validations.checkNull("SUBINJURYCLAIM", cases[i].SUBINJURYCLAIM, "Injury claim is required", validationObject);
            validations.checkNull("STATE", cases[i].STATE, "State is required", validationObject);
            validations.checkNull("ISSUBREPRESENT", cases[i].ISSUBREPRESENT, "Select Y/N", validationObject);
            */
            validations.checkMaxLength("ADJFIRSTNM", cases[i].ADJFIRSTNM, 150, "Length of first name should be less than or equal to 150 characters", validationObject);            
            validations.checkMaxLength("ADJLASTNM", cases[i].ADJLASTNM, 150, "Length of last name should be less than or equal to 150 characters", validationObject);            
            validations.checkMaxLength("EMAIL", cases[i].EMAIL, 128, "Length of email should be less than or equal to 128 characters", validationObject);            
            validations.checkMaxLength("ADJADDRESS", cases[i].ADJADDRESS, 300, "Length of address should be less than or equal to 300 characters", validationObject);            
            validations.checkMaxLength("CITY", cases[i].CITY, 40, "Length of days should be less than or equal to 40 characters", validationObject);            
            validations.checkMaxLength("CLAIM", cases[i].CLAIM, 150, "Length of claim should be less than or equal to 150 characters", validationObject);            
            validations.checkMaxLength("SUBINJURYCLAIM", cases[i].SUBINJURYCLAIM, 500, "Length of injury claim should be less than or equal to 500 characters", validationObject);            
            
            validations.checkMaxLength("CID", cases[i].CID, 10, "Length of Case id should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("CASETL", cases[i].CASETL, 120, "Length of Case Title should be less than or equal to 120 characters", validationObject);
            validations.checkMaxLength("ISGPSNEEDED", cases[i].ISGPSNEEDED, 1, "Length of GPS needed should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("ACTIONDETAILS", cases[i].ACTIONDETAILS, 300, "Length of action details should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("ISIFTWOINVESTIGATORS", cases[i].ISIFTWOINVESTIGATORS, 50, "Length of two investigators should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("FRSTNM", cases[i].FRSTNM, 150, "Length of First Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("LSTNM", cases[i].LSTNM, 150, "Length of Last Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("BUSADDRESS", cases[i].BUSADDRESS, 300, "Length of Last known business address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("RESADDRESS", cases[i].RESADDRESS, 300, "Length of Residence Address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("ISPREVIOUSSUR", cases[i].ISPREVIOUSSUR, 1, "Length of previous surveillance should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("ISBEYONDTMACTIVE", cases[i].ISBEYONDTMACTIVE, 1, "Length of permission to go beyond should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("BUDGET", cases[i].BUDGET, 100, "Length of budget should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("HEARABOUTUS", cases[i].HEARABOUTUS, 200, "Length of heard about us should be less than or equal to 200 characters", validationObject);
            validations.checkMaxLength("LICENSEPLATE", cases[i].LICENSEPLATE, 50, "Length of License Plate should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CMAKE", cases[i].CMAKE, 50, "Length of make should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CMODEL", cases[i].CMODEL, 50, "Length of model should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CDESCRIPTION", cases[i].CDESCRIPTION, 300, "Length of description should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("HEIGHT", cases[i].HEIGHT, 6, "Length of height should be less than or equal to 6 characters", validationObject);
            validations.checkMaxLength("FILENO", cases[i].FILENO, 20, "Length of file should be less than or equal to 20 characters", validationObject);
            validations.checkMaxLength("HAIRCOLOR", cases[i].HAIRCOLOR, 100, "Length of hair color should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("TYPE", cases[i].TYPE, 100, "Length of type should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("COURTNM", cases[i].COURTNM, 100, "Length of court should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("DEPT", cases[i].DEPT, 50, "Length of department should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("WEIGHT", cases[i].WEIGHT, 6, "Length of weight should be less than or equal to 6 characters", validationObject);
            validations.checkMaxLength("RACE", cases[i].RACE, 50, "Length of race should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("AT", cases[i].AT, 150, "Length of AT should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("PLMKATTPAT", cases[i].PLMKATTPAT, 100, "Length of Make Attempt At should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("MISCELIST", cases[i].MISCELIST, 200, "Length of Miscellaneous Instructions should be less than or equal to 200 characters", validationObject);

            validations.checkNumber("AGE", cases[i].AGE, "Age should be a number", validationObject);
            validations.checkNumber("HOURSOFWK", cases[i].HOURSOFWK, "Hours Of Work should be a number", validationObject);
            validations.checkNumber("PHONE", cases[i].PHONE, "Phone should be a number", validationObject);
            validations.checkNumber("ZIPCD", cases[i].ZIPCD, "Zip code should be a number", validationObject);

            validations.checkEmail("EMAIL", cases[i].EMAIL, "Email id is not valid", validationObject);

            if(Object.keys(validationObject).length == 0)            
                validations.isDateGreater("SURSTARTDT", cases[i].SURSTARTDT, "SURENDDT", cases[i].SURENDDT, "Surveillance (Start date) should be less than Surveillance (End date)", validationObject); 

            // ==> Check date validation pending    LTDTTOSERV,     CASEDT
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
            
            for(let i = 0; i < cases.length; i++)
            {
                // Get auto-generated number for case id
                nextNumber = await numberSeries.getNextSeriesNumber(cases[i].CLNT, "NA", "CASEID");
                
                // Add auto-generated number as case id
                cases[i].CIDSYS = nextNumber;
        
                // Add create params 
                cases[i].CDATE = curDate;
                cases[i].CTIME = curTime;
                cases[i].ISDEL = "N";
                cases[i].CUSER = loginUser.USERID.toLowerCase();
                
                // Add additional information
                cases[i].SERVICETYP = "Workers Comp";
                cases[i].STATUS = "08";
                cases[i].ISCLOSED = "N";

            }
        
            return cases;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Validation funtion for updation
const validateUPDATEWorkersCompData = async (cases) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < cases.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", cases[i].CIDSYS, "System Case ID is required", validationObject);

            validations.checkNull("FRSTNM", cases[i].FRSTNM, "First Name is required", validationObject);
            validations.checkNull("LSTNM", cases[i].LSTNM, "Last Name is required", validationObject);
            validations.checkNull("PRIORITY", cases[i].PRIORITY, "Priority Status is required", validationObject);
            validations.checkNull("CASEDT", cases[i].CASEDT, "Case Date is required", validationObject);
            validations.checkNull("SURSTARTDT", cases[i].SURSTARTDT, "Surveillance (Start date) is mandatory", validationObject);
            validations.checkNull("SURENDDT", cases[i].SURENDDT, "Surveillance (End date) is mandatory", validationObject);
            //By Kedar////validations.checkNull("ISGPSNEEDED", cases[i].ISGPSNEEDED, "Select Y/N", validationObject);
            validations.checkNull("ACTIONDETAILS", cases[i].ACTIONDETAILS, "Action details are required", validationObject);
            //By Kedar//validations.checkNull("DAYSFORSUR", cases[i].DAYSFORSUR, "Specific days are required", validationObject);
            validations.checkNull("ISIFTWOINVESTIGATORS", cases[i].ISIFTWOINVESTIGATORS, "Select Y/N", validationObject);
            validations.checkNull("ISPREVIOUSSUR", cases[i].ISPREVIOUSSUR, "Select Y/N", validationObject);
            validations.checkNull("ISBEYONDTMACTIVE", cases[i].ISBEYONDTMACTIVE, "Select Y/N", validationObject);
            validations.checkNull("BUDGET", cases[i].BUDGET, "Budget is required", validationObject);
            validations.checkNull("LICENSEPLATE", cases[i].LICENSEPLATE, "License Plate is required", validationObject);
            validations.checkNull("CMAKE", cases[i].CMAKE, "Make is required", validationObject);
            validations.checkNull("CMODEL", cases[i].CMODEL, "Model is required", validationObject);
            validations.checkNull("CDESCRIPTION", cases[i].CDESCRIPTION, "Description is required", validationObject);
            validations.checkNull("LTDTTOSERV", cases[i].LTDTTOSERV, "Last Date To Serve is required", validationObject);
            validations.checkNull("SEX", cases[i].SEX, "Select sex", validationObject);
            //by Kedar
            /*validations.checkNull("ADJFIRSTNM", cases[i].ADJFIRSTNM, "First Name is required", validationObject);
            validations.checkNull("ADJLASTNM", cases[i].ADJLASTNM, "Last Name is required", validationObject);
            validations.checkNull("PHONE", cases[i].PHONE, "Phone number is required", validationObject);
            validations.checkNull("EMAIL", cases[i].EMAIL, "Email is required", validationObject);
            validations.checkNull("ADJADDRESS", cases[i].ADJADDRESS, "Address is required", validationObject);
            validations.checkNull("CITY", cases[i].CITY, "City is required", validationObject);
            validations.checkNull("ZIPCD", cases[i].ZIPCD, "Zip code is required", validationObject);
            validations.checkNull("CLAIM", cases[i].CLAIM, "Claim is required", validationObject);
            validations.checkNull("SUBINJURYCLAIM", cases[i].SUBINJURYCLAIM, "Injury claim is required", validationObject);
            validations.checkNull("STATE", cases[i].STATE, "State is required", validationObject);
            validations.checkNull("ISSUBREPRESENT", cases[i].ISSUBREPRESENT, "Select Y/N", validationObject);
            */
            validations.checkMaxLength("ADJFIRSTNM", cases[i].ADJFIRSTNM, 150, "Length of first name should be less than or equal to 150 characters", validationObject);            
            validations.checkMaxLength("ADJLASTNM", cases[i].ADJLASTNM, 150, "Length of last name should be less than or equal to 150 characters", validationObject);            
            validations.checkMaxLength("EMAIL", cases[i].EMAIL, 128, "Length of email should be less than or equal to 128 characters", validationObject);            
            validations.checkMaxLength("ADJADDRESS", cases[i].ADJADDRESS, 300, "Length of address should be less than or equal to 300 characters", validationObject);            
            validations.checkMaxLength("CITY", cases[i].CITY, 40, "Length of days should be less than or equal to 40 characters", validationObject);            
            validations.checkMaxLength("CLAIM", cases[i].CLAIM, 150, "Length of claim should be less than or equal to 150 characters", validationObject);            
            validations.checkMaxLength("SUBINJURYCLAIM", cases[i].SUBINJURYCLAIM, 500, "Length of injury claim should be less than or equal to 500 characters", validationObject);            
            
            validations.checkMaxLength("CID", cases[i].CID, 10, "Length of Case id should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("CASETL", cases[i].CASETL, 120, "Length of Case Title should be less than or equal to 120 characters", validationObject);
            validations.checkMaxLength("ISGPSNEEDED", cases[i].ISGPSNEEDED, 1, "Length of GPS needed should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("ACTIONDETAILS", cases[i].ACTIONDETAILS, 300, "Length of action details should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("ISIFTWOINVESTIGATORS", cases[i].ISIFTWOINVESTIGATORS, 50, "Length of two investigators should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("FRSTNM", cases[i].FRSTNM, 150, "Length of First Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("LSTNM", cases[i].LSTNM, 150, "Length of Last Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("BUSADDRESS", cases[i].BUSADDRESS, 300, "Length of Last known business address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("RESADDRESS", cases[i].RESADDRESS, 300, "Length of Residence Address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("ISPREVIOUSSUR", cases[i].ISPREVIOUSSUR, 1, "Length of previous surveillance should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("ISBEYONDTMACTIVE", cases[i].ISBEYONDTMACTIVE, 1, "Length of permission to go beyond should be less than or equal to 1 characters", validationObject);
            validations.checkMaxLength("BUDGET", cases[i].BUDGET, 100, "Length of budget should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("HEARABOUTUS", cases[i].HEARABOUTUS, 200, "Length of heard about us should be less than or equal to 200 characters", validationObject);
            validations.checkMaxLength("LICENSEPLATE", cases[i].LICENSEPLATE, 50, "Length of License Plate should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CMAKE", cases[i].CMAKE, 50, "Length of make should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CMODEL", cases[i].CMODEL, 50, "Length of model should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CDESCRIPTION", cases[i].CDESCRIPTION, 300, "Length of description should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("HEIGHT", cases[i].HEIGHT, 6, "Length of height should be less than or equal to 6 characters", validationObject);
            validations.checkMaxLength("FILENO", cases[i].FILENO, 20, "Length of file should be less than or equal to 20 characters", validationObject);
            validations.checkMaxLength("HAIRCOLOR", cases[i].HAIRCOLOR, 100, "Length of hair color should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("TYPE", cases[i].TYPE, 100, "Length of type should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("COURTNM", cases[i].COURTNM, 100, "Length of court should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("DEPT", cases[i].DEPT, 50, "Length of department should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("WEIGHT", cases[i].WEIGHT, 6, "Length of weight should be less than or equal to 6 characters", validationObject);
            validations.checkMaxLength("RACE", cases[i].RACE, 50, "Length of race should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("AT", cases[i].AT, 150, "Length of AT should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("PLMKATTPAT", cases[i].PLMKATTPAT, 100, "Length of Make Attempt At should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("MISCELIST", cases[i].MISCELIST, 200, "Length of Miscellaneous Instructions should be less than or equal to 200 characters", validationObject);

            validations.checkNumber("AGE", cases[i].AGE, "Age should be a number", validationObject);
            validations.checkNumber("HOURSOFWK", cases[i].HOURSOFWK, "Hours Of Work should be a number", validationObject);
            validations.checkNumber("PHONE", cases[i].PHONE, "Phone should be a number", validationObject);
            validations.checkNumber("ZIPCD", cases[i].ZIPCD, "Zip code should be a number", validationObject);

            validations.checkEmail("EMAIL", cases[i].EMAIL, "Email id is not valid", validationObject);

            if(Object.keys(validationObject).length == 0)            
                validations.isDateGreater("SURSTARTDT", cases[i].SURSTARTDT, "SURENDDT", cases[i].SURENDDT, "Surveillance (Start date) should be less than Surveillance (End date)", validationObject); 

            // ==> Check date validation pending    LTDTTOSERV,     CASEDT
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
            
            for(let i=0; i<cases.length; i++)
            {                
                // Add update params 
                cases[i].UDATE = curDate;
                cases[i].UTIME = curTime;
                cases[i].UUSER = loginUser.USERID.toLowerCase();
            }
        
            return cases;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Validation funtion for deletion
const validateDELETEWorkersCompData = async (cases) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < cases.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", cases[i].CIDSYS, "System Case ID is required", validationObject);

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
            
            for(let i=0; i<cases.length; i++)
            {                
                // Add delete params 
                cases[i].DDATE = curDate;
                cases[i].DTIME = curTime;
                cases[i].DUSER = loginUser.USERID.toLowerCase();
            }
        
            return cases;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}



/*** CRUD Operations for Other Case ***/
// Resolver function for mutation OtherCaseCRUDOps(input) : String
const OtherCaseCRUDOps = async (args, context, info) =>
{
    try 
    {   
        
        loginUser = validations.getLoginData(context);

        // Get the transaction from arguments
        let transaction = args.transaction;

        let affectedRecords = 0;

        // If transaction is not available
        if(typeof transaction === 'undefined' || transaction == null || transaction.trim().length == 0)
            throw new Error("Transaction is required and can not be empty.");

        transaction = transaction.trim().toUpperCase();    
        
        if(transaction == "CREATE")     // Create 
        {

            // Validate input data
            let cases = await validateCREATEOtherCaseData(args.cases);
            
            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createCases(cases);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let cases = await validateUPDATEOtherCaseData(args.cases);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cases.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateCases(cases);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let cases = await validateDELETEOtherCaseData(args.cases);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != cases.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteCases(cases);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let cases = await validateDELETEOtherCaseData(args.cases);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCases(cases);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != cases.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteCases(cases);
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
        throw error;    
    }

}
// Validation funtion for creation
const validateCREATEOtherCaseData = async (cases) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < cases.length; i++)
        {
            let validationObject = {};

           /* validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("PRIORITY", cases[i].PRIORITY, "Priority Status is required", validationObject);
            validations.checkNull("CASEDT", cases[i].CASEDT, "Case Date is required", validationObject);
            validations.checkNull("SUBJECT", cases[i].SUBJECT, "Subject is required", validationObject);
            validations.checkNull("DESCRIPTION", cases[i].DESCRIPTION, "Description is required", validationObject);

            validations.checkMaxLength("CID", cases[i].CID, 10, "Length of Case id should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("SUBJECT", cases[i].SUBJECT, 200, "Length of Subject should be less than or equal to 200 characters", validationObject);
            validations.checkMaxLength("DESCRIPTION", cases[i].DESCRIPTION, 500, "Length of GPS needed should be less than or equal to 500 characters", validationObject);
          */
          validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
          validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
          validations.checkNull("FRSTNM", cases[i].FRSTNM, "First Name is required", validationObject);
         validations.checkNull("LSTNM", cases[i].LSTNM, "Last Name is required", validationObject);
          //validations.checkNull("SPOUSE", cases[i].SPOUSE, "Spouse is required", validationObject);
          //validations.checkNull("CASEDT", cases[i].CASEDT, "Case Date is required", validationObject);
        // validations.checkNull("AKA", cases[i].AKA, "AKA is required", validationObject);
         
          validations.checkNull("DOB", cases[i].DOB, "Date of Birth is required", validationObject);
          //validations.checkNull("BUSINESSTYP", cases[i].BUSINESSTYP, "Type of Business is required", validationObject);
         // validations.checkNull("BUSINESSNM", cases[i].BUSINESSNM, "Name of Business is required", validationObject);
         // validations.checkNull("BUSINESSTXID", cases[i].BUSINESSTXID, "Tax ID of Business is required", validationObject);
         // validations.checkNull("CITY2", cases[i].CITY2, "City is required", validationObject);
         // validations.checkNull("ZIPCD2", cases[i].ZIPCD2, "Zip is required", validationObject);
         // validations.checkNull("DRIVERLINCSUB", cases[i].DRIVERLINCSUB, "Driver’s License Subject is required", validationObject);
         // validations.checkNull("CITY", cases[i].CITY, "City is required", validationObject);
         // validations.checkNull("EMPID", cases[i].EMPID, "Employed By is required", validationObject);
         // validations.checkNull("ZIPCD", cases[i].ZIPCD, "Zip is required", validationObject);
        //  validations.checkNull("BUSADDRESS", cases[i].BUSADDRESS, "Last Known Business Address is required", validationObject);
         // validations.checkNull("EMPCITY", cases[i].EMPCITY, "Employee City is required", validationObject);
         // validations.checkNull("EMPZIPCD", cases[i].EMPZIPCD, "Employee Zip is required", validationObject);
        //  validations.checkNull("RESADDRESS", cases[i].RESADDRESS, "Last Known Residential Address is required", validationObject);
         // validations.checkNull("SECURITYSUB", cases[i].SECURITYSUB, "Social Security Subject is required", validationObject);
         // validations.checkNull("DRIVERLINCSPOS", cases[i].DRIVERLINCSPOS, "Spouse Driver's License is required", validationObject);
         // validations.checkNull("ADJADDRESS", cases[i].ADJADDRESS, "Employer's Address is required", validationObject);
         // validations.checkNull("PHONE2", cases[i].PHONE2, "Phone is required", validationObject);
        //  validations.checkNull("STATE2", cases[i].STATE2, "State is required", validationObject);
         // validations.checkNull("PHONE", cases[i].PHONE, "Phone is required", validationObject);
        //  validations.checkNull("SECURITYSPOS", cases[i].SECURITYSPOS, "Social Security Spouse is required", validationObject);
         // validations.checkNull("EMPPHONE", cases[i].EMPPHONE, "Employee Phone is required", validationObject);
         // validations.checkNull("STATE", cases[i].STATE, "State is required", validationObject);
         // validations.checkNull("EMPSTATE", cases[i].EMPSTATE, "Employee State is required", validationObject);

         //validations.checkNull("SERVICES", cases[i].SERVICES, "Services is required", validationObject); //COMMENTED ON 20190731
         validations.checkNull("TYPE", cases[i].TYPE, "Services is required", validationObject); //COMMENTED ON 20190731

            // ==> Check date validation pending    LTDTTOSERV,     CASEDT
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
            
            for(let i = 0; i < cases.length; i++)
            {
                // Get auto-generated number for case id
                nextNumber = await numberSeries.getNextSeriesNumber(cases[i].CLNT, "NA", "CASEID");
                
                // Add auto-generated number as case id
                cases[i].CIDSYS = nextNumber;
        
                // Add create params 
                cases[i].CDATE = curDate;
                cases[i].CTIME = curTime;
                cases[i].ISDEL = "N";
                
                // Add additional information
                cases[i].SERVICETYP = "Other Cases";
                cases[i].STATUS = "08";
                cases[i].ISCLOSED = "N";
                cases[i].CASETL = "Title";
            }
        
            return cases;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Validation funtion for updation
const validateUPDATEOtherCaseData = async (cases) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < cases.length; i++)
        {
            let validationObject = {};

            /*validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", cases[i].CIDSYS, "System Case ID is required", validationObject);
            validations.checkNull("PRIORITY", cases[i].PRIORITY, "Priority Status is required", validationObject);
            validations.checkNull("CASEDT", cases[i].CASEDT, "Case Date is required", validationObject);
            validations.checkNull("SUBJECT", cases[i].SUBJECT, "Subject is required", validationObject);
            validations.checkNull("DESCRIPTION", cases[i].DESCRIPTION, "Description is required", validationObject);

            validations.checkMaxLength("CID", cases[i].CID, 10, "Length of Case id should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("SUBJECT", cases[i].SUBJECT, 200, "Length of Subject should be less than or equal to 200 characters", validationObject);
            validations.checkMaxLength("DESCRIPTION", cases[i].DESCRIPTION, 500, "Length of GPS needed should be less than or equal to 500 characters", validationObject);
           */
          validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("FRSTNM", cases[i].FRSTNM, "First Name is required", validationObject);
           validations.checkNull("LSTNM", cases[i].LSTNM, "Last Name is required", validationObject);
            //validations.checkNull("SPOUSE", cases[i].SPOUSE, "Spouse is required", validationObject);
            //validations.checkNull("CASEDT", cases[i].CASEDT, "Case Date is required", validationObject);
          // validations.checkNull("AKA", cases[i].AKA, "AKA is required", validationObject);
           
            validations.checkNull("DOB", cases[i].DOB, "Date of Birth is required", validationObject);
            //validations.checkNull("BUSINESSTYP", cases[i].BUSINESSTYP, "Type of Business is required", validationObject);
           // validations.checkNull("BUSINESSNM", cases[i].BUSINESSNM, "Name of Business is required", validationObject);
           // validations.checkNull("BUSINESSTXID", cases[i].BUSINESSTXID, "Tax ID of Business is required", validationObject);
           // validations.checkNull("CITY2", cases[i].CITY2, "City is required", validationObject);
           // validations.checkNull("ZIPCD2", cases[i].ZIPCD2, "Zip is required", validationObject);
           // validations.checkNull("DRIVERLINCSUB", cases[i].DRIVERLINCSUB, "Driver’s License Subject is required", validationObject);
           // validations.checkNull("CITY", cases[i].CITY, "City is required", validationObject);
           // validations.checkNull("EMPID", cases[i].EMPID, "Employed By is required", validationObject);
           // validations.checkNull("ZIPCD", cases[i].ZIPCD, "Zip is required", validationObject);
          //  validations.checkNull("BUSADDRESS", cases[i].BUSADDRESS, "Last Known Business Address is required", validationObject);
           // validations.checkNull("EMPCITY", cases[i].EMPCITY, "Employee City is required", validationObject);
           // validations.checkNull("EMPZIPCD", cases[i].EMPZIPCD, "Employee Zip is required", validationObject);
          //  validations.checkNull("RESADDRESS", cases[i].RESADDRESS, "Last Known Residential Address is required", validationObject);
           // validations.checkNull("SECURITYSUB", cases[i].SECURITYSUB, "Social Security Subject is required", validationObject);
           // validations.checkNull("DRIVERLINCSPOS", cases[i].DRIVERLINCSPOS, "Spouse Driver's License is required", validationObject);
           // validations.checkNull("ADJADDRESS", cases[i].ADJADDRESS, "Employer's Address is required", validationObject);
           // validations.checkNull("PHONE2", cases[i].PHONE2, "Phone is required", validationObject);
          //  validations.checkNull("STATE2", cases[i].STATE2, "State is required", validationObject);
           // validations.checkNull("PHONE", cases[i].PHONE, "Phone is required", validationObject);
          //  validations.checkNull("SECURITYSPOS", cases[i].SECURITYSPOS, "Social Security Spouse is required", validationObject);
           // validations.checkNull("EMPPHONE", cases[i].EMPPHONE, "Employee Phone is required", validationObject);
           // validations.checkNull("STATE", cases[i].STATE, "State is required", validationObject);
           // validations.checkNull("EMPSTATE", cases[i].EMPSTATE, "Employee State is required", validationObject);
            // ==> Check date validation pending    LTDTTOSERV,     CASEDT
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
            
            for(let i=0; i<cases.length; i++)
            {                
                // Add update params 
                cases[i].UDATE = curDate;
                cases[i].UTIME = curTime        
            }
        
            return cases;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// // Validation funtion for creation
// const validateCREATEOtherCaseData = async (cases) =>
// {
//     try 
//     {
//         let validationObjects = {};

//         for(let i = 0; i < cases.length; i++)
//         {
//             let validationObject = {};

//             validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
//             validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
//             validations.checkNull("PRIORITY", cases[i].PRIORITY, "Priority Status is required", validationObject);
//             validations.checkNull("CASEDT", cases[i].CASEDT, "Case Date is required", validationObject);
//             validations.checkNull("SUBJECT", cases[i].SUBJECT, "Subject is required", validationObject);
//             validations.checkNull("DESCRIPTION", cases[i].DESCRIPTION, "Description is required", validationObject);

//             validations.checkMaxLength("CID", cases[i].CID, 10, "Length of Case id should be less than or equal to 10 characters", validationObject);
//             validations.checkMaxLength("SUBJECT", cases[i].SUBJECT, 200, "Length of Subject should be less than or equal to 200 characters", validationObject);
//             validations.checkMaxLength("DESCRIPTION", cases[i].DESCRIPTION, 500, "Length of GPS needed should be less than or equal to 500 characters", validationObject);

//             // ==> Check date validation pending    LTDTTOSERV,     CASEDT
//             if(Object.keys(validationObject).length != 0)
//                 validationObjects[i] = validationObject;

//         }
        
//         // if data is not valid, throw validation errors
//         if(Object.keys(validationObjects).length != 0)
//         {
//             throw new Error(JSON.stringify(validationObjects));
//         }
//         else
//         {
//             let nextNumber;
    
//             // Get system date and time
//             let curDate = sysDateTime.sysdate_yyyymmdd();
//             let curTime = sysDateTime.systime_hh24mmss();
            
//             for(let i = 0; i < cases.length; i++)
//             {
//                 // Get auto-generated number for case id
//                 nextNumber = await numberSeries.getNextSeriesNumber(cases[i].CLNT, "NA", "CASEID");
                
//                 // Add auto-generated number as case id
//                 cases[i].CIDSYS = nextNumber;
        
//                 // Add create params 
//                 cases[i].CDATE = curDate;
//                 cases[i].CTIME = curTime;
//                 cases[i].ISDEL = "N";
//                 cases[i].CUSER = loginUser.USERID.toLowerCase();

//                 // Add additional information
//                 cases[i].SERVICETYP = "Other Cases";
//                 cases[i].STATUS = "08";
//                 cases[i].ISCLOSED = "N";
//                 cases[i].CASETL = "Title";
//             }
        
//             return cases;        
//         }            
//     } 
//     catch (error) 
//     {
//         throw error;    
//     }
// }

// // Validation funtion for updation
// const validateUPDATEOtherCaseData = async (cases) =>
// {
//     try 
//     {
//         let validationObjects = {};

//         for(let i = 0; i < cases.length; i++)
//         {
//             let validationObject = {};

//             validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
//             validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
//             validations.checkNull("CIDSYS", cases[i].CIDSYS, "System Case ID is required", validationObject);
//             validations.checkNull("PRIORITY", cases[i].PRIORITY, "Priority Status is required", validationObject);
//             validations.checkNull("CASEDT", cases[i].CASEDT, "Case Date is required", validationObject);
//             validations.checkNull("SUBJECT", cases[i].SUBJECT, "Subject is required", validationObject);
//             validations.checkNull("DESCRIPTION", cases[i].DESCRIPTION, "Description is required", validationObject);

//             validations.checkMaxLength("CID", cases[i].CID, 10, "Length of Case id should be less than or equal to 10 characters", validationObject);
//             validations.checkMaxLength("SUBJECT", cases[i].SUBJECT, 200, "Length of Subject should be less than or equal to 200 characters", validationObject);
//             validations.checkMaxLength("DESCRIPTION", cases[i].DESCRIPTION, 500, "Length of GPS needed should be less than or equal to 500 characters", validationObject);

//             // ==> Check date validation pending    LTDTTOSERV,     CASEDT
//             if(Object.keys(validationObject).length != 0)
//                 validationObjects[i] = validationObject;

//         }
        
//         // if data is not valid, throw validation errors
//         if(Object.keys(validationObjects).length != 0)
//         {
//             throw new Error(JSON.stringify(validationObjects));
//         }
//         else
//         {
//             // Get system date and time
//             let curDate = sysDateTime.sysdate_yyyymmdd();
//             let curTime = sysDateTime.systime_hh24mmss();
            
//             for(let i=0; i<cases.length; i++)
//             {                
//                 // Add update params 
//                 cases[i].UDATE = curDate;
//                 cases[i].UTIME = curTime;
//                 cases[i].UUSER = loginUser.USERID.toLowerCase();        
//             }
        
//             return cases;        
//         }            
//     } 
//     catch (error) 
//     {
//         throw error;    
//     }
// }

// Validation funtion for deletion
const validateDELETEOtherCaseData = async (cases) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < cases.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", cases[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", cases[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", cases[i].CIDSYS, "System Case ID is required", validationObject);

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
            
            for(let i=0; i<cases.length; i++)
            {                
                // Add delete params 
                cases[i].DDATE = curDate;
                cases[i].DTIME = curTime;
                cases[i].DUSER = loginUser.USERID.toLowerCase();
            }
        
            return cases;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


/**
 * Check duplicate cases
 **/
// Function to check uniqueness of data
const checkDuplicateCases = async (cases) =>
{
    try 
    {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
    
        for(let i = 0; i < cases.length; i++)
        {
            placeHolders = [
                (typeof cases[i].CLNT !== 'undefined' && cases[i].CLNT.trim())        ?   cases[i].CLNT.trim()    : '',
                (typeof cases[i].LANG !== 'undefined' && cases[i].LANG.trim())        ?   cases[i].LANG.trim()    : '',
                (typeof cases[i].CIDSYS !== 'undefined' && cases[i].CIDSYS.trim())    ?   cases[i].CIDSYS.trim()  : ''
            ];
    
            result = await dbServices.getTableData(checkDuplicateCasesQuery, placeHolders)
            
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


/**
 * Create Cases 
 **/
// function for creating cases records
const createCases = async (cases) =>
{
    try 
    {                        
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;
        let caseIDs = [];

        for(let i = 0; i < cases.length; i++)
        {
            // form the data json
            dataJSON = cases[i];
            caseIDs[i] = dataJSON.CIDSYS;

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("CASEDETAILS", dataJSON);
            insertStatements.push(insertStatement);
            //console.log("insertStatement => ");  console.log(insertStatement);

        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(insertStatements);

        //return affectedRecords;  
        return caseIDs;        

    } 
    catch (error) 
    {
        throw error;    
    }

}

/*// function for creating cases records
const createCases = async (cases) =>
{
    try 
    {                        
        let insertDML = `
            INSERT INTO CASEDETAILS
            SET ?
        `;

        let valuesArray = cases;

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


/**
 * Update Cases 
 **/
// function for updating cases records
const updateCases = async (cases) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;
        let caseIDs = [];

        for(let i = 0; i < cases.length; i++)
        {
            // form the data json
            dataJSON = cases[i];
            caseIDs[i] = dataJSON.CIDSYS;
        
            // form the clause json
            clauseJSON = {
                "CLNT"      :   cases[i].CLNT,
                "LANG"      :   cases[i].LANG,
                "CIDSYS"    :   cases[i].CIDSYS
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("CASEDETAILS", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);
            //console.log("updateStatement => ");  console.log(updateStatement);
        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        //return affectedRecords;   
        return caseIDs;        
     
    } 
    catch (error) 
    {
        return error;    
    }
}


/**
 * Logical Delete Cases 
 **/
// function for logically deleting cases records
const logicalDeleteCases = async (cases) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;
        let caseIDs = [];

        for(let i = 0; i < cases.length; i++)
        {
            // form the data json
            dataJSON = {
                "ISDEL"   :   "Y",
                "DDATE"	  :   cases[i].DDATE,
                "DTIME"	  :   cases[i].DTIME,
                "DUSER"	  :   cases[i].DUSER
            };
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   cases[i].CLNT,
                "LANG"    :   cases[i].LANG,
                "CIDSYS"  :	  cases[i].CIDSYS
            };

            caseIDs[i] = cases[i].CIDSYS;

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("CASEDETAILS", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);
            //console.log("updateStatement => ");  console.log(updateStatement);
        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        //return affectedRecords;        
        return caseIDs;        

    } 
    catch (error) 
    {
        return error;    
    }
}


/**
 * Physical Delete Cases 
 **/
// function for phyically deleting cases records
const physicalDeleteCases = async (cases) =>
{
    try 
    {   
        let deleteStatement;             
        let deleteStatements = [] ;
        let clauseJSON;
        let result;
        let affectedRecords = 0;
        let caseIDs = [];

        for(let i = 0; i < cases.length; i++)
        {
            // form the caluse json
            clauseJSON = {
                "CLNT"    :   cases[i].CLNT,
                "LANG"    :   cases[i].LANG,
                "CIDSYS"  :	  cases[i].CIDSYS
            }

            caseIDs[i] = cases[i].CIDSYS;

            // Get the delete statement
            deleteStatement = await dbServices.getDeleteStatement("CASEDETAILS", clauseJSON);
            deleteStatements.push(deleteStatement);
        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(deleteStatements);

        //return affectedRecords;
        return caseIDs;        
        
    } 
    catch (error) 
    {
        return error;    
    }
}


/**
 * Update Cases for Status
 **/
// function for updating cases 
const UpdateCaseStatus = async (args, context, info) =>
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
        let caseIDs = [];
        let casestatus = args.casestatus;

        for(let i = 0; i < casestatus.length; i++)
        {

            // form the data json
            dataJSON = {
               "STATUS"   : casestatus[i].STATUS,
               //added 20181009

               "PRIORITY"   : casestatus[i].PRIORITY,
               "ASSIGNUSER" : casestatus[i].ASSIGNUSER,
               "CASERATE"   : casestatus[i].CASERATE,


               "STATUSDT" : sysDateTime.sysdate_yyyymmdd(),
               "STATUSTM" : sysDateTime.systime_hh24mmss()
            };
        
            // form the clause json
            clauseJSON = {
                "CLNT"      :   casestatus[i].CLNT,
                "LANG"      :   casestatus[i].LANG,
                "CIDSYS"    :   casestatus[i].CIDSYS
            }

            caseIDs[i] = casestatus[i].CIDSYS;

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("CASEDETAILS", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);
            //console.log("updateStatement => ");  console.log(updateStatement);
        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        //return affectedRecords;   
        return caseIDs;        
     
    } 
    catch (error) 
    {
        return error;    
    }
}


// Export functions
module.exports = {
    searchCases,
    caseDetails,
    CasesCRUDOps,
    UpdateCaseStatus 
};
