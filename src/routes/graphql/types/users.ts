import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { Post } from './posts.js';
import { Profile } from './profiles.js';

const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: Profile,
      resolve: (obj, _args, { prisma }) => {
        return prisma.user.findUnique({
          where: {
            id: obj.id,
          },
        });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      resolve: (obj, _args, { prisma }) => {
        return prisma.post.findMany({
          where: {
            id: obj.id,
          },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: (obj, _args, { prisma }) => {
        return prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: obj.id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: (obj, _args, { prisma }) => {
        return prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: obj.id,
              },
            },
          },
        });
      },
    },
  }),
});

export { User };
