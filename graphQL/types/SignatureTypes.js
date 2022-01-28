/**
 * @author Kedar Lachke
 */

// Signature Type
const typeDefs = `

    # Output Type
    type ESignature
    {
        CLNT	:	String,
        LANG	:	String,
        SIGNATUREID:String,
        CID	    :	String,
        CIDSYS	:	String,
        FONTTYPE:	String,
        TAGOPEN	:	String,
        SIGNATURE:	String,
        TAGCLOSE:	String,
        CUSER	:	String,
        CDATE	:	String,
        CTIME	:	String,
        UDATE	:	String,
        UTIME	:	String,
        UUSER	:	String,
        ISDEL	:	String,
        DDATE	:	String,
        DTIME	:	String,
        DUSER	:	String
    }

    # Input Type
    input ESignatures
    {
        CLNT   	 :  String,
        LANG     :  String,
        SIGNATUREID:String,
        CID	     :  String,
        CIDSYS	 :	String,
        FONTTYPE :	String,
        TAGOPEN	 :	String,
        SIGNATURE:	String,
        TAGCLOSE :	String        
    }

    # Query Type
    type Query
    {
        # Search ESignature based on criteria
        searchESignatures
        (
            CLNT    :   String!,
            LANG    :   String!,
            SIGNATUREID:String,
            CID	     :  String,
            CIDSYS	 :	String
            exactMatch   :  Boolean = true
        ) : [ESignature]   
    }

    # Mutation type
    type Mutation
    {
        # CRUD Operations for ESignature
        ESignatureCRUDOps
        (
            ESignatures        :   [ESignatures!]!,
            transaction     :   TransactionTypes!
        )   :   [String]       
    }
`;

// Export the typeDefs
module.exports = typeDefs;