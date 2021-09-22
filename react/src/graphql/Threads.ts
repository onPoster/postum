import { returnTypes } from '@postum/client'
import {
  useQuery,
  gql,
  ApolloClient
} from "@apollo/client"

interface ThreadsData {
  threads: returnTypes.Thread[];
}

interface ThreadsVars {
  forum: string;
  pageSize: number;
  skip: number;
}

export const THREADS_FIELDS = gql`
  fragment ThreadsFields on Thread {
    id
    author { id }
    title
    forum { id }
    posts(orderBy: createdAt, orderDirection: desc) { 
      id 
      createdAt
    }
    createdAt
  }
`

export const THREADS = gql`
  ${THREADS_FIELDS}
  query Threads($forum: String!, $pageSize: Int!, $skip: Int!) {
    threads(
      where: { deleted: false, forum: $forum },
      first: $pageSize,
      skip: $skip,
      orderBy: createdAt,
      orderDirection: desc
    ) {
      ...ThreadsFields
    }
  }
`

const DEF_PAGE_SIZE = 25
const DEF_PAGE = 0

export function threadsVars(
  forumId: string, 
  pageSize: number = DEF_PAGE_SIZE, 
  pageIndex: number = DEF_PAGE
): ThreadsVars {
  return { forum: forumId, pageSize, skip: 25 * pageIndex }
}

export function useThreadsQuery(
  forumId: string, 
  pageSize: number = DEF_PAGE_SIZE, 
  pageIndex: number = DEF_PAGE
) {
  return useQuery<ThreadsData, ThreadsVars>(
    THREADS,
    { variables: threadsVars(forumId, pageSize, pageIndex) }
  )
}

export function optimisticThreadsMutation(
  apolloClient: ApolloClient<object>,
  data: ThreadsData | undefined,
  id: string,
  title: string,
  author: string,
  forum: string
) {
  const newThread = {
    __typename: "Thread",
    id,
    title,
    author: { id: author },
    forum: { id: forum },
    posts: [{ id, createdAt: Math.floor(Date.now()/1000) }],
    createdAt: Math.floor(Date.now()/1000)
  }
  let threads: returnTypes.Thread[] = [newThread]
  if (data) { threads = threads.concat([...data.threads])}
  apolloClient.writeQuery({
    query: THREADS,
    variables: threadsVars(forum),
    data: { threads }
  })
}