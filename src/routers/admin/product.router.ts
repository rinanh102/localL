import { Router } from 'express';

import { AuthenticationAdmin, xhrRequired } from '../../utils/common';
import { createProduct, searchProductViaName, deleteProduct, editProduct, getListAll, getList, getProductDetailAdmin } from "../../controllers/product.controller";
import { validatorCreateProduct, validatorDeleteProduct, validatorGetProduct, validatorEditProduct, validatorSearchProductViaName, validatorGetProductDetail } from '../../validators/product.validator';

export default (productRouter: Router): void => {
    productRouter.route("/product/create")
        .post(xhrRequired, AuthenticationAdmin, validatorCreateProduct, createProduct);
    productRouter.route("/product/delete")
        .delete(xhrRequired, AuthenticationAdmin, validatorDeleteProduct, deleteProduct);
    productRouter.route("/product/edit")
        .put(xhrRequired, AuthenticationAdmin, validatorEditProduct, editProduct);
    productRouter.route("/product/searchName")
        .get(xhrRequired, AuthenticationAdmin, validatorSearchProductViaName, searchProductViaName);
    productRouter.route("/product/getListAll")
        .get(xhrRequired, AuthenticationAdmin, getListAll);
    productRouter.route("/product/getList")
        .get(xhrRequired, AuthenticationAdmin, validatorGetProduct, getList);
    productRouter.route("/product/getDetail")
        .get(xhrRequired, AuthenticationAdmin, validatorGetProductDetail, getProductDetailAdmin);
}