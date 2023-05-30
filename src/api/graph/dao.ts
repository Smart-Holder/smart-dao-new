import { useMemo } from 'react';
import { useLazyQuery } from '@apollo/client';
import { tokenIdFormat } from '@/utils';
import {
  GET_DAOS_ACTION,
  GET_DAO_ACTION,
  GET_DAO_MEMBERS_ACTION,
} from '@/api/gqls/dao';
import {
  ResponseDataType,
  assetPoolProps,
  daosType,
  membersRes,
} from '@/api/typings/dao';
import dayjs from 'dayjs';
import { formatAddress } from '@/utils';

const useLayoutDaos = () => {
  const [fetchMore, { data, loading, error }] = useLazyQuery<ResponseDataType>(
    GET_DAOS_ACTION(),
    {
      fetchPolicy: 'no-cache',
    },
  );
  let dataSource = useMemo(() => {
    let result = Object.assign({}, data);
    result.daos = result.daos?.map((item) => {
      let first = item.assetPool?.find(
        (item: assetPoolProps) => item.type === 'Frist',
      );
      let second = item.assetPool?.find(
        (item: assetPoolProps) => item.type === 'Second',
      );

      let data_members = [...item.memberPool.members];
      data_members.forEach((member, index) => {
        let obj = { ...member };
        obj.owner = member.owner.id;
        obj.tokenId = tokenIdFormat(member.tokenId);
        data_members[index] = obj;
      });

      return {
        ...item,
        time: dayjs.unix(Number(item.time)).valueOf().toString(),
        ledger: item.ledgerPool?.id,
        member: item.memberPool?.id,
        root: item.votePool?.id,
        host: item.host.toLocaleLowerCase(),
        first: first?.id,
        second: second?.id,
        assetIssuanceTax: first?.tax,
        assetCirculationTax: second?.tax,
        executor: item.executor,
        defaultVoteTime: item.votePool.lifespan,
        memberPool: {
          ...item.memberPool,
          members: data_members,
        },
      };
    });
    return result;
  }, [data]);

  return {
    fetchMore,
    data: dataSource,
    loading,
    error,
  };
};

const useDao = () => {
  const [fetchMore, { data, loading, error }] = useLazyQuery<ResponseDataType>(
    GET_DAO_ACTION(),
    {
      fetchPolicy: 'no-cache',
    },
  );

  let dataSource = useMemo(() => {
    if (data?.dao) {
      let result = Object.assign({}, data?.dao);

      let first = result.assetPool?.find(
        (item: assetPoolProps) => item.type === 'Frist',
      );
      let second = result.assetPool?.find(
        (item: assetPoolProps) => item.type === 'Second',
      );

      let data_members = [...result.memberPool.members];
      data_members.forEach((member, index) => {
        let obj = { ...member };
        obj.owner = member.owner.id;
        obj.tokenId = tokenIdFormat(member.tokenId);
        data_members[index] = obj;
      });

      return {
        ...result,
        time: dayjs.unix(Number(result.time)).valueOf().toString(),
        ledger: result.ledgerPool?.id,
        member: result.memberPool?.id,
        root: result.votePool?.id,
        host: result.host.toLocaleLowerCase(),
        first: first?.id,
        second: second?.id,
        assetIssuanceTax: first?.tax,
        assetCirculationTax: second?.tax,
        executor: result.executor,
        defaultVoteTime: result.votePool.lifespan,
        memberPool: {
          ...result.memberPool,
          members: data_members,
        },
      };
    }
  }, [data]);

  return {
    fetchMore,
    data: dataSource,
    loading,
    error,
  };
};

const useDaoMembers = () => {
  const [fetchMore, { data, loading, error }] = useLazyQuery<membersRes>(
    GET_DAO_MEMBERS_ACTION(),
  );

  let dataSource = useMemo(() => {
    if (data?.members) {
      let data_ = [...data.members];

      data_.forEach((member, index) => {
        let obj = { ...member };
        obj.owner = member.owner.id;
        obj.tokenId = tokenIdFormat(member.tokenId);
        data_[index] = obj;
      });
      return data_;
    } else {
      return [];
    }
  }, [data]);

  return {
    data: dataSource,
    loading,
    error,
    fetchMore,
  };
};

export { useLayoutDaos, useDao, useDaoMembers };
