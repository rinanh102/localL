import { Response } from "express";
import * as CategoriesService from '../services/categories.service';
import { Pipe } from "../utils/common";

/**
 * [APP] get categories
 * @param req
 * @param res
 * @returns
 */
export const getCategories = async (req: any, res: Response) => {
    await Pipe(res, req, CategoriesService.getCategories(req.query));
}

/**
 * [APP] get categories Tab
 * @param req
 * @param res
 * @returns
 */
export const getCategoriesFilter = async (req: any, res: Response) => {
    await Pipe(res, req, CategoriesService.getCategoriesFilter());
}

/**
 * [APP] get categories Select form
 * @param req
 * @param res
 * @returns
 */
export const getCategoriesSelectForm = async (req: any, res: Response) => {
    await Pipe(res, req, CategoriesService.getCategoriesSelectForm());
}

/**
 * [APP] get categories user profile
 * @param req
 * @param res
 * @returns
 */
 export const getCategoriesUserProfile = async (req: any, res: Response) => {
    await Pipe(res, req, CategoriesService.getCategoriesUserProfile());
}
