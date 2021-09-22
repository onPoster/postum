// Based on the Subgraph schema.graphql -- all fields implemented as optional because queries may not return all fields

export interface Forum {
  id?: string
  title?: string
  categories?: Category[]
  threads?: Thread[]
  admin_roles?: AdminRole[]
  createdAt?: number
  lastEditedAt?: number
  deletedAt?: number
}

export interface Category {
  id?: string
  title?: string
  description?: string
  forum?: Forum
  threads?: Thread[]
  createdAt?: number
  lastEditedAt?: number
  deletedAt?: number
}

export interface Thread {
  id?: string
  author?: User
  title?: string
  forum?: Forum
  category?: Category
  posts?: Post[]
  createdAt?: number
  deletedAt?: number
}

export interface Post {
  id?: string
  author?: User
  content?: string
  reply_to_post?: Post
  thread?: Thread
  deleted?: boolean
  createdAt?: number
  lastEditedAt?: number
  deletedAt?: number
}

export interface AdminRole {
  id?: string
  user?: User
  forum?: Forum
  createdAt?: number
  deletedAt?: number
}

export interface User {
  id?: string
  admin_roles?: AdminRole[]
  threads?: Thread[]
  posts?: Post[]
  createdAt?: number
}