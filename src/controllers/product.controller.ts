
import { Request, Response } from "express";
import * as response from "../utils/response";
import { OTHER_ERRORS } from "../utils/errorMessages";
import { HttpStatusCode } from "../utils/const";
import * as ProductServices from '../services/product.service';
import * as ProductValidate from '../validators/product.validator';
import { Pipe } from "../utils/common";

/**
 * [ADMIN] create products
 * @param req 
 * @param res 
 * @returns 
 */
export const createProduct = async (req: Request, res: Response) => {
    await Pipe(res, req, ProductServices.createProduct(req.body));
}

/**
 * [ADMIN] delete products
 * @param req
 * @param res
 * @returns
 */
export const deleteProduct = async (req: Request, res: Response) => {
    await Pipe(res, req, ProductServices.deleteProduct(req.query));
}

/**
 * [ADMIN] edit products
 * @param req 
 * @param res 
 * @returns 
 */
export const editProduct = async (req: Request, res: Response) => {
    await Pipe(res, req, ProductServices.editProduct(req.body));
}

/**
 * [ADMIN] create products
 * @param req 
 * @param res 
 * @returns 
 */
export const searchProductViaName = async (req: Request, res: Response) => {
    await Pipe(res, req, ProductServices.searchProductViaName(req.query));
}

/**
 * [ADMIN] get list products
 * @param req
 * @param res
 * @returns
 */
export const getListAll = async (req: Request, res: Response) => {
    await Pipe(res, req, ProductServices.getListAll());
}

/**
 * [ADMIN] get list products
 * @param req
 * @param res
 * @returns
 */
export const getList = async (req: Request, res: Response) => {
    await Pipe(res, req, ProductServices.getList(req.query));
}
/**
 * [APP] get list recommend products 
 * @param req
 * @param res
 * @returns
 */
export const getRecommendProducts = async (req: Request, res: Response) => {
    await Pipe(res, req, ProductServices.getRecommendProducts(req));
}

/**
 * [APP] get list product detail
 * @param req
 * @param res
 * @returns
 */
export const getProductDetail = async (req: Request, res: Response) => {
    await Pipe(res, req, ProductServices.getProductDetail(req));
}

/**
 * [ADMIN] get list product detail
 * @param req
 * @param res
 * @returns
 */
export const getProductDetailAdmin = async (req: Request, res: Response) => {
    await Pipe(res, req, ProductServices.getProductDetailAdmin(req.query));
}
/**
 * [APP] update Total Click
 * @param req
 * @param res
 * @returns
 */
export const updateTotalClick = async (req: Request, res: Response) => {
    await Pipe(res, req, ProductServices.updateTotalClick(req.query));
}

/**
 * [APP] search products by name/ company
 * @param req 
 * @param res 
 * @returns 
 */
export const searchProductByName = async (req: Request, res: Response) => {
        await Pipe(res, req, ProductServices.searchProductByName(req));
}

/**
 * [APP] get list filtered products 
 * @param req
 * @param res
 * @returns
 */
export const getFilteredProducts = async (req: Request, res: Response) => {
    await Pipe(res, req, ProductServices.getFilteredProducts(req));
}
/**
 * [APP] get list recommend gift product
 * @param req
 * @param res
 * @returns
 */
export const getRecommnedGiftProducts = async (req: Request, res: Response) => {
    await Pipe(res, req, ProductServices.getRecommnedGiftProducts(req));
}

/**
 * [APP] get list  products by popular keywords
 * @param req
 * @param res
 * @returns
 */
export const getProductsByPopularSearch = async (req: Request, res: Response) => {
    await Pipe(res, req, ProductServices.getProductsByPopularSearch(req));
}

/**
 * [APP] get list  products by popular keywords Admin
 * @param req
 * @param res
 * @returns
 */
export const getProductsByPopularSearchAdmin = async (req: Request, res: Response) => {
    await Pipe(res, req, ProductServices.getProductsByPopularSearchAdmin(req));
}
/**
 * [APP] get list  products by region
 * @param req
 * @param res
 * @returns
 */
 export const getProductsByRegion = async (req: Request, res: Response) => {
    await Pipe(res, req, ProductServices.getProductsByRegion(req));
}