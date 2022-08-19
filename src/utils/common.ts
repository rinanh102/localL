import { Request, Response, NextFunction } from 'express';
import { CONFIG, HttpStatusCode, ROLE_USER, STATUS } from './const';
import * as response from "./response";
import JWT from "jsonwebtoken";
import { logger } from '../libs/logs';
import { AUTHENTICATION_ERRORS, DEVICE_SESSION_ERRORS, OTHER_ERRORS } from './errorMessages';
import Users from '../models/users.model';
import DeviceSessions from '../models/deviceSession.model';

/**
     * Validate xmlHttpRequest
     * @param req 
     * @param res req
     * @param next 
     */
export const xhrRequired = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if (!req.xhr) {
            response.error(res, req, { message: 'Request is not Ajax or Fetch' }, HttpStatusCode.BAD_REQUEST);
            return;
        }
        next();
    }
    catch (error) {
        logger.error(error);
        return response.error(res, req, { message: error.message }, HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
}

export const generateAccessToken = async (user: Users, deviceToken: any) => {
    try {
        return JWT.sign(
            {
                id: user.id,
                role: user.role,
                deviceToken
            },
            CONFIG.JWT_ENCRYPTION,
            {
                expiresIn: CONFIG.JWT_EXPIRATION,
            }
        );
    } catch (error) {
        throw new Error(error);
    }
}

export const generateRefreshToken = async (user: Users, deviceToken: any) => {
    try {
        return JWT.sign(
            {
                id: user.id,
                role: user.role,
                deviceToken
            },
            CONFIG.JWT_ENCRYPTION_REFRESH,
            {
                expiresIn: CONFIG.JWT_EXPIRATION_REFRESH,
            }
        );
    } catch (error) {
        throw new Error(error);
    }
}
export const generateAccessTokenAdmin = async (user: Users) => {
    try {
        return JWT.sign(
            {
                id: user.id,
                role: user.role,
            },
            CONFIG.JWT_ENCRYPTION,
            {
                expiresIn: CONFIG.JWT_EXPIRATION,
            }
        );
    } catch (error) {
        throw new Error(error);
    }
}

export const generateRefreshTokenAdmin = async (user: Users) => {
    try {
        return JWT.sign(
            {
                id: user.id,
                role: user.role,
            },
            CONFIG.JWT_ENCRYPTION_REFRESH,
            {
                expiresIn: CONFIG.JWT_EXPIRATION_REFRESH,
            }
        );
    } catch (error) {
        throw new Error(error);
    }
}

export const AuthenticationClient = async (req: any, res: Response, next: NextFunction) => {
    const token = _getToken(req.headers);
    if (token) {
        JWT.verify(token, CONFIG.JWT_ENCRYPTION, async (error: any, decoded: any) => {
            if (error) {
                try {
                    const decodedOld = JWT.verify(token, CONFIG.JWT_ENCRYPTION, {ignoreExpiration: true} );
                    const decodedOjb = Object(decodedOld)
                    const deviceSession = await DeviceSessions.findOne({ where: { userId: decodedOjb.id, deviceToken: decodedOjb.deviceToken, status: STATUS.ACTIVE } })
                    if (!deviceSession) {
                        return Promise.reject(DEVICE_SESSION_ERRORS.DEVICE_SESSION_NOT_FOUND());
                    }
                    await DeviceSessions.destroy({ where: { userId: decodedOjb.id, deviceToken: decodedOjb.deviceToken, status: STATUS.ACTIVE } })
                } catch (error){
                    return response.error(res, req, AUTHENTICATION_ERRORS.TOKEN_EXPIRED_OR_NOT_AVAILABLE(error), HttpStatusCode.FORBIDDEN); 
                }
                return response.error(res, req, AUTHENTICATION_ERRORS.TOKEN_EXPIRED_OR_NOT_AVAILABLE(error), HttpStatusCode.FORBIDDEN);
            } else {
                const user = {} as any;
                user.id = decoded.id;
                user.role = decoded.role;
                user.nickname = decoded.nickname;
                user.deviceToken = decoded.deviceToken;
                if (user.role === ROLE_USER.USER) {
                    req.user = user;
                    next();
                } else {
                    return response.error(res, req, AUTHENTICATION_ERRORS.PERMISSION_DENIED(), HttpStatusCode.UNAUTHORIZED);
                }
            }
        });
    } else {
        return response.error(res, req, AUTHENTICATION_ERRORS.TOKEN_EXPIRED_OR_NOT_AVAILABLE(), HttpStatusCode.FORBIDDEN);
    }
}

export const AuthenticationAdmin = async (req: any, res: Response, next: NextFunction) => {
    const token = _getToken(req.headers);
    if (token) {
        JWT.verify(token, CONFIG.JWT_ENCRYPTION, async (error: any, decoded: any) => {
            if (error) {
                return response.error(res, req, AUTHENTICATION_ERRORS.TOKEN_EXPIRED_OR_NOT_AVAILABLE(error), HttpStatusCode.UNAUTHORIZED);
            } else {
                const user = {} as any;
                user.id = decoded.id;
                user.role = decoded.role;
                user.nickname = decoded.nickname;
                if (user.role === ROLE_USER.ADMIN) {
                    req.user = user;
                    next();
                } else {
                    return response.error(res, req, AUTHENTICATION_ERRORS.PERMISSION_DENIED(), HttpStatusCode.UNAUTHORIZED);
                }
            }
        });
    } else {
        return response.error(res, req, AUTHENTICATION_ERRORS.TOKEN_EXPIRED_OR_NOT_AVAILABLE(), HttpStatusCode.UNAUTHORIZED);
    }
}

const _getToken = (headers: any) => {
    if ((headers && headers.authorization) || headers["x-access-token"]) {
        let token = headers.authorization || headers["x-access-token"];
        if (token.startsWith(`Bearer `)) {
            token = token.slice(7, token.length);
            return token;
        } else {
            return token;
        }
    } else {
        return null;
    }
}

//#region [CORS]
export const cors = (req: Request, res: Response, next: NextFunction) => {
    try {

        const allowedHeaders = ["authorization", "x-requested-with", "content-type", "lang", "id", "name", "category", "page", "limit", "sort", "sort-by", "size", "stbd-code"]

        res.header("Access-Control-Allow-Origin", req.headers.origin as string);
        res.header("Access-Control-Allow-Headers", allowedHeaders.join(", "));
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");

        next();
    }
    catch (error) {
        logger.error(error);
        return;
    }
}

/**
 *
 * @param {Number} total
 * @param {Number} skip
 * @param {Number} limit
 * @param {Number} size
 * 
 * @returns {Object}
 */
export const pagination = async (total: any, skip: any, limit: any, size: any) => {
    try {
        return {
            previousPage: skip > 1 ? skip - 1 : 1,
            currentPage: skip < 1 ? skip + 1 : skip,
            nextPage: Math.ceil(total / limit) > skip ? (skip < 1 ? skip + 2 : skip + 1) : Math.ceil(total / limit),
            firstPage: 1,
            lastPage: Math.ceil(total / limit),
            pageSize: size,
            totalPages: Math.ceil(total / limit),
            totalRecords: total,
        };
    } catch (error) {
        return {
            previousPage: 0,
            currentPage: 0,
            nextPage: 0,
            firstPage: 0,
            lastPage: 0,
            pageSize: 0,
            totalPages: 0,
            totalRecords: 0,
        };
    }
}

//#region [CORS]
export const Pipe = async (res: any, req: any, fn: any): Promise<any> => {
    try {
        const result = await fn;
        return response.success(res, result, HttpStatusCode.OK);
    } catch (error) {
        logger.error(error);
        return response.error(res, req, OTHER_ERRORS.UNKNOWN(error), HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
}
