// Import Section

const AuthService = require('../../services/authentication');
const AuthServiceJWT = require('../../services/authenticationJWT');
// const graphql = require('graphql');
// const { GraphQLObjectType, GraphQLID } = graphql;
// const UserType = require('./types/user_type');



// Resolvers
const resolvers = 
{
    Query: 
    {
      
        currentUsername : AuthService.currentUserUsername,
        currentUsernameJWT: AuthServiceJWT.currentUserUsernameJWT,
        users:AuthService.users
    },

    Mutation:
    {
        signUpUsername : AuthService.signUpUsername,
        signUpUsernameJWT : AuthServiceJWT.signUpUsernameJWT,
        signInUsername : AuthService.signInUsername,
        signInUsernameJWT : AuthServiceJWT.signInUsernameJWT,
        signOutUsername: AuthService.sigOutUsername,
        createUsername: AuthService.createUsername,
        updateUsername: AuthService.updateUsername,
        saveUsername:AuthService.saveUsername,
        deleteUsername:AuthService.deleteUsername
    }
};



// Export the resolvers
module.exports = resolvers;