import { useAppSelector } from '@/store/hooks';
import { copyToClipboard, debounce, formatAddress } from '@/utils';
import { Avatar, Typography, Col, Image, message, Row, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import Modal from '@/components/modal';
import { CopyOutlined, LoadingOutlined } from '@ant-design/icons';

import { shelves } from '@/api/asset';
import EllipsisMiddle from '@/components/typography/ellipsisMiddle';

const { Text } = Typography;

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

  const ownerObj = extra.find((item: any) => item.owner) || {};

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [width, setWidth] = useState('auto');

  const contractAddress = `${formatMessage({
    id: 'financial.asset.address',
  })}:  ${storageData.token}`;

  const onResize = () => {
    const header = document.querySelector('.asset-detail-header') as any;
    const left = document.querySelector('.asset-detail-header-left') as any;
    const w = header.offsetWidth - left.offsetWidth - 83;
    console.log('======', header.offsetWidth, left.offsetWidth);

    setWidth(w ? w + 'px' : 'auto');
  };

  useEffect(() => {
    onResize();
  }, []);

  useEffect(() => {
    const resize = debounce(onResize, 200);

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  const toAddress = () => {
    // https://goerli.etherscan.io/address/.....
    // https://etherscan.io/address/....
  };

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

  const copy = () => {
    copyToClipboard(storageData.token);
  };

  return (
    <div className="asset-detail-header">
      <div className="asset-detail-header-left">
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
      <div className="asset-detail-header-right">
        <Text style={{ maxWidth: '100%' }} ellipsis={true}>
          iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi
        </Text>
        <div className="asset-name">{storageData.name}</div>
        <div className="asset-tags">
          {tags.map((tag: string) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
          #{storageData.id}
        </div>

        {ownerObj.owner && (
          <div className="asset-owner">
            <Avatar src={ownerObj.image} size={34} />
            <div className="asset-owner-right">
              <span className="asset-owner-label">
                {formatMessage({ id: 'financial.asset.owner' })}
              </span>
              <span className="asset-owner-value">{ownerObj.owner}</span>
            </div>
          </div>
        )}
        {/* <div style={{ marginTop: 44 }} className="dao-info-item">
              {formatMessage({ id: 'financial.asset.owner' })}:&nbsp;&nbsp;
              {formatAddress(storageData.owner, 8)}
            </div> */}
        <div
          style={{ marginTop: 44 }}
          className="dao-info-item dao-info-item-address"
        >
          <EllipsisMiddle
            className="dao-info-item-value"
            suffixCount={5}
            onClick={toAddress}
          >
            {contractAddress}
          </EllipsisMiddle>

          {/* {formatAddress(storageData.token, 8)} */}

          {/* <div className="copy">
                <CopyOutlined onClick={copy} />
              </div> */}
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
        {/* <div style={{ marginTop: 40 }}>
              {currentMember.tokenId && owner ? (
                <>
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
            </div> */}
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
          .asset-detail-header {
            display: flex;
          }
          .asset-detail-header-right {
             {
              /* flex: 1 1 auto; */
            }
            margin-left: 83px;
          }
          .asset-name {
            height: 40px;
            font-size: 28px;
            font-family: var(--font-family-600);
            font-weight: 600;
            color: #000000;
            line-height: 40px;
          }

          .asset-tags {
            display: flex;
            align-items: center;
            margin-top: 14px;
            font-size: 18px;
            font-family: var(--font-family-500);
            font-weight: 500;
            color: #000000;
            line-height: 25px;
          }

          .asset-owner {
            display: flex;
            align-items: center;
            margin-top: 16px;
          }

          .asset-owner-right {
            display: flex;
            flex-direction: column;
          }

          .asset-owner-label {
            margin-left: 7px;
            font-size: 12px;
            font-family: var(--font-family-500);
            font-weight: 500;
            color: #818181;
            line-height: 17px;
          }

          .asset-owner-value {
            margin-left: 7px;
            font-size: 16px;
            font-family: var(--font-family-500);
            font-weight: 500;
            color: #000000;
            line-height: 19px;
          }

          .dao-info-item {
            height: 22px;
            margin-top: 20px;
            font-size: 16px;
            font-family: var(--font-family-500);
            font-weight: 500;
            color: #000000;
            line-height: 22px;
          }

          .dao-info-item-address {
            position: relative;
          }

          .dao-info-item-value {
          }

          .dao-info-item-value :global(.ant-typography) {
            font-size: 16px;
            font-family: var(--font-family-500);
            font-weight: 500;
            color: #000000;
            line-height: 22px;
          }

          .dao-info-item-value:hover {
            text-decoration: underline;
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
            font-family: var(--font-family-600);
            font-weight: 600;
            color: #000000;
            line-height: 24px;
          }

          @media screen and (max-width: 1280px) {
            .asset-detail-header-left {
              width: 200px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default App;
