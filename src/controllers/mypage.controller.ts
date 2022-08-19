import { Request, Response } from "express";
import * as MyPageServices from '../services/mypage.service';
import { Pipe } from "../utils/common";

/**
 * [APP] My like list
 * @param  {Object}
 * @returns {Promise}
 */

 export const getMyLikeList = async (req: Request, res: Response) => {
    await Pipe(res, req, MyPageServices.getMyLikeList(req));
}

/**
 * [APP] My Review list
 * @param  {Object}
 * @returns {Promise}
 */

 export const getMyReviewList = async (req: Request, res: Response) => {
    await Pipe(res, req, MyPageServices.getMyViewList(req));
}

/**
 * [APP] My Detail
 * @param  {Object}
 * @returns {Promise}
 */

 export const getMyDetail = async (req: Request, res: Response) => {
    await Pipe(res, req, MyPageServices.getMyDetail(req));
}


/**
 * [APP] Edit Profile
 * @param  {Object}
 * @returns {Promise}
 */

 export const editProfile = async (req: Request, res: Response) => {
    await Pipe(res, req, MyPageServices.editProfile(req));
}
/**
 * [APP] Update Notification
 * @param  {Object}
 * @returns {Promise}
 */

 export const updateNotification = async (req: Request, res: Response) => {
    await Pipe(res, req, MyPageServices.updateNotification(req));
}