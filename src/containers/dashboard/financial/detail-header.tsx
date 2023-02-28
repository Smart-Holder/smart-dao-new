import { FC, useState } from 'react';
import styles from './detail-header.module.css';
import modalStyles from './put-modal.module.css';
import Image from 'next/image';
import { Avatar, Button, message, Modal, Space } from 'antd';
import { formatAddress, fromToken } from '@/utils';
import { useAppSelector } from '@/store/hooks';
import PutModal, { PutModalListItem } from './put-modal';
import { useIntl } from 'react-intl';

type DetailHeaderProps = {
  logo: string;
  title: string;
};

import openseaIcon from '/public/images/opensea.png';
import { shelves } from '@/api/asset';
import { LoadingOutlined } from '@ant-design/icons';

const list = [{ name: 'OpenSea', image: openseaIcon }];

const DetailHeader: FC<DetailHeaderProps> = (props) => {
  const { formatMessage } = useIntl();
  const { logo, title } = props;

  const { currentMember } = useAppSelector((store) => store.dao);

  const storageData = JSON.parse(localStorage.getItem('asset') || '{}') || {};
  console.log('storageData', storageData);

  const extra = storageData?.properties || [];

  const blockchain = extra.find(
    (item: any) => item.trait_type === 'blockchain',
  );

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onShare = () => {};

  const onShelves = async (name: string) => {
    const params = {
      token: storageData.token,
      tokenId: storageData.tokenId,
      amount: storageData.minimumPrice,
    };

    try {
      setLoading(true);
      await shelves(params);
      message.success('success');
      // window.location.reload();
      setLoading(false);
      hideModal();
    } catch (error: any) {
      console.error(error);
      message.error(error?.message);
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles['container']}>
      <div className={styles['img']}>
        <Image src={logo} alt="logo" width={71} height={71} />
      </div>
      <div className={styles['info']}>
        <div className={styles['t1']}>
          <div className={styles['title']}>
            <span>{title}</span>
            {/* <span className={styles['sub-title']}>(标签#8790)</span> */}
          </div>
          {currentMember.tokenId && (
            <Space size={10}>
              {/* <Button onClick={onShare}>分享</Button> */}
              <Button onClick={showModal}>
                {formatMessage({ id: 'financial.asset.listing' })}
              </Button>
            </Space>
          )}
        </div>
        <div className={styles['t2']}>
          <div className={styles['left']}>
            {/* <div className={styles['item']}>拥有者: Allen.hou</div> */}
          </div>
          <div className={styles['right']}>
            <div className={styles['item']}>
              {formatMessage({ id: 'financial.asset.address' })}:{' '}
              {formatAddress(storageData.token)}
            </div>
            <div className={styles['item']}>
              {formatMessage({ id: 'financial.asset.tokenId' })}:{' '}
              {formatAddress(storageData.tokenId)}
            </div>
            <div className={styles['item']}>
              {formatMessage({ id: 'financial.asset.chain' })}:{' '}
              {blockchain?.value}
            </div>
            <div className={styles['item']}>
              {formatMessage({ id: 'financial.asset.metadata' })}:{' '}
              {formatAddress(storageData.uri, 8)}
            </div>
            <div className={styles['item']}>
              {formatMessage({ id: 'financial.asset.royalties' })}: 3%
            </div>
          </div>
        </div>
      </div>

      <Modal
        width={512}
        open={isModalOpen}
        onCancel={hideModal}
        footer={null}
        destroyOnClose
      >
        <div className={modalStyles['content']}>
          <div className={modalStyles['title']}>
            {formatMessage({ id: 'financial.asset.tradingMarket' })}
          </div>
          {/* <div className={modalStyles['sub-title']}>
            Create your own DAO in a few minutes!
          </div> */}
          <div className={modalStyles['list']}>
            {list.map((item, i) => (
              <div
                key={i}
                className={modalStyles['item']}
                onClick={() => {
                  onShelves(item.name);
                }}
              >
                {!loading ? (
                  <Image
                    className={modalStyles['item-icon']}
                    src={item.image}
                    alt="img"
                    width={88}
                    height={88}
                  />
                ) : (
                  // <LoadingOutlined style={{ fontSize: 88 }} />
                  <Avatar size={88} icon={<LoadingOutlined />} />
                )}
                <div className={modalStyles['item-title']}>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DetailHeader;
