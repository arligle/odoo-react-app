import { Session } from "./storage";
import other from "./other";

// 常用header
export const CommonHeaderEnum = {
  TENANT_ID: "TENANT-ID",
  ENC_FLAG: "Enc-Flag",
  AUTHORIZATION: "Authorization",
};

async function request(url: string, options: any = {}) {
  // 请求拦截
  const token = Session.getToken();
  if (token) {
    options.headers = options.headers || {};
    // console.log(options.headers)
    options.headers[CommonHeaderEnum.AUTHORIZATION] = `Bearer ${token}`;
  }
  const tenantId = Session.getTenant();
  if (tenantId) {
    options.headers = options.headers || {};
    options.headers[CommonHeaderEnum.TENANT_ID] = tenantId;
  }
  if (options.headers && options.headers[CommonHeaderEnum.ENC_FLAG]) {
    const enc = other.encryption(
      JSON.stringify(options.body),
      process.env.NEXT_PUBLIC_PWD_ENC_KEY as string
    );
    options.body = {
      encryption: enc,
    };
  }

  // 发送请求
  let response = await fetch(url, options);
  // 响应拦截
  if (response.status === 423) {
    throw new Error('"演示环境，仅供预览"');
  }

  if (response.status === 401) {
    Session.clear();
    window.location.href = "/";
    throw new Error("令牌状态已过期，请点击重新登录");
  }

  let data = await response.json();

  if (data.code === 1) {
    throw data;
  }

  if (data.encryption) {
    const originData = JSON.parse(
      other.decryption(
        data.encryption,
        process.env.NEXT_PUBLIC_PWD_ENC_KEY as string
      )
    );
    data = originData;
  }

  return data;
}

export default request;
