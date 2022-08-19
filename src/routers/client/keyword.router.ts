import { Router } from 'express';
import { AuthenticationClient, xhrRequired } from '../../utils/common';
import * as KeywordController from "../../controllers/keyword.controller";

export default (keywordRouter: Router): void => {
    keywordRouter.route("/keywords/popular")
    .get(xhrRequired,AuthenticationClient, KeywordController.getPopularKeywords)
}