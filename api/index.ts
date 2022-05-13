import axios from "./axios";

import Urls from "@/constants/Urls";

interface CodeResponse {
  code: number;
}

interface CommonResponse<T> {
  code: number;
  info: T;
  type: string;
}

interface EmoticonResponse {
  kaomoji: string[];
  bmoji: string[];
  emoji: string[];
}

export interface Image {
  url: string; // hash of the image
  ext: string; // extension of the image
}

export interface Forum {
  id: number; // 版块的ID
  rank: number; // 版块的默认排序，越小越靠前，自己开发时可以使用其他的排序规则
  name: string; // 版块名称
  name2: string; // 版块别名，几乎无用
  headimg: string; // 版块图标的文件名，/static/header/+版块图标的文件名
  info: string; // 版块描述
  hide: boolean; // 是否为隐藏版块，即不会出现在版块列表中
  timeline: boolean; // 是否为时间线版块，即不会出现在时间线中
  close: boolean; // 是否为禁止发布版块，即是否可以新增内容
}

export interface Reply {
  id: number; // 串号的ID
  res: number; // 回复目标，0为主内容
  time: number; // 发布时间
  name: string; // 昵称，大多数情况下是不填的
  cookie: string; // 饼干
  admin: boolean; // 是否为管理员
  content: string; // 内容
  images: Image[]; // 图片列表
}

export interface Post extends Reply {
  root: string; // 最后回复时间 GMT+0
  forum: number; // 版块ID
  title: string; // 标题，大多数情况下是不填的*回复是没有标题的
  lock: boolean; // 是否锁定，锁定了的内容无法回复*默认为null
  reply_count: number; // 回复数
  hide_count?: number; // 还有多少个回复没展示，即reply_count-5
  reply: Reply[];
}

export interface SearchResult extends Reply {
  forum: number; // 版块ID
  title: string; // 标题，大多数情况下是不填的*回复是没有标题的
  lock: boolean; // 是否锁定，锁定了的内容无法回复*默认为null
  reply: Reply[];
}

export interface ReplyRequest {
  res: number; // 回复目标，0为主内容
  forum: number; // 版块ID
  title: string; // 标题，大多数情况下是不填的*回复是没有标题的
  name: string; // 昵称，大多数情况下是不填的
  comment: string; // 内容
  cookie: string; // 饼干
  webapp: number; // 使用post提交必须包含这个参数，发送1
  img: string[];
}

export interface UploadResponse {
  code: number; //
  pic: string; // 图片的hash
  msg: string;
}

export interface SignInfo {
  sign: number;
  signtime: string;
  point: number;
  exp: number;
}

export interface CookieWithRemarks {
  cookie: string;
  remarks: string;
}

export interface CookieInfo extends SignInfo {
  cookie: string;
  vip: string;
  list: CookieWithRemarks[];
}

// 获取版块列表
export const getForums = () => axios.post<CommonResponse<Forum[]>>("/api/forumlist");

// 获取某个版块的帖子列表
export const getPostsByForum = (id = 0, page = 1, pageSize = 20) =>
  axios.post<CommonResponse<Post[]>>("/api/forum", {
    id,
    page,
    page_def: pageSize,
  });

// 获取某个帖子的回复列表
export const getPostById = (id = 0, page = 1, pageSize = 20, order = 0) =>
  axios.post<CommonResponse<Post>>("/api/threads", {
    id,
    page,
    page_def: pageSize,
    order,
  });

// 搜索
export const getSearchResults = (keyword: string, page = 1, pageSize = 20) =>
  axios.post<CommonResponse<SearchResult[]>>("/api/search", {
    keyword,
    page,
    page_def: pageSize,
  });

export const getReply = (id = 0) => axios.post<CommonResponse<Reply>>("/api/thread", { id });

export const signIn = (cookie: string, hash: string) =>
  axios.post<CommonResponse<SignInfo>>("/api/sign", { cookie, code: hash });

export const addReply = (data: ReplyRequest) =>
  axios.post<CommonResponse<number>>("/post/post", data);

export const deleteReply = (id: number, cookie: string) =>
  axios.post(`/post/del/${id}`, { cookie });

export const uploadImage = (image: FormData) =>
  fetch(`${Urls.baseURL}post/upload`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    method: "POST",
    body: image,
  }).then((res) => res.json());

export const getCookies = (id: string, hash: string) =>
  axios.post<CommonResponse<CookieInfo>>("/api/userinfo", {
    cookie: id,
    code: hash,
  });

export const createCookie = (code?: string) =>
  axios.post<CommonResponse<string>>("/post/cookieGet", {
    cdk: code,
  });

export const importCookie = (masterCode: string, code: string) =>
  axios.post<CommonResponse<CookieWithRemarks[]>>("/api/cookieAdd", {
    master: masterCode,
    cookieadd: code,
  });

export const deleteSlaveCookie = (id: string, hash: string, slaveId: string) =>
  axios.post<CodeResponse>("/api/cookiedel", {
    cookie: id,
    code: hash,
    del: slaveId,
  });

export const getEmoticons = () => axios.get<EmoticonResponse>("/static/js/kaomoji.json");

export const getRecommendations = () => axios.get("/webapp/pages/main/search.html");
