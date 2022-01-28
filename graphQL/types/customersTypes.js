/**
 * @author 
 */

// Customers Type
const typeDefs = `

    # Output Type
    type Customer
    {
        CCODE         : String,
        FIRSTNM       : String,
        LASTNM        : String,
        CMAIL         : String,
        PHNO          : String,
        OFFICENM      : String,
        ADDR          : String,
        CITY          : String,
        PINC          : String,
        FAXNO         : String,
        BESTTMCAL     : String,
        MODOFCON      : String,
        STATE         : String,
        COUNTRY	 	  : String
    }

    # Input Type
    input Customers
    {
        CLNT                : String,
        LANG                : String,
        CCODE               : String,
        CNAME                : String,
        CTYPE                : String,
        CCURR                : String,
        PANNO                : String,
        VATNO                : String,
        PFNO                  : String,
        STAXNO                : String,
        ESICNO                : String,
        PHNO                : String,
        CELLNO                : String,
        FAXNO                : String,
        CMAIL                : String,
        COFF                : String,
        ADDR                : String,
        ADDR1                : String,
        CITY                : String,
        COUNTRY                : String,
        PINC                : String,
        BNKCD                : String,
        ACNO                : String,
        RECONAC                : String,
        CUSTP                : String,
        CUSTC                : String,
        RCCODE                : String,
        WSITE                : String,
        SHIPM                : String,
        FRTRM                : String,
        PAYMD                : String,
        TANNO                : String,
        CSTNO                : String,
        EXCSNO                : String,
        IECCD                : String,
        MICRCD                : String,
        IFCICD                : String,
        INCORPDT                : String,
        CSITE                : String,
        CMPNCD                : String,
        CMPNNM                : String,
        FIRSTNM                : String,
        LASTNM                : String,
        OFFICENM                : String,
        STATE                : String,
        MODOFCON                : String,
        BESTTMCAL                : String,
        GLACC                : String
    }

    # Query Type
    type Query
    {
        # Search customers based on criteria
        searchCustomers
        (
            CLNT    :   String!,
            LANG    :   String!,
            FIRSTNM :   String,
            LASTNM  :   String,
            CMAIL   :   String,
            CELLNO  :   String,
            exactMatch   :  Boolean = false
        ) : [Customer]   

        # Get customer's details based on criteria
        customerDetails(
            CLNT        : String!, 
            LANG        : String!,
            CCODE       : String,
            CMAIL       : String
        ) : [Customer]

    }

    # Mutation type
    type Mutation
    {
        # CRUD Operations for Customers
        CustomersCRUDOps
        (
            customers       :   [Customers!]!,
            transaction     :   TransactionTypes!
        )   :   [String]  
    }
    
`;

// Export the typeDefs
module.exports = typeDefs;