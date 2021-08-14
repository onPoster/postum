import { ethers } from "ethers"
import {
  CREATE_FORUM,
  DELETE_FORUM,
  EDIT_FORUM
} from "@postum/json-schema"
import { post } from "."

export async function createForum(
  signer: ethers.Signer, 
  createForum: CREATE_FORUM
) {
  await post(createForum, signer)
}

export async function editForum(
  signer: ethers.Signer,
  editForum: EDIT_FORUM
) {
  await post(editForum, signer)
}

export async function deleteForum(
  signer: ethers.Signer,
  deleteForum: DELETE_FORUM
) {
  await post(deleteForum, signer)
}