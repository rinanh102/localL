import { Request, Response } from "express";
import * as MemberService from "../services/member.service";
import { Pipe } from "../utils/common";

/**
 * [ADMIN] member quantity management
 * @param req
 * @param res
 * @returns
 */
export const memberQuantity = async (req: Request, res: Response) => {
    await Pipe(res, req, MemberService.memberQuantity(req.query));
}

/**
 * [ADMIN] member quantity management
 * @param req
 * @param res
 * @returns
 */
export const memberAge = async (req: Request, res: Response) => {
    await Pipe(res, req, MemberService.memberAge(req.query));
}

/**
 * [ADMIN] member quantity management
 * @param req
 * @param res
 * @returns
 */
export const memberGender = async (req: Request, res: Response) => {
    await Pipe(res, req, MemberService.memberGender(req.query));
}


/**
 * [ADMIN] member management
 * @param req
 * @param res
 * @returns
 */
export const memberManagement = async (req: Request, res: Response) => {
    await Pipe(res, req, MemberService.memberManagement(req.query));
}

/**
 * [ADMIN] member get detail
 * @param req
 * @param res
 * @returns
 */
export const getDetailMember = async (req: Request, res: Response) => {
    await Pipe(res, req, MemberService.getDetailMember(req.query));
}

/**
 * [ADMIN] member delete
 * @param req
 * @param res
 * @returns
 */
export const deleteMember = async (req: Request, res: Response) => {
    await Pipe(res, req, MemberService.deleteMember(req.query));
}

/**
 * [ADMIN] member delete multiple
 * @param req
 * @param res
 * @returns
 */
export const deleteMembers = async (req: Request, res: Response) => {
    await Pipe(res, req, MemberService.deleteMembers(req.body));
}

/**
 * [ADMIN] member delete multiple
 * @param req
 * @param res
 * @returns
 */
 export const searchMembers = async (req: Request, res: Response) => {
    await Pipe(res, req, MemberService.searchMembers(req.query));
}
