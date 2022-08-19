import Joi from "joi";
import * as response from "../utils/response";
import { OTHER_ERRORS } from "../utils/errorMessages";
import { HttpStatusCode } from "../utils/const";


const validatorCreateProductSchema = Joi.object({
    title: Joi.string().required(),
    thumbnail: Joi.array().items(Joi.number()).min(1).max(4).required(),
    description: Joi.string().required(),
    keywords: Joi.array().items(Joi.object({
        keywordId: Joi.number().required(),
        highlight: Joi.boolean().required()
    })).required(), tastes: Joi.array().items(Joi.object({
        id: Joi.number(),
        score: Joi.number()
    })).min(6).required(),
    snacks: Joi.array().items(Joi.object({
        id: Joi.number(),
        content: Joi.string()
    })).required(),
    region: Joi.number().required(),
    district: Joi.number().required(),
    brewery: Joi.string().required(),
    categories: Joi.array().items(Joi.number()).required(),
    concentration: Joi.number().required(),
    price: Joi.number().required(),
    discount: Joi.number().required(),
    images: Joi.array().items(Joi.number()).min(1).max(5).required(),
    url: Joi.string().required()
});

export const validatorCreateProduct = (req: any, res: any, next: any) => {
    const validateUser = validatorCreateProductSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorSearchProductViaNameSchema = Joi.object({
    name: Joi.string().required(),
    limit: Joi.number().integer().min(1).required(),
    offset: Joi.number().integer().min(1).required(),
});

export const validatorSearchProductViaName = (req: any, res: any, next: any) => {
    const validateUser = validatorSearchProductViaNameSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorEditProductSchema = Joi.object({
    productId: Joi.number().required(),
    title: Joi.string().required(),
    thumbnail: Joi.array().items(Joi.number()).min(1).max(4).required(),
    description: Joi.string().required(),
    keywords: Joi.array().items(Joi.object({
        keywordId: Joi.number().required(),
        highlight: Joi.boolean().required()
    })).required(),
    tastes: Joi.array().items(Joi.object({
        id: Joi.number(),
        score: Joi.number()
    })).min(6).required(),
    snacks: Joi.array().items(Joi.object({
        id: Joi.number(),
        content: Joi.string()
    })).required(),
    region: Joi.number().required(),
    district: Joi.number().required(),
    brewery: Joi.string().required(),
    categories: Joi.array().items(Joi.number()).required(),
    concentration: Joi.number().required(),
    price: Joi.number().required(),
    discount: Joi.number().required(),
    images: Joi.array().items(Joi.number()).min(1).max(5).required(),
    url: Joi.string().required()
});

export const validatorEditProduct = (req: any, res: any, next: any) => {
    const validateUser = validatorEditProductSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}


const validatorDeleteProductSchema = Joi.object({
    productId: Joi.string().required()
});

export const validatorDeleteProduct = (req: any, res: any, next: any) => {
    const validateUser = validatorDeleteProductSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorGetProductSchema = Joi.object({
    name: Joi.allow(null, ''),
    limit: Joi.number().integer().min(1).required(),
    offset: Joi.number().integer().min(1).required(),
    order: Joi.string().valid("ASC", "DESC").required(),
});

export const validatorGetProduct = (req: any, res: any, next: any) => {
    const validateUser = validatorGetProductSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorGetRecomnendProductsSchema = Joi.object({
    limit: Joi.number().integer().min(1).required(),
    offset: Joi.number().integer().min(1).required(),
    order: Joi.string().valid("ASC", "DESC").required(),
    filter: Joi.string().valid("totalLike", "createdAt", "price").required()
});

export const validatorGetRecomnendProducts = (req: any, res: any, next: any) => {
    const validateUser = validatorGetRecomnendProductsSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorGetRecommedGiftProductsSchema = Joi.object({
    categoryIds: Joi.array().items(Joi.number()).required(),
    ageIds: Joi.array().items(Joi.number()).required(),
    typeIds: Joi.array().items(Joi.number()).required(),
    concentrationIds: Joi.array().items(Joi.number()).required(),
    limit: Joi.number().integer().min(1).required(),
    offset: Joi.number().integer().min(1).required(),

});

export const validatorGetRecommedGiftProducts = (req: any, res: any, next: any) => {
    const validateUser = validatorGetRecommedGiftProductsSchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorGetFilteredProductsParamsSchema = Joi.object({
    limit: Joi.number().integer().min(1).required(),
    offset: Joi.number().integer().min(1).required(),
    order: Joi.string().valid("ASC", "DESC"),
    filter: Joi.string().valid("totalLike", "createdAt", "discountPrice").required()
});

export const validatorGetFilteredProductsParams = (req: any, res: any, next: any) => {
    const validateUser = validatorGetFilteredProductsParamsSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorGetFilteredProductsBodySchema = Joi.object({
    categoryIds: Joi.array().items(Joi.number()).required(),
    priceIds: Joi.array().items(Joi.number()).required(),
    concentrationIds: Joi.array().items(Joi.number()).required(),
});

export const validatorGetFilteredProductsBody = (req: any, res: any, next: any) => {
    const validateUser = validatorGetFilteredProductsBodySchema.validate(req.body);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorGetProductsByPopularSearchSchema = Joi.object({
    keywordId: Joi.number().required(),
    limit: Joi.number().integer().min(1).required(),
    offset: Joi.number().integer().min(1).required(),

});

export const validatorGetProductsByPopularSearch = (req: any, res: any, next: any) => {
    const validateUser = validatorGetProductsByPopularSearchSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorGetProductsByPopularSearchAdminSchema = Joi.object({
    keywordId: Joi.number().required(),
    limit: Joi.number().integer().min(1).required(),
    offset: Joi.number().integer().min(1).required(),

});

export const validatorGetProductsByPopularSearchAdmin = (req: any, res: any, next: any) => {
    const validateUser = validatorGetProductsByPopularSearchAdminSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorGetProductDetailSchema = Joi.object({
    id: Joi.string().required()
});

export const validatorGetProductDetail = (req: any, res: any, next: any) => {
    const validateUser = validatorGetProductDetailSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorUpdateTotalClickSchema = Joi.object({
    id: Joi.string().required()
});

export const validatorUpdateTotalClick = (req: any, res: any, next: any) => {
    const validateUser = validatorUpdateTotalClickSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}

const validatorGetProductsByRegionSchema = Joi.object({
    regionId: Joi.number().required(),
    limit: Joi.number().integer().min(1).required(),
    offset: Joi.number().integer().min(1).required(),

});
export const validatorGetProductsByRegion = (req: any, res: any, next: any) => {
    const validateUser = validatorGetProductsByRegionSchema.validate(req.query);
    if (validateUser.error) {
        return response.error(res, req, OTHER_ERRORS.VALIDATION_ERROR(validateUser.error), HttpStatusCode.BAD_REQUEST);
    }
    next();
}