import { Response } from "express";
import * as FileService from '../services/file.service';
import { Pipe } from "../utils/common";

/**
 * Upload file to S3 [APP, ADMIN]
 * @param req
 * @param ress
 * @returns
 */
export const uploadFile = async (req: any, res: Response) => {
    await Pipe(res, req, FileService.uploadFile(req));
}
/**
 * Upload image to S3 [APP]
 * @param req
 * @param ress
 * @returns
 */
 export const uploadImage = async (req: any, res: Response) => {
    await Pipe(res, req, FileService.uploadImage(req));
}

/**
 * Delete files to S3 [APP, ADMIN]
 * @param req
 * @param ress
 * @returns
 */
export const deleteFile = async (req: any, res: Response) => {
    await Pipe(res, req, FileService.deleteFile(req.query));
}

/**
 * Delete files to S3 [APP, ADMIN]
 * @param req
 * @param ress
 * @returns
 */
 export const deleteFiles = async (req: any, res: Response) => {
    await Pipe(res, req, FileService.deleteFiles());
}

/**
 * Delete files to S3 [APP, ADMIN]
 * @param req
 * @param ress
 * @returns
 */
 export const deleteFilesViaAdmin = async (req: any, res: Response) => {
    await Pipe(res, req, FileService.deleteFilesViaAdmin(req.body));
}

