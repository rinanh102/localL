
import { FILE_ERRORS, OTHER_ERRORS, USER_ERRORS } from "../utils/errorMessages";
import { uploadFileS3, deleteFileS3 } from "../libs/aws/aws-s3";
import Files from "../models/files.model";
import { FileType, FILE_UPLOAD_LIMIT, FOLDER_S3, IMAGE_UPLOAD_LIMIT, STATUS } from "../utils/const";
import Users from "../models/users.model";
import Sequelize from "sequelize";
const { Op } = Sequelize;

/**
 * USER UPLOAD FILE IN COMMENT
 * @param  {Object} file
 * @returns {Promise}
 */
export const uploadFile = async (req: any) => {
    const { file } = req;
    const { folder } = req.body;
    const userId = req.user.id;

    if (!file) {
        return Promise.reject(FILE_ERRORS.FILE_NOT_FOUND());
    }
    if (!folder || !FOLDER_S3.includes(folder)) {
        return Promise.reject(FILE_ERRORS.FOLDER_NOT_EXIST());
    }

    // Check user
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }

    if (file.size > FILE_UPLOAD_LIMIT) {
        return Promise.reject(OTHER_ERRORS.VALIDATION_ERROR(`File is too big, the file is no more than ${FILE_UPLOAD_LIMIT / 1024 / 1024}MB`))
    }
    const result = await uploadFileS3({ file, folder, userId });
    return Promise.resolve(result);
};
/**
 * USER UPLOAD FILE IN COMMENT
 * @param  {Object} file
 * @returns {Promise}
 */
export const uploadImage = async (req: any) => {
    const { file } = req;
    const { folder } = req.body;
    const userId = req.user.id;

    if (!file) {
        return Promise.reject(FILE_ERRORS.FILE_NOT_FOUND());
    }
    if (!folder || !FOLDER_S3.includes(folder)) {
        return Promise.reject(FILE_ERRORS.FOLDER_NOT_EXIST());
    }

    // Check user
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }

    if (file.size > IMAGE_UPLOAD_LIMIT) {
        return Promise.reject(OTHER_ERRORS.VALIDATION_ERROR(`File is too big, the file is no more than ${IMAGE_UPLOAD_LIMIT / 1024 / 1024}MB`))
    }
    const result = await uploadFileS3({ file, folder, userId });
    return Promise.resolve(result);
};

/**
 * @param  {Object} file
 * @returns {Promise}
 */
export const deleteFile = async (query: any) => {
    const { id } = query;
    const file = await Files.findOne({ where: { id, status: STATUS.ACTIVE } });
    if (!file) {
        return Promise.reject(FILE_ERRORS.FILE_NOT_FOUND());
    }
    await Files.update({ status: STATUS.DELETED }, { where: { id, status: STATUS.ACTIVE } });
    return Promise.resolve({ mesages: "Delete successfully!" });
};

/**
 * @param  {Object} file
 * @returns {Promise}
 */
export const deleteFiles = async () => {
    const files = await Files.findAll({
        where: {
            [Op.or]: [
                {
                    productId: null,
                    bundleId: null,
                    type: {
                        [Op.in]: [
                            FileType.ALCOHOLICS,
                            FileType.PRODUCTS,
                            FileType.THUMBNAILS
                        ]
                    }
                },
                { status: STATUS.DELETED }
            ]
        }
    });
    if (!!files) {
        const fileIds: any[] = [];
        const keys = files.map((item: any) => {
            fileIds.push(item.id);
            if (!!item.key) {
                return { Key: item.key };
            }
        });
        const keyFilters = keys.filter((item: any) => !!item);
        if (!!keyFilters.length) {
            await deleteFileS3(keyFilters);
        }
        await Files.destroy({ where: { id: { [Op.in]: fileIds } } });
    }
    return Promise.resolve({ mesages: "Delete successfully!" });
};

/**
 * @param  {Object} file
 * @returns {Promise}
 */
export const deleteFilesViaAdmin = async (body: any) => {
    const { deleteIds } = body;
    const files = await Files.findAll({ where: { id: { [Op.in]: deleteIds } } });
    if (!!files) {
        const keys = files.map((item: any) => {
            if (!!item.key) {
                return { Key: item.key };
            }
        });
        const keyFilters = keys.filter((item: any) => !!item);
        if (!!keyFilters.length) {
            await deleteFileS3(keyFilters);
        }
    }
    await Files.destroy({ where: { id: { [Op.in]: deleteIds } } });
    return Promise.resolve({ mesages: "Delete successfully!" });
};