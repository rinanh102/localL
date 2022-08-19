import { Request, Response } from "express";
import * as KeywordService from "../services/keyword.service";
import { Pipe } from "../utils/common";

/**
 * [ADMIN] create keywords
 * @param req
 * @param res
 * @returns
 */
export const createKeyword = async (req: Request, res: Response) => {
    await Pipe(res, req, KeywordService.createKeyword(req.body));
}

/**
 * [ADMIN] delete keywords
 * @param req
 * @param res
 * @returns
 */
export const deleteKeyword = async (req: Request, res: Response) => {
    await Pipe(res, req, KeywordService.deleteKeyword(req.query));
}

/**
 * [APP] get keywords
 * @param req
 * @param res
 * @returns
 */
export const getPopularKeywords = async (req: Request, res: Response) => {
    await Pipe(res, req, KeywordService.getPopularKeywords());
}