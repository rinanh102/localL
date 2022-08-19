import { Router } from 'express';
import { AuthenticationClient, xhrRequired } from '../../utils/common';
import * as SearchHistoriesController from "../../controllers/searchHistories.controller";
import { validatorDeleteSearchHistory } from "../../validators/searchHistories.validator";

export default (searchHistoyRouter: Router): void => {
    searchHistoyRouter.route("/keywords/search-history")
        .get(xhrRequired, AuthenticationClient, SearchHistoriesController.getRecentSearchHistories);
    searchHistoyRouter.route("/keywords/recent-search")
        .delete(xhrRequired, AuthenticationClient, validatorDeleteSearchHistory, SearchHistoriesController.deleteSearchHistory);
}