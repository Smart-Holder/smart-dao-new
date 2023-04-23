import { Asset } from '@/config/define';
import { fromToken } from '@/utils';
import { Image } from 'antd';

type PriceProps = {
  icon?: string;
  value?: number;
  unit?: string;
  data?: Asset;
};

const App = ({
  icon = '/images/market/icon_nft_card_unit_eth_default@2x.png',
  value,
  unit = 'ETH',
  data,
}: PriceProps) => {
  let v = 0;

  if (value !== undefined) {
    v = value;
  } else if (data) {
    const min = data.minimumPrice;
    const properties = data.properties || [];
    const listingPriceObj =
      properties.find((item: any) => item.listingPrice) || {};
    const priceObj = properties.find((item: any) => item.price) || {};

    v = Math.max(
      fromToken(min),
      fromToken(listingPriceObj.listingPrice || 0),
      fromToken(priceObj.price || 0),
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Image src={icon} width={20} height={20} preview={false} alt="" />

      <span>{`${v} ${unit}`}</span>
    </div>
  );
};

export default App;
