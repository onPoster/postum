import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'

import { NETWORKS, injected, walletconnect, useEagerConnect, useInactiveListener } from '../lib/web3Connection'
import { shortAccount } from '../lib/utils'

export default function Web3Connector() {
  const [connectDropdownActive, setConnectDropdownActive] = useState(false)

  function toggleConnectDropdown() {
    if (!connectDropdownActive) {
      setConnectDropdownActive(true)
    } else {
      setConnectDropdownActive(false)
    }
  }

  const context = useWeb3React<ethers.providers.Web3Provider>()
  const { connector, chainId, account, activate, deactivate, active } = context

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  function Web3ConnectorDropdown() {
    if (connector) {
      return (
        <div className="dropdown-menu">
          <div className="dropdown-content">
            <div className="dropdown-item">
              <a 
                className="button is-fullwidth is-white" 
                onClick={() => {
                  deactivate()
                }}
              >
                Switch
              </a>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="dropdown-menu">
        <div className="dropdown-content">
          <div className="dropdown-item">
            <a 
              className={
                "button is-fullwidth is-white" + 
                (activatingConnector === "injected" ? " is-loading" : "")
              }
              onClick={() => {
                setActivatingConnector("injected")
                activate(injected).then(() => {
                  toggleConnectDropdown()
                })
              }}
            >
              Metamask
            </a>
          </div>
          
          <div className="dropdown-item">
            <a 
              className={
                "button is-fullwidth is-white" + 
                (activatingConnector === "walletconnect" ? " is-loading" : "")
              }
              onClick={() => {
                setActivatingConnector("walletconnect")
                activate(walletconnect).then(() => {
                  toggleConnectDropdown()
                })
              }}
            >
              WalletConnect
            </a>
          </div>
          
        </div>
      </div>
    )
  }

  return (
    <div 
      className={"dropdown is-right" + (connectDropdownActive ? " is-active" : "")}
    >
      <div className="dropdown-trigger">
        <a 
          className={"button" + (connectDropdownActive ? " is-dark" : "")} 
          onClick={() => { 
            setActivatingConnector(undefined)
            toggleConnectDropdown()
          }}
        >
          { !active && <span>Connect</span> }
          { active && account && <span className="has-text-weight-bold">{shortAccount(account)}</span> }
          { active && chainId && <span>&nbsp;–&nbsp;{NETWORKS[chainId]}</span> }
          <span className="icon is-small">
            <i className={"fas" + (connectDropdownActive ? " fa-angle-up" : " fa-angle-down")}></i>
          </span>
        </a>
      </div>
      <Web3ConnectorDropdown />
    </div>
  )
}