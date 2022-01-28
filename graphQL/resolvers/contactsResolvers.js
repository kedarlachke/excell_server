/**
 * @author 
 */

// Import Section
import contactsServices from "../../services/contactsServices";


// Resolvers
const resolvers = 
{
    Query: 
    {
        // Resolver for searchContacts(input) : [Contacts]
        searchContacts : contactsServices.searchContacts,

        // Resolver for contactDetails(input) : [Contacts]
        contactDetails : contactsServices.contactDetails        
    },

    Mutation:
    {
        // Resolver for ContactsCRUDOps(input) : String
        ContactsCRUDOps : contactsServices.ContactsCRUDOps               
    }
};



// Export the resolvers
module.exports = resolvers;