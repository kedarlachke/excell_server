/**
 * @author 
 */


// Import section
import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';
import admZip from 'adm-zip';
import ExcelSheetParse from './ExcelsheetParse'
import XLSX from 'xlsx';



import {
    searchCompanyDocumentsQuery,
    searchUploadedDocumentsQuery,
    downloadUploadedDocumentsQuery,
    downloadProgressReportDocumentsQuery,
    downloadProgressReportZipQuery,
    getUploadedDocDetailsQuery,
    downloadPriceListQuery,
    downloadCompanyProfileQuery,
    checkDuplicateCompanyDocsQuery
} from '../common/sqlQueries';


// Logged in user
var loginUser = {CLNT:"1002",LANG:"EN",USERNAME:"Sohan Patil",USERID:"SP0001",AUTH:{GRPID:"EXUSRS",GRPNM:"EMPLOYEE GROUP",}};


// Resolver function for query searchCompanyDocuments(input) : [CompanyDocuments]
const searchCompanyDocuments = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = searchCompanyDocumentsQuery;
        
        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : ''
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


// Resolver function for query searchUploadedDocuments(input) : [UploadedDocuments]
const searchUploadedDocuments = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = searchUploadedDocumentsQuery;
        
        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : '',
            (typeof args.CENTITYID !== 'undefined' && args.CENTITYID.trim())    ?   args.CENTITYID.trim()     : '',
            (typeof args.CENTITY !== 'undefined' && args.CENTITY.trim())        ?   args.CENTITY.trim()       : ''

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



// Resolver function for query documentDetails(input) : [UploadedDocuments]
const documentDetails = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = getUploadedDocDetailsQuery;
        
        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : '',
            (typeof args.CENTITYID !== 'undefined' && args.CENTITYID.trim())    ?   args.CENTITYID.trim()     : '',
            (typeof args.CENTITY !== 'undefined' && args.CENTITY.trim())        ?   args.CENTITY.trim()       : '',
            (typeof args.SRNO !== 'undefined' && args.SRNO.trim())              ?   args.SRNO.trim()          : ''
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


// Resolver function for mutation uploadDocuments(input) : String
const uploadDocuments = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        args = args || '';

        let files = context.request.files || [];
        let file;

        let document;
        let documents = [];
        
        let documentID = "0";
        let documentsUploaded = [];
    
        let affectedRecords = 0;

        // Get system date and time
        let curDate = sysDateTime.sysdate_yyyymmdd();
        let curTime = sysDateTime.systime_hh24mmss();
        
        if(files.length != 0)
        {
            for( let i = 0 ; i < files.length; i++)
            {
                file = files[i];
        
                /* console.log("-----------------------------------");
                console.log("Document Name : " + file.originalname);
                console.log("Mime Type : " + file.mimetype);
                console.log("Document Size : " + file.size);  */
        
                documentID = await numberSeries.getNextSeriesNumber(args.CLNT, "0100", "IMGSRN");
        
                document = {
                    "CLNT"              :  args.CLNT,
                    "LANG"              :  args.LANG,
                    "CENTITY"           :  args.CENTITY,
                    "CENTITYID"         :  args.CENTITYID,
                    "CIMGDOC"           :  args.CIMGDOC,
                    "CDOCTYPE"          :  file.mimetype,
                    "CDOCDESC"          :  args.CDOCDESC,
                    "CDOCEXTENSION"     :  args.CDOCEXTENSION,
                    "CDOCSIZE"          :  file.size,
                    "SRNO"	            :  documentID,
                    "CDOCNAME"	        :  file.originalname,
                    "SYSTEM"	        :  args.SYSTEM,
                    "USERID"	        :  args.USERID,
                    "NOTE"	            :  args.NOTE,
                    "LEADID"	        :  args.LEADID,              
                    "CDOC"              :  file.buffer,
                    // Add create params 
                    "CDATE"     : curDate,
                    "CTIME"     : curTime,
                    "CUSER"     : loginUser.USERID.toLowerCase(),
                    "ISDEL"     : "N"
                }
                
                documents[i] = document;

                documentsUploaded[i] = documentID;
            }
        }
        else
        {
            documentID = await numberSeries.getNextSeriesNumber(args.CLNT, "0100", "IMGSRN");

            document = {
                "CLNT"              :  args.CLNT,
                "LANG"              :  args.LANG,
                "CENTITY"           :  args.CENTITY,
                "CENTITYID"         :  args.CENTITYID,
                "CIMGDOC"           :  args.CIMGDOC,
                "CDOCDESC"          :  args.CDOCDESC,
                "CDOCEXTENSION"     :  args.CDOCEXTENSION,
                "SRNO"	            :  documentID,
                "SYSTEM"	        :  args.SYSTEM,
                "USERID"	        :  args.USERID,
                "NOTE"	            :  args.NOTE,
                "LEADID"	        :  args.LEADID,              
                // Add create params 
                "CDATE"     : curDate,
                "CTIME"     : curTime,
                "CUSER"     : loginUser.USERID.toLowerCase(),
                "ISDEL"     : "N"
            }
            
            documents[0] = document;

            documentsUploaded[0] = documentID;
        
        }

        // Save the document
        affectedRecords = await createDocuments(documents);

        //console.log(documentsUploaded);
        //return documentsUploaded;
        return affectedRecords;
        
    } 
    catch (error) 
    {
        return error;
    }

}


// function for creating documents
const createDocuments = async (documents) =>
{
    try 
    {                        
        let insertDML = `
            INSERT INTO TIMAGE
            SET ?
        `;

        let valuesArray = documents;

        // Use database service to insert records in table 
        let recordsInserted = await dbServices.insertTableRecords(insertDML, valuesArray) ;
        //console.log("result => ");  console.log(result);

        return recordsInserted;        
    } 
    catch (error) 
    {
        throw error;    
    }

}


/* // function for edit documents
const editDocuments = async (args, context, info) =>
{
    
    try 
    {   
        // Delete old document
        let recordsDeleted = await deleteDocuments(args, context, info);

        // Insert new document
        let affectedRecords = await uploadDocuments(args, context, info);

        return affectedRecords;  

    } 
    catch (error) 
    {
        return error;    
    }
} */


// Resolver function for mutation editDocuments(input) : String
const editDocuments = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        args = args || '';

        let files = context.request.files || [];
        let file;

        let document;
        let documents = [];
        
        let documentID = "0";
        let documentsUploaded = [];
    
        let affectedRecords = 0;

        // Get system date and time
        let curDate = sysDateTime.sysdate_yyyymmdd();
        let curTime = sysDateTime.systime_hh24mmss();
        
        if(files.length != 0)
        {
            for( let i = 0 ; i < files.length; i++)
            {
                file = files[i];
        
                /* console.log("-----------------------------------");
                console.log("Document Name : " + file.originalname);
                console.log("Mime Type : " + file.mimetype);
                console.log("Document Size : " + file.size);  */
        
                //documentID = await numberSeries.getNextSeriesNumber(args.CLNT, "0100", "IMGSRN");
        
                document = {
                    "CLNT"              :  args.CLNT,
                    "LANG"              :  args.LANG,
                    "CENTITY"           :  args.CENTITY,
                    "CENTITYID"         :  args.CENTITYID,
                    "CIMGDOC"           :  args.CIMGDOC,
                    "CDOCTYPE"          :  file.mimetype,
                    "CDOCDESC"          :  args.CDOCDESC,
                    "CDOCEXTENSION"     :  args.CDOCEXTENSION,
                    "CDOCSIZE"          :  file.size,
                    "SRNO"	            :  args.SRNO,
                    "CDOCNAME"	        :  file.originalname,
                    "SYSTEM"	        :  args.SYSTEM,
                    "USERID"	        :  args.USERID,
                    "NOTE"	            :  args.NOTE,
                    "LEADID"	        :  args.LEADID,              
                    "CDOC"              :  file.buffer,
                    // Add update params 
                    "UDATE"     : curDate,
                    "UTIME"     : curTime,
                    "UUSER"     : loginUser.USERID.toLowerCase(),
                    "ISDEL"     : "N"
                }
                
                documents[i] = document;

                documentsUploaded[i] = documentID;
            }
        }
        else
        {

            document = {
                "CLNT"              :  args.CLNT,
                "LANG"              :  args.LANG,
                "CENTITY"           :  args.CENTITY,
                "CENTITYID"         :  args.CENTITYID,
                "CIMGDOC"           :  args.CIMGDOC,
                "CDOCDESC"          :  args.CDOCDESC,
                "CDOCEXTENSION"     :  args.CDOCEXTENSION,
                "SRNO"	            :  args.SRNO,
                "SYSTEM"	        :  args.SYSTEM,
                "USERID"	        :  args.USERID,
                "NOTE"	            :  args.NOTE,
                "LEADID"	        :  args.LEADID,              
                // Add update params 
                "UDATE"     : curDate,
                "UTIME"     : curTime,
                "UUSER"     : loginUser.USERID.toLowerCase(),
                "ISDEL"     : "N"
            }
            
            documents[0] = document;

            documentsUploaded[0] = documentID;
        
        }

        // Update the document
        affectedRecords = await updateDocuments(documents);

        //console.log(documentsUploaded);
        //return documentsUploaded;
        return affectedRecords;
        
    } 
    catch (error) 
    {
        return error;
    }

}


// function for update documents
const updateDocuments = async (documents) =>
{
    try 
    {                        
        let updateDML = `
            UPDATE TIMAGE
            SET ?
            WHERE  CLNT =   '` + documents[0].CLNT + `'
                AND LANG =   '` + documents[0].LANG + `'
                AND CENTITYID  =   '` + documents[0].CENTITYID + `'
                AND CENTITY    =   '` + documents[0].CENTITY + `'
                AND SRNO    =   '` + documents[0].SRNO + `'
            `;

        let valuesArray = documents;

        // Use database service to update records in table 
        let recordsInserted = await dbServices.updateTableRecords(updateDML, valuesArray) ;
        //console.log("result => ");  console.log(result);

        return recordsInserted;        
    } 
    catch (error) 
    {
        throw error;    
    }

}



// function for deleting documents
const deleteDocuments = async (args, context, info) =>
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

        // form the data json
        dataJSON = {
            "ISDEL"   :   "Y",
            "DDATE"	  :   sysDateTime.sysdate_yyyymmdd(),
            "DTIME"	  :   sysDateTime.systime_hh24mmss(),
            "DUSER"     : loginUser.USERID.toLowerCase()
        }
    
        // form the clause json
        clauseJSON = {
            "CLNT"    :   args.CLNT,
            "LANG"    :   args.LANG,
            "CENTITYID"  :	  args.CENTITYID,
            "CENTITY"    :	  args.CENTITY,
            "SRNO"       :    args.SRNO
        }

        // Get the update statement
        updateStatement = await dbServices.getUpdateStatement("TIMAGE", dataJSON, clauseJSON);
        updateStatements.push(updateStatement);
        //console.log("updateStatement => ");  console.log(updateStatement);

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        return affectedRecords;  

    } 
    catch (error) 
    {
        return error;    
    }
}



// Download document
const downloadDocument = async (httpRequest) =>
{
    try 
    {
        //console.log(httpRequest.query);

        // Get the document type from request
        let documentType = httpRequest.query.documentType;

        if(typeof documentType === 'undefined' || documentType == null || documentType.trim().length == 0)
            throw new Error("Document Type is required.");

        documentType = documentType.trim().toUpperCase();

        // Get the document id from request
        let documentID = httpRequest.query.documentID;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof documentID !== 'undefined' && documentID.trim())  ?   documentID.trim()    : ''
        ];


        let selectQuery;

        // Get query for request document
        switch (documentType) {
            case 'LEADDOCS':
                selectQuery = downloadUploadedDocumentsQuery;                
                break;

            case 'PRGRPTDOCS':
                selectQuery = downloadProgressReportDocumentsQuery;
                break;

            case 'PRGRPTZIP':
                selectQuery = downloadProgressReportZipQuery;
                break;

            case 'PRICELIST':
                selectQuery = downloadPriceListQuery;
                break;

            case 'CMPNPROFILE':
                selectQuery = downloadCompanyProfileQuery;
                break;

            default:
                throw new Error("Invalid Document Type Specified.");
                break;
        }
        

        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders) ;

        /*console.log("result => ");
        console.log(result);*/ 

        let document;

        // Block for Single File Download
        if(documentType.indexOf("ZIP") == -1)
        {
            document = {
                "documentName"  :   result[0].CDOCNAME,
                "documentType"  :   result[0].CDOCTYPE,
                "documentSize"  :   result[0].CDOCSIZE,
                "document"      :   result[0].CDOC.data
            } ;                
        }        
        // Block for Zipping Files
        else if(documentType.indexOf("ZIP") != -1)
        {
            let zipDocument = new admZip();

            for(let i = 0; i < result.length; i++ )
            {
                if(result[i].CDOC != null)
                    zipDocument.addFile(result[i].CDOCNAME, Buffer.from(result[i].CDOC.data));
            }

            let zipDocumentBuffer =  zipDocument.toBuffer();
            document = {
                "documentName"  :   "documents.zip",
                "documentType"  :   "application/zip",
                "documentSize"  :   zipDocumentBuffer.length,
                "document"      :   zipDocumentBuffer
            } ;                
        }

/*         console.log("document => ");
        console.log(document);
 */        
        return document;        

    } 
    catch (error) 
    {
        console.log("error => ");
        console.log(error);

        return error;    
    }

}



// Resolver function for mutation uploadCompanyDocuments(input) : String
const uploadCompanyDocuments = async (args, context, info) =>
{
    try 
    {
        
        args = args || '';
        console.log(args)
        loginUser = validations.getLoginData(context);

        let files = context.request.files || [];
        let file;

        let document;
        let documents = [];
        
        let documentID = "0";
        let documentsUploaded = [];
    
        let affectedRecords = 0;

        // Get system date and time
        let curDate = sysDateTime.sysdate_yyyymmdd();
        let curTime = sysDateTime.systime_hh24mmss();
        
		let validationObjects = {};
		let validationObject = {};

		validations.checkNull("CLNT", args.CLNT, "Client is required", validationObject);
		validations.checkNull("LANG", args.LANG, "Language is required", validationObject);
		validations.checkNull("DOCTYPE", args.DOCTYPE, "Document type is required", validationObject);
        
        if(files.length == 0)
		    validations.checkNull("DOCUMENT", null, "Document is required", validationObject);

		validations.checkMaxLength("DOCTYPE", args.DOCTYPE, 50, "Length of Document type should be less than or equal to 50 characters", validationObject);

		if(Object.keys(validationObject).length != 0)
			validationObjects[0] = validationObject;

        
        // if data is not valid, throw validation errors
        if(Object.keys(validationObjects).length != 0)
        {
            throw new Error(JSON.stringify(validationObjects));
        }
        else
        {
            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateCompanyDocs(args);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
            
                for( let i = 0 ; i < files.length; i++)
                {
                    file = files[i];
            
                     console.log("-----------------------------------");
                    console.log("Document Name : " + file.originalname);
                    console.log("Mime Type : " + file.mimetype);
                    console.log("Document Size : " + file.size); 
                    let extension="";
                    if(file.originalname.toLowerCase().includes("xlsx") || file.originalname.toLowerCase().includes("xls")){
                        extension="xlsx"
                    }else{
                        extension=file.mimetype
                    }
                    documentID = await numberSeries.getNextSeriesNumber(args.CLNT, "0100", "EXDOC");
            
                    document = {
                        "CLNT"              :  args.CLNT,
                        "LANG"              :  args.LANG,
                        "DOCTYPE"           :  args.DOCTYPE,
                        "DOCID"	            :  documentID,
                        "DOCNM"	            :  file.originalname,
                        "DOCUMENT"          :  file.buffer,
                        "DOCEXTENSION"      :  extension,
                        // Add create params 
                        "CDATE"     : curDate,
                        "CTIME"     : curTime,
                        "CUSER"     : loginUser.USERID.toLowerCase(),
                        "ISDEL"     : "N"
                    };
                    
                    documents[i] = document;

                    documentsUploaded[i] = documentID;
                }
            }
        }

        // Save the document
        affectedRecords = await createCompanyDocuments(documents);
            if(args.DOCTYPE==="EXCEL"){
                console.log(args.DOCTYPE)
                var workbook = XLSX.read(files[0].buffer, {type:"buffer"});
                //console.log(workbook.SheetNames)
                await ExcelSheetParse.parseExcel(args.APPEND,workbook)
            }
        //console.log(documentsUploaded);
        //return documentsUploaded;
        return affectedRecords;
        
    } 
    catch (error) 
    {
        console.log(error)
        return error;
    }

}


// Function to check uniqueness of data
const checkDuplicateCompanyDocs = async (args) =>
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
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())        ?   args.CLNT.trim()    : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())        ?   args.LANG.trim()    : '',
            (typeof args.DOCTYPE !== 'undefined' && args.DOCTYPE.trim())    ?   args.DOCTYPE.trim()  : ''
        ];

        result = await dbServices.getTableData(checkDuplicateCompanyDocsQuery, placeHolders)
        
        if(parseInt(result[0].COUNT) > 0)
        {
            duplicateRecordsMessage = duplicateRecordsMessage + args.DOCTYPE + " document already exists."; 
            duplicateCount = duplicateCount + 1;       
        }
        else
        {
            recordsNotFoundMessage = recordsNotFoundMessage + args.DOCTYPE + " document not found. ";
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



// function for creating company documents
const createCompanyDocuments = async (documents) =>
{
    try 
    {                        
        let insertDML = `
            INSERT INTO EXCELDOCUMENT
            SET ?
        `;

        let valuesArray = documents;

        // Use database service to insert records in table 
        let recordsInserted = await dbServices.insertTableRecords(insertDML, valuesArray) ;
        //console.log("result => ");  console.log(result);

        return recordsInserted;        
    } 
    catch (error) 
    {
        throw error;    
    }

}


// function for deleting company documents
const deleteCompanyDocuments = async (args, context, info) =>
{
    
    try 
    {   
        loginUser = validations.getLoginData(context);
        
        let deleteStatement;             
        let deleteStatements = [] ;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        // form the clause json
        clauseJSON = {
            "CLNT"    :   args.CLNT,
            "LANG"    :   args.LANG,
            "DOCID"   :   args.DOCID
        }

        // Get the delete statement
        deleteStatement = await dbServices.getDeleteStatement("EXCELDOCUMENT", clauseJSON);
        deleteStatements.push(deleteStatement);
        //console.log("deleteStatement => ");  console.log(deleteStatement);

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
    searchCompanyDocuments,
    searchUploadedDocuments,
    uploadDocuments,
    downloadDocument,
    deleteDocuments,
    editDocuments,
    documentDetails,
    uploadCompanyDocuments,
    deleteCompanyDocuments
};



