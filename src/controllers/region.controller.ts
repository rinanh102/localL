import { Request, Response } from "express";
import * as RegionService from "../services/region.service";
import { Pipe } from "../utils/common";

/**
 * [ADMIN] get regions
 * @param req
 * @param res
 * @returns
 */
export const getRegions = async (req: Request, res: Response) => {
    await Pipe(res, req, RegionService.getRegions());
}

/**
 * [APP] get district
 * @param req
 * @param res
 * @returns
 */
 export const getDistrictsOfRegion = async (req: Request, res: Response) => {
    await Pipe(res, req, RegionService.getDistrictsOfRegion(req.query));
}

/**
 * [ADMIN] get regions
 * @param req
 * @param res
 * @returns
 */
 export const getCities = async (req: Request, res: Response) => {
    await Pipe(res, req, RegionService.getCities());
}

/**
 * [ADMIN] get regions
 * @param req
 * @param res
 * @returns
 */
 export const getDistricts = async (req: Request, res: Response) => {
    await Pipe(res, req, RegionService.getDistricts(req.query));
}