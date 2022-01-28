/**
 * @author 
 */

// Import Section
import usersServices from "../../services/usersServices";


// Resolvers
const resolvers = 
{
    Query: 
    {
        // Resolver for searchUsers(input) : [Users]
        searchUsers : usersServices.searchUsers,

        // Resolver for userDetails(input) : [Users]
        userDetails : usersServices.userDetails,

        // Resolver for searchAuthorizations(input) : [Authorization]
        searchAuthorizations : usersServices.searchAuthorizations,

        // Resolver for Password Change
        searchPassword :usersServices.searchPassword

    },

    Mutation:
    {
        // Resolver for UsersCRUDOps(input) : String
        UsersCRUDOps : usersServices.UsersCRUDOps,

        // Resolver for updateUserAuthorizations(input) : String
        updateUserAuthorizations : usersServices.updateUserAuthorizations,


        //Customer Signup resolver    
        SignUpCustomerUsername : usersServices.SignUpCustomerUsername,


                //Customer Signup resolver    
                SignUpCustomerUsernameJWT : usersServices.SignUpCustomerUsernameJWT
    }
};



// Export the resolvers
module.exports = resolvers;