import { getRepository } from 'typeorm';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '../database/entity/User';

const SECRET = 'secret';

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
}

class UserRepository {
  private userRepository = getRepository(User);

  async createUser(props: CreateUserPayload) {
    const { name, email, password } = props;

    const user = await this.userRepository.save({
      name,
      email,
      hashedPassword: this.createHashedPassword(password),
    });

    return this.formatUserDataWithoutHashedPassword(user);
  }

  async getUser(props: Object = {}) {
    const user = await this.userRepository.findOne(props);

    return this.formatUserDataWithoutHashedPassword(user);
  }

  async deleteUser(props: Object = {}) {
    const userToRemove = await this.getUser(props);

    await this.userRepository.remove(userToRemove);

    return this.formatUserDataWithoutHashedPassword(userToRemove);
  }

  createHashedPassword(password: string) {
    const salt = crypto.randomBytes(16).toString('hex');

    const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');

    return hashedPassword;
  }

  async validatePassword(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    const hashedPassword = this.createHashedPassword(password);

    return hashedPassword === user.hashedPassword;
  }

  generateJWT(id: string, email: string) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        id,
        email,
        exp: parseInt(`${expirationDate.getTime() / 1000}`, 10),
      },
      SECRET,
    );
  }

  verifyToken(token: string) {
    const decoded = jwt.verify(token, SECRET);

    if (decoded['id'] && decoded['email']) {
      return decoded;
    }

    return null;
  }

  formatUserDataWithoutHashedPassword(user: User) {
    delete user.hashedPassword;

    return user;
  }
}

export default UserRepository;