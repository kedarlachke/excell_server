/**
 * @author 
 */

import dbServices from '../services/dbServices';

import {
    servicesRequiredDDLQuery,
    bestTimeToCallDDLQuery,
    priorityLevelDDLQuery,
    sourceofLeadsDDLQuery,
    bestMethodofContactDDLQuery,
    statusDDLQuery,
    assignToDDLQuery,
    leadsDocTypeDDLQuery,
    contactTypesDDLQuery,
    statesDDLQuery,
    taxTypesDDLQuery,
    countriesDDLQuery,
    taskInvoiceStatusDDLQuery,
    taskPriorityDDLQuery,
    customersDDLQuery,
    currencyDDLQuery,
    serviceCategoryDDLQuery,
    businessTypesDDLQuery,
    paymentModeDDLQuery,
    companyDDLQuery,
    partMasterDDLQuery,
    payForDDLQuery,
    payModeDDLQuery,
    cardTypeDDLQuery,
    workCategoryDDLQuery,
    taskOfDDLQuery,
    excelDocTypesDDLQuery,
    otherservices
} from '../common/sqlQueries';


// Resolver function for query populateDDL(input) : [DDL]
const populateDDL = async (args, context, info) =>
{
    try 
    {
        let ddlName = args.ddlName;
        let ddlQuery;
        
        if(typeof ddlName === 'undefined' || ddlName == null || ddlName.trim().length == 0)
            throw new Error("DDL Name is required.");

        ddlName = ddlName.trim().toUpperCase();
    
        // Placeholders for prepared query
        let placeHolders = args.paraArray || [];

        // Get ddl query for request ddl
        switch (ddlName) {
            case 'SERVICES_REQUIRED':
                ddlQuery = servicesRequiredDDLQuery;                
                break;

            case 'BEST_TIME_TO_CALL':
                ddlQuery = bestTimeToCallDDLQuery;
                break;

            case 'BEST_METHOD_OF_CONTACT':
                ddlQuery = bestMethodofContactDDLQuery;
                break;

            case 'PRIORITY_LEVEL':
                ddlQuery = priorityLevelDDLQuery;
                break;

            case 'SOURCE_OF_LEADS':
                ddlQuery = sourceofLeadsDDLQuery;
                break;

            case 'STATUS':
                ddlQuery = statusDDLQuery;
                break;

            case 'ASSIGN_TO':
                ddlQuery = assignToDDLQuery;
                break;
                
            case 'LEAD_DOCTYPES':
                ddlQuery = leadsDocTypeDDLQuery;
                break;

            case 'CONTACT_TYPES':
                ddlQuery = contactTypesDDLQuery;
                break;

            case 'STATES':
                ddlQuery = statesDDLQuery;
                break;

            case 'TAX_TYPES':
                ddlQuery = taxTypesDDLQuery;
                break;

            case 'COUNTRIES':
                ddlQuery = countriesDDLQuery;
                break;

            case 'TASKINV_STATUS':
                ddlQuery = taskInvoiceStatusDDLQuery;
                break;

            case 'TASK_PRIORITY':
                ddlQuery = taskPriorityDDLQuery;
                break;                
                
            case 'CUSTOMERS':
                ddlQuery = customersDDLQuery;
                break;

            case 'CURRENCY':
                ddlQuery = currencyDDLQuery;
                break;
                  
            case 'SERVICE_CATEGORY':
                ddlQuery = serviceCategoryDDLQuery;
                break;  
                
            case 'BUSINESS_TYPES':
                ddlQuery = businessTypesDDLQuery;
                break; 
                
            case 'PAYMENT_MODE':
                ddlQuery = paymentModeDDLQuery;
                break; 
                
            case 'COMPANY':
                ddlQuery = companyDDLQuery;
                break; 

            case 'PART_MASTER':
                ddlQuery = partMasterDDLQuery;
                break; 

            case 'PAY_FOR':
                ddlQuery = payForDDLQuery;
                break; 

            case 'PAY_MODE':
                ddlQuery = payModeDDLQuery;
                break; 

            case 'CARD_TYPE':
                ddlQuery = cardTypeDDLQuery;
                break; 
                
            case 'WORK_CATEGORY':
                ddlQuery = workCategoryDDLQuery;
                break; 

            case 'TASK_OF':
                ddlQuery = taskOfDDLQuery;
                break; 

            case 'EXCEL_DOCS':
                ddlQuery = excelDocTypesDDLQuery;
                break; 


            case 'OTHER_SERVICES':
                ddlQuery = otherservices;
                break;

            default:
                throw new Error("DDL Query not found.");
                break;
        }
            
        // Use database service to get table data
        let result = await dbServices.getTableData(ddlQuery, placeHolders) ;

        return result;
            
    } 
    catch (error) 
    {
        return error;    
    }

}


module.exports = {
    populateDDL
};