/**
 * @author 
 */

// Case Type
const typeDefs = 
`
    # Output Type
    type Lead
    {
        LSTNM           : String,
        BESTTMCAL       : String,
        FRSTNM          : String,
        PRIORITY        : String,
        FULLNM          : String,
        EMAILID         : String,
        PHONE           : String,
        CID             : String,
        CDATE           : String,
        OFFICENM        : String,
        CSOURCE         : String,
        ASSIGNTO        : String,
        STDESC          : String,
        STATUS          : String,
        MODDESC         : String,
        MODEOFSRC       : String,
        ADDCOMMETS      : String,
        LSTUPDT         : String,
        CATCODE         : String,
        TYPSERV         : String,
        DESCRIPTION     : String,
        MODOFCON        : String,
        ADDRESS         : String,
        CITY            : String,
        STATE           : String,
        ZIPCD           : String,
        MAILCOUNT         : String,
        TASKCOUNT         : String,
        LEADNOTECOUNT   :  String,

    }

    # Output type
    type MailList
    {
        CLNT		: String,
        LANG		: String,
        MAILLOGID   : String,
        FROMID      : String,
        TOID        : String,
        MAILCC      : String,
        MAILBCC     : String,
        MAILSUB     : String,
        MSGBODY     : String,
        MAILFOR     : String,
        MAILFORID   : String,
        CDATE       : String,
        CTIME       : String,
        CUSER       : String,
        UDATE       : String,
        UTIME       : String,
        UUSER       : String,
        ISDEL       : String,
        DDATE       : String,
        DTIME       : String,
        DUSER       : String    
    } 

    # Input Type 
    input Leads
    {
        CLNT		: String,
        LANG		: String,
        CID		    : String,
        CSOURCE		: String,
        MODEOFSRC	: String,
        CATCODE     : String,
        TYPSERV		: String,
        DESCRIPTION	: String,
        FULLNM		: String,
        EMAILID		: String,
        PHONE		: String,
        BESTTMCAL	: String,
        MODOFCON	: String,
        ADDRESS		: String,
        CITY		: String,
        STATE		: String,
        ZIPCD		: String,
        ADDCOMMETS	: String,
        ASSIGNTO	: String,
        STATUS		: String,
        CDATE		: String,
        CTIME		: String,
        CUSER		: String,
        UDATE		: String,
        UTIME		: String,
        UUSER		: String,
        ISDEL		: String,
        DDATE		: String,
        DTIME		: String,
        DUSER		: String,
        PRIORITY	: String,
        LSTNM		: String,
        OFFICENM	: String,
        FRSTNM		: String,
        LEADNOTES	: String
    }

    # Input type
    input LeadStatus
    {
        CLNT        : String!, 
        LANG        : String!,
        CID         : String!,
        STATUS      : String!,
        ASSIGNTO    : String!
    }


    # Query Type
    type Query
    {
        # Search leads based on criteria
        searchLeads(
            CLNT        : String!, 
            LANG        : String!,
            FULLNM      : String,
            OFFICENM    : String, 
            PHONE       : String, 
            EMAILID     : String, 
            TYPSERV     : String,
            STATUS      : String,
            ASSIGNTO    : String,
            CATCODE     : String,
            isAdmin     : Boolean = false
        ) : [Lead]

        # Search dashboard leads based on criteria
        searchDashboardLeads(
            CLNT        : String!, 
            LANG        : String!,
            FULLNM      : String,
            OFFICENM    : String, 
            PHONE       : String, 
            EMAILID     : String, 
            TYPSERV     : String,
            STATUS      : String
        ) : [Lead]

        # Get leads details based on criteria
        leadDetails(
            CLNT        : String!, 
            LANG        : String!,
            CID      : String!
        ) : [Lead]

        # Search Mail List based on criteria
        searchMailsList(
            CLNT        : String!, 
            LANG        : String!,
            MAILFOR     : String!,
            MAILFORID   : String!, 
            FROMDATE    : String, 
            TODATE      : String, 
            CUSER       : String,
            STATUS      : String,
            ASSIGNTO    : String,
            CATCODE     : String,
            isAdmin     : Boolean = false
        ) : [MailList]

    }

    # Mutation Type
    type Mutation
    {
        # CRUD Operations for Leads
        LeadsCRUDOps
        (
            leads       : [Leads!]!,
            transaction : TransactionTypes!
        )   :   [String]       

        # Update Leads Status
        UpdateLeadStatus
        (
            leadstatus  : [LeadStatus!]!
        )   :   [String]       
    }

`;    


// Export the typeDefs
module.exports = typeDefs;