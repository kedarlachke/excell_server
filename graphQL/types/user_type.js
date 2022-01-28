// Users Type
const typeDefs = `

    # Output Type
    type UserType
    {

        applicationid      : String,
        client      : String,
		lang      : String,
		email      : String,
        username      : String,
        password      : String,
        mobile      : String
    }



    type UserNewType
    {

        applicationid      : String,
        client      : String,
		lang      : String,
		email      : String,
        username      : String,
        password      : String,
        mobile      : String,
        firstname      : String,
        lastname      : String,
        userauthorisations      : String,
        token      : String,
        status :String,
        _id:String

    }



    # Output Type
    type UserTokenType
    {
        applicationid      : String,
        client      : String,
		lang      : String,
		email      : String,
        username      : String,
        password      : String,
        mobile      : String,
        token      : String
    }

    # Query Type
    type Query
    {
        currentUsername
     : UserType 
  
        currentUsernameJWT
         : UserNewType


         users    (
            applicationid    :   String!,
            client    :   String!,
            lang   :   String!
        ):[UserNewType]


        
  }






    # Mutation Type
    type Mutation
    {
        
        signUpUsername
        (
            applicationid : String,
            client: String ,
                lang: String ,
                email: String,
            username:String,
            password: String,
            mobile: String
        )   :   UserType       


        signUpUsernameJWT
        (
            applicationid :  String,
            client:  String ,
                lang:  String ,
                email:  String,
            username: String,
            password:  String,
            mobile:  String
        )   :   UserNewType     


        signInUsername
        (
            applicationid : String,
            client: String,
                lang: String,
                username: String,
            password: String
        )   :   UserType 

        signInUsernameJWT
        (
            applicationid :  String,
            client:  String ,
                lang:  String ,
                username: String,
            password:  String

        )  :   UserNewType     

        signOutUsername
          :   UserType 


         createUsername
         (
            applicationid : String,
            client: String ,
                lang: String ,
                email: String,
            username:String,
            password: String,
            mobile: String
         )   :   UserType 



         updateUsername
         (
            applicationid : String,
            client: String ,
                lang: String ,
                email: String,
            username:String,
            password: String,
            mobile: String
         )   :   UserType 

         



         saveUsername
         (
            applicationid : String,
            client: String ,
            lang: String ,
            email: String,
            username:String,
            password: String,
            mobile: String,
            firstname: String,
            lastname: String,
            userauthorisations : String,
            status:String
         )  : UserNewType


         deleteUsername
         (
            applicationid : String,
            client: String ,
            lang: String ,
            username:String,
            _id:String
         )  : UserNewType



    }

    
`;

// Export the typeDefs
module.exports = typeDefs;