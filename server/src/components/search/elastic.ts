import { Client } from '@elastic/elasticsearch';

import { searchConfig } from '../../config';

export const client = new Client({ node: searchConfig.host });

export const indexExists = async (index: string): Promise<boolean> => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const { body } = await client.indices.exists({ index });
  return Boolean(body);
};

export const refreshIndex = async (index: string): Promise<void> => {
  await client.indices.refresh({ index });
};

export const createIndex = async (
  index: string,
  mappings: any,
): Promise<void> => {
  await client.indices.create({
    index,
    body: {
      mappings,
    },
  });
};

export const searchIndex = async <T = any>({
  index,
  query,
  offset,
  limit,
  sort,
}: {
  index: string;
  query: any;
  offset?: number;
  limit?: number;
  sort?: string[];
}): Promise<
  {
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _source: T;
  }[]
> => {
  const { body } = await client.search({
    index,
    body: {
      query,
    },
    from: offset,
    size: limit,
    sort,
  });

  return body.hits.hits;
};

export const createDocument = async <T>(
  index: string,
  body: T,
): Promise<void> => {
  await client.index({
    index,
    body,
    refresh: 'true',
  });
};

export const updateDocument = async <T>(
  index: string,
  query: any,
  body: T,
): Promise<void> => {
  const [doc] = await searchIndex({ index, query });
  if (doc) {
    await client.update({
      index,
      id: doc._id,
      body: {
        doc: body,
      },
      refresh: 'true',
    });
  }
};
export const deleteDocument = async (
  index: string,
  query: any,
): Promise<void> => {
  const [doc] = await searchIndex({ index, query });
  if (doc) {
    await client.delete({
      index,
      id: doc._id,
      refresh: 'true',
    });
  }
};
