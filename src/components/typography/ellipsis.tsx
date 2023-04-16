import { Typography } from 'antd';
import { ParagraphProps } from 'antd/es/typography/Paragraph';

const App = ({ children, copyable, ...rest }: ParagraphProps) => {
  const copyable_ =
    typeof copyable === 'boolean'
      ? copyable
        ? { text: children as string }
        : false
      : copyable;

  return (
    <Typography.Paragraph
      className="smart-ellipsis"
      copyable={copyable_}
      {...rest}
    >
      <span>{children}</span>
    </Typography.Paragraph>
  );
};

export default App;
