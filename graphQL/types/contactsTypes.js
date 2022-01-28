/**
 * @author 
 */

// Contacts Type
const typeDefs = `

    # Output Type
    type Contact
    {
        CLNT	:	String,
        LANG	:	String,
        CONTACTID	:	String,
        CONTACTTYPE	:	String,
        FRSTNM	:	String,
        LSTNM	:	String,
        DISNAME	:	String,
        EMAILID	:	String,
        PHONE	:	String,
        COMPANY	:	String,
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
        ADDR	:	String,
        CITY	:	String,
        STATE	:	String,
        PINC	:	String,
        FAXNO	:	String,
        MODOFCON	:	String,
        BESTTMCAL	:	String,
        COUNTRY	:	String
    }

    # Input Type
    input Contacts
    {
        CLNT   				: String,
        LANG                : String,
        CONTACTID           : String,
        CONTACTTYPE         : String,
        FRSTNM              : String,
        LSTNM               : String,
        DISNAME             : String,
        EMAILID             : String,
        PHONE               : String,
        COMPANY             : String,
        ADDR                : String,
        CITY                : String,
        STATE               : String,
        PINC                : String,
        FAXNO               : String,
        MODOFCON            : String,
        BESTTMCAL           : String,
        COUNTRY				: String        
    }

    # Query Type
    type Query
    {
        # Search contacts based on criteria
        searchContacts
        (
            CLNT    :   String!,
            LANG    :   String!,
            DISNAME :   String,
            COMPANY :   String,
            PHONE   :   String,
            EMAILID :   String,
            exactMatch   :  Boolean = false
        ) : [Contact]   

        # Get contacts details based on criteria
        contactDetails(
            CLNT        : String!, 
            LANG        : String!,
            CONTACTID   : String,
            EMAILID     : String
        ) : [Contact]
        
    }

    # Mutation type
    type Mutation
    {
        # CRUD Operations for Contacts
        ContactsCRUDOps
        (
            contacts        :   [Contacts!]!,
            transaction     :   TransactionTypes!
        )   :   [String]       
    }
`;

// Export the typeDefs
module.exports = typeDefs;