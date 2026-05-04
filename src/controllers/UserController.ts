import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { UserService } from '../services/UserService';

export class UserController extends BaseController {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    await this.handleAsyncError(res, async () => {
      const users = await this.userService.getAllUsers();
      this.sendSuccess(res, users, 200);
    });
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    await this.handleAsyncError(res, async () => {
      const id = parseInt(req.params.id as string, 10);
      const user = await this.userService.getUserById(id);
      
      if (user) {
        this.sendSuccess(res, user, 200);
      } else {
        this.sendError(res, 'User not found', 404);
      }
    });
  };

  createUser = async (req: Request, res: Response): Promise<void> => {
    await this.handleAsyncError(res, async () => {
      const { name, email } = req.body;
      const createdUser = await this.userService.createUser({ name, email });
      this.sendSuccess(res, createdUser, 201);
    });
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    await this.handleAsyncError(res, async () => {
      const id = parseInt(req.params.id as string, 10);
      const { name, email } = req.body;
      const updatedUser = await this.userService.updateUser(id, { name, email });
      
      if (updatedUser) {
        this.sendSuccess(res, updatedUser, 200);
      } else {
        this.sendError(res, 'Failed to update user', 500);
      }
    });
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    await this.handleAsyncError(res, async () => {
      const id = parseInt(req.params.id as string, 10);
      const success = await this.userService.deleteUser(id);
      
      if (success) {
        this.sendSuccess(res, { message: 'User deleted successfully' }, 200);
      } else {
        this.sendError(res, 'Failed to delete user', 500);
      }
    });
  };
}
