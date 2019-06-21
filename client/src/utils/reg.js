/**
 * 工具函数
 */

//  密码正则验证
export function pwdReg(value) {
    // 正则 必须包含至少一位数字和一位字母
    const reg = /^(?![^a-zA-Z]+$)(?!\D+$)/;
    return reg.test(value);
}