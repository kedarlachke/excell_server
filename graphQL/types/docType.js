/**
 * @author 
 */

// Contacts Type
const typeDefs = `

    # Input Type
    input DocInput
    {
        CLNT	: String,
        LANG	: String,
        DOCID	: String,
        DOCCONTENT : String  ,
        CUSER:String  
    }
    # Output Type
    type DocOutput
    {
        CLNT	: String,
        LANG	: String,
        DOCID	: String,
        DOCCONTENT : String ,
        CUSER:String 
    }
    # Query Type
    type Query
    {
      
        
        # Get uploaded document details based on criteria
        getDocDetail
        (
            CLNT    :   String!,
            LANG    :   String!,
            DOCID   :   String!
        ) : DocOutput           

    }




    # Mutation type
    type Mutation
    {
        

        
        # Delete the document
        deleteDocument
        (
            CLNT      :   String!,
            LANG      :   String!,
            DOCID     :   String!
        ) : DocOutput

        # Create the document
        createDocument
        (
            CLNT       :   String!,
            LANG       :   String!,
            DOCID      :   String!,
            DOCCONTENT :   String!,
            CUSER:String!
        ) : DocOutput


    }
    
`;

// Export the typeDefs
module.exports = typeDefs;