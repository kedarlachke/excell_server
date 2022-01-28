/**
 * @author 
 */

// Import Section
// import ddlServices from "../../services/ddlServices";

//const {  GraphQLUpload } = require('apollo-server');
import { GraphQLUpload } from 'graphql-upload'
// Resolvers
const resolvers = 
{
    Upload: GraphQLUpload,
    Query: {
        files: () => {
          // Return the record of files uploaded from your DB or API or filesystem.
        }
      },
      Mutation: {
        async singleUpload( {file} ) {
          console.log('file upload---0***');

          console.log(file);
          console.log('file upload---1***');
          const { stream, filename, mimetype, encoding } = await file;
    
          console.log('file upload***');
          console.log(filename);
          // 1. Validate file metadata.
    
          // 2. Stream file contents into local filesystem or cloud storage:
          // https://nodejs.org/api/stream.html
    
          // 3. Record the file upload in your DB.
          // const id = await recordFile( … )
    
          return { stream, filename, mimetype, encoding };
        }
      },

};



// Export the resolvers
module.exports = resolvers;