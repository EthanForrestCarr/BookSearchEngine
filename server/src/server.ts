import express from 'express';
import path from 'node:path';
import type { Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import authMiddleware from './services/auth.js';
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import { MyContext } from './services/auth.js';
import cors from 'cors';

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

const PORT = process.env.PORT || 3001;
const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

const app = express();

app.use(cors(corsOptions));

const startApolloServer = async () => {
  await server.start();
  await db;

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      const { user } = authMiddleware(req);
      return { user };
    },
  }));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(process.cwd(), 'client', 'dist')));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(process.cwd(), 'client', 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();