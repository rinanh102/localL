import { Router } from 'express';
import { AuthenticationClient, xhrRequired } from '../../utils/common';
import * as ProductController from '../../controllers/product.controller';
import {
    validatorGetProductDetail,
    validatorUpdateTotalClick,
    validatorSearchProductViaName,
    validatorGetFilteredProductsBody,
    validatorGetFilteredProductsParams,
    validatorGetRecomnendProducts,
    validatorGetProductsByPopularSearch,
    validatorGetProductsByPopularSearchAdmin,
    validatorGetRecommedGiftProducts,
    validatorGetProductsByRegion
} from "../../validators/product.validator";

export default (productRouter: Router): void => {
    productRouter.route("/product/detail")
        .get(xhrRequired, AuthenticationClient, validatorGetProductDetail, ProductController.getProductDetail);
    productRouter.route("/product/total-click")
        .get(xhrRequired, AuthenticationClient, validatorUpdateTotalClick, ProductController.updateTotalClick);
    productRouter.route("/products/search-name")
        .get(xhrRequired, AuthenticationClient, validatorSearchProductViaName, ProductController.searchProductByName);
    productRouter.route("/products/recommend")
        .get(xhrRequired, AuthenticationClient, validatorGetRecomnendProducts, ProductController.getRecommendProducts);
    productRouter.route("/products/filtered")
        .post(xhrRequired, AuthenticationClient,
            validatorGetFilteredProductsParams,
            validatorGetFilteredProductsBody, ProductController.getFilteredProducts);
    productRouter.route("/products/popular-search")
        .get(xhrRequired, AuthenticationClient, validatorGetProductsByPopularSearch, ProductController.getProductsByPopularSearch);
    productRouter.route("/products/popular-search-admin")
        .get(xhrRequired, AuthenticationClient, validatorGetProductsByPopularSearchAdmin, ProductController.getProductsByPopularSearchAdmin);
    productRouter.route("/products/recommend-gifts")
        .post(xhrRequired, AuthenticationClient, validatorGetRecommedGiftProducts, ProductController.getRecommnedGiftProducts);
    productRouter.route("/products/region")
        .get(xhrRequired, AuthenticationClient, validatorGetProductsByRegion, ProductController.getProductsByRegion);
}