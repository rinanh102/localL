import { Request, Response } from "express";
import * as BannerService from "../services/banner.service";
import { Pipe } from "../utils/common";

/**
 * [APP] get title
 * @param req
 * @param res
 * @returns
 */
export const getTitle = async (req: Request, res: Response) => {
    await Pipe(res, req, BannerService.getTitle())
}

/**
 * [APP] get banners
 * @param req
 * @param res
 * @returns
 */
export const getBanners = async (req: Request, res: Response) => {
    await Pipe(res, req, BannerService.getBanners(req.query))
}

/**
 * [ADMIN] get banners
 * @param req
 * @param res
 * @returns
 */
export const getBannerAdmin = async (req: Request, res: Response) => {
    await Pipe(res, req, BannerService.getBannerAdmin(req.query))
}

/**
 * [ADMIN] update banners SEARCH
 * @param req
 * @param res
 * @returns
 */
export const updateBannerAdmin = async (req: Request, res: Response) => {
    await Pipe(res, req, BannerService.updateBannerAdmin(req.query, req.body))
}
