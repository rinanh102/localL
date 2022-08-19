import { Request, Response } from "express";
import * as SnackService from "../services/snack.service";
import { Pipe } from "../utils/common";

/**
 * [ADMIN] get snacks
 * @param req
 * @param res
 * @returns
 */
export const getSnacks = async (req: Request, res: Response) => {
    await Pipe(res, req, SnackService.getSnacks(req.query))
}

/**
 * [ADMIN] delete snacks
 * @param req
 * @param res
 * @returns
 */
export const deleteSnack = async (req: Request, res: Response) => {
    await Pipe(res, req, SnackService.deleteSnack(req.query))
}

/**
 * [ADMIN] delete snacks
 * @param req
 * @param res
 * @returns
 */
 export const deleteSnacks = async (req: Request, res: Response) => {
    await Pipe(res, req, SnackService.deleteSnacks(req.body))
}


/**
 * [ADMIN] update snacks
 * @param req
 * @param res
 * @returns
 */
export const updateSnack = async (req: Request, res: Response) => {
    await Pipe(res, req, SnackService.updateSnack(req.body))
}

/**
 * [ADMIN] create snacks
 * @param req
 * @param res
 * @returns
 */
export const createSnack = async (req: Request, res: Response) => {
    await Pipe(res, req, SnackService.createSnack(req.body))
}

/**
 * [ADMIN] get snacks
 * @param req
 * @param res
 * @returns
 */
export const getSnack = async (req: Request, res: Response) => {
    await Pipe(res, req, SnackService.getSnack(req.query))
}
