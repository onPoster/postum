import { returnTypes } from '@postum/client'
import {
  useQuery,
  gql,
  ApolloClient
} from "@apollo/client"

interface PostsData {
  posts: returnTypes.Post[];
}

interface PostsVars {
  thread: string;
  pageSize: number;
  skip: number;
}

export const POSTS_FIELDS = gql`
  fragment PostsFields on Post {
    id
    author { id }
    content
    reply_to_post { 
      id
      content
    }
    thread { id }
    createdAt
    lastEditedAt
  }
`

export const POSTS = gql`
  ${POSTS_FIELDS}
  query Posts($thread: String!, $pageSize: Int!, $skip: Int!) {
    posts(
      where: { deleted: false, thread: $thread },
      first: $pageSize,
      skip: $skip,
      orderBy: createdAt,
      orderDirection: asc
    ) {
      ...PostsFields
    }
  }
`

const DEF_PAGE_SIZE = 25
const DEF_PAGE = 0

export function postsVars(
  threadId: string, 
  pageSize: number = DEF_PAGE_SIZE, 
  pageIndex: number = DEF_PAGE
): PostsVars {
  return { thread: threadId, pageSize, skip: 25 * pageIndex }
}

export function usePostsQuery(
  threadId: string, 
  pageSize: number = DEF_PAGE_SIZE, 
  pageIndex: number = DEF_PAGE
) {
  return useQuery<PostsData, PostsVars>(
    POSTS,
    { variables: postsVars(threadId, pageSize, pageIndex) }
  )
}

export function optimisticPostsMutation(
  apolloClient: ApolloClient<object>,
  data: PostsData | undefined,
  id: string,
  author: string,
  content: string,
  thread: string,
  reply_to_post: returnTypes.Post = { id: "", content: "" },
) {
  let newPost = {
    __typename: "Post",
    id,
    author: { id: author },
    content,
    reply_to_post,
    thread: { id: thread },
    createdAt: Math.floor(Date.now()/1000),
    lastEditedAt: 0
  }
  let posts: returnTypes.Post[] = [newPost]
  if (data) { posts = data.posts.concat(posts)}
  apolloClient.writeQuery({
    query: POSTS,
    variables: postsVars(thread),
    data: { posts }
  })
}