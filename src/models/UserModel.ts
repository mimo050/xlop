import { prisma } from '../db/client';
import { Prisma, User } from '@prisma/client';

export const UserModel = {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },
  create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  },
  count(): Promise<number> {
    return prisma.user.count();
  }
};
