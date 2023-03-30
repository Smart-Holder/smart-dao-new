import React, { CSSProperties } from 'react';
import { Typography } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

const { Text } = Typography;

const EllipsisMiddle: React.FC<{
  suffixCount: number;
  children: string;
  className?: string;
  copyable?: boolean;
  style?: CSSProperties;
  onClick?: (text: string) => void;
}> = ({ suffixCount, children, style, className = '', copyable, onClick }) => {
  if (!children) {
    return null;
  }

  const start = children.slice(0, children.length - suffixCount).trim();
  const suffix = children.slice(-suffixCount).trim();

  const onTextClick = () => {
    if (onClick) {
      onClick(children);
    }
  };

  return (
    // <div className={className} style={{ maxWidth: '100%' }} onClick={onClick}>
    <Text
      className={className}
      style={style ? { maxWidth: '100%', ...style } : { maxWidth: '100%' }}
      ellipsis={{ suffix }}
      copyable={
        copyable
          ? {
              tooltips: false,
              text: children,
              onCopy(event) {
                event?.stopPropagation();
              },
            }
          : false
      }
      onClick={onTextClick}
    >
      {start}
    </Text>
    // </div>
  );
};

export default EllipsisMiddle;
