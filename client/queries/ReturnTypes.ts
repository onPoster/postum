// Based on the Subgraph schema.graphql -- all fields implemented as optional because queries may not return all fields

export interface Forum {
  id?: string
  title?: string
  categories?: Category[]
  threads?: Thread[]
  admin_roles?: AdminRole[]
}

export interface Category {
  id?: string
  title?: string
  description?: string
  forum?: Forum
  threads?: Thread[]
}

export interface Thread {
  id?: string
  author?: User
  title?: string
  forum?: Forum
  category?: Category
  posts?: Post[]
}

export interface Post {
  id?: string
  author?: User
  content?: string
  reply_to_post?: Post
  thread?: Thread
  deleted?: boolean
}

export interface AdminRole {
  id?: string
  user?: User
  forum?: Forum
}

export interface User {
  id?: string
  admin_roles?: AdminRole[]
  threads?: Thread[]
  posts?: Post[]
}