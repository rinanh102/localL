import BCRYPT from "bcrypt";
import Users from "../models/users.model";
import { AUTHENTICATION_ERRORS, USER_ERRORS, DEVICE_SESSION_ERRORS } from "../utils/errorMessages";
import { ROLE_USER, STATUS, CONFIG, HttpStatusCode, USER_STATUS } from "../utils/const";
import { generateAccessToken, generateRefreshToken, generateRefreshTokenAdmin, generateAccessTokenAdmin } from "../utils/common";
import UserSettings from "../models/userSettings.model";
import JWT from "jsonwebtoken";
import * as response from "../utils/response";
import DeviceSessions from "../models/deviceSession.model";
import fetch from 'node-fetch';
import Sequelize from "sequelize";
const { Op } = Sequelize;
/**
 * [APP] login with email
 * @param req
 * @param res
 * @returns
 */
export const loginWithEmail = async (req: any) => {
    const { email, password, deviceToken } = req.body;

    const deviceSession = await DeviceSessions.findOne({ where: { deviceToken, status: STATUS.ACTIVE } })
    if (deviceSession) {
        return Promise.reject(DEVICE_SESSION_ERRORS.DEVICE_SESSION_EXIST());
    }

    const user = await Users.findOne({ where: { email, status: STATUS.ACTIVE }, include: ['avatarUrl'] });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }

    const passwordCorrect = await BCRYPT.compareSync(password, user.password);
    if (!passwordCorrect) {
        return Promise.reject(USER_ERRORS.PASSWORD_INCORRECT());
    }

    const accessToken = await generateAccessToken(user, deviceToken);
    const refreshToken = await generateRefreshToken(user, deviceToken);

    await DeviceSessions.create({ userId: user.id, deviceToken });

    return Promise.resolve({
        userInfo: user.toUser(),
        accessToken,
        refreshToken
    });
}

/**
 * [APP] signup with email
 * @param req
 * @param res
 * @returns
 */
export const verifyProfileSignup = async (body: any) => {
    const { email, nickname, name, password, dateOfBirth, phoneNumber, age, gender } = body;

    const checkEmail = await Users.findOne({ where: { email, status: STATUS.ACTIVE } });
    if (checkEmail) {
        return Promise.reject(USER_ERRORS.USER_ALREADY_EXIST());
    }

    const checkNickname = await Users.findOne({ where: { nickname, status: STATUS.ACTIVE } });
    if (checkNickname) {
        return Promise.reject(USER_ERRORS.NICKNAME_ALREADY_EXIST());
    }

    const checkPhoneNumber = await Users.findOne({ where: { phoneNumber, status: STATUS.ACTIVE } });
    if (checkPhoneNumber) {
        return Promise.reject(USER_ERRORS.PHONE_ALREADY_EXIST());
    }

    const userBody = {
        email,
        nickname,
        name,
        password,
        dateOfBirth,
        phoneNumber,
        age,
        gender,
        setting: {},
        role: ROLE_USER.USER
    };
    return Promise.resolve(userBody);
}


/**
 * [APP] signup with email
 * @param req
 * @param res
 * @returns
 */
export const loginWithCIEmail = async (body: any) => {
    const { email, nickname, name, password, dateOfBirth, phoneNumber, age, gender, deviceToken, CI_value } = body;

    const userBody = Object.fromEntries(Object.entries({ email, nickname, name, dateOfBirth, phoneNumber, age, gender, CI_value }).filter(([_, v]) => v != null));

    const salt = await BCRYPT.genSalt(10);
    const hashedPassword = await BCRYPT.hash(password, salt);

    const checkUserCI = await Users.findOne({
        where: {
            CI_value,
            status: STATUS.ACTIVE
        }
    });

    if (checkUserCI) {
        const accessToken = await generateAccessToken(checkUserCI, deviceToken);
        const refreshToken = await generateRefreshToken(checkUserCI, deviceToken);

        await checkUserCI.update({ ...userBody, password: hashedPassword });
        await DeviceSessions.create({ userId: checkUserCI.id, deviceToken });

        return Promise.resolve({
            name: checkUserCI.name || '',
            accessToken,
            refreshToken
        });
    }

    const newBody = { ...userBody, password: hashedPassword, setting: {} }

    const newUser = await Users.create(newBody, {
        include: [
            {
                model: UserSettings,
                as: 'setting'
            }
        ]
    })

    const accessToken = await generateAccessToken(newUser, deviceToken);
    const refreshToken = await generateRefreshToken(newUser, deviceToken);
    await DeviceSessions.create({ userId: newUser.id, deviceToken });
    return Promise.resolve({
        name: newUser.name,
        accessToken,
        refreshToken
    });
}

/**
 * [APP] reset password
 * @param req
 * @param res
 * @returns
 */
export const resetPassword = async (body: any) => {
    const { email, password } = body;
    const user = await Users.findOne({ where: { email, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.EMAIL_DOESNT_EXIST());
    }

    const salt = await BCRYPT.genSalt(10);
    const hashedPassword = await BCRYPT.hash(password, salt);

    const update = Object.assign({}, { password: hashedPassword });

    await Users.update(update, { where: { email, status: STATUS.ACTIVE } });
    return Promise.resolve({ mesages: "Update successfully!" });
}
/**
 * [APP] change password
 * @param req
 * @param res
 * @returns
 */
export const changePassword = async (req: any) => {
    const { password, newPassword } = req.body;
    const userId = req.user.id
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    const validPassword = await BCRYPT.compare(password, user.password);

    if (!validPassword) {
        return Promise.reject(USER_ERRORS.WRONG_PASSWORD());
    }

    const salt = await BCRYPT.genSalt(10);
    const hashedPassword = await BCRYPT.hash(newPassword, salt);

    //const update = Object.assign({}, { password: hashedPassword });

    await Users.update({ password: hashedPassword }, { where: { id: user.id, status: STATUS.ACTIVE } });
    return Promise.resolve({ mesages: "Change password successfully!" });
}

/**
 * [APP] login with social
 * @param req
 * @param res
 * @returns
 */
export const loginWithSocial = async (req: any) => {

    const { id, type, deviceToken } = req.body;

    const social = type === 'APPLE' ? { appleId: id } : { kakaoId: id };

    const checkUser = await Users.findOne({
        where: {
            [Op.or]: [
                {
                    kakaoId: id,
                    status: STATUS.ACTIVE
                },
                {
                    appleId: id,
                    status: STATUS.ACTIVE
                }
            ]
        }
    });

    if (checkUser) {
        // CI exists
        const { CI_value } = checkUser;
        if (CI_value) {
            const accessToken = await generateAccessToken(checkUser, deviceToken);
            const refreshToken = await generateRefreshToken(checkUser, deviceToken);

            await checkUser.update({ ...social })

            await DeviceSessions.create({ userId: checkUser.id, deviceToken });

            return Promise.resolve({
                name: checkUser.name,
                accessToken,
                refreshToken
            })
        }
        return Promise.resolve({ isCheckCI: false, ...social });
    }
    return Promise.resolve({ isCheckCI: false, ...social });
}

/**
 * [APP] login with social
 * @param req
 * @param res
 * @returns
 */
export const loginWithCI = async (req: any) => {

    const { age, gender, dateOfBirth, CI_value, kakaoId, appleId, deviceToken } = req.body;

    const deviceSession = await DeviceSessions.findOne({ where: { deviceToken, status: STATUS.ACTIVE } })
    if (deviceSession) {
        return Promise.reject(DEVICE_SESSION_ERRORS.DEVICE_SESSION_EXIST());
    }

    const userBody = Object.fromEntries(Object.entries({ age, gender, dateOfBirth, CI_value, kakaoId, appleId }).filter(([_, v]) => v != null));

    const checkUserCI = await Users.findOne({
        where: {
            CI_value,
            status: STATUS.ACTIVE
        }
    });

    if (checkUserCI) {
        const accessToken = await generateAccessToken(checkUserCI, deviceToken);
        const refreshToken = await generateRefreshToken(checkUserCI, deviceToken);

        await checkUserCI.update(userBody);
        await DeviceSessions.create({ userId: checkUserCI.id, deviceToken });

        return Promise.resolve({
            name: checkUserCI.name || '',
            accessToken,
            refreshToken
        });
    }

    const where = Object.fromEntries(Object.entries({ appleId, kakaoId }).filter(([_, v]) => v != null));

    const checkUser = await Users.findOne({
        where: {
            ...where,
            status: STATUS.ACTIVE
        }
    });

    if (checkUser) {
        const accessToken = await generateAccessToken(checkUser, deviceToken);
        const refreshToken = await generateRefreshToken(checkUser, deviceToken);

        await checkUser.update(userBody);
        await DeviceSessions.create({ userId: checkUser.id, deviceToken });

        return Promise.resolve({
            name: checkUser.name,
            accessToken,
            refreshToken
        });
    }

    const newBody = { ...userBody, setting: {} }

    const newUser = await Users.create(newBody, {
        include: [
            {
                model: UserSettings,
                as: 'setting'
            }
        ]
    })

    const accessToken = await generateAccessToken(newUser, deviceToken);
    const refreshToken = await generateRefreshToken(newUser, deviceToken);
    await DeviceSessions.create({ userId: newUser.id, deviceToken });
    return Promise.resolve({
        name: newUser.name,
        accessToken,
        refreshToken
    });
}

/**
 * [APP] verify if CI_value in use
 * @param req
 * @param res
 * @returns
 */
export const verifyCIvalue = async (body: any) => {
    const { CI_value } = body;
    const user = await Users.findOne({ where: { CI_value, status: STATUS.ACTIVE } });
    if (user) {
        return Promise.resolve({
            isExist: 1,
            // type: user.type,
            message: USER_ERRORS.CIVALUE_IN_USE().message,
        })
    }
    return Promise.resolve({
        isExist: 0,
        message: "CI_value is not in use"
    })
}

/**
 * [APP] verify if nickname in use
 * @param req
 * @param res
 * @returns
 */
export const verifyNickname = async (body: any) => {
    const { nickname } = body;
    const user = await Users.findOne({ where: { nickname, status: STATUS.ACTIVE } });
    if (user) {
        return Promise.reject(USER_ERRORS.NICKNAME_ALREADY_EXIST());
    }
    return Promise.resolve({
        message: "Nickname is available"
    })
}

/**
 * [APP] verify if phone number in use
 * @param req
 * @param res
 * @returns
 */
export const verifyPhoneNumber = async (body: any) => {
    const { phoneNumber } = body;
    const user = await Users.findOne({ where: { phoneNumber, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.PHONE_DOESNT_EXIST());
    }
    const result = user.toUserData();
    return Promise.resolve(result);
}

/**
 * [APP] verify if email in use
 * @param req
 * @param res
 * @returns
 */
export const verifyEmail = async (body: any) => {
    const { email } = body;
    const user = await Users.findOne({ where: { email, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.resolve({
            isExist: 0,
            message: USER_ERRORS.EMAIL_DOESNT_EXIST().message
        })
    }
    return Promise.resolve({
        isExist: 1,
        message: USER_ERRORS.EMAIL_ALREADY_EXIST().message
    })
}

/**
 * [ADMIN] login with email
 * @param req
 * @param res
 * @returns
 */
export const loginWithEmailAdmin = async (body: any) => {
    const { email, password } = body;
    const user = await Users.findOne({ where: { email, status: STATUS.ACTIVE, role: ROLE_USER.ADMIN }, include: ['avatarUrl'] });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    const passwordCorrect = await BCRYPT.compareSync(password, user.password);
    if (!passwordCorrect) {
        return Promise.reject(USER_ERRORS.PASSWORD_INCORRECT());
    }
    const accessToken = await generateAccessTokenAdmin(user);
    const refreshToken = await generateRefreshTokenAdmin(user);
    return Promise.resolve({
        userInfo: user.toUser(),
        accessToken,
        refreshToken
    });
}

/**
 * [APP] renew token
 * @param req
 * @param res
 * @returns
 */
export const renewAccessToken = async (req: any, res: any, body: any) => {
    const { refreshToken, deviceToken } = body;
    let accessToken: any;
    if (refreshToken) {
        await JWT.verify(refreshToken, CONFIG.REFRESH_TOKEN_SECRET, async (error: any, decoded: any) => {
            if (error) {
                return response.error(res, req, AUTHENTICATION_ERRORS.TOKEN_EXPIRED_OR_NOT_AVAILABLE(error), HttpStatusCode.FORBIDDEN);
            } else {
                const user = {} as any;
                user.id = decoded.id;
                user.role = decoded.role;
                accessToken = await generateAccessToken(user, deviceToken);
            }
        });
        return Promise.resolve({
            accessToken
        });
    } else {
        return response.error(res, req, AUTHENTICATION_ERRORS.TOKEN_EXPIRED_OR_NOT_AVAILABLE(), HttpStatusCode.FORBIDDEN);
    }

}
/**
 * [APP] logout
 * @param req
 * @param res
 * @returns
 */
export const logout = async (req: any) => {
    const deviceToken = req.user.deviceToken;
    const userId = req.user.id
    const user = await Users.findOne({ where: { id: userId, status: STATUS.ACTIVE } });
    if (!user) {
        return Promise.reject(USER_ERRORS.USER_NOT_FOUND());
    }
    const deviceSession = await DeviceSessions.findOne({ where: { userId, deviceToken, status: STATUS.ACTIVE } })
    if (!deviceSession) {
        return Promise.reject(DEVICE_SESSION_ERRORS.DEVICE_SESSION_NOT_FOUND());
    }
    await DeviceSessions.destroy({ where: { userId, deviceToken, status: STATUS.ACTIVE } })
    return Promise.resolve({
        message: "Logout successfully"
    });
}

/**
 * [APP] iamport get token and user's certifications
 * @param req
 * @param res
 * @returns
 */
const getIamportToken = async () => {
    try {
        const body: any = {
            imp_key: CONFIG.IMP_KEY,
            imp_secret: CONFIG.IMP_SECRET
        }
        const response = await fetch(CONFIG.IAMPORT_TOKEN_URL, {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        const { access_token } = result.response;
        if (access_token) {
            return access_token;
        }
    } catch (e: any) {
        return null;
    }
    return null;
}

export const getCertifications = async (req: any) => {
    try {
        const { uid } = req.body;
        const accessToken = await getIamportToken();
        if (accessToken) {
            const getCertificationUrl = `${CONFIG.IAMPORT_CERTIFICATION_URL}${uid}?_token=${accessToken}`;
            const response = await fetch(getCertificationUrl);
            const data = await response.json();
            const { birthday, gender, unique_key } = data.response
            return Promise.resolve({
                birthday,
                gender,
                unique_key
            });
        }
    } catch (e: any) {
        return Promise.reject(AUTHENTICATION_ERRORS.IAMTOKEN_NOTFOUND());
    }
    return Promise.reject(AUTHENTICATION_ERRORS.IAMTOKEN_NOTFOUND());
}

export const loginViaCIValue = async (req: any) => {
    try {
        const { uid } = req.body;
        const accessToken = await getIamportToken();
        if (accessToken) {
            const getCertificationUrl = `${CONFIG.IAMPORT_CERTIFICATION_URL}${uid}?_token=${accessToken}`;
            const response = await fetch(getCertificationUrl);
            const data = await response.json();
            const { birthday, gender, unique_key } = data.response
            return Promise.resolve({
                birthday,
                gender,
                unique_key
            });
        }
    } catch (e: any) {
        return Promise.reject(AUTHENTICATION_ERRORS.IAMTOKEN_NOTFOUND());
    }
    return Promise.reject(AUTHENTICATION_ERRORS.IAMTOKEN_NOTFOUND());
}