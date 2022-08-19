import { Request, Response } from "express";
import * as SearchHistoriesService from "../services/searchHistory.service";
import { Pipe } from "../utils/common";

/**
 * [APP] get recent search histories
 * @param req
 * @param res
 * @returns
 */
 export const getRecentSearchHistories = async (req: Request, res: Response) => {
    await Pipe(res, req,  SearchHistoriesService.getRecentSearchHistories(req));
}

/**
 * [APP] delete search history
 * @param req
 * @param res
 * @returns
 */
 export const deleteSearchHistory = async (req: Request, res: Response) => {
    await Pipe(res, req,  SearchHistoriesService.deleteSearchHistory(req));
}