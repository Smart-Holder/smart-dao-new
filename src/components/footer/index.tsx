import { Col, Layout, Row, Space, Image } from 'antd';

const { Footer } = Layout;

const App = ({ hasSider }: { hasSider?: boolean }) => {
  return (
    <Footer className="footer">
      <div
        className={`${hasSider ? 'footer-content-hasSider' : 'footer-content'}`}
      >
        <Row gutter={16} style={{ width: '100%' }}>
          <Col span={12}>
            <div className="left">
              <Image
                src="/images/icon_logo_white@2x.png"
                alt="logo"
                width={174}
                height={60}
                preview={false}
              />
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
                <Image
                  src="/images/footer/icon_footer_social_facebook@2x.png"
                  alt="logo"
                  width={30}
                  height={30}
                  preview={false}
                />
                <Image
                  src="/images/footer/icon_footer_social_linkedin@2x.png"
                  alt="logo"
                  width={30}
                  height={30}
                  preview={false}
                />
                <Image
                  src="/images/footer/icon_footer_social_twitter@2x.png"
                  alt="logo"
                  width={30}
                  height={30}
                  preview={false}
                />
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
            max-width: var(--max-width);
            height: var(--height-footer);
            padding: 63px 80px 5px;
            margin: 0 auto;
          }

          .footer-content-hasSider {
            box-sizing: border-box;
            height: var(--height-footer);
            margin-left: 298px;
            padding: 63px 80px 5px;
          }

          .desc1 {
            width: 400px;
            margin-top: 17px;
            font-size: 16px;
            font-family: SFUIText-Regular;
            color: #ffffff;
            line-height: 28px;
          }

          .desc2 {
            margin-top: 5px;
            font-size: 14px;
            font-family: SFUIText-Regular;
            font-weight: 400;
            color: #ffffff;
            line-height: 20px;
          }

          .right {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            font-size: 12px;
            font-family: SFUIText-Regular;
            color: #ffffff;
            line-height: 37px;
          }

          .bottom {
            margin-top: 65px;
            font-size: 12px;
            font-family: SFUIText-Regular;
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
};

export default App;
