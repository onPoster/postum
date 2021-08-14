import { ethers } from "ethers"
import { 
  GRANT_ADMIN_ROLE,
  REMOVE_ADMIN_ROLE 
} from "@postum/json-schema"
import { post } from "."

export async function grantAdminRole(
  signer: ethers.Signer, 
  grantAdminRole: GRANT_ADMIN_ROLE
) {
  await post(grantAdminRole, signer)
}

export async function removeAdminRole(
  signer: ethers.Signer, 
  removeAdminRole: REMOVE_ADMIN_ROLE
) {
  await post(removeAdminRole, signer)
}