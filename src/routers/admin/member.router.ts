import { Router } from 'express';
import { AuthenticationAdmin, xhrRequired } from '../../utils/common';
import { memberAge, memberGender, memberQuantity, memberManagement, getDetailMember, deleteMember, deleteMembers, searchMembers } from "../../controllers/member.controller";
import { validatorMemberManagement, validatorGetMember, validatorGetDetail, validatoDeleteMember, validatorDeleteMembers, validatorSearchMembers } from '../../validators/member.validator';

export default (memberRouter: Router): void => {
    memberRouter.route("/member/quantity")
        .get(xhrRequired, AuthenticationAdmin, validatorMemberManagement, memberQuantity);
    memberRouter.route("/member/age")
        .get(xhrRequired, AuthenticationAdmin, validatorMemberManagement, memberAge);
    memberRouter.route("/member/gender")
        .get(xhrRequired, AuthenticationAdmin, validatorMemberManagement, memberGender);
    memberRouter.route("/member/management")
        .get(xhrRequired, AuthenticationAdmin, validatorGetMember, memberManagement);
    memberRouter.route("/member/getDetail")
        .get(xhrRequired, AuthenticationAdmin, validatorGetDetail, getDetailMember);
    memberRouter.route("/member/delete")
        .delete(xhrRequired, AuthenticationAdmin, validatoDeleteMember, deleteMember);
    memberRouter.route("/member/deletes")
        .delete(xhrRequired, AuthenticationAdmin, validatorDeleteMembers, deleteMembers);
    memberRouter.route("/member/search")
        .get(xhrRequired, AuthenticationAdmin, validatorSearchMembers, searchMembers);
}