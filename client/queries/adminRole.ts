import { querySubgraph, returnTypes } from "."
type AdminRole = returnTypes.AdminRole

export async function adminsByForum(
  forum: string,
  pageSize: number,
  pageIndex: number
) {
  const skip = pageSize * pageIndex
  const query = `{
    adminRoles(where: { deleted: false }, forum: "${forum}", first: ${pageSize}, skip: ${skip}) {
      id
      user {
        id
      }
      forum {
        id
      }
      deleted
      createdAt
    }
  }`
  const admins: AdminRole[] = (await querySubgraph(query)).data.adminRoles
  return admins
}