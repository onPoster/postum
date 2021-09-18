import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import client, { returnTypes } from '@postum/client'
import { actions } from "@postum/json-schema"
import { useApolloClient } from "@apollo/client"

import Layout from '../components/Layout'
import { useForumsQuery, optimisticForumsMutation } from '../graphql/Forums'
import { optimisticForumMutation } from '../graphql/Forum'

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

  const context = useWeb3React<ethers.providers.Web3Provider>()
  const { connector, library, chainId, account, activate, deactivate, active } = context
  const { loading, error, data, stopPolling, startPolling } = useForumsQuery()

  const [formError, setFormError] = useState<string>("")

  const history = useHistory()

  let createForum: actions.CREATE_FORUM = newCreateForum()

  const handleSubmit = async () => {
    if (!library) {
      setFormError("Must connect an Ethereum account.")
      return
    }

    createForum.args = {
      title,
      admins: [
        admins[0], 
        ...Object.keys(admins).slice(1).map(k => {
          return admins[Number(k)]
        })
      ]
    }

    const signer = await library.getSigner()

    try {
      const txResponse = await client.mutate.createForum(signer, createForum)
      // TODO add a notifier in case the wait between response and receipt is long
      const txReceipt = await txResponse.wait()
      const id = txReceipt.transactionHash

      optimisticForumsMutation(apolloClient, data, title, id)
      optimisticForumMutation(apolloClient, title, id, createForum.args.admins)

      createForum = newCreateForum()
      // TODO instead of routing directly, put a button in the notifier that lets
      // the user route here if they want to
      history.push(`/forum/${id}`)
    } catch (e) {
      setFormError(e.message)
    }
  }

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