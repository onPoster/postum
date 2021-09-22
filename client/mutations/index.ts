import { ethers } from "ethers"
import { POSTER_ADDRESS, POSTER_ABI } from "../constants"
import { validate, actions } from "@postum/json-schema"

const poster = new ethers.Contract(
  POSTER_ADDRESS,
  POSTER_ABI
)

export async function post(
  content: actions.POSTUM_ACTION, 
  signer: ethers.Signer
): Promise<ethers.providers.TransactionResponse> {
  validate(content)
  const userPoster = poster.connect(signer)
  const txResponse: ethers.providers.TransactionResponse = 
    await userPoster.post(JSON.stringify(content))
  return txResponse
}

export * from "./forum"
export * from "./category"
export * from "./thread"
export * from "./post"
export * from "./adminRole"