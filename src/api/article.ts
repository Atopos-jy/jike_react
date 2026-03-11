import http from "@/utils/request";
import type { ApiResponse } from "@/type/api";

export interface ChannelData {
  channels: ChannelItem[];
}
export interface ChannelItem {
  id: number;
  name: string;
}

export interface PublishFormFields {
  title: string;
  type: number;
  content: string;
  cover: PublishFormData;
  channel_id: number;
}

export interface PublishFormData {
  type: number;
  images: string[];
}

export interface AritcleListParams {
  status?: string;
  channel_id?: number;
  begin_pubdate?: string;
  end_pubdate?: string;
  page?: number;
  per_page?: number;
}

export interface ArticleItem {
  id: string;
  title: string;
  status: 0 | 1 | 2 | 3 | 4;
  comment_count: number;
  cover?: { images: string[] };
  like_count?: number;
  pubdate?: string;
  read_count?: number;
  channel_id?: string;
}

// 文章列表分页数据类型
export interface ArticleList {
  page: number;
  per_page: number;
  results: ArticleItem[];
  total_count: number;
}

export const getChannel = (): Promise<ApiResponse<ChannelData>> => {
  return http.get<ChannelData>("/channels");
};

export const addArticle = (data: PublishFormFields): Promise<ApiResponse> => {
  return http.post("/mp/articles?draft=false", data);
};

export const getArticleList = (
  params: AritcleListParams,
): Promise<ApiResponse<ArticleList>> => {
  return http.get("/mp/articles", params);
};
