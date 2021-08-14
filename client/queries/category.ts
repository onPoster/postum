import { querySubgraph } from "."

export async function categoriesByForum(
  forum: string,
  pageSize: number, 
  pageIndex: number
) {
  const skip = pageSize * pageIndex
  const query = `{
    categories(forum: "${forum}", first: "${pageSize}", skip: "${skip}") {
      id
      title
      description
      forum { id }
      threads(first: "5") {
        id
        author { id }
        title 
      }
    }
  }`
  return (await querySubgraph(query)).data.categories
}