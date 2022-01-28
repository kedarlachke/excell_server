/**
 * @author 
 */

// Client Type
const typeDefs = `

    # Output Type
    type Client
    {
        CLNT	                : String,
        PASSWORD                : String,
        LANG	                : String,
        CLNTID	                : String,
        FIRSTNM	                : String,
        LASTNM	                : String,
        OFFICENM                : String,
        ADDRESS	                : String,
        CITY	                : String,
        STATE	                : String,
        ZIPCD	                : String,
        EMAILID	                : String,
        PHONE	                : String,
        FAX	                	: String,
        MODOFCON                : String,
        BESTTMCAL               : String
    }

    input Clients
    {
        CLNT	                : String,
        PASSWORD                : String,
        LANG	                : String,
        CLNTID	                : String,
        FIRSTNM	                : String,
        LASTNM	                : String,
        OFFICENM                : String,
        ADDRESS	                : String,
        CITY	                : String,
        STATE	                : String,
        ZIPCD	                : String,
        EMAILID	                : String,
        PHONE	                : String,
        FAX	                	: String,
        MODOFCON                : String,
        BESTTMCAL               : String
    }

    # Query Type
    type Query
    {
        # Get client details based on criteria
        clientDetails(
            CLNT        : String!, 
            LANG        : String!,
            CLNTID      : String,
            EMAILID     : String
        ) : [Client]

    }


    # Mutation type
    type Mutation
    {
        # CRUD Operations for Clients
        ClientCRUDOps
        (
            clients : [Clients!]!,
            transaction : TransactionTypes!
        )   :   [String]
    }
`;

// Export the typeDefs
module.exports = typeDefs;