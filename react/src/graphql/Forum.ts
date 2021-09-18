import { returnTypes } from '@postum/client'
import {
  useQuery,
  gql,
  ApolloClient
} from "@apollo/client"

interface ForumData {
  forum: returnTypes.Forum
}

interface ForumVars {
  id: string;
  threadPageSize: number;
  threadSkip: number;
}

export const FORUM_THREAD_FIELDS = gql`
  fragment ForumThreadFields on Thread {
    id
    author
    title
    posts { id }
    createdAt
  }
`

export const FORUM_FIELDS = gql`
  fragment ForumFields on Forum {
    id
    title
    createdAt
    lastEditedAt
    deleted
    deletedAt
    admin_roles(where: { deleted: false }) {
      user { id }
    }
  }
`

export const FORUM = gql`
  ${FORUM_FIELDS}
  ${FORUM_THREAD_FIELDS}
  query Forum($id: String!, $threadPageSize: Int!, $threadSkip: Int!) {
    forum(id: $id) {
      ...ForumFields
      threads(
        where: { deleted: false }, 
        orderBy: createdAt, 
        orderDirection: desc,
        first: $threadPageSize,
        skip: $threadSkip
      ) {
        ...ForumThreadFields
      }
    }
  }
`

const DEF_PAGE_SIZE = 25
const DEF_PAGE = 0

export function forumVars(
  id: string, 
  threadPageSize: number = DEF_PAGE_SIZE, 
  threadPageIndex: number = DEF_PAGE
): ForumVars {
  return { id, threadPageSize, threadSkip: 25 * threadPageIndex }
}

export function useForumQuery(
  id: string, 
  threadPageSize: number = DEF_PAGE_SIZE, 
  threadPageIndex: number = DEF_PAGE
) {
  return useQuery<ForumData, ForumVars>(
    FORUM,
    { variables: forumVars(id, threadPageSize, threadPageIndex) }
  )
}

export function optimisticForumMutation(
  apolloClient: ApolloClient<object>,
  title: string,
  id: string,
  admins: [string, ...string[]]
) {
  const newForum = {
    __typename: "Forum",
    title,
    id,
    createdAt: Math.floor(Date.now()/1000),
    threads: [],
    admin_roles: admins.map(address => {
      return { 
        user: { id: address } 
      }
    }),
    lastEditedAt: null,
    deleted: false,
    deletedAt: null
  }
  apolloClient.writeQuery({
    query: FORUM,
    variables: forumVars(newForum.id),
    data: { forum: newForum }
  })
}