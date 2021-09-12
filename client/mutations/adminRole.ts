import { ethers } from "ethers"
import { actions } from "@postum/json-schema"
import { post } from "."

export async function grantAdminRole(
  signer: ethers.Signer, 
  grantAdminRole: actions.GRANT_ADMIN_ROLE
) {
  await post(grantAdminRole, signer)
}

export async function removeAdminRole(
  signer: ethers.Signer, 
  removeAdminRole: actions.REMOVE_ADMIN_ROLE
) {
  await post(removeAdminRole, signer)
}