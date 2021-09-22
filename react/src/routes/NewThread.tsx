import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import client from '@postum/client'
import { actions } from "@postum/json-schema"
import { useApolloClient } from "@apollo/client"

import Layout from '../components/Layout'
import { useThreadsQuery, optimisticThreadsMutation } from '../graphql/Threads'
import { useForumQuery } from '../graphql/Forum'
import { optimisticThreadMutation } from '../graphql/Thread'
import { NotificationsContext, newNotification } from '../components/Notifications'

function newCreateThread(): actions.CREATE_THREAD {
  return { 
    action: "CREATE_THREAD", 
    args: {
      forum: "",
      title: "",
      content: ""
    }
  }
}

export default function NewThread() {
  const { forumId } = useParams()
  const apolloClient = useApolloClient()
  const web3Context = useWeb3React<ethers.providers.Web3Provider>()
  const { library } = web3Context
  const [formError, setFormError] = useState<string>("")
  const { notifications, setNotifications } = React.useContext(NotificationsContext)
  const { data, loading, error, stopPolling, startPolling } = useThreadsQuery(forumId)
  const forumQuery = useForumQuery(forumId)
  const history = useHistory()

  let createThread = newCreateThread()

  const handleSubmit = async () => {
    if (!library) {
      setFormError("Must connect an Ethereum account.")
      return
    }

    // grab form data arguments
    createThread.args = {
      title,
      forum: forumId,
      content
    }

    // get signer needed for eth tx
    const signer = await library.getSigner()

    try {
      // submit eth tx
      const txResponse = await client.mutate.createThread(signer, createThread)

      // notify user that eth tx is pending
      newNotification(
        notifications,
        {
          id: txResponse.hash,
          text: "Waiting for blockchain to confirm new thread...",
          loading: true
        },
        setNotifications
      )

      // copy args so we can ungrab form data
      const argsCopy = Object.assign({}, createThread.args)
      // ungrab form data
      createThread = newCreateThread()
      // send user back to forum page
      history.push(`/forum/${forumId}`)

      // wait for eth tx confirmation
      const txReceipt = await txResponse.wait()
      const threadId = txReceipt.transactionHash

      // once eth tx is confirmed, optimistically mutate local state
      optimisticThreadsMutation(
        apolloClient, 
        data,
        threadId,
        await signer.getAddress(),
        title,
        forumId
      )
      optimisticThreadMutation(
        apolloClient,
        threadId,
        title,
        await signer.getAddress(),
        forumId
      )

      // notify user that their new data is available and link them to it
      newNotification(
        notifications,
        {
          id: txResponse.hash,
          text: `New thread confirmed: ${argsCopy.title}`,
          loading: false,
          route: `/thread/${forumId}/${threadId}`
        },
        setNotifications
      )
    } catch (e) {
      setFormError(e.message)
    }
  }

  // form field state
  const [title, setTitle] = useState<string>("")
  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value)
  }

  const [content, setContent] = useState<string>("")
  const handleContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.currentTarget.value)
  }

  useEffect(() => {}, [formError])

  /*
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

  if (!data || !data.threads || !forumQuery.data?.forum) return (
    <div className="notification is-danger">
      Error: couldn't find data
    </div>
  )
  */
  
  return Layout(
    <section className="section">
      <p className="title is-3">New Thread</p>
      <p className="subtitle is-6">
        {"in "}
        <Link to={"/forum/" + forumId}>
          {forumQuery.data?.forum?.title || "loading..."}
        </Link>
      </p>
      <form className="block">
        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <input 
              className="input" 
              type="text" 
              placeholder="e.g. New Thread"
              onChange={handleTitle}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">First Post</label>
          <div className="control">
            <textarea
              className="textarea"
              placeholder="e.g. I've been thinking..."
              onChange={handleContent}
            />
          </div>
        </div>
      </form>
      { formError && 
        <div className="notification is-danger">
          <button className="delete" onClick={() => { setFormError("") }}></button>
          Error: {formError}
        </div>
      }
      <div className="buttons">
        <a className="button is-dark" onClick={handleSubmit}>Submit</a>
        <Link className="button" to={"/forum/" + forumId}>Cancel</Link>
      </div>
    </section>
  )
}