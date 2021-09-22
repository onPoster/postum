import axios from "axios"

// const subgraphURI = "http://localhost:8000/subgraphs/name/EzraWeller/postum"
export const subgraphURI = "https://api.thegraph.com/subgraphs/name/ezraweller/postum-rinkeby"

export async function querySubgraph(query: string) {
  let res
  try {
    res = (await axios.post(subgraphURI, { query })).data
  } catch (err) {
    console.error('Graph Query Error: ', err)
  }
  return res
}

export * from "./forum"
export * from "./adminRole"
export * from "./category"
export * from "./thread"
export * from "./post"
import * as returnTypes from "./ReturnTypes"
export { returnTypes }

/**
 * TODO needed queries
 * - all forums
 *  - day 2: forums by text search
 * 
 * - categories by forum
 * 
 * - threads by forum
 * - threads by author
 * 
 * - posts by thread
 * - posts by forum and text search
 *  - day 2: threads by category and text search
 * - posts by thread and text search
 * - posts by author
 */