import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { returnTypes } from '@postum/client'

import Layout from '../components/Layout'
import { useForumQuery } from '../graphql/Forum'
import Threads from '../components/Threads'
import { adminConnected } from '../lib/utils'

export default function Forum() {
  const { forumId } = useParams<{ forumId: string }>()
  const { loading, error, data, stopPolling, startPolling } = useForumQuery(forumId)
  const web3Context = useWeb3React<ethers.providers.Web3Provider>()
  const { account } = web3Context

  function Body() {
    if (loading) return (
      <div className="buttons is-centered">
        <button className="button is-white is-large is-loading" disabled/>
      </div>
    )

    if (error || web3Context.error) return (
      <div className="notification is-danger">
        Error: { error || web3Context.error } 
      </div>
    )

    if (!data || !data.forum) return (
      <div className="notification is-danger">
        Error: couldn't find data
      </div>
    )
    
    return (
      <div>
        <div className="block mb-6">
          <p className="title is-3 mb-3">{data.forum.title}</p>
          { adminConnected(data.forum, account) &&  <a className="button is-small">Edit Forum</a> }
        </div>
        <div className="block">
          <Link className="button is-medium" to={"/new_thread/" + forumId}>New Thread</Link>
        </div>
        <Threads />
      </div>
    )
  }
  
  return Layout(
    <section className="section">
      <Body />
    </section>
  )
}