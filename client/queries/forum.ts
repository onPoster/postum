import { querySubgraph, returnTypes } from "."
type Forum = returnTypes.Forum

export async function forum(id: string) {
  const query = `{
    forums(where: { id: "${id}", deleted: false }) {
      id
      title
      categories(where: { deleted: false }) {
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
            createdAt
            lastEditedAt
          }
          deleted
          createdAt
        }
        deleted
        createdAt
        lastEditedAt
      }
      threads(where: { deleted: false }) {
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
          createdAt
          lastEditedAt
        }
        deleted
        createdAt
      }
      admin_roles(where: { deleted: false }) {
        id
        user {
          id
        }
        deleted
        createdAt
      }
      deleted
      createdAt
      lastEditedAt
    }
  }`
  const forums: Forum[] = (await querySubgraph(query)).data.forums
  if (forums.length != 1) { throw new Error("Forums array length != 1") }
  return forums[0]
}

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
            createdAt
            lastEditedAt
          }
          deleted
          createdAt
        }
        createdAt
        lastEditedAt
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
          createdAt
          lastEditedAt
        }
        deleted
        createdAt
      }
      admin_roles(where: { deleted: false }, first: ${pageSize}) {
        id
        user {
          id
        }
        deleted
        createdAt
      }
      deleted
      createdAt
      lastEditedAt
    }
  }`
  const forums: Forum[] = (await querySubgraph(query)).data.forums
  return forums
}
