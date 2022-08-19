import { Request, Response } from 'express';

export const success = (res: Response, data: any, status: number = 403): any => {
    try {
        const result = {
            status: status ? status : 200,
            success: true,
            data: data ? data : {},
        };
        return res.status(status ? status : 200).json(result);
    }
    catch (error) {
        console.log(error);
    }
}

/**
 *
 * @param {*} res
 * @param {*} req
 * @param {String} error
 * @param {Number} status
 */
export const error = (res: Response, req: Request, error: any, status: number = 403): any => {
    try {
        const result = {
            status,
            success: false,
            data: {
                error: error.message || '',
                code: status,
                request: req.originalUrl,
                method: req.method,
            },
        };
        return res.status(status).json(result);
    } catch (error) {
        console.log(error);
    }
}