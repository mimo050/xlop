import bcrypt from 'bcryptjs';
import { UserModel } from '../models/UserModel';
import { env } from '../config/env';

export const AuthService = {
  async initAdminUser() {
    const count = await UserModel.count();
    if (count === 0) {
      const hash = await bcrypt.hash(env.adminPassword, 10);
      await UserModel.create({ email: env.adminEmail, passwordHash: hash });
      console.log(`Admin user created with email ${env.adminEmail}`);
    }
  },
  async verifyCredentials(email: string, password: string) {
    const user = await UserModel.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(password, user.passwordHash);
    return match ? user : null;
  }
};
