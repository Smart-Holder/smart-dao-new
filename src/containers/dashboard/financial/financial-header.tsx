import { FC, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './financial-header.module.css';
import { Button, Typography } from 'antd';
import { useAppSelector } from '@/store/hooks';
import { useIntl } from 'react-intl';

const { Paragraph, Text } = Typography;

type FinancialHeaderProps = {
  desc: string;
  createTime: string;
  amount: number;
  chain: string;
} & FinancialDataType;

export type FinancialDataType = {
  title: string;
  addr: string;
  logo: string;
};

const FinancialHeader: FC<FinancialHeaderProps> = (props) => {
  const { formatMessage } = useIntl();
  const { logo, title, createTime, amount, addr, desc, chain } = props;

  const { currentMember } = useAppSelector((store) => store.dao);

  const img =
    'data:image/png;base64,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';

  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<FinancialDataType>();
  // const [currentPutList, setCurrentPutList] = useState<PutModalListItem[]>([]);

  const onShare = () => {};

  const onCreate = () => {
    router.push('/dashboard/financial/assets/issue');
  };

  const onShelves = () => {
    router.push('/dashboard/mine/assets/shelves');
  };

  // const onPut = () => {
  //   setCurrentItem({ logo, title, addr });
  //   setCurrentPutList([
  //     { img: 'https://storage.nfte.ai/icon/currency/eth.svg', name: 'opensea' },
  //     { img: 'https://storage.nfte.ai/icon/currency/eth.svg', name: 'opensea' },
  //     { img: 'https://storage.nfte.ai/icon/currency/eth.svg', name: 'opensea' },
  //     { img: 'https://storage.nfte.ai/icon/currency/eth.svg', name: 'opensea' },
  //   ]);
  //   setOpenModal(true);
  // };

  const onEdit = () => {};

  // const onClosePutModal = () => {
  //   setCurrentItem(undefined);
  //   setCurrentPutList([]);
  //   setOpenModal(false);
  // };

  return (
    <>
      <div className={styles['container']}>
        <div className={styles['left']}>
          <div className={styles['logo']}>
            <Image src={logo || img} alt="logo" width={71} height={71} />
          </div>
          <div className={styles['base-info']}>
            <div className={styles['l1']}>
              <div className={styles['title']}>{title}</div>
              <div className={styles['created']}>
                <span>
                  {formatMessage({ id: 'financial.asset.time.create' })}:
                </span>
                {createTime}
              </div>
              <div className={styles['amount']}>
                {/* {amount} */}
                <span>{chain}</span>
              </div>
            </div>
            <div className={styles['l2']}>
              <div className={styles['addr']}>{addr}</div>
              <div className={styles['desc']}>
                <Paragraph
                  style={{ width: '80%', marginBottom: 0 }}
                  ellipsis={true}
                >
                  {/* 描述: {desc} */}
                  {desc}
                </Paragraph>
              </div>
            </div>
          </div>
        </div>
        {currentMember.tokenId && (
          <div className={styles['right']}>
            {/* <Button onClick={onShare}>分享</Button> */}
            <Button onClick={onCreate}>
              {formatMessage({ id: 'financial.asset.publish' })}
            </Button>
            <Button onClick={onShelves}>
              {formatMessage({ id: 'financial.asset.listing' })}
            </Button>
            {/* <Button onClick={onPut}>上架交易</Button> */}
            {/* <Button onClick={onEdit}>编辑</Button> */}
          </div>
        )}
      </div>
      {/* <PutModal
        open={openModal}
        onClose={onClosePutModal}
        data={currentItem}
        list={currentPutList}
      /> */}
    </>
  );
};

export default FinancialHeader;
