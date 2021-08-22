import { querySubgraph, Forum } from "."

export async function allForums(pageSize: number, pageIndex: number) {
  const skip = pageSize * pageIndex
  const query = `{
    forums(where: { deleted: false }, first: ${pageSize}, skip: ${skip}) {
      id
      title
      categories(where: { deleted: false }, first: ${pageSize}) {
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
          deleted
        }
      }
      threads(where: { deleted: false }, first: ${pageSize}) {
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
        deleted
      }
      admin_roles(where: { deleted: false }, first: ${pageSize}) {
        id
        user {
          id
        }
        deleted
      }
      deleted
    }
  }`
  const forums: Forum[] = (await querySubgraph(query)).data.forums
  return forums
}
