import { imageView2Max } from '@/utils';
import { Avatar, Typography } from 'antd';

const { Paragraph } = Typography;

type Props = {
  data: {
    name?: string;
    image?: string;
  };
};

const App = ({ data: { name, image } }: Props) => {
  return (
    <div className="item-owner">
      <Avatar
        src={imageView2Max({
          url: image,
          w: 50,
        })}
        size={28}
      />
      <Paragraph ellipsis={{ rows: 1 }}>{name}</Paragraph>

      <style jsx>
        {`
          .item-owner {
            display: flex;
            align-items: center;
          }

          .item-owner :global(.ant-typography) {
            margin-bottom: 0;
            margin-left: 8px;
            font-size: 16px;
            font-weight: 500;
            color: #000000;
            line-height: 19px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
