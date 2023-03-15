import { useRef, useState } from 'react';
import { Layout, message } from 'antd';
import { useRouter } from 'next/router';
import { rng } from 'somes/rng';
import { useIntl } from 'react-intl';

import Menu from '@/components/sider/dashboardSiderVisitorMenu';
import InfoDAO from '@/components/sider/infoDAO';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setDAOType } from '@/store/features/daoSlice';

import { join } from '@/api/member';
import { request } from '@/api';
import { Permissions } from '@/config/enum';

const App = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { nickname, image } = useAppSelector((store) => store.user.userInfo);
  const { addressFormat, chainId, address } = useAppSelector(
    (store) => store.wallet,
  );
  const { currentDAO, DAOType } = useAppSelector((store) => store.dao);

  const [loading, setLoading] = useState(false);

  const goHome = () => {
    router.push('/');
  };

  const setJoin = async () => {
    try {
      const params = {
        name: formatMessage({ id: 'proposal.basic.addNFTP' }),
        description: JSON.stringify({
          type: 'member',
          purpose: `${formatMessage({
            id: 'proposal.basic.addNFTP',
          })}: ${address}`,
        }),
        extra: [
          {
            abi: 'member',
            method: 'requestJoin',
            params: [
              address,
              {
                id: '0x' + rng(32).toString('hex'),
                name: '',
                description: '',
                image: '',
                votes: 1,
              },
              [
                Permissions.Action_VotePool_Vote,
                Permissions.Action_VotePool_Create,
              ],
            ],
          },
        ],
      };

      setLoading(true);
      await join({ votePool: currentDAO.root, member: currentDAO.member });
      // message.success('success');
      // await createDAOVote(params);
      message.success(formatMessage({ id: 'governance.proposal.success' }));
      setLoading(false);
      // dispatch(setDAOType('joining'));
      // window.location.reload();
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      message.error(error?.message);
    }
  };

  const setFollow = async () => {
    try {
      await request({
        name: 'user',
        method: 'addLikeDAO',
        params: { dao: currentDAO.id, chain: chainId },
      });

      message.success('success');
      dispatch(setDAOType('follow'));
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout.Sider
      width="298"
      style={{
        overflow: 'auto',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        height: '100vh',
        padding: '76px 32px 0',
        backgroundColor: 'white',
        borderRight: '1px solid #f5f5f5',
      }}
    >
      <InfoDAO />
      <Menu />
    </Layout.Sider>
  );
};

export default App;
