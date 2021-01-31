import { getRepository } from 'typeorm';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import { User } from '../database/entity/User';

const SECRET = 'secret';

interface UpdateUserPayload {
  searchProps: Object;
  updatedValues: any;
}

class UserRepository {
  private userRepository = getRepository(User);

  async createUser(name: string, email: string, password: string) {
    const user = await this.userRepository.save({
      name,
      email,
      hashedPassword: this.createHashedPassword(password),
      createdAt: new Date().toISOString(),
      id: v4(),
    });

    return this.formatUserDataWithoutHashedPassword(user);
  }

  async getUser(props: Object = {}, options: Object = {}) {
    const user = await this.userRepository.findOne(props, options);

    return this.formatUserDataWithoutHashedPassword(user);
  }

  async getUsers(props: Object = {}) {
    const users = await this.userRepository.find(props);

    return this.formatUsersDataWithoutHashedPassword(users);
  }

  async deleteUser(props: Object = {}) {
    const userToRemove = await this.getUser(props);

    await this.userRepository.remove(userToRemove);

    return this.formatUserDataWithoutHashedPassword(userToRemove);
  }

  async updateUser(props: UpdateUserPayload) {
    let userToUpdate: any = await this.getUser(props.searchProps);

    userToUpdate = {
      ...userToUpdate,
      ...props.updatedValues,
    };

    await this.userRepository.save(userToUpdate);

    return this.formatUserDataWithoutHashedPassword(userToUpdate);
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

  formatUsersDataWithoutHashedPassword(users: User[]) {
    if (!users) return users;

    return users.map((user: User) => {
      return this.formatUserDataWithoutHashedPassword(user);
    });
  }
}

export default UserRepository;
