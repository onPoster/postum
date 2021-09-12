import { querySubgraph, returnTypes } from "."
type Category = returnTypes.Category

export async function categoriesByForum(
  forum: string,
  pageSize: number, 
  pageIndex: number
) {
  const skip = pageSize * pageIndex
  const query = `{
    categories(where: { deleted: false }, forum: "${forum}", first: ${pageSize}, skip: ${skip}) {
      id
      title
      description
      forum { id }
      threads(where: { deleted: false }, first: ${pageSize}) {
        id
        author { id }
        title
        deleted
        createdAt
      }
      deleted
      createdAt
      lastEditedAt
    }
  }`
  const categories: Category[] = (await querySubgraph(query)).data.categories
  return categories
}