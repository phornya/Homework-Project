"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    sendSuccess(res, data, statusCode = 200) {
        res.status(statusCode).json({
            success: true,
            data
        });
    }
    sendError(res, message, statusCode = 500) {
        res.status(statusCode).json({
            success: false,
            message
        });
    }
    async handleAsyncError(res, asyncFn) {
        try {
            await asyncFn();
        }
        catch (error) {
            if (error instanceof Error) {
                this.sendError(res, error.message, 500);
            }
            else {
                this.sendError(res, 'Internal server error', 500);
            }
        }
    }
}
exports.BaseController = BaseController;
