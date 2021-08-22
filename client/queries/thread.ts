import { querySubgraph, Thread } from "."

export async function threadsByForum(
  forum: string,
  pageSize: number, 
  pageIndex: number
) {
  const skip = pageSize * pageIndex
  const query = `{
    threads(where: { deleted: false }, forum: "${forum}", first: ${pageSize}, skip: ${skip}) {
      id
      author { id }
      title
      forum { id }
      category { id }
      posts(where: { deleted: false }, first: ${pageSize}) {
        id
        author { id }
        content
        reply_to_post { id }
        deleted
      }
    }
  }`
  const threads: Thread[] = (await querySubgraph(query)).data.threads
  return threads
}

export async function threadsByAuthor(
  author: string,
  pageSize: number, 
  pageIndex: number
) {
  const skip = pageSize * pageIndex
  const query = `{
    threads(where: { deleted: false }, author: "${author}", first: ${pageSize}, skip: ${skip}) {
      id
      author { id }
      title 
      forum { 
        id
        title
        deleted
      }
      category { 
        id
        title
        deleted
      }
      posts(where: { deleted: false }, first: ${pageSize}) {
        id
        author { id }
        content
        reply_to_post { id }
        deleted
      }
      deleted
    }
  }`
  const threads: Thread[] = (await querySubgraph(query)).data.threads
  return threads
}