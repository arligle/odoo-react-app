"use server";

import { SignUpFormType } from "../types/auth";

interface LoginData {
    username: string;
    password: string;
    randomStr: string;
    code: string;
    scope: string;
    grant_type: string;
}

interface VerifyReqData {
    captchaType?: string;
}

interface ReqCheckData {
    captchaType: string;
    pointJson: string;
    token: string;
}

export async function getToken(loginData: LoginData) {
    const params = new URLSearchParams({
        username: loginData.username,
        randomStr: loginData.randomStr,
        code: loginData.code,
        scope: loginData.scope,
        grant_type: loginData.grant_type,
    }).toString();
    const data = new URLSearchParams({ password: loginData.password }).toString();
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/oauth2/token?${params}`,
            {
                method: "POST",
                headers: {
                    skipToken: "true",
                    Authorization:
                        "Basic " +
                        btoa(process.env.NEXT_PUBLIC_OAUTH2_PASSWORD_CLIENT as string),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: data,
            },
        );
        const resData = await response.json();
        console.log(resData);
        return resData;
    } catch (e) {
        return { code: 1, msg: "网络错误，请联系管理员！", data: null, ok: false };
    }
}

export async function registerUser(data: SignUpFormType) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/register/user`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        },
    );
    return response.json();
}

export async function getVerify(verifyReqData: VerifyReqData) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/code/create`,
        {
            method: "GET",
            headers: {
                contentType: "application/json",
            },
        },
    );
    return response.json();
}

export async function verifyCode(reqCheckData: ReqCheckData) {
    const params = new URLSearchParams({ ...reqCheckData }).toString();
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/code/check?${params}`,
        {
            method: "POST",
            headers: {
                contentType: "application/json",
            },
        },
    );
    return response.json();
}
