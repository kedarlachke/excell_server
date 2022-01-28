/**
 * @author 
 */

// Enumerations
const typeDefs = `

    # Constants for Dropdown
    enum DDLTypes
    {
        ASSIGN_TO
        BEST_METHOD_OF_CONTACT
        BEST_TIME_TO_CALL
        BUSINESS_TYPES
        CARD_TYPE
        COMPANY
        CONTACT_TYPES
        COUNTRIES
        CURRENCY
        CUSTOMERS
        EXCEL_DOCS
        LEAD_DOCTYPES
        PART_MASTER
        PAY_MODE
        PAY_FOR
        PAYMENT_MODE
        PRIORITY_LEVEL
        SERVICE_CATEGORY
        SERVICES_REQUIRED
        SOURCE_OF_LEADS
        STATES
        STATUS
        TASK_OF
        TASK_PRIORITY
        TASKINV_STATUS
        TAX_TYPES
        WORK_CATEGORY
        OTHER_SERVICES
    }

    # Constants for Case Types
    enum CaseTypes
    {
        ASSET_SEARCH
        CHILD_CUSTODY
        INFIDELITY
        LOCATE_PEOPLE
        OTHER_CASE
        PROCESS_SERVER 
        WORKERS_COMP        
    }

    # Constants for Transaction Types
    enum TransactionTypes
    {
        CREATE
        UPDATE
        LOGICAL_DELETE
        PHYSICAL_DELETE
    }

    # Constants for Report Types
    enum ReportTypes
    {
        INVOICE
        PROGRESS_REPORT
    }

    
    # Constants for Excel Types
    enum ExcelTypes
    {
        ADMIN_CASES
        ADMIN_LEADS
        ADMIN_TASKS
        BILLABLEHRS_DTL
        BILLABLEHRS_HDR
        BILLEDHRS_DTL
        BILLEDHRS_HDR
        CONTACTS
        CUSTOMERS
        INVOICES
        PROGRESS_REPORT
        SERVICES
        USER_TASKS
        USERS
        RATECARDS
    }

`;


// Export typeDefs
module.exports = typeDefs;