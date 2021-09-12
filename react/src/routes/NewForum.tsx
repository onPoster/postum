import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { store, useGlobalState, useLocalState } from 'state-pool'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import client, { returnTypes } from '@postum/client'
import { actions } from "@postum/json-schema"

import Layout from '../components/Layout'
import { create } from 'domain';

export default function NewForum() {
  const context = useWeb3React<ethers.providers.Web3Provider>()
  const { connector, library, chainId, account, activate, deactivate, active, error } = context

  const createForum: actions.CREATE_FORUM = { 
    action: "CREATE_FORUM", 
    args: {
      title: "",
      admins: [""]
    }
  }

  const [formError, setFormError] = useState<string>("")
  const history = useHistory()
  const handleSubmit = async () => {
    if (!library) {
      setFormError("Must connect an Ethereum account.")
      return
    }
    createForum.args = Object.assign(
      createForum.args,
      {
        title,
        admins: Object.keys(admins).map(k => {
          return admins[Number(k)]
        })
      }
    )
    const signer = await library.getSigner()
    try {
      console.log('submitting forum', createForum)
      await client.mutate.createForum(signer, createForum)
      history.push('/forums')
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