import Onboardings from "../models/onboardings.model";
import { FileType, STATUS } from "../utils/const";
import Files from "../models/files.model";

/**
 * [APP] get onboardings
 * @param  {Object}
 * @returns {Promise}
 */
export const getOnboardings = async () => {
    const onboardings = await Onboardings.findAll({
        where: {
            status: STATUS.ACTIVE
        },
        include: ['imageUrl'],
        limit: 3
    })
    const splash = await Files.findOne({ where: { type: FileType.SPLASHS, status: STATUS.ACTIVE } });
    const result = onboardings.map(data => data.toDataOnboardings());
    return Promise.resolve({
        onboardings: result,
        splash: splash && splash.toFileDataUrl()
    });
}

/**
 * [ADMIN] get onboardings ADMIN
 * @param  {Object}
 * @returns {Promise}
 */

export const getOnboardingAdmin = async () => {
    const onboardings = await Onboardings.findAll({
        where: {
            status: STATUS.ACTIVE
        },
        include: ['imageUrl'],
        limit: 3
    })
    const splash = await Files.findOne({ where: { type: FileType.SPLASHS, status: STATUS.ACTIVE } })
    const result = onboardings.map(data => data.toDataOnboardingAdmin());
    return Promise.resolve({
        onboardings: result,
        splash: !!splash ? splash.toSplashImage() : null
    });
};

/**
 * [ADMIN] get onboardings ADMIN
 * @param  {Object}
 * @returns {Promise}
 */

export const updateOnboarding = async (body: any) => {
    const { onboardings } = body;
    const progress = [];
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < onboardings.length; index++) {
        const { id, image } = onboardings[index]
        progress.push(Onboardings.update({ image }, { where: { id, status: STATUS.ACTIVE } }))
    }
    await Promise.all(progress);
    return Promise.resolve({ mesages: "Update successfully!" });
}