import React, { useEffect, useState } from 'react'
import client, { returnTypes } from '@postum/client'
import { actions } from "@postum/json-schema"
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useApolloClient } from "@apollo/client"

import { POSTS, usePostsQuery, optimisticPostsMutation } from '../graphql/Posts'
import { NotificationsContext, newNotification } from './Notifications'

function newCreatePost(): actions.CREATE_POST {
  return {
    action: "CREATE_POST",
    args: {
      thread: "",
      content: ""
    }
  }
}

interface NewPostProps {
  threadId: string;
  forumId: string;
  reply_to_post?: returnTypes.Post;
  close: () => void;
}

// TODO add reply_to_post stuff

export default function NewPost(props: NewPostProps) {
  const apolloClient = useApolloClient()
  const { loading, error, data } = usePostsQuery(props.threadId)
  const [formError, setFormError] = useState<string>("")
  const { notifications, setNotifications } = React.useContext(NotificationsContext)
  const web3Context = useWeb3React<ethers.providers.Web3Provider>()
  const { library } = web3Context

  let createPost = newCreatePost()

  const handleSubmit = async () => {
    if (!library) {
      setFormError("Must connect an Ethereum account.")
      return
    }

    // grab form data arguments
    createPost.args = {
      thread: props.threadId,
      content
    }

    // get signer needed for eth tx
    const signer = await library.getSigner()

    try {
      // submit eth tx
      const txResponse = await client.mutate.createPost(signer, createPost)

      // notify user that eth tx is pending
      newNotification(
        notifications,
        {
          id: txResponse.hash,
          text: "Waiting for blockchain to confirm new post...",
          loading: true
        },
        setNotifications
      )

      // copy args so we can ungrab form data
      const argsCopy = Object.assign({}, createPost.args)
      // ungrab form data
      createPost = newCreatePost()
      // send user back to the thread
      props.close()

      // wait for eth tx confirmation
      const txReceipt = await txResponse.wait()
      const postId = txReceipt.transactionHash

      // once eth tx is confirmed, optimistically mutate local state
      optimisticPostsMutation(
        apolloClient, 
        data,
        postId,
        await signer.getAddress(),
        content,
        props.threadId
      )

      // notify user that their new data is available and link them to it
      newNotification(
        notifications,
        {
          id: txResponse.hash,
          text: `New post confirmed: "${argsCopy.content.split(' ').slice(0, 4).join(' ')}..."`,
          loading: false,
          route: `/thread/${props.forumId}/${props.threadId}`
        },
        setNotifications
      )
    } catch(e) {
      setFormError("Failed to submit new post")
    }
  }

  const [content, setContent] = useState<string>("")
  const handleContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.currentTarget.value)
  }

  useEffect(() => {}, [formError])

  return (
    <section className="section is-fixed has-left-0">
      <div className="box has-background-white">
        <p className="title is-4">New Post</p>
        <form className="block">
          <div className="field">
            <div className="control">
              <textarea
                className="textarea"
                autoFocus
                placeholder="e.g. On the other hand..."
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
          <a className="button" onClick={props.close}>Cancel</a>
        </div>
      </div>
    </section>
  )
}