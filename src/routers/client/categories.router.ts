import { Router } from 'express';
import { AuthenticationClient, xhrRequired } from '../../utils/common';
import { getCategories, getCategoriesFilter, getCategoriesSelectForm, getCategoriesUserProfile } from '../../controllers/categories.controller';
import { validatorGetCate } from '../../validators/categories.validator';

export default (categoriesRouter: Router): void => {
    categoriesRouter.route("/categories/getList")
        .get(xhrRequired, AuthenticationClient, validatorGetCate, getCategories)
    categoriesRouter.route("/categories/filter")
        .get(xhrRequired, AuthenticationClient, getCategoriesFilter)
    categoriesRouter.route("/categories/select-form")
        .get(xhrRequired, AuthenticationClient, getCategoriesSelectForm)
    categoriesRouter.route("/categories/user-profile")
        .get(xhrRequired, AuthenticationClient, getCategoriesUserProfile)
}