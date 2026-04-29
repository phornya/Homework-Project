"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_1 = require("../models/User");
class UserController {
    getAllUsers = async (req, res) => {
        try {
            const users = await User_1.User.getAll();
            res.status(200).json(users);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    };
    getUserById = async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const user = await User_1.User.getById(id);
            if (user) {
                res.status(200).json(user);
            }
            else {
                res.status(404).json({ message: 'User not found' });
            }
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    };
    createUser = async (req, res) => {
        try {
            const { name, email } = req.body; // Using object destructuring
            if (!name || !email) {
                res.status(400).json({ message: 'Name and email are required' });
                return;
            }
            const newUser = { name, email };
            const createdUser = await User_1.User.create(newUser);
            res.status(201).json(createdUser);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    };
    updateUser = async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const { name, email } = req.body; // Using object destructuring
            const success = await User_1.User.update(id, { name, email });
            if (success) {
                res.status(200).json({ message: 'User updated successfully' });
            }
            else {
                res.status(404).json({ message: 'User not found' });
            }
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    };
    deleteUser = async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            const success = await User_1.User.delete(id);
            if (success) {
                res.status(200).json({ message: 'User deleted successfully' });
            }
            else {
                res.status(404).json({ message: 'User not found' });
            }
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    };
}
exports.UserController = UserController;
