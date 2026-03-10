import http from "@/utils/request";
import type { ApiResponse } from "@/type/api";
import Publish from "@/pages/Publish";

export interface ChannelData {
  channels: ChannelItem[];
}
export interface ChannelItem {
  id: number;
  name: string;
}

export interface PublishFormFields {
  title: string;
  content: string;
  cover: PublishFormData;
  channel_id: number;
}

export interface PublishFormData {
  type: 0;
  images: [];
}

export const getChannel = (): Promise<ApiResponse<ChannelData>> => {
  return http.get<ChannelData>("/channels");
};

export const addArticle = (data: PublishFormFields): Promise<ApiResponse> => {
  return http.post("/articles?draft=false", data);
};
