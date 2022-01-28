/**
 * @author 
 */

// Import section
import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';

import docHeaderServices from './docHeaderServices';
import docDetailsServices from './docDetailsServices';
import taxAmountServices from './taxAmountServices';

import {
    searchBillableHoursHeaderQuery,
    searchBillableHoursDetailsQuery,
    searchBillableCaseHoursQuery,
    searchInvoicesQuery,
    searchBilledHoursHeaderQuery,
    searchBilledHoursDetailsQuery,
    invoiceReportHeaderQuery,
    invoiceReportTitleQuery,
    invoiceReportItemsQuery,
    invoiceReportTotalQuery,
    progressReportQuery
} from '../common/sqlQueries';


// Logged in user
var loginUser = {CLNT:"1002",LANG:"EN",USERNAME:"Sohan Patil",USERID:"SP0001",AUTH:{GRPID:"EXUSRS",GRPNM:"EMPLOYEE GROUP",}};


// Resolver function for query searchBillableHoursHeader(input) : [BillableHours]
const searchBillableHoursHeader = async (args, context, info) => {
    try {


        loginUser = validations.getLoginData(context);
        
        
        let selectQuery = searchBillableHoursHeaderQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim()) ? args.CLNT.trim() : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim()) ? args.LANG.trim() : '',
            (typeof args.FROMDATE !== 'undefined' && args.FROMDATE.trim()) ? args.FROMDATE.trim() : '',
            (typeof args.TODATE !== 'undefined' && args.TODATE.trim()) ? args.TODATE.trim() : '',
            (typeof args.FIRSTNM !== 'undefined' && args.FIRSTNM.trim()) ? args.FIRSTNM.trim() : '%%',
            (typeof args.LASTNM !== 'undefined' && args.LASTNM.trim()) ? args.LASTNM.trim() : '%%'

        ];

        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders);

        return result;
    }
    catch (error) {
        return error;
    }

}



// Resolver function for query searchBillableHoursDetails(input) : [BillableHours]
const searchBillableHoursDetails = async (args, context, info) => {
    try {

        loginUser = validations.getLoginData(context);

        let selectQuery = searchBillableHoursDetailsQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim()) ? args.CLNT.trim() : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim()) ? args.LANG.trim() : '',
            (typeof args.CLNTID !== 'undefined' && args.CLNTID.trim()) ? args.CLNTID.trim() : '',
            (typeof args.FROMDATE !== 'undefined' && args.FROMDATE.trim()) ? args.FROMDATE.trim() : '',
            (typeof args.TODATE !== 'undefined' && args.TODATE.trim()) ? args.TODATE.trim() : ''
        ];

        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders);

        return result;
    }
    catch (error) {
        return error;
    }

}



// Resolver function for query searchBillableCaseHours(input) : [BillableHours]
const searchBillableCaseHours = async (args, context, info) => {
    try {

        loginUser = validations.getLoginData(context);

        let selectQuery = searchBillableCaseHoursQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim()) ? args.CLNT.trim() : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim()) ? args.LANG.trim() : '',
            (typeof args.CLNTID !== 'undefined' && args.CLNTID.trim()) ? args.CLNTID.trim() : '',
            (typeof args.CIDSYS !== 'undefined' && args.CIDSYS.trim()) ? args.CIDSYS.trim() : '',
            (typeof args.FROMDATE !== 'undefined' && args.FROMDATE.trim()) ? args.FROMDATE.trim() : '',
            (typeof args.TODATE !== 'undefined' && args.TODATE.trim()) ? args.TODATE.trim() : '',
            (typeof args.ISBILLED !== 'undefined' && args.ISBILLED.trim()) ? args.ISBILLED.trim() : '%%'
        ];

        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders);

        return result;
    }
    catch (error) {
        return error;
    }

}


// Resolver function for query searchInvoices(input) : [Invoices]
const searchInvoices = async (args, context, info) => {
    try {

        loginUser = validations.getLoginData(context);

        let selectQuery = searchInvoicesQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim()) ? args.CLNT.trim() : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim()) ? args.LANG.trim() : '',
            (typeof args.DOCTYPE !== 'undefined' && args.DOCTYPE.trim()) ? args.DOCTYPE.trim() : '',
            (typeof args.DOCNO !== 'undefined' && args.DOCNO.trim()) ? args.DOCNO.trim() : '%%',
            (typeof args.CUSTOMER !== 'undefined' && args.CUSTOMER.trim()) ? args.CUSTOMER.trim() : '%%',
            (typeof args.CMPNNM !== 'undefined' && args.CMPNNM.trim()) ? args.CMPNNM.trim() : '%%',
            (typeof args.CIDSYS !== 'undefined' && args.CIDSYS.trim()) ? args.CIDSYS.trim() : '%%',
            (typeof args.DOCFRMDT !== 'undefined' && args.DOCFRMDT.trim()) ? args.DOCFRMDT.trim() : '',
            (typeof args.DOCTODT !== 'undefined' && args.DOCTODT.trim()) ? args.DOCTODT.trim() : '',
            (typeof args.CUSTCD !== 'undefined' && args.CUSTCD.trim()) ? args.CUSTCD.trim() : '%%'            
        ];

        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders);

        return result;
    }
    catch (error) {
        return error;
    }

}


// Resolver function for query searchBilledHoursHeader(input) : [BilledHoursHeader]
const searchBilledHoursHeader = async (args, context, info) => {
    try {

        loginUser = validations.getLoginData(context);

        let selectQuery = searchBilledHoursHeaderQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim()) ? args.CLNT.trim() : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim()) ? args.LANG.trim() : ''
        ];

        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders);

        return result;
    }
    catch (error) {
        return error;
    }

}


// Resolver function for query searchBilledHoursDetails(input) : [BilledHoursDetails]
const searchBilledHoursDetails = async (args, context, info) => {
    try {

        loginUser = validations.getLoginData(context);

        let selectQuery = searchBilledHoursDetailsQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim()) ? args.CLNT.trim() : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim()) ? args.LANG.trim() : '',
            (typeof args.CLNTIDS !== 'undefined' && args.CLNTIDS.trim()) ? args.CLNTIDS.trim() : '',
            (typeof args.CLNTIDS !== 'undefined' && args.CLNTIDS.trim()) ? args.CLNTIDS.trim() : '',
            (typeof args.CLNTIDS !== 'undefined' && args.CLNTIDS.trim()) ? args.CLNTIDS.trim() : ''
        ];

        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders);

        return result;
    }
    catch (error) {
        return error;
    }

}



// Resolver function for mutation invoiceDetails(input) : [InvoiceDetails]
const invoiceDetails = async (args, context, info) => {
    try {
        loginUser = validations.getLoginData(context);

        // Get invoice header
        let docHeader = await docHeaderServices.documentHeader(args, context, info);
        //console.log("docHeader => "); console.log(docHeader[0]);

        // Get invoice details
        let docDetail = await docDetailsServices.documentDetails(args, context, info);

        // Get invoice tax details
        let taxAmount = await taxAmountServices.taxAmountDetails(args, context, info);

        // Form the InvoiceDetails json
        let invoice = [{
            "DocHeader": docHeader[0],
            "DocDetails": docDetail,
            "TaxAmounts": taxAmount
        }]

        return invoice;

    }
    catch (error) {
        return error;
    }

}



/**
 * CRUD Operations for Invoices
 * Data will be iserted into three tables TDOCHDR, TDOCDTL & TTAXAMOUNT for Header, Details and Tax Amount respectively
 **/
// Resolver function for mutation InvoicesCRUDOps(input) : String
const InvoicesCRUDOps = async (args, context, info) => {
    try {

        loginUser = validations.getLoginData(context);

        // Get the transaction from arguments
        let transaction = args.transaction;

        let affectedRecords = 0;

        // If transaction is not available
        if (typeof transaction === 'undefined' || transaction.trim().length == 0)
            throw new Error("Transaction is required and can not be empty.");

        transaction = transaction.trim().toUpperCase();

        if (transaction == "CREATE")     // Create 
        {

            // Validate input data
            let invoices = await validateCREATEInvoicesData(args.invoices);

            // Check uniqueness of input data
            let duplicateObj = await checkDuplicateInvoices(invoices);

            // if all goes well, then create records
            if (duplicateObj.isDuplicate) {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else {
                affectedRecords = await createInvoices(invoices);
            }

        }
        else if (transaction == "UPDATE")    // Update
        {

            // Validate input data
            let invoices = await validateUPDATEInvoicesData(args.invoices);

            // Check uniqueness of input data
            let duplicateObj = await checkDuplicateInvoices(invoices);

            // If invoice is available, then delete previous invoice 
            if (parseInt(duplicateObj.duplicateCount) != invoices.length) {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else {
                affectedRecords = await physicalDeleteInvoices(invoices);

                // Re-Create Invoice using same document id
                if (affectedRecords != 0) {
                    affectedRecords = await createInvoices(invoices);
                }
            }


            /*// Check availability of records
            let duplicateObj =  await checkDuplicateInvoices(invoices);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != invoices.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateInvoices(invoices);
            }*/

        }
        else if (transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let invoices = await validateDELETEInvoicesData(args.invoices);

            // Check availability of records
            let duplicateObj = await checkDuplicateInvoices(invoices);

            // if all goes well, then update records
            if (parseInt(duplicateObj.duplicateCount) != invoices.length) {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else {
                affectedRecords = await logicalDeleteInvoices(invoices);
            }

        }
        else if (transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let invoices = await validateDELETEInvoicesData(args.invoices);

            // Check availability of records
            let duplicateObj = await checkDuplicateInvoices(invoices);

            // if all goes well, then delete records
            if (parseInt(duplicateObj.duplicateCount) != invoices.length) {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else {
                affectedRecords = await physicalDeleteInvoices(invoices);
            }

        }
        else    // Throw invalid transaction error
        {
            throw new Error("Invalid transaction specified.");
        }

        return affectedRecords;

    }
    catch (error) {
        return error;
    }

}



// Validation funtion for creation
const validateCREATEInvoicesData = async (invoices) => {
    try {
        let validationObjects = {};
        let nextNumber, docNumber;
        let docheader, docdetails, taxamounts;
        let errorObject = {};
        let isInvalidData = false;

        for (let i = 0; i < invoices.length; i++) {
            let validationObject = {};

            // Get auto-generated number for document id
            nextNumber = await numberSeries.getNextSeriesNumber(invoices[i].DocHeader.CLNT, "INV", "DOCID");

            // If invoice is for Billable Hours, auto-generate it
            if (invoices[i].DocHeader.DOCNO.trim().toUpperCase() == 'BH') {
                // Get auto-generated number for document number
                docNumber = await numberSeries.getNextSeriesNumber(invoices[i].DocHeader.CLNT, "INV", "INVNO");

                // Set document number
                invoices[i].DocHeader.DOCNO = docNumber;
            }

            // Set document id
            invoices[i].DocHeader.DOCID = nextNumber;

            for (let j = 0; j < invoices[i].DocDetails.length; j++) {
                invoices[i].DocDetails[j].DOCID = nextNumber;
            }

            for (let k = 0; k < invoices[i].TaxAmounts.length; k++) {
                invoices[i].TaxAmounts[k].DOCID = nextNumber;
            }

            // Validate input invoice
            /*
            let tmpDocHdr = [invoices[i].DocHeader];
            tmpDocHdr = await docHeaderServices.validateCREATEData(tmpDocHdr); 

            invoices[i].DocHeader  = tmpDocHdr[0] ;                    
            invoices[i].DocDetails = await docDetailsServices.validateCREATEData(invoices[i].DocDetails);
            invoices[i].TaxAmounts = await taxAmountServices.validateCREATEData(invoices[i].TaxAmounts);            
            */

            // Validate Header
            try {
                let tmpDocHdr = [invoices[i].DocHeader];
                tmpDocHdr = await docHeaderServices.validateCREATEData(tmpDocHdr);

                invoices[i].DocHeader = tmpDocHdr[0];
                errorObject[i] = { "DocHeader": "{}" };
            }
            catch (error) {
                isInvalidData = true;
                errorObject[i] = { "DocHeader": error.message };
                //throw new Error(JSON.stringify(errorObject));
            }

            // Validate Details
            try {
                invoices[i].DocDetails = await docDetailsServices.validateCREATEData(invoices[i].DocDetails);
                errorObject[i].DocDetails = "{}";
            }
            catch (error) {
                isInvalidData = true;
                errorObject[i].DocDetails = error.message;
                //throw new Error(JSON.stringify(errorObject));
            }

            // Validate Tax Amounts
            try {
                invoices[i].TaxAmounts = await taxAmountServices.validateCREATEData(invoices[i].TaxAmounts);
                errorObject[i].TaxAmounts = "{}";
            }
            catch (error) {
                isInvalidData = true;
                errorObject[i].TaxAmounts = error.message;
                //throw new Error(JSON.stringify(errorObject));
            }

        }

        if (isInvalidData)
            throw new Error(JSON.stringify(errorObject));
        else
            return invoices;

    }
    catch (error) {
        throw error;
    }
}


// Validation funtion for updation      
// Note : Invoice will be recreated by deleting existing invoice
const validateUPDATEInvoicesData = async (invoices) => {
    try {
        let validationObjects = {};
        let docheader, docdetails, taxamounts;
        let errorObject = {};
        let isInvalidData = false;
        let invDocID;

        for (let i = 0; i < invoices.length; i++) {
            let validationObject = {};

            // Get the present document id from header
            invDocID = invoices[i].DocHeader.DOCID;

            // Set the document id in details and tax amounts
            for (let j = 0; j < invoices[i].DocDetails.length; j++) {
                invoices[i].DocDetails[j].DOCID = invDocID;
            }

            for (let k = 0; k < invoices[i].TaxAmounts.length; k++) {
                invoices[i].TaxAmounts[k].DOCID = invDocID;
            }

            // Validate Header
            try {
                let tmpDocHdr = [invoices[i].DocHeader];
                tmpDocHdr = await docHeaderServices.validateCREATEData(tmpDocHdr);

                invoices[i].DocHeader = tmpDocHdr[0];
                errorObject[i] = { "DocHeader": "{}" };
            }
            catch (error) {
                isInvalidData = true;
                errorObject[i] = { "DocHeader": error.message };
                //throw new Error(JSON.stringify(errorObject));
            }

            // Validate Details
            try {
                invoices[i].DocDetails = await docDetailsServices.validateCREATEData(invoices[i].DocDetails);
                errorObject[i].DocDetails = "{}";
            }
            catch (error) {
                isInvalidData = true;
                errorObject[i].DocDetails = error.message;
                //throw new Error(JSON.stringify(errorObject));
            }

            // Validate Tax Amounts
            try {
                invoices[i].TaxAmounts = await taxAmountServices.validateCREATEData(invoices[i].TaxAmounts);
                errorObject[i].TaxAmounts = "{}";
            }
            catch (error) {
                isInvalidData = true;
                errorObject[i].TaxAmounts = error.message;
                //throw new Error(JSON.stringify(errorObject));
            }

        }

        if (isInvalidData)
            throw new Error(JSON.stringify(errorObject));
        else
            return invoices;

    }
    catch (error) {
        throw error;
    }
}


// Validation funtion for deletion      
const validateDELETEInvoicesData = async (invoices) => {
    try {
        let validationObjects = {};
        let docheader, docdetails, taxamounts;
        let errorObject = {};
        let isInvalidData = false;
        let invDocID;

        for (let i = 0; i < invoices.length; i++) {
            let validationObject = {};

            // Validate Header
            try {
                let tmpDocHdr = [invoices[i].DocHeader];
                tmpDocHdr = await docHeaderServices.validateDELETEData(tmpDocHdr);

                invoices[i].DocHeader = tmpDocHdr[0];
                errorObject[i] = { "DocHeader": "{}" };
            }
            catch (error) {
                isInvalidData = true;
                errorObject[i] = { "DocHeader": error.message };
                //throw new Error(JSON.stringify(errorObject));
            }


        }

        if (isInvalidData)
            throw new Error(JSON.stringify(errorObject));
        else
            return invoices;

    }
    catch (error) {
        throw error;
    }
}


// Function to check uniqueness of data
const checkDuplicateInvoices = async (invoices) => {
    try {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
        let duplicateObj;

        for (let i = 0; i < invoices.length; i++) {
            // Check for duplicate header
            let tmpDocHdr = [invoices[i].DocHeader];
            duplicateObj = await docHeaderServices.checkDuplicateDocHeaders(tmpDocHdr);

            /*if(duplicateObj.isDuplicate)
                return duplicateObj;

            // Check for duplicate details    
            duplicateObj = await docDetailsServices.checkDuplicateDocDetails(invoices[i].DocDetails);
        
            if(duplicateObj.isDuplicate)
                return duplicateObj;

            // Check for duplicate tax amounts
            duplicateObj = await taxAmountServices.checkDuplicateTaxAmounts(invoices[i].TaxAmounts);
    
            if(duplicateObj.isDuplicate)
                return duplicateObj;*/

        }

        return duplicateObj;
    }
    catch (error) {
        throw error;
    }

}


// function for creating invoices records
const createInvoices = async (invoices) => {
    try {
        let insertStatement;
        let insertStatements = [];
        let headerDataJSON, detailsDataJSON, taxamountDataJSON;
        let result;
        let affectedRecords = 0;

        for (let i = 0; i < invoices.length; i++) {
            // form the header data json
            headerDataJSON = invoices[i].DocHeader;

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("TDOCHDR", headerDataJSON);
            insertStatements.push(insertStatement);

            for (let j = 0; j < invoices[i].DocDetails.length; j++) {
                // form the header data json
                detailsDataJSON = invoices[i].DocDetails[j];

                // Get the insert statement
                insertStatement = await dbServices.getInsertStatement("TDOCDTL", detailsDataJSON);
                insertStatements.push(insertStatement);
            }


            for (let k = 0; k < invoices[i].TaxAmounts.length; k++) {
                // form the header data json
                taxamountDataJSON = invoices[i].TaxAmounts[k];

                // Get the insert statement
                insertStatement = await dbServices.getInsertStatement("TTAXAMOUNT", taxamountDataJSON);
                insertStatements.push(insertStatement);
            }

        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(insertStatements);

        //return affectedRecords;    
        if (affectedRecords != 0)
            return invoices;

    }
    catch (error) {
        return error;
    }
}


// function for logically deleting invoices
const logicalDeleteInvoices = async (invoices) => {
    try {
        let updateStatement;
        let updateStatements = [];
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for (let i = 0; i < invoices.length; i++) {
            // form the data json
            dataJSON = {
                "ISDEL": "Y",
                "DDATE": invoices[i].DocHeader.DDATE,
                "DTIME": invoices[i].DocHeader.DTIME,
                "DUSER": invoices[i].DocHeader.DUSER
            };

            // form the clause json
            clauseJSON = {
                "CLNT": invoices[i].DocHeader.CLNT,
                "LANG": invoices[i].DocHeader.LANG,
                "DOCID": invoices[i].DocHeader.DOCID
            };


            // Get the update statement for header
            updateStatement = await dbServices.getUpdateStatement("TDOCHDR", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);

            // Get the update statement for details
            updateStatement = await dbServices.getUpdateStatement("TDOCDTL", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);

            // Get the update statement for tax amount
            updateStatement = await dbServices.getUpdateStatement("TTAXAMOUNT", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);

            // Get the update statement for TPROGRESSWORK
            updateStatement = ` UPDATE TPROGRESSWORK 
                                SET ISBILLED='N' 
                                WHERE CLNT= '`+ invoices[i].DocHeader.CLNT + `'
                                AND LANG= '`+ invoices[i].DocHeader.LANG + `'
                                AND DOCID= '`+ invoices[i].DocHeader.DOCID + `'
                                AND LINEITEMNO IN (
                                    SELECT D.LINEITEMNO 
                                    FROM TDOCDTL D ,TDOCHDR H 
                                    WHERE H.CLNT= '`+ invoices[i].DocHeader.CLNT + `'
                                    AND H.LANG= '`+ invoices[i].DocHeader.LANG + `'
                                    AND H.DOCID= '`+ invoices[i].DocHeader.DOCID + `'
                                    AND H.CLNT=D.CLNT 
                                    AND H.LANG=D.LANG 
                                    AND H.DOCID=D.DOCID 
                                )`;

            updateStatements.push(updateStatement);

            //console.log("updateStatements => ");  console.log(updateStatements);
        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        //return affectedRecords;  
        if (affectedRecords != 0)
            return invoices;

    }
    catch (error) {
        return error;
    }
}


// function for phyically deleting invoices
const physicalDeleteInvoices = async (invoices) => {
    try {
        let deleteStatement;
        let deleteStatements = [];
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for (let i = 0; i < invoices.length; i++) {
            // form the caluse json
            clauseJSON = {
                "CLNT": invoices[i].DocHeader.CLNT,
                "LANG": invoices[i].DocHeader.LANG,
                "DOCID": invoices[i].DocHeader.DOCID
            }

            // Get the delete statement for header
            deleteStatement = await dbServices.getDeleteStatement("TDOCHDR", clauseJSON);
            deleteStatements.push(deleteStatement);

            // Get the delete statement for details
            deleteStatement = await dbServices.getDeleteStatement("TDOCDTL", clauseJSON);
            deleteStatements.push(deleteStatement);

            // Get the delete statement for tax amount
            deleteStatement = await dbServices.getDeleteStatement("TTAXAMOUNT", clauseJSON);
            deleteStatements.push(deleteStatement);

            //console.log("deleteStatement => ");  console.log(deleteStatement);

        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(deleteStatements);

        return affectedRecords;
    }
    catch (error) {
        return error;
    }
}



// function for updating invoices status and payment mode
const updateInvoiceStatus = async (args, context, info) => {
    try {
        loginUser = validations.getLoginData(context);
        
        let updateStatement;
        let updateStatements = [];
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        // form the data json
        dataJSON = {
            "STATUS": args.STATUS,
            "PAYMENTBY": args.PAYMENTBY,
            "UDATE": sysDateTime.sysdate_yyyymmdd(),
            "UTIME": sysDateTime.systime_hh24mmss(),
            "UUSER" : loginUser.USERID.toLowerCase()
        };

        // form the clause json
        clauseJSON = {
            "CLNT": args.CLNT,
            "LANG": args.LANG,
            "DOCID": args.DOCID
        };


        // Get the update statement for header
        updateStatement = await dbServices.getUpdateStatement("TDOCHDR", dataJSON, clauseJSON);
        updateStatements.push(updateStatement);

        //console.log("updateStatements => ");  console.log(updateStatements);

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        return affectedRecords;

    }
    catch (error) {
        return error;
    }
}



// function for getting Invoice PDF Report data
const getInvoiceReportData = async (args) =>
{
    try 
    {
        
        let reportData = {};

        let params = JSON.parse(args.ParamObj);

        // Placeholders for prepared query
        let placeHolders = [
            (typeof params.CLNT !== 'undefined' && params.CLNT.trim())              ?   params.CLNT.trim()          : '',
            (typeof params.LANG !== 'undefined' && params.LANG.trim())              ?   params.LANG.trim()          : '',
            (typeof params.DOCID !== 'undefined' && params.DOCID.trim())            ?   params.DOCID.trim()      : ''
        ];
console.log('KEDAR 1234');

        let selectQuery = invoiceReportHeaderQuery;
        reportData.HDR = await dbServices.getTableData(selectQuery, placeHolders) ;

        selectQuery = invoiceReportTitleQuery;
        reportData.TITLE = await dbServices.getTableData(selectQuery, placeHolders) ;

        selectQuery = invoiceReportItemsQuery;
        reportData.DETAILS = await dbServices.getTableData(selectQuery, placeHolders) ;

        selectQuery = invoiceReportTotalQuery;
        reportData.TOTAL = await dbServices.getTableData(selectQuery, placeHolders) ;

        console.log("reportData => ");
        console.log(JSON.stringify(reportData));
        
        return JSON.stringify(reportData);        
    } 
    catch (error) 
    {
        return error;    
    }

}


//json  Data function for progress report
const getProgressReportData = async (args) =>
{
    try 
    {
        
        let reportData = {};

        let params = JSON.parse(args.ParamObj);

        // Placeholders for prepared query
        let placeHolders = [
            (typeof params.CLNT !== 'undefined' && params.CLNT.trim())              ?   params.CLNT.trim()          : '',
            (typeof params.LANG !== 'undefined' && params.LANG.trim())      
                    ?   params.LANG.trim()          : '',
            (typeof params.DOCID !== 'undefined' && params.DOCID.trim())            ?   params.DOCID.trim()      : ''
        ];


        let selectQuery =  progressReportQuery;
        reportData.PRGRPT = await dbServices.getTableData(selectQuery, placeHolders) ;

       
        //console.log(JSON.stringify(reportData));

        return JSON.stringify(reportData);        
    } 
    catch (error) 
    {
        return error;    
    }

}




// Export functions
module.exports = {
    searchBillableHoursHeader,
    searchBillableHoursDetails,
    searchBillableCaseHours,
    searchInvoices,
    searchBilledHoursHeader,
    searchBilledHoursDetails,
    invoiceDetails,
    InvoicesCRUDOps,
    updateInvoiceStatus,
    getInvoiceReportData,
    getProgressReportData
};