
const typeDefs = 
`
# Output Type
    type MemuItem
    {
        id: String,
		menuname:  String
		rate: String,
		image : String,
		qty: String
    }

    
    # Input Type 
    input MemuItems
    {
        id: String,
		menuname:  String
		rate: String,
		image : String,
		qty: String
    }

    # Mutation Type
    type Mutation
    {
        # CRUD Operations for SAles
        SalesCRUDOps
        (
            memuItems       : [MemuItems!]!,
            paid : String,
            transaction : TransactionTypes!
        )   :   [String]       

             
    }

`;

// Export the typeDefs
module.exports = typeDefs;