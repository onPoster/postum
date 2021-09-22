import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'

import Layout from '../components/Layout'
import { useThreadQuery } from '../graphql/Thread'
import { useForumQuery } from '../graphql/Forum'
import Posts from '../components/Posts'
import { adminConnected } from '../lib/utils'

export default function Thread() {
  const { forumId, threadId } = useParams<{ forumId: string, threadId: string }>()
  const { loading, error, data, stopPolling, startPolling } = useThreadQuery(threadId)
  const forumQuery = useForumQuery(forumId)
  const web3Context = useWeb3React<ethers.providers.Web3Provider>()
  const { account } = web3Context

  function Body() {
    if (loading || forumQuery.loading) return (
      <div className="buttons is-centered">
        <button className="button is-white is-large is-loading" disabled/>
      </div>
    )

    if (error || forumQuery.error || web3Context.error) return (
      <div className="notification is-danger">
        Error: { error || forumQuery.error || web3Context.error }
      </div>
    )

    if (!data || !data.thread || !forumQuery.data) return (
      <div className="notification is-danger"> 
        Error: couldn't find data 
      </div>
    )
    
    return (
      <div>
        <div className="block mb-6">
          <p className="title is-3">{data.thread.title}</p>
          <p className="subtitle is-5 mb-3">
            {"in "}
            <Link to={"/forum/" + forumId}>
              {forumQuery.data.forum.title || "loading..."}
            </Link>
          </p>
          { adminConnected(forumQuery.data.forum, account) &&  
            <a className="button is-small">Delete Thread</a> 
          }
        </div>
        <Posts forum={forumQuery.data.forum}/>
      </div>
    )
  }
  
  return Layout(
    <section className="section">
      <Body />
    </section>
  )
}