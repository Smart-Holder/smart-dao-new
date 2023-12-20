import { Asset } from '@/config/define';
import { fromToken, fromTokenPlus, getUnit } from '@/utils';
import { Image } from 'antd';
import { ETH_CHAINS_INFO } from '@/config/chains';
import { useAppSelector } from '@/store/hooks';

type PriceProps = {
  icon?: string;
  value?: number | string;
  unit?: string;
  data?: Asset;
};

const App = ({
  icon = '/images/market/icon_nft_card_unit_eth_default@2x.png',
  value,
  unit = '',
  data,
}: PriceProps) => {
  const { chainId } = useAppSelector((store) => store.wallet);
  let v: number | string = 0;

  if (value !== undefined) {
    v = value;
  } else if (data) {
    const min = data.minimumPrice;
    const properties = data.properties || [];
    const listingPriceObj =
      properties.find((item: any) => item.listingPrice) || {};
    const priceObj = properties.find((item: any) => item.price) || {};

    let maxValue = Math.max(
      Number(min) || 0,
      listingPriceObj.listingPrice || 0,
      priceObj.price || 0,
    );
    v = fromTokenPlus(maxValue);
    // v = Math.max(
    //   fromToken(min),
    //   fromToken(listingPriceObj.listingPrice || 0),
    //   fromToken(priceObj.price || 0),
    // );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Image
        src={ETH_CHAINS_INFO[chainId]?.icon || icon}
        width={20}
        height={20}
        preview={false}
        alt=""
      />
      {/* <Image src={Matic} width={20} height={20} preview={false} alt="" /> */}

      <span style={{ marginLeft: 1 }}>{`${v} ${unit || getUnit()}`}</span>
    </div>
  );
};

export default App;
