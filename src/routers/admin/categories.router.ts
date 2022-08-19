import { Router } from 'express';
import { AuthenticationAdmin, xhrRequired } from '../../utils/common';
import { getCategories } from '../../controllers/categories.controller';

export default (categoriesRouter: Router): void => {
    categoriesRouter.route("/categories/getList")
        .get(xhrRequired, AuthenticationAdmin, getCategories)
}