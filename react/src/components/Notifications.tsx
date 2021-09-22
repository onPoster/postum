import React, { useEffect, MouseEvent } from 'react'
import { Link } from 'react-router-dom'

interface NotificationData {
  id: string;
  text: string;
  route?: string;
  loading: boolean;
}

export interface NotificationsData { [id: string]: NotificationData }

interface INotificationsContext {
  notifications: NotificationsData
  setNotifications: React.Dispatch<React.SetStateAction<NotificationsData>>
}

export const NotificationsContext = React.createContext<INotificationsContext>({
  notifications: {},
  setNotifications: () => {}
})

export function newNotification(
  notifications: NotificationsData,
  newNot: NotificationData, 
  setNotifications: React.Dispatch<React.SetStateAction<NotificationsData>>
) {
  const newNots = Object.assign({}, notifications)
  newNots[newNot.id] = newNot
  setNotifications(newNots)
}

export function deleteNotification(
  notifications: NotificationsData,
  idToDelete: string, 
  setNotifications: React.Dispatch<React.SetStateAction<NotificationsData>>
) {
  const newNots = Object.assign({}, notifications)
  delete newNots[idToDelete]
  setNotifications(newNots)
}

export function Notifications() {
  const { notifications, setNotifications } = React.useContext(NotificationsContext)

  useEffect(() => {}, [notifications])

  const handleCloseNotification = (event: MouseEvent) => {
    const id = event.currentTarget.id
    deleteNotification(
      notifications,
      id,
      setNotifications
    )
  }

  function Notification(notData: NotificationData) {
    let isStyle = "is-success"
    if (notData.loading) { isStyle = "is-warning" }
    return (
      <div className={"notification " + isStyle + " is-shadowed mx-6"} key={notData.id}>
        <div className="level">
          <div className="level-left">
            { notData.route &&
              <Link to={notData.route} id={notData.id} onClick={handleCloseNotification}>
                { notData.text }
              </Link>
            }
            { !notData.route && notData.text }
          </div>
          <div className="level-right">
            { !notData.loading &&
              <button className="delete" id={notData.id} onClick={handleCloseNotification}></button>
            }
            { notData.loading &&
              <button className="button is-warning is-loading" disabled/>
            } 
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="is-fixed my-5">
      { Object.keys(notifications).slice(0, 3).map(id => Notification(notifications[id])) }
    </div>
  )
}