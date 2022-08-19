
import { Request, Response } from "express";
import * as DashboardServices from '../services/dashboard.service';
import { Pipe } from "../utils/common";

/**
 * [ADMIN] member graphs
 * @param req 
 * @param res 
 * @returns 
 */
export const getMemberGraphs = async (req: Request, res: Response) => {
    await Pipe(res, req, DashboardServices.getMemberGraphs(req.query));
}

/**
 * [ADMIN] reviews
 * @param req 
 * @param res 
 * @returns 
 */
export const getReviews = async (req: Request, res: Response) => {
    await Pipe(res, req, DashboardServices.getReviews());
}

/**
 * [ADMIN] reviews
 * @param req 
 * @param res 
 * @returns 
 */
 export const getGifts = async (req: Request, res: Response) => {
    await Pipe(res, req, DashboardServices.getGifts());
}

/**
 * [ADMIN] reviews
 * @param req
 * @param res
 * @returns
 */
 export const getProducts = async (req: Request, res: Response) => {
    await Pipe(res, req, DashboardServices.getProducts());
}

/**
 * [ADMIN] reviews
 * @param req
 * @param res
 * @returns
 */
 export const searchDashBoard = async (req: Request, res: Response) => {
    await Pipe(res, req, DashboardServices.searchDashBoard(req.query));
}
