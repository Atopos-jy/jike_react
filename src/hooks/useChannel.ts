import type { ChannelItem } from "@/api/article";
import { getChannel } from "@/api/article";
import { useState, useEffect } from "react";
const useChannel = () => {
  const [channelOptions, setChannelOptions] = useState<ChannelItem[]>([]);
  useEffect(() => {
    const getChannelList = async () => {
      const res = await getChannel();
      setChannelOptions(res.data.channels);
    };
    getChannelList();
  }, []);
  return {
    channelOptions,
    setChannelOptions,
  };
};
export { useChannel };
