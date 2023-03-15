import { Col, Layout, Row, Space } from 'antd';
import Image from 'next/image';

import logo from '/public/images/icon_logo_white.png';
import facebook from '/public/images/footer/icon_footer_social_facebook.png';
import linkedin from '/public/images/footer/icon_footer_social_linkedin.png';
import twitter from '/public/images/footer/icon_footer_social_twitter.png';

const { Footer } = Layout;

export default function Home() {
  return (
    <Footer className="footer">
      <div className="footer-content">
        <Row gutter={16} style={{ width: '100%' }}>
          <Col span={12}>
            <div className="left">
              <Image src={logo} alt="logo" width={175} height={54} />
              <div className="desc1">
                Build a platform to help web2 stars, sports and artists quickly
                enter the web3 world
              </div>
              <div className="desc2">Powered by Smartholder.</div>
            </div>
          </Col>
          <Col span={12}>
            <div className="right">
              <Space size={38}>
                <span>TERM & CONDITION</span>
                <span>PRIVACY POLICY</span>
                <span>ABOUT US</span>
                <span>FAQ</span>
              </Space>
              <Space size={32} style={{ marginTop: 43 }}>
                <Image src={facebook} alt="logo" width={30} height={30} />
                <Image src={linkedin} alt="logo" width={30} height={30} />
                <Image src={twitter} alt="logo" width={30} height={30} />
              </Space>
            </div>
          </Col>
        </Row>

        <div className="bottom">
          CopyRight © 2023 SmartDAO. All Rights Reserved
        </div>
      </div>

      <style jsx>
        {`
          .footer-content {
            max-width: var(--width);
            padding: 63px 80px 5px;
            margin: 0 auto;
          }

          .desc1 {
            width: 400px;
            margin-top: 17px;
            font-size: 16px;
            font-family: HelveticaNeue;
            color: #ffffff;
            line-height: 28px;
          }

          .desc2 {
            margin-top: 5px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            line-height: 20px;
          }

          .right {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            font-size: 12px;
            font-family: HelveticaNeue;
            color: #ffffff;
            line-height: 37px;
          }

          .bottom {
            margin-top: 65px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #6f6f6f;
            line-height: 37px;
            letter-spacing: 1px;
            text-align: center;
          }
        `}
      </style>
    </Footer>
  );
}
