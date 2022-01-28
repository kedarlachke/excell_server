/**
 * @author 
 */

// Case Type
const typeDefs = 
`
    # Output Type
    type TaxRate
    {
        CLNT	: String,
        LANG	: String,
        CMPN	: String,
        RULEID	: String,
        DOCTYPE	: String,
        ISSTATESPC	: String,
        STATECD	    : String,
        STATE	    : String,
        ISAMNTRNGSPC	: String,
        AMOUNTFROM	: String,
        AMOUNTTO	: String,
        ISFXDAMNT	: String,
        FXDAMOUNT	: String,
        ISTIMESPC	: String,
        FROMDT	: String,
        TODT	: String,
        ISRATEFXD	: String,
        RATE	: String,
        ISDEL	: String,
        TAXCD	: String,
        TAXDESC	: String,
        CORDER	: String,
        GLACC	: String        
    }

    # Query Type
    type Query
    {
        # Search tax rates based on criteria
        searchTaxRates(
            CLNT        : String!, 
            LANG        : String!,
            DOCTYPE     : String!
        ) : [TaxRate]

    }


`;    


// Export the typeDefs
module.exports = typeDefs;