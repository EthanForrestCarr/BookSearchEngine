import { User } from '../models/User.js';
import { AuthenticationError } from 'apollo-server';

const resolvers = {
  Query: {
    me: async (_parent, _args, context) => {
      if (context.user) {
        return await User.findById(context.user._id);
      }
      throw new AuthenticationError('Not logged in');
    },
  },
  Mutation: {
    login: async (_parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = user.generateAuthToken();
      return { token, user };
    },
    addUser: async (_parent, args) => {
      const user = await User.create(args);
      const token = user.generateAuthToken();
      return { token, user };
    },
    saveBook: async (_parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: args } },
          { new: true }
        );
      }
      throw new AuthenticationError('Not logged in');
    },
    removeBook: async (_parent, { bookId }, context) => {
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
