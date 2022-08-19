
import { Request, Response } from "express";
import * as GiftServices from '../services/gift.service';
import { Pipe } from "../utils/common";

/**
 * [APP] get Gifts
 * @param req 
 * @param res 
 * @returns 
 */
export const getGifts = async (req: Request, res: Response) => {
    await Pipe(res, req, GiftServices.getGifts(req.query));
}

/**
 * [APP] get Gift Detail
 * @param req 
 * @param res 
 * @returns 
 */
export const getGiftDetail = async (req: Request, res: Response) => {
    await Pipe(res, req, GiftServices.getGiftDetail(req.query));
}

/**
 * [ADMIN] create Gifts
 * @param req 
 * @param res 
 * @returns 
 */
export const createGift = async (req: Request, res: Response) => {
    await Pipe(res, req, GiftServices.createGift(req.body));
}

/**
 * [ADMIN] delete Gifts
 * @param req 
 * @param res 
 * @returns 
 */
export const deleteGift = async (req: Request, res: Response) => {
    await Pipe(res, req, GiftServices.deleteGift(req.query));
}

/**
 * [ADMIN] delete Gifts
 * @param req 
 * @param res 
 * @returns 
 */
 export const deleteGifts = async (req: Request, res: Response) => {
    await Pipe(res, req, GiftServices.deleteGifts(req.body));
}


/**
 * [ADMIN] edit Gifts
 * @param req 
 * @param res 
 * @returns 
 */
export const editGift = async (req: Request, res: Response) => {
    await Pipe(res, req, GiftServices.editGift(req.body));
}

/**
 * [ADMIN] get Gifts
 * @param req 
 * @param res 
 * @returns 
 */
export const getDetail = async (req: Request, res: Response) => {
    await Pipe(res, req, GiftServices.getDetail(req.query));
}

/**
 * [ADMIN] get Gifts
 * @param req 
 * @param res 
 * @returns 
 */
export const getListGift = async (req: Request, res: Response) => {
    await Pipe(res, req, GiftServices.getGiftAdmin(req.query));
}

/**
 * [APP] update total click
 * @param req 
 * @param res 
 * @returns 
 */
export const updateTotalClick = async (req: Request, res: Response) => {
    await Pipe(res, req, GiftServices.updateTotalClick(req.query));
}

/**
 * [APP] update total click
 * @param req 
 * @param res 
 * @returns 
 */
export const searchGiftViaName = async (req: Request, res: Response) => {
    await Pipe(res, req, GiftServices.searchGiftViaName(req.query));
}