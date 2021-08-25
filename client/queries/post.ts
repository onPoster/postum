import { querySubgraph, Post } from "."

export async function postsByThread(
  thread: string,
  pageSize: number, 
  pageIndex: number
) {
  const skip = pageSize * pageIndex
  const query = `{
    posts(where: { deleted: false }, thread: "${thread}", first: ${pageSize}, skip: ${skip}) {
      id
      author { id }
      thread { id }
      content
      reply_to_post { 
        id
        author { id }
        thread { id }
        content
        reply_to_post { id }
        deleted
      }
      deleted
    }
  }`
  const posts: Post[] = (await querySubgraph(query)).data.posts
  return posts
}

export async function postsByAuthor(
  author: string,
  pageSize: number, 
  pageIndex: number
) {
  const skip = pageSize * pageIndex
  const query = `{
    posts(where: { deleted: false }, author: "${author}", first: ${pageSize}, skip: ${skip}) {
      id
      author { id }
      thread {
        id
        author { id }
        title 
        forum { 
          id
          title
        }
        category { id }
        posts(first: 1) {
          id
          author { id }
          content
          reply_to_post { id }
          deleted
        }
        deleted
      }
      content
      reply_to_post {
        id
        author { id }
        thread { id }
        content
        reply_to_post { id }
        deleted
      }
      deleted
    }
  }`
  const posts: Post[] = (await querySubgraph(query)).data.posts
  return posts
}

/* This doesn't work
export async function postsBySearch(
  searchText: string,
  forum: string,
  pageSize: number, 
  pageIndex: number
) {
  const skip = pageSize * pageIndex
  const query = `{
    posts(
      where: { 
        deleted: false,
      }, 
      forum: "${forum}",
      content_contains: "${searchText}",
      first: ${pageSize}, 
      skip: ${skip}
    ) {
      id
      author { id }
      thread { 
        id
        author { id }
        title 
        forum { 
          id
          title
        }
        category { id }
        posts(first: 1) {
          id
          author { id }
          content
          reply_to_post { id }
          deleted
        }
        deleted
      }
      content
      reply_to_post {
        id
        author { id }
        thread { id }
        content
        reply_to_post { id }
        deleted
      }
      deleted
    }
  }`
  const posts: Post[] = (await querySubgraph(query)).data.posts
  return posts
}
*/

export async function postsBySearch(
  searchText: string,
  pageSize: number, 
  pageIndex: number
) {
  const skip = pageSize * pageIndex
  const query = `{
    postSearch(text: "${searchText}", first: ${pageSize}, skip: ${skip}) {
      id
      author { id }
      thread { 
        id
        author { id }
        title 
        forum { 
          id
          title
        }
        category { id }
        posts(first: 1) {
          id
          author { id }
          content
          reply_to_post { id }
          deleted
        }
      }
      content
      reply_to_post {
        id
        author { id }
        thread { id }
        content
        reply_to_post { id }
        deleted
      }
      deleted
    }
  }`
  return (await querySubgraph(query)).data.postSearch
}

export async function postsBySearchAndForum(
  searchText: string,
  forum: string,
  pageSize: number, 
  pageIndex: number
) {
  const skip = pageSize * pageIndex
  const query = `{
    postSearch(
      text: "${searchText}", 
      forum: "${forum}",
      first: ${pageSize}, 
      skip: ${skip}
    ) {
      id
      author { id }
      thread {
        id
        author { id }
        title 
        forum { id }
        category { id }
        posts(first: 1) {
          id
          author { id }
          content
          reply_to_post { id }
          deleted
        }
      }
      content
      reply_to_post {
        id
        author { id }
        thread { id }
        content
        reply_to_post { id }
        deleted
      }
      deleted
    }
  }`
  console.log((await querySubgraph(query)).data)
  return (await querySubgraph(query)).data.postSearch
}

export async function postsBySearchAndThread(
  searchText: string,
  thread: string,
  pageSize: number, 
  pageIndex: number
) {
  const skip = pageSize * pageIndex
  const query = `{
    postSearch(
      text: "${searchText}", 
      thread: "${thread}",
      first: ${pageSize}, 
      skip: ${skip}
    ) {
      id
      author { id }
      thread {
        id
        author { id }
        title 
        forum { id }
        category { id }
        posts(first: 1) {
          id
          author { id }
          content
          reply_to_post { id }
          deleted
        }
      }
      content
      reply_to_post {
        id
        author { id }
        thread { id }
        content
        reply_to_post { id }
        deleted
      }
      deleted
    }
  }`
  return (await querySubgraph(query)).data.postSearch
}