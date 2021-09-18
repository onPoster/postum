import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import client, { returnTypes } from '@postum/client'
import { useApolloClient } from "@apollo/client";

import Layout from '../components/Layout'
import { lastUpdated } from '../lib/utils'
import { useForumQuery, FORUM, forumVars } from '../graphql/Forum'

export default function Forum() {
  const { id } = useParams()
  const context = useWeb3React<ethers.providers.Web3Provider>()
  const { connector, chainId, account, activate, deactivate, active } = context
  const apolloClient = useApolloClient()
  const { loading, error, data, stopPolling, startPolling } = useForumQuery(id)

  function adminConnected(forum: returnTypes.Forum, account: string | null | undefined): boolean {
    if (!account) { return false }
    if (forum.admin_roles?.filter((ar: returnTypes.AdminRole) => {
      return ar.user?.id.toLowerCase() === account.toLowerCase()
    }).length > 0) {
      return true
    }
    return false
  }

  function ThreadCard(thread: returnTypes.Thread) {
    const posts = thread.posts
    let updated
    if (posts && posts.length) {
      updated = lastUpdated(posts[0].createdAt)
    }
    if (!updated) {
      updated = lastUpdated(thread.createdAt)
    }
  
    return (
      <tr key={thread.id}>
          <th> 
            <Link 
              className="has-text-dark has-text-weight-normal is-size-5" 
              to={`/forum/${thread.id}`}
            >
              { thread.title } 
            </Link>
          </th>
          <td className="is-size-5"> { thread.posts?.length } </td>
          { updated && 
            <td className="has-text-grey-light is-size-5">
              ~{ updated.ago }{ updated.units }
            </td> 
          }
      </tr>
    )
  }

  function Body() {
    if (loading) return (
      <div className="buttons is-centered">
        <button className="button is-white is-large is-loading" disabled/>
      </div>
    )

    if (error) return <div className="notification is-danger"> Error: { error } </div>

    if (!data || !data.forum) return <div className="notification is-danger"> Error: couldn't find data </div>
    
    return (
      <div>
        <div className="block mb-6">
          <p className="title is-3 mb-1">{data.forum.title}</p>
          { adminConnected(data.forum, account) &&  <a className="button is-small">Edit Forum</a> }
        </div>
        <div className="block">
          <Link className="button is-medium" to="/new_forum">New Thread</Link>
        </div>
        <div className="block">
          <table className="table is-fullwidth">
            <tbody>
              { data.forum.threads?.map((f: returnTypes.Forum) => { return ThreadCard(f)}) }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  
  return Layout(
    <section className="section">
      <Body />
    </section>
  )
}