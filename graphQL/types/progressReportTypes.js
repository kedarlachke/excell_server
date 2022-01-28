/**
 * @author 
 */

// Tasks Type
const typeDefs = `

    # Output Type
    type ProgressReport
    {
        CLNT	    :	String,
        LANG	    :	String,
        PRGRPTID	:	String,
        PRGWORKID	:	String,
        WORKCAT	    :	String,
        WORKHOURS	:	String,
        CDATE	:	String,
        CTIME	:	String,
        CUSER	:	String,
        UDATE	:	String,
        UTIME	:	String,
        UUSER	:	String,
        ISDEL	:	String,
        DDATE	:	String,
        DTIME	:	String,
        DUSER	:	String,
        DOCID	:	String,
        LINEITEMNO	:	String,
        CDOCTYPE	:	String,
        CDOC	    :	String,
        CDOCDESC	:	String,
        CIDSYS	    :	String,
        RPTTXT	    :	String,
        DOCNM	    :	String,
        CEXTENSION	:	String,
        ISBILLED	:	String,
        SHAREWITH	:	String        
    }


    # Input Type
    input ProgressReports
    {
        CLNT	    :	String,
        LANG	    :	String,
        PRGRPTID	:	String,
        PRGWORKID	:	String,
        WORKCAT	    :	String,
        WORKHOURS	:	String,
        DOCID	    :	String,
        LINEITEMNO	:	String,
        CDOCTYPE	:	String,
        CDOC	    :	String,
        CDOCDESC	:	String,
        CIDSYS	    :	String,
        RPTTXT	    :	String,
        DOCNM	    :	String,
        CEXTENSION	:	String,
        ISBILLED	:	String,
        SHAREWITH	:	String  
    }


    # Query Type
    type Query
    {
        # Search progress report details
        searchProgressReports
        (
            CLNT    :   String!,
            LANG    :   String!,
            PRGRPTID    :   String,
            CUSER   :   String,
            RPTTXT  :   String,
            FRMDATE :   String!,
            TODATE  :   String!,
            CIDSYS  :   String!
        ) : [ProgressReport]   


        # Get Progress Report details based on criteria
        progressReportDetails(
            CLNT        : String!, 
            LANG        : String!,
            PRGRPTID    : String!
        ) : [ProgressReport]

    }


    # Mutation Type
    type Mutation
    {
        # CRUD Operations for Progress Report
        ProgressReportCRUDOps
        (
            progressreports   : [ProgressReports!]!,
            transaction       : TransactionTypes!
        )   :   String       

        # Update progress work against invoice generated
        UpdateProgressAgainstInvoice
        (
            progressreports   : [ProgressReports!]!
        )   :   String       

        # Toggle progress work billing status
        ToggleProgressWorkBilling
        (
            progressreports   : [ProgressReports!]!
        )   :   String       
    }

`;

// Export the typeDefs
module.exports = typeDefs;