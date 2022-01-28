/**
 * @author 
 */

// Billing Type
const typeDefs = 
`
    # Output Type
    type BillableHours
    {
        CLIENTNAME    : String,
        CIDSYS        : String,
        CLNTHW        : String,
        CLNTID        : String,
        FIRSTNM		  : String,

        CASETL		  : String,
        SERVICETYP	  : String,
        RPTDATE		  : String,
        RPTTXT		  : String,
        WORKCAT		  : String,
        CATDESC		  : String,
        CDATE		  : String,
        CUSER		  : String,
        WORKHOURS	  : String,
        PRGRPTID	  : String,
        PRGWORKID	  : String,
        ISBILLED	  : String,
        RATE		  : String
    }

    # Output Type
    type Invoice
    {
        CLNT      : String,
        LANG      : String,
        CIDSYS    : String,
        DOCID     : String,
        DOCDT     : String,
        DOCTYPE   : String,
        DOCNO     : String,
        PONO      : String,
        RMKS      : String,
        CURRENCY  : String,
        DUEDT     : String,
        DOCHDR    : String,
        TOT       : String,
        CUSTCD    : String,
        INVDT     : String,
        BAL       : String,
        CMPN      : String,
        CMPNNM    : String,
        CUSTOMER  : String,
        ISDEL     : String,
        STATUS    : String,
        STATUSDSC : String,
        PAYMENTBY : String
    }

    # Output Type
    type BilledHoursHeader
    {
        CLIENTNAME    : String,
        CLNTBILLABLEHW        : String,
        CLNTHW        : String,
        CLNTID        : String
    }

    # Output Type
    type BilledHoursDetails
    {
        DOCNO           : String,
        DOCDT           : String,  
        CLIENTNAME      : String,
        CASETL          : String,
        SERVICETYP      : String,  
        RPTDATE         : String,
        RPTTXT          : String, 
        WORKCAT         : String, 
        CDATE           : String, 
        CLNTBILLABLEHW  : String,
        WORKHOURS       : String, 
        PRGRPTID        : String, 
        CIDSYS          : String, 
        CLNTID          : String,
        PRGWORKID       : String, 
        RATE		 	: String
    }


    # Input Type
    input Invoices
    {
        DocHeader : DocHeaders,
        DocDetails : [DocDetails],
        TaxAmounts : [TaxAmounts]
    }

    # Output Type
    type InvoiceDetails
    {
        DocHeader : DocHeader,
        DocDetails : [DocDetail],
        TaxAmounts : [TaxAmount]
    }


    # Query Type
    type Query
    {
        # Search billable hours header based on criteria 
        searchBillableHoursHeader
        (
            CLNT        : String!, 
            LANG        : String!,
            FROMDATE    : String!,
            TODATE      : String!,
            FIRSTNM     : String,
            LASTNM      : String
        ) : [BillableHours]


        # Search billable hours details based on criteria 
        searchBillableHoursDetails
        (
            CLNT        : String!, 
            LANG        : String!,
            CLNTID      : String!,  
            FROMDATE    : String!,
            TODATE      : String!
        ) : [BillableHours]


        # Search billable hours for a Case 
        searchBillableCaseHours
        (
            CLNT        : String!, 
            LANG        : String!,
            CLNTID      : String!,
            CIDSYS      : String!,
            FROMDATE    : String!,
            TODATE      : String!,
            ISBILLED    : String,
        ) : [BillableHours]

        
        # Search invoices based on criteria 
        searchInvoices
        (
            CLNT        : String!,
            LANG        : String!,
            DOCTYPE     : String!,
            DOCNO       : String,
            CUSTOMER    : String,
            CMPNNM      : String,
            CIDSYS      : String,
            DOCFRMDT    : String!,
            DOCTODT     : String!,
            CUSTCD      : String
        ) : [Invoice]

        # Search billed hours header based on criteria 
        searchBilledHoursHeader
        (
            CLNT        : String!, 
            LANG        : String!
        ) : [BilledHoursHeader]

        # Search billed hours details based on criteria 
        searchBilledHoursDetails
        (
            CLNT        : String!, 
            LANG        : String!,
            CLNTIDS     : String! 
        ) : [BilledHoursDetails]

        # Get invoice details based on criteria
        invoiceDetails(
            CLNT        : String!, 
            LANG        : String!,
            DOCID       : String!
        ) : [InvoiceDetails]

    }

    # Mutation Type
    type Mutation
    {
        # CRUD Operations for Invoices
        InvoicesCRUDOps
        (
            invoices    : [Invoices!]!,
            transaction : TransactionTypes!
        )   :   [InvoiceDetails]       

        # Update Invoice Status and Payment Mode
        updateInvoiceStatus
        (
            CLNT        : String!,
            LANG        : String!,
            DOCID       : String!,
            STATUS      : String!,
            PAYMENTBY   : String
        )  : String
    }

`;    


// Export the typeDefs
module.exports = typeDefs;