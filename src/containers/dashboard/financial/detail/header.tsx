import { useAppSelector } from '@/store/hooks';
import { debounce, formatAddress, imageView2Max } from '@/utils';
import { Avatar, Typography, Col, Image, Row, Tag, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import Ellipsis from '@/components/typography/ellipsis';
import { ETH_CHAINS_INFO } from '@/config/chains';
import BigNumber from 'bignumber.js';

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

  const [imageSize, setImageSize] = useState(0);

  const chainData = ETH_CHAINS_INFO[chainId];

  const onResize = () => {
    const imageWidth = document.querySelector(
      '.asset-detail-header-image',
    ) as any;
    setImageSize(imageWidth?.offsetWidth || 0);
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
    window.open(`${chainData.lookAddr}${storageData.token}`, '_blank');
  };

  const buy = () => {
    window.open(
      `${chainData.opensea}/${storageData.token}/${new BigNumber(
        storageData.tokenId,
      )
        .toFormat()
        .replaceAll(',', '')}`,
      '_blank',
    );

    // https://testnets.opensea.io/zh-CN/assets/goerli/0x1e867336dc6d79052ae65385d629f2e3391000ae/4560955291428245978451205010522475634670296989920826467698835367063246014811
    // https://opensea.io/zh-CN/assets/ethereum/0x5af0d9827e0c53e4799bb226655a1de152a425a5/969
  };

  return (
    <div className="asset-detail-header">
      <Row gutter={24}>
        <Col span={9}>
          <Image
            className="asset-detail-header-image"
            src={imageView2Max({
              url: storageData.imageOrigin || currentDAO.image,
              w: 800,
            })}
            // shape="square"
            // size={{ xs: 200, sm: 200, md: 200, lg: 300, xl: 442, xxl: 442 }}
            // size={imageSize}
            style={{ maxWidth: 442 }}
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
                  {/* <EllipsisMiddle suffixCount={5} copyable onClick={toAddress}>
                    {storageData.token}
                  </EllipsisMiddle> */}
                  {/* {formatAddress(storageData.token, 6, 6)} */}
                  <Ellipsis copyable onClick={toAddress}>
                    {storageData.token}
                  </Ellipsis>
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
                  {/* <EllipsisMiddle suffixCount={5} copyable>
                    {storageData.tokenId}
                  </EllipsisMiddle> */}
                  <Ellipsis copyable>{storageData.tokenId}</Ellipsis>
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
                  {/* <EllipsisMiddle suffixCount={5} copyable>
                    {storageData.uri}
                  </EllipsisMiddle> */}
                  <Ellipsis copyable>{storageData.uri}</Ellipsis>
                </span>
              </Col>
            </Row>

            {address && storageData.selling !== 0 && (
              <Row style={{ marginTop: 40 }}>
                <Button type="primary" className="smart-button" onClick={buy}>
                  Buy
                </Button>
              </Row>
            )}

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
          // ellipsis={{
          //   rows: 3,
          //   expandable: true,
          //   symbol: (
          //     <div style={{ color: '#000' }}>
          //       {formatMessage({ id: 'viewMore' })}
          //     </div>
          //   ),
          // }}
          >
            {storageData.description}
          </Paragraph>
        </div>
      )}

      <style jsx>
        {`
          .asset-detail-header :global(.asset-detail-header-image) {
            object-fit: cover;
          }

          .asset-name {
            height: 40px;
            font-size: 28px;
            font-weight: 600;
            color: #000000;
            line-height: 40px;
          }

          .asset-tags {
            display: flex;
            align-items: center;
            margin-top: 14px;
            font-size: 18px;
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
            font-weight: 500;
            color: #818181;
            line-height: 17px;
          }

          .asset-owner-value {
            margin-left: 7px;
            font-size: 16px;
            font-weight: 500;
            color: #000000;
            line-height: 19px;
          }

          .dao-info-item {
            display: flex;
            height: 22px;
            margin-top: 20px;
            font-size: 16px;
            font-weight: 500;
            color: #000000;
            line-height: 22px;
          }

          .dao-info-item-label {
            font-size: 16px;
            font-weight: 500;
            color: #000000;
            line-height: 22px;
          }
          .dao-info-item-value {
            font-size: 16px;
            font-weight: 500;
            color: #000000;
            line-height: 22px;
          }

          .dao-info-item-value :global(.ant-typography) {
            font-size: 16px;
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
            font-weight: 600;
            color: #000000;
            line-height: 28px;
          }

          .asset-desc :global(.ant-typography) {
            font-size: 14px;
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
