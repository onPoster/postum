import { returnTypes } from '@postum/client'
import {
  useQuery,
  gql,
  ApolloClient
} from "@apollo/client"

interface ThreadData {
  thread: returnTypes.Thread
}

interface ThreadVars {
  id: string;
}

export const THREAD_FIELDS = gql`
  fragment ThreadFields on Thread {
    id
    title
    author { id }
    forum { id }
    createdAt
  }
`

export const THREAD = gql`
  ${THREAD_FIELDS}
  query Thread($id: String!) {
    thread(id: $id) {
      ...ThreadFields
    }
  }
`

export function useThreadQuery(
  id: string
) {
  return useQuery<ThreadData, ThreadVars>(
    THREAD,
    { variables: { id } }
  )
}

export function optimisticThreadMutation(
  apolloClient: ApolloClient<object>,
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
    createdAt: Math.floor(Date.now()/1000)
  }
  apolloClient.writeQuery({
    query: THREAD,
    variables: { id: newThread.id },
    data: { thread: newThread }
  })
}