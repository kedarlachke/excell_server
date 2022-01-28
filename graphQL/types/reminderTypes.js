/**
 * @author 
 */

// Reminder Type
const typeDefs = `

    # Output Type
    type Reminder
    {
        CLNT    :	String,
        LANG    :	String,
        DOCID   :	String,
        DOCNO       :	String,
        DOCDT       :	String,
        DUEDT       :	String,
        TOT         :	String,
        CUSTCD      :	String,
        CUSTOMER    :	String,
        CUSTMAIL    :	String,
        CMPNNM      :	String,
        COMPMAIL    :	String,
    }


    # Input Type
    input Reminders
    {
        CLNT    :	String,
        LANG    :	String,
        REMNO   :	String,
        DOCID   :	String,
        CFORM   :	String,
        CFROMNAME   :	String,
        CTO         :	String,
        CSUBJECT    :	String,
        CMESSAGE    :	String,
        DUEAMT      :	String,
        DOCNO       :	String,
        CUSTCD      :	String,
        CUSTOMER    :	String,
        CUSTMAIL    :	String,
        DOCDT       :	String,
        CMPNNM      :	String,
        COMPMAIL    :	String,
        DUEDT       :	String,
        CIDSYS      :   String
    }

    
    # Query Type
    type Query
    {
        # Search invoice details for reminder
        invoiceDetailsForReminder
        (
            CLNT    :   String!,
            LANG    :   String!,
            DOCID   :   String!
        ) : [Reminder]   
    }

    # Mutation Type
    type Mutation
    {
        # CRUD Operations for Reminders
        RemindersCRUDOps
        (
            reminders       : [Reminders!]!,
            transaction     : TransactionTypes!
        )   :   String       
    }

`;



// Export the typeDefs
module.exports = typeDefs;