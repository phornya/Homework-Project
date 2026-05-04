"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const BaseController_1 = require("./BaseController");
const UserService_1 = require("../services/UserService");
class UserController extends BaseController_1.BaseController {
    userService;
    constructor() {
        super();
        this.userService = new UserService_1.UserService();
    }
    getAllUsers = async (req, res) => {
        await this.handleAsyncError(res, async () => {
            const users = await this.userService.getAllUsers();
            this.sendSuccess(res, users, 200);
        });
    };
    getUserById = async (req, res) => {
        await this.handleAsyncError(res, async () => {
            const id = parseInt(req.params.id, 10);
            const user = await this.userService.getUserById(id);
            if (user) {
                this.sendSuccess(res, user, 200);
            }
            else {
                this.sendError(res, 'User not found', 404);
            }
        });
    };
    createUser = async (req, res) => {
        await this.handleAsyncError(res, async () => {
            const { name, email } = req.body;
            const createdUser = await this.userService.createUser({ name, email });
            this.sendSuccess(res, createdUser, 201);
        });
    };
    updateUser = async (req, res) => {
        await this.handleAsyncError(res, async () => {
            const id = parseInt(req.params.id, 10);
            const { name, email } = req.body;
            const updatedUser = await this.userService.updateUser(id, { name, email });
            if (updatedUser) {
                this.sendSuccess(res, updatedUser, 200);
            }
            else {
                this.sendError(res, 'Failed to update user', 500);
            }
        });
    };
    deleteUser = async (req, res) => {
        await this.handleAsyncError(res, async () => {
            const id = parseInt(req.params.id, 10);
            const success = await this.userService.deleteUser(id);
            if (success) {
                this.sendSuccess(res, { message: 'User deleted successfully' }, 200);
            }
            else {
                this.sendError(res, 'Failed to delete user', 500);
            }
        });
    };
}
exports.UserController = UserController;
