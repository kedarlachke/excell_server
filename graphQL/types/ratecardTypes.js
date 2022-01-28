/**
 * @author Kedar Lachke
 */

const typeDefs = `
# Output Type
type Ratecard
    {
        CLNT	:	String,
        LANG	:	String,
        CLIENTID:	String,
        CIDSYS	:	String,
        ITEMID	:	String,
        ITEMDECS:	String,
        ITEMRATE:	String,
        ORDERNO	:	String,
        ISACTIVE:	String,
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

    # Input Type
    input Ratecards
    {
        CLNT	:	String,
        LANG	:	String,
        CLIENTID:	String,
        CIDSYS	:	String,
        ITEMID	:	String,
        ITEMDECS:	String,
        ITEMRATE:	String,
        ORDERNO	:	String,
        ISACTIVE:	String,
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

    # Query Type
    type Query
    {
        # Search Ratecard based on criteria
        searchRatecards
        (
            CLNT     :   String!,
            LANG     :   String!,
            CLIENTID :   String,
            CIDSYS   :   String,
            ITEMID   :   String,
            ITEMDECS :   String,
            ISACTIVE :   String
            exactMatch   :  Boolean = false
        ) : [Ratecard]


        # Get contacts details based on criteria
        ratecardDetails(
            CLNT        : String!, 
            LANG        : String!,
            CLIENTID :   String,
            CIDSYS   :   String,
            ITEMID   :   String
        ) : [Ratecard]
    
    }
    
    # Mutation type
    type Mutation
    {
        # CRUD Operations for Ratecards
        RatecardsCRUDOps
        (
            ratecards        :   [Ratecards!]!,
            transaction     :   TransactionTypes!
        )   :   [String]       
    }

    

`;

// Export the typeDefs
module.exports = typeDefs;