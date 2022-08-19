
const _errorFormatter = (error: any, defaultError: any) => {
    function errorConverter(error: any) {
        if (typeof error !== "string") {
            return JSON.stringify(error);
        }
        return error || null;
    }
    return {
        message: errorConverter(error) || defaultError,
    };
}

export const OTHER_ERRORS = {
    UNKNOWN: (error: any) => {
        return _errorFormatter(
            error ? error.message : null || error,
            `Unknown error`,
        );
    },
    VALIDATION_ERROR: (error: any) => {
        let errorDetail = null;
        if (error && error.details && error.details[0]) {
            errorDetail = error.details[0]?.message;
        }
        return _errorFormatter(errorDetail || error, 'Failed to validate request queries');
    }
};

export const USER_ERRORS = {
    EMAIL_ALREADY_EXIST: (error?: any) => { return _errorFormatter(error, `이미 존재하는 이메일입니다.`) },
    EMAIL_DOESNT_EXIST: (error?: any) => { return _errorFormatter(error, `존재하지 않는 이메일입니다.`) },
    NICKNAME_ALREADY_EXIST: (error?: any) => { return _errorFormatter(error, `이미 사용중인 닉네임입니다.`) },
    PHONE_ALREADY_EXIST: (error?: any) => { return _errorFormatter(error, `이미 사용중인 번호입니다.`) },
    PHONE_DOESNT_EXIST: (error?: any) => { return _errorFormatter(error, `해당 번호로 가입한 내역이 존재하지 않습니다.`) },
    ACCOUNT_DOESNT_EXIST: (error?: any) => { return _errorFormatter(error, `존재하지 않는 계정입니다.`) },
    WRONG_PASSWORD: (error?: any) => { return _errorFormatter(error, `비밀번호가 일치하지 않습니다.`) },
    USER_NOT_FOUND: (error?: any) => { return _errorFormatter(error, `해당 정보와 일치하는 사용자를 찾을 수 없습니다.`) },
    USER_NAME_NOT_FOUND: (error?: any) => { return _errorFormatter(error, `Update your profile!`) },
    USER_ALREADY_EXIST: (error?: any) => { return _errorFormatter(error, `해당 정보로 가입한 내역이 존재합니다.`) },
    PASSWORD_INCORRECT: (error?: any) => { return _errorFormatter(error, `비밀번호가 일치하지 않습니다.`) },
    CIVALUE_IN_USE: (error?: any) => { return _errorFormatter(error, `입력하신 본인확인 정보로 가입된 내역이 존재합니다.`) },
    USER_NOT_OLD_ENOUGH: (error?: any) => { return _errorFormatter(error, `19세 미만의 미성년자는 서비스를 이용하실 수 없습니다.`) },
};

export const FILE_ERRORS = {
    FILE_NOT_FOUND: (error?: any) => { return _errorFormatter(error, `File not found!.`) },
    UPLOAD_FAIL: (error?: any) => { return _errorFormatter(error, `Upload fail!.`) },
    FOLDER_NOT_EXIST: (error?: any) => { return _errorFormatter(error, `Folder not exist.`) },
    DELETE_FAIL: (error?: any) => { return _errorFormatter(error, `Delete fail!`) },
};

export const AUTHENTICATION_ERRORS = {
    TOKEN_EXPIRED_OR_NOT_AVAILABLE: (error?: any) => { return _errorFormatter(error, `토큰이 만료되어 다시 로그인해주시기 바랍니다.`); },
    DEVICE_SESSION_EXPIRED: (error?: any) => { return _errorFormatter(error, `세션이 만료되어 다시 로그인해주시기 바랍니다.`); },
    PERMISSION_DENIED: (error?: any) => { return _errorFormatter(error, `접근 권한이 없습니다.`); },
    IAMTOKEN_NOTFOUND: (error?: any) => { return _errorFormatter(error, `접근 권한이 없습니다.`); },
};

export const GIFT_ERRORS = {
    GIFT_NOT_FOUND: (error?: any) => { return _errorFormatter(error, `Gift not found!.`) },
};
export const PRODUCT_ERRORS = {
    PRODUCT_NOT_FOUND: (error?: any) => { return _errorFormatter(error, `Product not found!.`) },
};

export const KEYWORD_ERRORS = {
    KEYWORD_NOT_FOUND: (error?: any) => { return _errorFormatter(error, `Keyword not found!.`) },
};

export const REVIEW_ERRORS = {
    REVIEW_NOT_FOUND: (error?: any) => { return _errorFormatter(error, `Review not found!.`) },
};

export const CATEGORY_ERRORS = {
    CATEGORY_NOT_FOUND: (error?: any) => { return _errorFormatter(error, `Category not found!.`) },
};

export const SNACKS_ERRORS = {
    SNACKS_NOT_FOUND: (error?: any) => { return _errorFormatter(error, `Snack not found!.`) },
};
export const SEACH_HISTORY_ERRORS = {
    SEARCH_HISTORY_NOT_FOUND: (error?: any) => { return _errorFormatter(error, `Search History not found!.`) },
};
export const REGION_ERRORS = {
    REGION_NOT_FOUND: (error?: any) => { return _errorFormatter(error, `Region not found!.`) },
};
export const DEVICE_SESSION_ERRORS = {
    DEVICE_SESSION_NOT_FOUND: (error?: any) => { return _errorFormatter(error, `Device session not found!.`) },
    DEVICE_SESSION_EXIST: (error?: any) => { return _errorFormatter(error, `Device session exists!.`) },
};