import { Request, Response } from 'express';

export class BaseController {
  protected sendSuccess(res: Response, data: any, statusCode: number = 200): void {
    res.status(statusCode).json({
      success: true,
      data
    });
  }

  protected sendError(res: Response, message: string, statusCode: number = 500): void {
    res.status(statusCode).json({
      success: false,
      message
    });
  }

  protected async handleAsyncError(
    res: Response,
    asyncFn: () => Promise<void>
  ): Promise<void> {
    try {
      await asyncFn();
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(res, error.message, 500);
      } else {
        this.sendError(res, 'Internal server error', 500);
      }
    }
  }
}
