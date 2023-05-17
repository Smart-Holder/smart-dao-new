import { gql, useQuery } from '@apollo/client';

export { gql, useQuery };

export interface Options {
  first?: number;
  skip?: number;
  orderDirection?: 'desc' | 'asc';
  orderBy?: string;
  where?: Dict;
  subs?: Dict<Options>;
}

export function stringifyOptions(opts?: Options, defaults?: Options) {
  let defaults_: any = defaults || {};
  let opts_ = { ...defaults_, opts };
  let str = ``;
  for (let [k, v] of Object.entries(opts_)) {
    if (v !== null && v !== undefined && k != 'subs') {
      if ('where' == k || typeof v == 'object') {
        str += `,${k}: { ${stringifyOptions(v as any, defaults_[k])} }`;
      } else {
        str += `,${k}: ${v}`;
      }
    }
  }
  return str;
}

export const stringify = stringifyOptions;

const GET_ALL_DAOS_QRL_DEMO = (opts: Options) => gql`
	query GetAllDaos {
		daos(${stringify(opts, {
      orderDirection: 'desc',
      first: 4,
      orderBy: 'blockNumber',
    })}) {
			id
			blockNumber
			extend
			name
			description
			image
			memberPool {
				count
				id
				members(${stringify(opts.subs?.members, {
          orderBy: 'tokenId',
          orderDirection: 'asc',
        })}) {
					id
					image
					name
					tokenId
				}
			}
			accounts {
				id
			}
			votePool {
				id
			}
		}
		statistic(id: "0x0000000000000000000000000000000000000000") {
			totalDAOs
		}
	}
`;

export const getAllDOAs_DEMO = ({
  first,
  skip,
  image,
  id,
}: {
  first?: number;
  skip?: number;
  image?: string;
  id?: number;
}) => {
  return useQuery<any>(
    GET_ALL_DAOS_QRL_DEMO({ first, skip, where: { image, id } }),
  );
};
