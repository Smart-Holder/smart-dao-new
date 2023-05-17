import React, { useState, useEffect, memo } from 'react';
import { Pie, PieConfig } from '@ant-design/charts';

// const data = [
//   {
//     type: '分类一',
//     value: 27,
//   },
//   {
//     type: '分类二',
//     value: 25,
//   },
//   {
//     type: '分类三',
//     value: 18,
//   },
//   {
//     type: '分类四',
//     value: 15,
//   },
//   {
//     type: '分类五',
//     value: 10,
//   },
//   {
//     type: '其他',
//     value: 5,
//   },
// ];

const App = ({ data = [] }: any) => {
  const config: PieConfig = {
    appendPadding: 0,
    data,
    height: 300,
    angleField: 'value',
    colorField: 'id',
    radius: 0.9,
    // color: ['#d62728', '#2ca02c', '#000000'],
    label: {
      type: 'inner',
      offset: '-30%',
      // content: ({ percent }) => `${(percent * 100).toFixed(2)}%`,
      content: ({ percent }) => '',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    legend: {
      layout: 'horizontal',
      position: 'right',
      maxWidth: 400,
      flipPage: true,
      maxWidthRatio: 0.4,
      maxRow: 5,
      itemName: {
        formatter: (text, item, index) => {
          return data[index].name;
        },
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  if (data.length === 0) {
    return null;
  }

  return <Pie {...config} />;
};

export default memo(App);
