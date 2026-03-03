import * as echarts from "echarts";
import { useEffect, useRef, type CSSProperties } from "react";
import type { EChartsOption, EChartsType } from "echarts";

function echartInit(
  chart: EChartsType,
  xData: string[],
  sData: number[],
  title: string,
) {
  const option: EChartsOption = {
    title: {
      text: title,
    },
    tooltip: {},
    xAxis: {
      data: xData,
    },
    yAxis: {},
    series: [
      {
        name: "销量",
        type: "bar",
        data: sData,
      },
    ],
  };
  chart.setOption(option);
}

type BarProps = {
  style?: CSSProperties;
  xData: string[];
  sData: number[];
  title?: string;
};

function Bar({ style, xData, sData, title = "" }: BarProps) {
  // 1. 先不考虑传参问题  静态数据渲染到页面中
  // 2. 把那些用户可能定制的参数 抽象props (1.定制大小 2.data 以及说明文字)
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<EChartsType | null>(null);
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const chart = echarts.init(node);
    chartRef.current = chart;
    return () => {
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    echartInit(chart, xData, sData, title);
  }, [xData, sData, title]);

  return <div ref={nodeRef} style={style}></div>;
}

export default Bar;
