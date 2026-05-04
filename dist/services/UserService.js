"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = require("../models/User");
class UserService {
    validateUserData(user) {
        const errors = [];
        if (!user.name || user.name.trim() === '') {
            errors.push('Name is required and cannot be empty');
        }
        if (!user.email || user.email.trim() === '') {
            errors.push('Email is required and cannot be empty');
        }
        else if (!this.isValidEmail(user.email)) {
            errors.push('Invalid email format');
        }
        return errors;
    }
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    async getAllUsers() {
        try {
            return await User_1.User.getAll();
        }
        catch (error) {
            throw new Error(`Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getUserById(id) {
        if (id <= 0) {
            throw new Error('User ID must be a positive number');
        }
        try {
            const user = await User_1.User.getById(id);
            return user;
        }
        catch (error) {
            throw new Error(`Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async createUser(userData) {
        // Validation
        const validationErrors = this.validateUserData(userData);
        if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '));
        }
        try {
            const newUser = {
                name: userData.name.trim(),
                email: userData.email.trim().toLowerCase()
            };
            return await User_1.User.create(newUser);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('UNIQUE')) {
                throw new Error('Email already exists');
            }
            throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateUser(id, userData) {
        if (id <= 0) {
            throw new Error('User ID must be a positive number');
        }
        // Check if user exists
        const existingUser = await User_1.User.getById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }
        // Validation
        const validationErrors = this.validateUserData(userData);
        if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '));
        }
        try {
            const updateData = {
                ...(userData.name && { name: userData.name.trim() }),
                ...(userData.email && { email: userData.email.trim().toLowerCase() })
            };
            const success = await User_1.User.update(id, updateData);
            if (success) {
                return await User_1.User.getById(id);
            }
            return null;
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('UNIQUE')) {
                throw new Error('Email already exists');
            }
            throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteUser(id) {
        if (id <= 0) {
            throw new Error('User ID must be a positive number');
        }
        const existingUser = await User_1.User.getById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }
        try {
            return await User_1.User.delete(id);
        }
        catch (error) {
            throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.UserService = UserService;
