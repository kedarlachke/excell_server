/**
 * @author 
 */

// Contacts Type
const typeDefs = `

    # Input Type
    input TaxAmounts
    {
        CLNT	: String,
        LANG	: String,
        DOCID	: String,
        DOCTYPE	: String,
        GEOGRAPHY	: String,
        DATE	: String,
        TAXTYPE	: String,
        LINEITEMNO	: String,
        AMOUNT	: String,
        RATE	: String,
        TAXAMOUNT	: String,
        TAXTEXT	: String,
        SIGN	: String,
        CORDER	: String        
    }


    # Output Type
    type TaxAmount
    {
        CLNT	: String,
        LANG	: String,
        DOCID	: String,
        DOCTYPE	: String,
        GEOGRAPHY	: String,
        DATE	: String,
        TAXTYPE	: String,
        LINEITEMNO	: String,
        AMOUNT	: String,
        RATE	: String,
        TAXAMOUNT	: String,
        TAXTEXT	: String,
        SIGN	: String,
        CORDER	: String        
    }

`;

// Export the typeDefs
module.exports = typeDefs;