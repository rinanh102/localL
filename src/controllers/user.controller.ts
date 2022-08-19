
import { Request, Response } from "express";
import * as UserService from '../services/user.service';
import { Pipe } from "..//utils/common";

/**
 * [APP] login with email
 * @param req
 * @param res
 * @returns
 */
export const loginWithEmail = async (req: Request, res: Response) => {
    await Pipe(res, req, UserService.loginWithEmail(req))
}

/**
 * [APP] signup with email
 * @param req
 * @param res
 * @returns
 */
export const verifyProfileSignup = async (req: Request, res: Response) => {
    await Pipe(res, req, UserService.verifyProfileSignup(req.body))
}

/**
 * [APP] reset password with email
 * @param req
 * @param res
 * @returns
 */
export const resetPasswordWithEmail = async (req: Request, res: Response) => {
    await Pipe(res, req, UserService.resetPassword(req.body))
}
/**
 * [APP] change password with email
 * @param req
 * @param res
 * @returns
 */
 export const changePassword = async (req: Request, res: Response) => {
    await Pipe(res, req, UserService.changePassword(req))
}

/**
 * [APP] login with social
 * @param req
 * @param res
 * @returns
 */
export const loginWithSocial = async (req: Request, res: Response) => {
    await Pipe(res, req, UserService.loginWithSocial(req))
}

/**
 * [APP] login with social
 * @param req
 * @param res
 * @returns
 */
 export const loginWithCI = async (req: Request, res: Response) => {
    await Pipe(res, req, UserService.loginWithCI(req))
}


/**
 * [APP] login with email CI
 * @param req
 * @param res
 * @returns
 */
 export const loginWithCIEmail = async (req: Request, res: Response) => {
    await Pipe(res, req, UserService.loginWithCIEmail(req.body))
}


/**
* [APP] verify if CI_value in use
* @param req
* @param res
* @returns
*/
export const verifyCIvalue = async (req: Request, res: Response) => {
    await Pipe(res, req, UserService.verifyCIvalue(req.body))
}

/**
* [APP] verify if nickname in use
* @param req
* @param res
* @returns
*/
export const verifyNickname = async (req: Request, res: Response) => {
    await Pipe(res, req, UserService.verifyNickname(req.body))
}

/**
* [APP] verify if phone number in use
* @param req
* @param res
* @returns
*/
export const verifyPhoneNumber = async (req: Request, res: Response) => {
    await Pipe(res, req, UserService.verifyPhoneNumber(req.body))
}

/**
* [APP] verify if email in use
* @param req
* @param res
* @returns
*/
export const verifyEmail = async (req: Request, res: Response) => {
    await Pipe(res, req, UserService.verifyEmail(req.body))
}

/**
 * [ADMIN] login with email
 * @param req
 * @param res
 * @returns
 */
export const loginWithEmailAdmin = async (req: Request, res: Response, next: any) => {
    await Pipe(res, req, UserService.loginWithEmailAdmin(req.body));
}

/**
 * [APP] renew access token
 * @param req
 * @param res
 * @returns
 */
export const renewAccessToken = async (req: any, res: any, next: any) => {
    await Pipe(res, req, UserService.renewAccessToken(req, res, req.body));
}
/**
* [APP] logout
* @param req
* @param res
* @returns
*/
export const logout = async (req: Request, res: Response, next: any) => {
    await Pipe(res, req, UserService.logout(req))
}

export const getCertifications = async (req: Request, res: Response, next: any) => {
    await Pipe(res, req, UserService.getCertifications(req))
}