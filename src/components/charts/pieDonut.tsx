import React, { useState, useEffect, memo } from 'react';
import { Pie, measureTextWidth, PieConfig } from '@ant-design/plots';

const colors = [
  '#2D70BD',
  '#7FA5D8',
  '#4585D6',
  '#D2DFFA',
  '#6F9DD9',
  '#8FAFDA',
  '#337ACB',
  '#A6B5E0',
  '#62A3EC',
  '#C4CFDB',
  '#5290DC',
  '#D4DBE5',
  '#1872BA',
  '#CBD8EE',
  '#B5BFD9',
  '#4174BD',
  '#86C2FF',
  '#C3E2FF',
  '#E9F1FF',
  '#DAE8FF',
];

const testData = [
  {
    id: '分类一',
    name: '分类一',
    value: 27,
  },
  {
    id: '分类二',
    name: '分类二',
    value: 25,
  },
  {
    id: '分类三',
    name: '分类三',
    value: 18,
  },
  {
    id: '分类四',
    name: '分类四',
    value: 15,
  },
  {
    id: '分类五',
    name: '分类五',
    value: 10,
  },
  {
    id: '其他',
    name: '其他',
    value: 5,
  },
];

const App = ({ data = testData }: any) => {
  // const [selectData, setSelectData] = useState([]);
  let selectData: any = [];

  const renderStatistic = (
    containerWidth: number,
    text: string,
    style: any,
  ) => {
    const { width: textWidth, height: textHeight } = measureTextWidth(
      text,
      style,
    );
    const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2

    let scale = 1;

    if (containerWidth < textWidth) {
      scale = Math.min(
        Math.sqrt(
          Math.abs(
            Math.pow(R, 2) /
              (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)),
          ),
        ),
        1,
      );
    }

    const textStyleStr = `width:${containerWidth}px;`;
    return `<div style="${textStyleStr};font-size:${scale}em;line-height:${
      scale < 1 ? 1 : 'inherit'
    };">${text}</div>`;
  };

  const config: PieConfig = {
    autoFit: true,
    // width: 500,
    height: 300,

    padding: 'auto',
    appendPadding: [25, 0, 25, 0],
    data,
    angleField: 'value',
    colorField: 'id',
    radius: 1,
    innerRadius: 0.64,
    color: colors,
    // meta: {
    //   value: {
    //     formatter: (v) => `${v} ¥`,
    //   },
    // },
    pieStyle: {
      lineWidth: 0,
    },
    label: {
      type: 'inner',
      offset: '-50%',
      // content: ({ percent }) => `${(percent * 100).toFixed(2)}%`,
      content: ({ percent }) => '',
      // content: '{value}',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
      autoRotate: false,
    },
    statistic: {
      title: {
        offsetY: -4,
        style: {
          fontSize: '14px',
          color: '#B1B1B1',
        },
        customHtml: (container, view, datum) => {
          const { width, height } = container.getBoundingClientRect();
          const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
          const text = datum?.name ? datum.name : 'In Total';
          return renderStatistic(d, text, {
            fontSize: '14px',
            color: '#B1B1B1',
          });
        },
      },
      content: {
        offsetY: 4,
        style: {
          fontSize: '22px',
        },
        customHtml: (container, view, datum, data: any) => {
          // setSelectData(data);
          selectData = data;
          const { width } = container.getBoundingClientRect();
          const text = datum
            ? `${datum.value}`
            : `${data.reduce((r: any, d: any) => r + d.value, 0)}`;
          return renderStatistic(width, text, {
            fontSize: 32,
          });
        },
      },
    },
    tooltip: {
      fields: ['name', 'value'],
      formatter: (datum) => {
        const total = selectData.reduce((r: any, d: any) => r + d.value, 0);
        const per = 1 / total;

        return {
          name: datum.name,
          value: `${datum.value} copes &nbsp;&nbsp;&nbsp;&nbsp; ${(
            per *
            datum.value *
            100
          ).toFixed(2)}%`,
        };
      },
    },
    legend: {
      layout: 'horizontal',
      position: 'right',
      maxWidth: 400,
      flipPage: data.length > 20,
      offsetX: -200,
      // maxWidthRatio: 0.4,
      maxWidthRatio: undefined,
      maxRow: 10,
      itemName: {
        formatter: (text, item, index) => {
          return data[index].name;
        },
      },
    },
    // 添加 中心统计文本 交互
    interactions: [
      // {
      //   type: 'element-selected',
      // },
      // {
      //   type: 'element-active',
      // },
      // {
      //   type: 'pie-statistic-active',
      // },
    ],
  };

  if (data.length === 0) {
    return null;
  }

  return <Pie {...config} />;
};

export default memo(App);
