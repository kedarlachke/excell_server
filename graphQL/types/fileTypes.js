/**
 * @author 
 */

// Documents Type
const typeDefs = `
scalar Upload
   
type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Query {
    uploads: [File]
  }

  type Mutation {
    singleUpload(file: Upload!): File!
  }

`;

// Export the typeDefs
module.exports = typeDefs;