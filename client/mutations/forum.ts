import { ethers } from "ethers"
import { actions } from "@postum/json-schema"
import { post } from "."

export async function createForum(
  signer: ethers.Signer, 
  createForum: actions.CREATE_FORUM
) {
  await post(createForum, signer)
}

export async function editForum(
  signer: ethers.Signer,
  editForum: actions.EDIT_FORUM
) {
  await post(editForum, signer)
}

export async function deleteForum(
  signer: ethers.Signer,
  deleteForum: actions.DELETE_FORUM
) {
  await post(deleteForum, signer)
}