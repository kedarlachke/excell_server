/**
 * @author 
 */

// Tasks Type
const typeDefs = `

    # Output Type
    type Service
    {
        CLNT	: String,
        LANG	: String,
        CATCODE	: String,
        CATDESC	: String,
        STCODE	: String,
        STDESC	: String,
        ORDERNO	: String,
        ISACTIVE	: String
    }

    # Input Type
    input Services
    {
        CLNT	: String,
        LANG	: String,
        CATCODE	: String,
        STCODE	: String,
        STDESC	: String,
        ORDERNO	: String,
        ISACTIVE	: String
    }

    # Query Type
    type Query
    {
        # Search tasks based on criteria
        searchServices
        (
            CLNT    :   String!,
            LANG    :   String!,
            STDESC  :   String
        ) : [Service]   

        # Get Service details based on criteria
        serviceDetails(
            CLNT        : String!, 
            LANG        : String!,
            CATCODE	    : String!,
            STCODE	    : String!,    
        ) : [Service]


    }

    # Mutation Type
    type Mutation
    {
        # CRUD Operations for Services
        ServicesCRUDOps
        (
            services    : [Services!]!,
            transaction : TransactionTypes!
        )   :   String       
    }

`;

// Export the typeDefs
module.exports = typeDefs;