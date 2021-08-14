// All fields implemented as optional because queries may not return all fields

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

/* === From GraphQL Schema ====

type Forum @entity {
  id: ID!
  title: String!
  categories: [Category!]! @derivedFrom(field: "forum")
  threads: [Thread!]! @derivedFrom(field: "forum")
  admin_roles: [AdminRole!]! @derivedFrom(field: "forum")
}

type Category @entity {
  id: ID!
  title: String!
  description: String!
  forum: Forum!
  threads: [Thread!]! @derivedFrom(field: "category")
}

type Thread @entity {
  id: ID!
  author: User!
  title: String!
  forum: Forum!
  category: Category
  posts: [Post!]! @derivedFrom(field: "thread")
}

type Post @entity {
  id: ID!
  author: User!
  content: String!
  reply_to_post: Post
  thread: Thread!
  deleted: Boolean!
}

type User @entity {
  id: ID!
  admin_roles: [AdminRole!]! @derivedFrom(field: "user")
  threads: [Thread!]! @derivedFrom(field: "author")
  posts: [Post!]! @derivedFrom(field: "author")
}

type AdminRole @entity {
  id: ID!
  user: User!
  forum: Forum!
}

*/