import { useRef } from 'react';
import { useIntl } from 'react-intl';
import { Layout, Space, Button, Avatar, Typography } from 'antd';
import { useRouter } from 'next/router';
// import Image from 'next/image';

import Menu from '@/components/menu/dashboardMenu';

import { useAppSelector } from '@/store/hooks';
import { UserOutlined } from '@ant-design/icons';
import { formatAddress } from '@/utils';

import RoleModal from '@/components/modal/roleModal';

// import logo from '/public/logo.png';

const { Paragraph } = Typography;

const App = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const userAvatar =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==';

  const roleModal: any = useRef(null);

  const { currentDAO, currentMember } = useAppSelector((store) => store.dao);

  const handleClick = () => {
    router.push('/');
  };

  const onChange = () => {
    roleModal.current.show();
  };

  return (
    <Layout.Sider
      width="240"
      style={{
        overflow: 'auto',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        height: '100vh',
        backgroundColor: 'white',
        boxShadow: '18px 4px 35px 0px rgba(0,0,0,0.02)',
      }}
    >
      <div className="top">
        <Space size={13}>
          <span className="logo" onClick={handleClick}></span>
          {/* <Image
            style={{ cursor: 'pointer' }}
            src={logo}
            alt="logo"
            width={85}
            height={35}
            onClick={handleClick}
          /> */}
          <span className="name" onClick={handleClick}>
            SmartDAO
          </span>
        </Space>
      </div>

      {/* DAO image and name */}
      <div className="user">
        <Space size={16}>
          {currentDAO.image ? (
            <Avatar size={44} src={currentDAO.image} />
          ) : (
            // <Avatar size={44} icon={<UserOutlined />} />
            <Avatar size={44} src={userAvatar} />
          )}

          <span className="username">
            {currentDAO.name ? (
              <Paragraph ellipsis={{ rows: 1 }}>{currentDAO.name}</Paragraph>
            ) : (
              currentDAO.address
            )}
          </span>
        </Space>
      </div>

      <div className="role">
        <Space size={10}>
          {currentMember.image ? (
            <Avatar size={30} src={currentMember.image} />
          ) : (
            <Avatar size={44} icon={<UserOutlined />} />
          )}
          <span className="rolename">
            {currentMember.name ? (
              <Paragraph ellipsis={{ rows: 1 }}>{currentMember.name}</Paragraph>
            ) : (
              formatAddress(currentMember.host)
            )}
          </span>
          <Button type="primary" onClick={onChange}>
            {formatMessage({ id: 'sider.change' })}
            {/* Change */}
          </Button>
        </Space>
      </div>

      <Menu />

      <RoleModal ref={roleModal} />

      <style jsx>
        {`
          .top {
            padding: 21px 10px 16px 32px;
          }

          .top .logo {
            display: inline-block;
            width: 44px;
            height: 44px;
            background: linear-gradient(164deg, #2f4cdd 0%, #d45bff 100%);
            border-radius: 6px;
            cursor: pointer;
          }

          .top .name {
            font-size: 24px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #3c4369;
            line-height: 44px;
            cursor: pointer;
          }

          .user {
            padding: 16px 10px 16px 32px;
          }

          .user .username {
            font-size: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #393939;
            line-height: 28px;
          }

          .user .username :global(.ant-typography) {
            width: 130px;
            margin-bottom: 0;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #393939;
            line-height: 22px;
          }

          .role {
            padding: 19px 12px;
            border-top: 1px solid #e5e7e8;
          }

          .role .rolename {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #393939;
            line-height: 22px;
          }

          .role .rolename :global(.ant-typography) {
            width: 80px;
            margin-bottom: 0;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #393939;
            line-height: 22px;
          }
        `}
      </style>
    </Layout.Sider>
  );
};

export default App;
