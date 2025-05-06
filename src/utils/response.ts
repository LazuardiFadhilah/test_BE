import { Response } from 'express';

export const successResponse = (res: Response, data: any, message='Success', count = "1", statusCode = 200) => {
    return res.status(statusCode).json({
        status: true,
        statusCode,
        message,
        count,
        data
    });
};

export const errorResponse = (res:Response, message="Error", statusCode = 500) => {
    return res.status(statusCode).json({
        status: false,
        statusCode,
        message
});
};
