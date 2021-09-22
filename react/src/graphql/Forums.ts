import { returnTypes } from '@postum/client'
import {
  useQuery,
  gql,
  ApolloClient
} from "@apollo/client"

interface ForumsData {
  forums: returnTypes.Forum[];
}

interface ForumsVars {
  pageSize: number;
  skip: number;
}

export const FORUMS_FIELDS = gql`
  fragment ForumsFields on Forum {
    id
    title
    createdAt
    threads(where: { deleted: false }, orderBy: createdAt, orderDirection: desc) {
      id
      createdAt
    }
  }
`

export const FORUMS = gql`
  ${FORUMS_FIELDS}
  query Forums($pageSize: Int!, $skip: Int!) {
    forums(
      where: { deleted: false }, 
      first: $pageSize, 
      skip: $skip,
      orderBy: createdAt,
      orderDirection: desc
    ) {
      ...ForumsFields
    }
  }
`

const DEF_PAGE_SIZE = 25
const DEF_PAGE = 0

export function forumsVars(pageSize: number = DEF_PAGE_SIZE, pageIndex: number = DEF_PAGE): ForumsVars {
  return { pageSize, skip: 25 * pageIndex }
}

export function useForumsQuery(pageSize: number = DEF_PAGE_SIZE, pageIndex: number = DEF_PAGE) {
  return useQuery<ForumsData, ForumsVars>(
    FORUMS,
    { variables: forumsVars(pageSize, pageIndex) }
  )
}

export function optimisticForumsMutation(
  apolloClient: ApolloClient<object>,
  data: ForumsData | undefined,
  id: string,
  title: string
) {
  const newForum = {
    __typename: "Forum",
    id,
    title,
    createdAt: Math.floor(Date.now()/1000),
    threads: []
  }
  let forums: returnTypes.Forum[] = [newForum]
  if (data) { forums = forums.concat([...data.forums])}
  apolloClient.writeQuery({
    query: FORUMS,
    variables: forumsVars(),
    data: { forums }
  })
}