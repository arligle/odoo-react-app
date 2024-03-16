import { create } from "zustand";
import request from "../utils/request";

type UserInfo = {
  userName: string;
  photo: string;
  time: number;
  roles: string[];
  authBtnList: string[];
};

type UserStore = {
  userInfo: UserInfo;
  setUserInfos: () => Promise<void>;
};

/**
 * 获取用户信息方法
 * @function setUserInfos
 * @async
 */
export const useStore = create<UserStore>((set) => ({
  userInfo: {
    userName: "",
    photo: "",
    time: 0,
    roles: [],
    authBtnList: [],
  },
  setUserInfos: async () => {
    // 获取用户信息
    const res = await request(`/gateway/admin/user/info`);
    set({
      userInfo: {
        userName: res.data.sysUser.userName,
        photo: res.data.sysUser.avatar,
        time: new Date().getTime(),
        roles: res.data.roles,
        authBtnList: res.data.permissions,
      },
    });
  },
}));
