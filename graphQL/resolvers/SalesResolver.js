import salesServices from '../../services/SalesServices'

const resolvers = 
{
    Query: 
    {SearchSale:{}},
    Mutation:
    {
        SalesCRUDOps:salesServices
    }
}


export default resolvers;