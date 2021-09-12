import { ethers } from "ethers"
import { actions } from "@postum/json-schema"
import { post } from "."

export async function createThread(
  signer: ethers.Signer, 
  createThread: actions.CREATE_THREAD
) {
  await post(createThread, signer)
}

export async function deleteThread(
  signer: ethers.Signer, 
  deleteThread: actions.DELETE_THREAD
) {
  await post(deleteThread, signer)
}