import { Request, Response } from "express";
import * as TasteService from "../services/taste.service";
import { Pipe } from "../utils/common";

/**
 * [ADMIN] get tastes
 * @param req
 * @param res
 * @returns
 */
export const getTastes = async (req: Request, res: Response) => {
    await Pipe(res, req.body, TasteService.getTastes());
}
