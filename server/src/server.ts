import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './config/connection';
import typeDefs from './schemas/typeDefs';
import resolvers from './schemas/resolvers';
import authMiddleware from './services/auth';

const PORT = process.env.PORT || 3001;
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => authMiddleware(req),
});

(async () => {
  await server.start();
  app.use(cors(), bodyParser.json(), expressMiddleware(server));

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}`);
    });
  });
})();
