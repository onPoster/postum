import { returnTypes } from '@postum/client'

export function shortAccount(account: string): string {
  return account.slice(0, 6) + "…" + account.slice(-4)
}

export function lastUpdated(
  time: number | undefined
): { units: string, ago: number} | undefined {
  if (!time) {
    return undefined
  }
  const lastUpdatedTime = Math.floor(Date.now()/1000) - time
  let lastUpdated = { 
    units: "m", // minutes
    ago: lastUpdatedTime / 60 
  }
  if (lastUpdated.ago > 365 * 24 * 60 ) { 
    lastUpdated.units = "y" // years
    lastUpdated.ago = lastUpdated.ago / (365 * 24 * 60)
  }
  if (lastUpdated.ago > 30 * 24 * 60 ) { 
    lastUpdated.units = "mo" // months
    lastUpdated.ago = lastUpdated.ago / (30 * 24 * 60)
  }
  if (lastUpdated.ago > 7 * 24 * 60 ) { 
    lastUpdated.units = "w" // weeks
    lastUpdated.ago = lastUpdated.ago / (7 * 24 * 60) 
  }
  if (lastUpdated.ago > 24 * 60) { 
    lastUpdated.units = "d" // days
    lastUpdated.ago = lastUpdated.ago / (24 * 60)
  }
  if (lastUpdated.ago > 60) { 
    lastUpdated.units = "h" // hours
    lastUpdated.ago = lastUpdated.ago / 60 
  }
  lastUpdated.ago = Math.floor(lastUpdated.ago)
  return lastUpdated
}

export function adminConnected(forum: returnTypes.Forum, account: string | null | undefined): boolean {
  if (!account) { return false }
  if (forum.admin_roles?.filter((ar: returnTypes.AdminRole) => {
    return ar.user?.id.toLowerCase() === account.toLowerCase()
  }).length > 0) {
    return true
  }
  return false
}