/**
 * @author 
 */

// Payment Authorization Types
const typeDefs = `

    # Output Type for eCheck Authorization
    type eCheckAuthorization
    {
        CLNT	:	String,
        LANG	:	String,
        CIDSYS	:	String,
        TODAYDATE	:	String,
        CLNTNAME	:	String,
        ACCHLDRNAME	:	String,
        CLNTADDRFLBANK	:	String,
        BANKNAME	:	String,
        BANKACCNO	:	String,
        BANKROUTNO	:	String,
        AMTAUTHRZD	:	String,
        FEE	    :	String,
        AGREE	:	String,
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
        PAYFOR	:	String
    }


    # Input Type eCheck Authorization
    input eCheckAuthorizations
    {
        CLNT	:	String,
        LANG	:	String,
        CIDSYS	:	String,
        TODAYDATE	:	String,
        CLNTNAME	:	String,
        ACCHLDRNAME	:	String,
        CLNTADDRFLBANK	:	String,
        BANKNAME	:	String,
        BANKACCNO	:	String,
        BANKROUTNO	:	String,
        AMTAUTHRZD	:	String,
        FEE	    :	String,
        AGREE	:	String,
        PAYFOR	:	String
    }


    # Output Type for Card Authorization
    type CardAuthorization
    {
        CLNT	:	String,
        LANG	:	String,
        CIDSYS	:	String,
        TODAYDATE	:	String,
        CLNTNAME	:	String,
        ACCHLDRNAME	:	String,
        CARDTYP	:	String,
        CARDNO	:	String,
        EXPDATE	:	String,
        SECURITYCD	:	String,
        BILLINGADDR	:	String,
        AMOUNT	:	String,
        AGREE	:	String,
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
        PAYFOR	:	String
    }


    # Input Type Card Authorization
    input CardAuthorizations
    {
        CLNT	:	String,
        LANG	:	String,
        CIDSYS	:	String,
        TODAYDATE	:	String,
        CLNTNAME	:	String,
        ACCHLDRNAME	:	String,
        CARDTYP	:	String,
        CARDNO	:	String,
        EXPDATE	:	String,
        SECURITYCD	:	String,
        BILLINGADDR	:	String,
        AMOUNT	:	String,
        AGREE	:	String,
        PAYFOR	:	String    
    }


    # Output Type for Cash/Other Authorization
    type CashAuthorization
    {
        CLNT	:	String,
        LANG	:	String,
        CIDSYS	:	String,
        PAYMENTFOR	:	String,
        PAYMENTMODE	:	String,
        AMOUNT	:	String,
        FEE	:	String,
        CDATE	:	String,
        CTIME	:	String,
        CUSER	:	String,
        UDATE	:	String,
        UTIME	:	String,
        UUSER	:	String,
        ISDEL	:	String,
        DDATE	:	String,
        DTIME	:	String,
        DUSER	:	String
    }


    # Input Type Cash Authorization
    input CashAuthorizations
    {
        CLNT	:	String,
        LANG	:	String,
        CIDSYS	:	String,
        PAYMENTFOR	:	String,
        PAYMENTMODE	:	String,
        AMOUNT	:	String,
        FEE	    :	String    
    }




    # Query Type
    type Query
    {
        # Get eCheck Authorization details based on criteria
        eCheckAuthorizationDetails
        (
            CLNT        : String!, 
            LANG        : String!,
            CIDSYS      : String!
        ) : [eCheckAuthorization]

        # Get Card Authorization details based on criteria
        CardAuthorizationDetails
        (
            CLNT        : String!, 
            LANG        : String!,
            CIDSYS      : String!
        ) : [CardAuthorization]

        # Get Cash Authorization details based on criteria
        CashAuthorizationDetails
        (
            CLNT        : String!, 
            LANG        : String!,
            CIDSYS      : String!
        ) : [CashAuthorization]

    }


    # Mutation Type
    type Mutation
    {
        # CRUD Operations for eCheck Authorization
        eCheckAuthorizationCRUDOps
        (
            authorizations : [eCheckAuthorizations!]!,
            transaction    : TransactionTypes!
        )   :   String       


        # CRUD Operations for Card Authorization
        CardAuthorizationCRUDOps
        (
            authorizations : [CardAuthorizations!]!,
            transaction    : TransactionTypes!
        )   :   String       


        # CRUD Operations for Cash Authorization
        CashAuthorizationCRUDOps
        (
            authorizations : [CashAuthorizations!]!,
            transaction    : TransactionTypes!
        )   :   String       


    }

`;

// Export the typeDefs
module.exports = typeDefs;