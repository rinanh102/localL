import { Request, Response } from "express";
import * as ReviewServices from "../services/review.service";
import { Pipe } from "../utils/common";

/**
 * [App] get reviews of product 
 * @param req
 * @param res
 * @returns
 */
export const getReviewsOfProduct = async (req: Request, res: Response) => {
    await Pipe(res, req, ReviewServices.getReviewsOfProduct(req));
}

/**
 * [App] get all reviews of product 
 * @param req
 * @param res
 * @returns
 */
export const getAllReviewsOfProduct = async (req: Request, res: Response) => {
    await Pipe(res, req, ReviewServices.getAllReviewsOfProduct(req));
}
/**
* [APP] create review
* @param  {Object} 
* @returns {Promise}
*/
export const createReview = async (req: Request, res: Response) => {
    await Pipe(res, req, ReviewServices.createReview(req));
}

/**
 * [ADMIN] delete review
 * @param req
 * @param res
 * @returns
 */
export const deleteReview = async (req: Request, res: Response) => {
    await Pipe(res, req, ReviewServices.deleteReview(req.query));
}

/**
 * [ADMIN] delete review
 * @param req
 * @param res
 * @returns
 */
export const getDetailReview = async (req: Request, res: Response) => {
    await Pipe(res, req, ReviewServices.getDetailReview(req.query));
}

/**
 * [ADMIN] delete reviews
 * @param req
 * @param res
 * @returns
 */
export const deleteReviews = async (req: Request, res: Response) => {
    await Pipe(res, req, ReviewServices.deleteReviews(req.body));
}

/**
 * [ADMIN] get reviews of product 
 * @param req
 * @param res
 * @returns
 */
export const getReviewsOfProductAdmin = async (req: Request, res: Response) => {
    await Pipe(res, req, ReviewServices.getReviewsOfProductAdmin(req));
}