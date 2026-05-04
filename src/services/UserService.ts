import { User, IUser } from '../models/User';

export class UserService {
  private validateUserData(user: Partial<IUser>): string[] {
    const errors: string[] = [];

    if (!user.name || user.name.trim() === '') {
      errors.push('Name is required and cannot be empty');
    }

    if (!user.email || user.email.trim() === '') {
      errors.push('Email is required and cannot be empty');
    } else if (!this.isValidEmail(user.email)) {
      errors.push('Invalid email format');
    }

    return errors;
  }
  
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async getAllUsers(): Promise<IUser[]> {
    try {
      return await User.getAll();
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserById(id: number): Promise<IUser | null> {
    if (id <= 0) {
      throw new Error('User ID must be a positive number');
    }

    try {
      const user = await User.getById(id);
      return user;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    // Validation
    const validationErrors = this.validateUserData(userData);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    try {
      const newUser: IUser = {
        name: userData.name!.trim(),
        email: userData.email!.trim().toLowerCase()
      };
      return await User.create(newUser);
    } catch (error) {
      if (error instanceof Error && error.message.includes('UNIQUE')) {
        throw new Error('Email already exists');
      }
      throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateUser(id: number, userData: Partial<IUser>): Promise<IUser | null> {
    if (id <= 0) {
      throw new Error('User ID must be a positive number');
    }
    // Check if user exists
    const existingUser = await User.getById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }
    // Validation
    const validationErrors = this.validateUserData(userData);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    try {
      const updateData: Partial<IUser> = {
        ...(userData.name && { name: userData.name.trim() }),
        ...(userData.email && { email: userData.email.trim().toLowerCase() })
      };
      
      const success = await User.update(id, updateData);
      if (success) {
        return await User.getById(id);
      }
      return null;
    } catch (error) {
      if (error instanceof Error && error.message.includes('UNIQUE')) {
        throw new Error('Email already exists');
      }
      throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    if (id <= 0) {
      throw new Error('User ID must be a positive number');
    }

    const existingUser = await User.getById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    try {
      return await User.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
