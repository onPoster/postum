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
}

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
  query Forum($id: String!) {
    forum(id: $id) {
      ...ForumFields
    }
  }
`

export function useForumQuery(
  id: string
) {
  return useQuery<ForumData, ForumVars>(
    FORUM,
    { variables: { id } }
  )
}

export function optimisticForumMutation(
  apolloClient: ApolloClient<object>,
  id: string,
  title: string,
  admins: [string, ...string[]]
) {
  const newForum = {
    __typename: "Forum",
    id,
    title,
    createdAt: Math.floor(Date.now()/1000),
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
    variables: { id: newForum.id },
    data: { forum: newForum }
  })
}