import { ethers } from "ethers"
import { POSTER_ADDRESS, POSTER_ABI } from "../constants"
import { validate, actions } from "@postum/json-schema"

const poster = new ethers.Contract(
  POSTER_ADDRESS,
  POSTER_ABI
)

export async function post(content: actions.POSTUM_ACTION, signer: ethers.Signer) {
  validate(content)
  const userPoster = poster.connect(signer)
  await userPoster.post(JSON.stringify(content))
}

export * from "./forum"
export * from "./category"
export * from "./thread"
export * from "./post"
export * from "./adminRole"