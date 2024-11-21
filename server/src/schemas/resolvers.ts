import User from '../models/User.js';
import { AuthenticationError } from 'apollo-server-core';
import { IResolvers } from '@graphql-tools/utils';

const resolvers: IResolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: { user: any }) => {
      if (context.user) {
        return await User.findById(context.user._id);
      }
      throw new AuthenticationError('Not logged in');
    },
  },
  Mutation: {
    login: async (_parent: unknown, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = user.generateAuthToken();
      return { token, user };
    },
    addUser: async (_parent: unknown, args: { username: string; email: string; password: string }) => {
      const user = await User.create(args);
      const token = user.generateAuthToken();
      return { token, user };
    },
    saveBook: async (_parent: unknown, args: { bookId: string; title: string }, context: { user: any }) => {
      if (context.user) {
        return await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: args } },
          { new: true }
        );
      }
      throw new AuthenticationError('Not logged in');
    },
    removeBook: async (_parent: unknown, { bookId }: { bookId: string }, context: { user: any }) => {
      if (context.user) {
        return await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
      }
      throw new AuthenticationError('Not logged in');
    },
  },
};

export default resolvers;

