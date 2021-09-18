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

export const FORUM_CARD_FIELDS = gql`
  fragment ForumCardFields on Forum {
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
  ${FORUM_CARD_FIELDS}
  query PageOfForums($pageSize: Int!, $skip: Int!) {
    forums(
      where: { deleted: false }, 
      first: $pageSize, 
      skip: $skip,
      orderBy: createdAt,
      orderDirection: desc
    ) {
      ...ForumCardFields
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
  title: string,
  id: string,
) {
  const newForums = {
    __typename: "Forum",
    title,
    id,
    createdAt: Math.floor(Date.now()/1000),
    threads: []
  }
  let forums: returnTypes.Forum[] = [newForums]
  if (data) { forums = forums.concat([...data.forums])}
  apolloClient.writeQuery({
    query: FORUMS,
    variables: forumsVars(),
    data: { forums }
  })
}