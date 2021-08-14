import { querySubgraph } from "."

export async function allForums(pageSize: number, pageIndex: number) {
  const skip = pageSize * pageIndex
  const query = `{
    forums(first: ${pageSize}, skip: ${skip}) {
      id
      title
      categories(first: ${pageSize}) {
        id
        title
        description
        forum { id }
        threads(first: 5) {
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
      }
      threads(first: ${pageSize}) {
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
      admin_roles {
        id
        user {
          id
        }
      }
    }
  }`
  return (await querySubgraph(query)).data.forums
}
