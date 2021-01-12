import { getRepository } from 'typeorm';
import CryptoJS from 'crypto-js';
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
    const hashedPassword = CryptoJS.AES.encrypt(password, SECRET).toString();

    return hashedPassword;
  }

  async validatePassword(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    var bytes = CryptoJS.AES.decrypt(user.hashedPassword, SECRET);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);

    return password === originalText;
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
    if (!user) return user;

    delete user.hashedPassword;

    return user;
  }
}

export default UserRepository;
