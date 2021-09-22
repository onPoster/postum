import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import client from '@postum/client'
import { actions } from "@postum/json-schema"
import { useApolloClient } from "@apollo/client"

import Layout from '../components/Layout'
import { useForumsQuery, optimisticForumsMutation } from '../graphql/Forums'
import { optimisticForumMutation } from '../graphql/Forum'
import { NotificationsContext, newNotification } from '../components/Notifications'

function newCreateForum(): actions.CREATE_FORUM {
  return { 
    action: "CREATE_FORUM", 
    args: {
      title: "",
      admins: [""]
    }
  }
}

export default function NewForum() {
  const apolloClient = useApolloClient()
  const web3Context = useWeb3React<ethers.providers.Web3Provider>()
  const { library } = web3Context
  const [formError, setFormError] = useState<string>("")
  const { notifications, setNotifications } = React.useContext(NotificationsContext)
  const { data, error, loading, stopPolling, startPolling } = useForumsQuery()
  const history = useHistory()

  let createForum: actions.CREATE_FORUM = newCreateForum()

  const handleSubmit = async () => {
    if (!library) {
      setFormError("Must connect an Ethereum account.")
      return
    }

    // grab form data arguments
    createForum.args = {
      title,
      admins: [
        admins[0], 
        ...Object.keys(admins).slice(1).map(k => {
          return admins[Number(k)]
        })
      ]
    }

    // get signer needed for eth tx
    const signer = await library.getSigner()

    try {
      // submit eth tx
      const txResponse = await client.mutate.createForum(signer, createForum)

      // notify user that eth tx is pending
      newNotification(
        notifications,
        {
          id: txResponse.hash,
          text: "Waiting for blockchain to confirm new forum...",
          loading: true
        },
        setNotifications
      )

      // copy args so we can ungrab form data
      const argsCopy = Object.assign({}, createForum.args)
      // ungrab form data
      createForum = newCreateForum()
      // send user back to forums page
      history.push(`/forums`)

      // wait for eth tx confirmation
      const txReceipt = await txResponse.wait()
      const id = txReceipt.transactionHash

      // once eth tx is confirmed, optimistically mutate local state
      optimisticForumsMutation(apolloClient, data, id, title)
      optimisticForumMutation(apolloClient, id, title, argsCopy.admins)

      // notify user that their new data is available and link them to it
      newNotification(
        notifications,
        {
          id: txResponse.hash,
          text: `New forum confirmed: ${argsCopy.title}`,
          loading: false,
          route: `/forum/${id}`
        },
        setNotifications
      )
    } catch (e) {
      setFormError("Failed to submit new forum")
    }
  }

  // form field state
  const [title, setTitle] = useState<string>("")
  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value)
  }

  const [admins, setAdmins] = useState<{ [key: number]: string }>({})
  const handleAdmin = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.value) {
      setAdmins(Object.assign(admins, {
        [Number(event.currentTarget.id)]: event.currentTarget.value
      }))
    } else {
      delete admins[Number(event.currentTarget.id)]
    }
  }

  const [adminFieldCount, setAdminFieldCount] = useState<number>(1)
  const handleAddAdminField = () => {
    setAdminFieldCount(adminFieldCount + 1)
  }
  const handleSubAdminField = () => {
    setAdminFieldCount(adminFieldCount - 1)
  }

  function adminField(key: number): JSX.Element {
    return (
      <div className="field" key={key}>
      <div className="control">
        <input 
          className="input" 
          type="text" 
          placeholder="e.g. 0x12345..."
          id={key.toString()}
          onChange={handleAdmin}
        />
      </div>
    </div>
    )
  }
  
  function makeAdminFields(count: number): JSX.Element[] {
    const res: JSX.Element[] = []
    for(let i = 0; i< count; i++) {
      res.push(adminField(i))
    }
    return res
  }

  useEffect(() => {}, [formError, adminFieldCount])

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

  if (!data || !data.forums) return (
    <div className="notification is-danger">
      Error: couldn't find data
    </div>
  )
  */
  
  return Layout(
    <section className="section">
      <p className="title is-3">New Forum</p>
        <form className="block">
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input 
                className="input" 
                type="text" 
                placeholder="e.g. Postum"
                onChange={handleTitle}
              />
            </div>
          </div>
          <label className="label">Admins</label>
          { makeAdminFields(adminFieldCount) }
          <div className="field">
            <div className="buttons">
              <div className="button" onClick={handleAddAdminField}>
                <i className="fas fa-plus" />
              </div>
              { adminFieldCount > 1 && 
                <div className="button" onClick={handleSubAdminField}>
                  <i className="fas fa-minus" />
                </div>
              }
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
          <Link className="button" to="/forums">Cancel</Link>
        </div>
    </section>
  )
}