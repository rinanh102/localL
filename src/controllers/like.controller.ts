import { Request, Response } from "express";
import * as LikeServices from '../services/like.service';
import { Pipe } from "../utils/common";

/**
 * [APP] update product like
 * @param  {Object} 
 * @returns {Promise}
 */

 export const updateProductLike = async (req: Request, res: Response) => {
    await Pipe(res, req, LikeServices.updateProductLike(req))
}

/**
 * [APP] update review like
 * @param  {Object} 
 * @returns {Promise}
 */

 export const updateReviewLike = async (req: Request, res: Response) => {
    await Pipe(res, req, LikeServices.updateReviewLike(req))
}

/**
 * [APP] update review like
 * @param  {Object} 
 * @returns {Promise}
 */

 export const updateCategoryLike = async (req: Request, res: Response) => {
    await Pipe(res, req, LikeServices.updateCategoryLike(req))
}