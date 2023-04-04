import { useAppSelector } from '@/store/hooks';
import { copyToClipboard, debounce, formatAddress } from '@/utils';
import { Avatar, Typography, Col, Image, message, Row, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import Modal from '@/components/modal';
import { CopyOutlined, LoadingOutlined } from '@ant-design/icons';

import { shelves } from '@/api/asset';
import EllipsisMiddle from '@/components/typography/ellipsisMiddle';
import { ETH_CHAINS_INFO } from '@/config/chains';

const { Text, Paragraph } = Typography;

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
  const [imageSize, setImageSize] = useState(0);

  const chainData = ETH_CHAINS_INFO[chainId];

  const onResize = () => {
    const imageWidth = document.querySelector(
      '.asset-detail-header-image',
    ) as any;
    setImageSize(imageWidth.offsetWidth);
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

  const toAddress = (addr: string) => {
    window.open(`${chainData.lookAddr}${addr}`, '_blank');
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
      <Row gutter={24}>
        <Col span={9} className="asset-detail-header-image">
          <Image
            src={storageData.imageOrigin || currentDAO.image}
            // shape="square"
            // size={{ xs: 200, sm: 200, md: 200, lg: 300, xl: 442, xxl: 442 }}
            // size={imageSize}
            width="100%"
            height={imageSize}
            preview={false}
            alt=""
          />
        </Col>
        <Col span={12} offset={1}>
          <div className="asset-detail-header-right">
            <div className="asset-name">{storageData.name}</div>
            <div className="asset-tags">
              {tags.map((tag: string) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
              #{storageData.id}
            </div>

            {owner && ownerObj.owner && (
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

            <Row style={{ marginTop: 44 }}>
              <Col span={6}>
                <span className="dao-info-item-label">
                  {formatMessage({ id: 'financial.asset.address' })}:
                </span>
              </Col>
              <Col span={18}>
                <span className="dao-info-item-value dao-info-item-value-address">
                  <EllipsisMiddle suffixCount={5} copyable onClick={toAddress}>
                    {storageData.token}
                  </EllipsisMiddle>
                </span>
              </Col>
            </Row>

            <Row style={{ marginTop: 20 }}>
              <Col span={6}>
                <span className="dao-info-item-label">
                  {formatMessage({ id: 'financial.asset.tokenId' })}:
                </span>
              </Col>
              <Col span={18}>
                {/* <span className="dao-info-item-value">
                  {formatAddress(storageData.tokenId, 8)}
                </span> */}
                <span className="dao-info-item-value">
                  <EllipsisMiddle suffixCount={5} copyable>
                    {storageData.tokenId}
                  </EllipsisMiddle>
                </span>
              </Col>
            </Row>

            <Row style={{ marginTop: 20 }}>
              <Col span={6}>
                <span className="dao-info-item-label">
                  {formatMessage({ id: 'financial.asset.chain' })}:
                </span>
              </Col>
              <Col span={18}>
                <span className="dao-info-item-value">{blockchain?.value}</span>
              </Col>
            </Row>

            <Row style={{ marginTop: 20 }}>
              <Col span={6}>
                <span className="dao-info-item-label">
                  {formatMessage({ id: 'financial.asset.metadata' })}:
                </span>
              </Col>
              <Col span={18}>
                <span className="dao-info-item-value">
                  <EllipsisMiddle suffixCount={5} copyable>
                    {storageData.uri}
                  </EllipsisMiddle>
                </span>
              </Col>
            </Row>

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
        </Col>
      </Row>
      {/* <div className="asset-detail-header-left">
        <Avatar
          className="asset-detail-header-left22"
          src={storageData.imageOrigin || currentDAO.image}
          shape="square"
          size={{ xs: 200, sm: 200, md: 200, lg: 300, xl: 442, xxl: 442 }}
          // width={442}
          // height={442}
          // preview={false}
          // alt=""
        />
      </div> */}

      {storageData.description && (
        <div className="asset-desc">
          <div className="asset-desc-title">
            {formatMessage({ id: 'description' })}
          </div>

          <Paragraph
            ellipsis={{
              rows: 3,
              expandable: true,
              symbol: (
                <div style={{ color: '#000' }}>
                  {formatMessage({ id: 'viewMore' })}
                </div>
              ),
            }}
          >
            {storageData.description}
          </Paragraph>
        </div>
      )}

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
            font-family: SFUIText-Medium;
            font-weight: 500;
            color: #818181;
            line-height: 17px;
          }

          .asset-owner-value {
            margin-left: 7px;
            font-size: 16px;
            font-family: SFUIText-Medium;
            font-weight: 500;
            color: #000000;
            line-height: 19px;
          }

          .dao-info-item {
            display: flex;
            height: 22px;
            margin-top: 20px;
            font-size: 16px;
            font-family: SFUIText-Medium;
            font-weight: 500;
            color: #000000;
            line-height: 22px;
          }

          .dao-info-item-label {
            font-size: 16px;
            font-family: SFUIText-Medium;
            font-weight: 500;
            color: #000000;
            line-height: 22px;
          }
          .dao-info-item-value {
            font-size: 16px;
            font-family: SFUIText-Medium;
            font-weight: 500;
            color: #000000;
            line-height: 22px;
          }

          .dao-info-item-value :global(.ant-typography) {
            font-size: 16px;
            font-family: SFUIText-Medium;
            font-weight: 500;
            color: #000000;
            line-height: 22px;
          }

          .dao-info-item-value-address :global(.ant-typography:hover) {
            text-decoration: underline;
            cursor: pointer;
          }

          .asset-desc {
            margin-top: 40px;
          }

          .asset-desc-title {
            height: 28px;
            margin-bottom: 20px;
            font-size: 20px;
            font-family: SFUIText-Semibold;
            font-weight: 600;
            color: #000000;
            line-height: 28px;
          }

          .asset-desc :global(.ant-typography) {
            font-size: 14px;
            font-family: SFUIText-Medium;
            font-weight: 500;
            color: #818181;
            line-height: 28px;
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
