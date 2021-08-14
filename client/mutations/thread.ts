import { ethers } from "ethers"
import { 
  CREATE_THREAD,
  DELETE_THREAD
} from "@postum/json-schema"
import { post } from "."

export async function createThread(
  signer: ethers.Signer, 
  createThread: CREATE_THREAD
) {
  await post(createThread, signer)
}

export async function deleteThread(
  signer: ethers.Signer, 
  deleteThread: DELETE_THREAD
) {
  await post(deleteThread, signer)
}