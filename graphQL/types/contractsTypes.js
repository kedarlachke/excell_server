/**
 * @author 
 */

// Contracts Type
const typeDefs = `

    # Output Type
    type Contract
    {
        CLNT	    :	String,
        LANG	    :	String,
        CONTRACTID	:	String,
        CLIENTID	:	String,
        CIDSYS	    :	String,
        CONTACTTYPE	:	String,
        FULLNM	    :	String,
        TOTAL	    :	String,
        RATEPERH	:	String,
        RATEPERM	:	String,
        MAXH	    :	String,
        OTHER	    :	String,
        SERVICETYPE	:	String,
        CUSTOMCON	:	String
    }

    # Output Type
    type ContractTemplate
    {
        CLNT	:	String,
        LANG	:	String,
        SERVICETYPE	:	String,
        CONTRACTDETAILS	:	String,
        ISDEL	:	String,
        CDATE	:	String,
        CTIME	:	String,
        CUSER	:	String,
        UDATE	:	String,
        UTIME	:	String,
        UUSER	:	String,
        DDATE	:	String,
        DTIME	:	String,
        DUSER	:	String
    }


    # Input Type
    input Contracts
    {
        CLNT	    :	String,
        LANG	    :	String,
        CONTRACTID	:	String,
        CLIENTID	:	String,
        CIDSYS	    :	String,
        CONTACTTYPE	:	String,
        FULLNM	    :	String,
        TOTAL	    :	String,
        RATEPERH	:	String,
        RATEPERM	:	String,
        MAXH	    :	String,
        OTHER	    :	String,
        SERVICETYPE	:	String,
        CUSTOMCON	:	String,
        TYPOFCONTRACT:  String,
        SUBJECT     :   String,
        MAILBODY    :   String,
        _TO          :  String,
        CC          :   String,
        BCC         :   String,                
    }

    # Query Type
    type Query
    {
        # Get contracts details based on criteria
        contractDetails(
            CLNT        : String!, 
            LANG        : String!,
            CIDSYS      : String!
        ) : [Contract]

        # Get contracts template based on criteria
        contractTemplate(
            CLNT        : String!, 
            LANG        : String!,
            SERVICETYPE : String!
        ) : [ContractTemplate]

    }

    # Mutation type
    type Mutation
    {
        # CRUD Operations for Contracts
        ContractsCRUDOps
        (
            contracts       :   [Contracts!]!,
            transaction     :   TransactionTypes!
        )   :   String       

        # Mail Contract
        MailContract
        (
            contracts       :   [Contracts!]!,
            transaction     :   TransactionTypes!
        )   :   String    
    }
`;

// Export the typeDefs
module.exports = typeDefs;