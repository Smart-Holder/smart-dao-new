import { useAppSelector } from '@/store/hooks';
import { formatAddress } from '@/utils';
import { Avatar, Button, Col, Image, message, Row, Tag } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';

import Modal from '@/components/modal';
import { LoadingOutlined } from '@ant-design/icons';

import { shelves } from '@/api/asset';

const list = [{ name: 'OpenSea', image: '/images/opensea.png' }];

const App = () => {
  const { formatMessage } = useIntl();

  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { currentDAO, currentMember } = useAppSelector((store) => store.dao);

  const storageData = JSON.parse(localStorage.getItem('asset') || '{}') || {};

  const owner = address.toLowerCase() === storageData.owner.toLowerCase();

  const extra = storageData?.properties || [];

  let tagsObj = extra.find((item: any) => item.trait_type === 'tags');
  const tags = tagsObj ? tagsObj.value.split(',') : [];

  const blockchain = extra.find(
    (item: any) => item.trait_type === 'blockchain',
  );

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
  };

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
      // console.error(error);
      // message.error(error?.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="top">
        <div className="top-left">
          <Avatar
            src={storageData.imageOrigin || currentDAO.image}
            shape="square"
            size={{ xs: 200, sm: 200, md: 200, lg: 300, xl: 442, xxl: 442 }}
            // width={442}
            // height={442}
            // preview={false}
            // alt=""
          />
        </div>
        <div className="top-right">
          <div>
            <div className="asset-name">{storageData.name}</div>
            <div className="asset-tags">
              {tags.map((tag: string) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
              #{storageData.id}
            </div>
            <div style={{ marginTop: 44 }} className="dao-info-item">
              {formatMessage({ id: 'financial.asset.owner' })}:&nbsp;&nbsp;
              {formatAddress(storageData.owner, 8)}
            </div>
            <div className="dao-info-item">
              {formatMessage({ id: 'financial.asset.address' })}:&nbsp;&nbsp;
              {formatAddress(storageData.token, 8)}
            </div>
            <div className="dao-info-item">
              {formatMessage({ id: 'financial.asset.tokenId' })}:&nbsp;&nbsp;
              {formatAddress(storageData.tokenId, 8)}
            </div>
            <div className="dao-info-item">
              {formatMessage({ id: 'financial.asset.chain' })}:&nbsp;&nbsp;
              {blockchain?.value}
            </div>
            <div className="dao-info-item">
              {formatMessage({ id: 'financial.asset.metadata' })}:&nbsp;&nbsp;
              {formatAddress(storageData.uri, 12)}
            </div>
            {/* <div className="dao-info-item">
              {formatMessage({ id: 'financial.asset.royalties' })}
              :&nbsp;&nbsp;3%
            </div> */}
            <div style={{ marginTop: 40 }}>
              {currentMember.tokenId && owner ? (
                <>
                  {/* <Button onClick={onShare}>分享</Button> */}
                  {storageData.selling === 0 && (
                    <Button
                      type="primary"
                      className="smart-button"
                      onClick={showModal}
                    >
                      {formatMessage({ id: 'financial.asset.listing' })}
                    </Button>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <Modal type="normal" open={isModalOpen} onCancel={hideModal}>
        <div className="title">
          {formatMessage({ id: 'financial.asset.tradingMarket' })}
        </div>
        <div className="market-list">
          {list.map((item, i) => (
            <div
              key={i}
              className="market-list-item"
              onClick={() => {
                onShelves(item.name);
              }}
            >
              {!loading ? (
                <Avatar src={item.image} size={88} alt="" />
              ) : (
                // <LoadingOutlined style={{ fontSize: 88 }} />
                <Avatar size={88} icon={<LoadingOutlined />} />
              )}
              <div className="market-list-item-name">{item.name}</div>
            </div>
          ))}
        </div>
      </Modal>
      <style jsx>
        {`
          .top {
            display: flex;
          }
          .top-right {
            margin-left: 83px;
          }
          .asset-name {
            height: 40px;
            font-size: 28px;
            font-family: SFUIDisplay-Semibold;
            font-weight: 600;
            color: #000000;
            line-height: 40px;
          }

          .asset-tags {
            display: flex;
            align-items: center;
            margin-top: 14px;
            font-size: 18px;
            font-family: SFUIText-Medium;
            font-weight: 500;
            color: #000000;
            line-height: 25px;
          }

          .dao-info-item {
            height: 22px;
            margin-top: 20px;
            font-size: 16px;
            font-family: SFUIText-Medium;
            font-weight: 500;
            color: #000000;
            line-height: 22px;
          }

          .market-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            margin-top: 50px;
          }

          .market-list-item {
            margin: 0 30px;
            cursor: pointer;
          }

          .market-list-item-name {
            height: 24px;
            margin-top: 32px;
            font-size: 20px;
            font-family: SFUIText-Semibold;
            font-weight: 600;
            color: #000000;
            line-height: 24px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
