import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { store, useGlobalState } from 'state-pool'
import client, { returnTypes } from '@postum/client'

import Layout from '../components/Layout'
import { lastUpdated } from '../lib/utils'

export default function Forum() {
  const { id } = useParams()
  const [forum, setForum, ] = useGlobalState("forum")
  const context = useWeb3React<ethers.providers.Web3Provider>()
  const { connector, chainId, account, activate, deactivate, active } = context

  useEffect(() => {
    if (!forum) {
      client.query.forum(id)
        .then((resultForum) => {
          setForum(resultForum)
        })
    }
  }, [])

  function adminConnected(): boolean {
    if (forum.admin_roles.filter((ar: returnTypes.AdminRole) => {
      return ar.user?.id === account
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
              onClick={() => {
                setForum(thread)
              }}
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
  
  return Layout(
    <div>
      { forum &&
        <section className="section">
          <div className="block mb-6">
            <p className="title is-3 mb-1">{forum.title}</p>
            { adminConnected() &&  <a className="button is-small">Edit Forum</a> }
          </div>
          <div className="block">
            <Link className="button is-medium" to="/new_forum">New Thread</Link>
          </div>
          <div className="block">
            <table className="table is-fullwidth">
              <tbody>
                { forum.threads.map((f: returnTypes.Forum) => { return ThreadCard(f)}) }
              </tbody>
            </table>
          </div>
        </section>
      }
    </div>
  )
}