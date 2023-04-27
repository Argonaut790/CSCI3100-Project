/* Module: Notification

    * Version: 1.0 (7/4/2023)
    * Description: This module is used to display the current notification to the user.
    * It imports the useNotification hook from the NotificationContext module to access
    * the current notification.
    * If there is no notification, it returns null and does not display anything.
    * If there is a notification, it displays a toast notification at the bottom right
    * corner of the screen.
    * The notification contains the message and an X button to dismiss it.
    * Parameter: None
*/
import React from 'react';
import { useNotification } from '../NotificationContext';

const Notification = () => {
    const { notification } = useNotification();

    if (!notification) {
        return null;
    }

    return (
        <div
            className={`position-fixed bottom-0 end-0 p-3 fade-in 'show'`}
            style={{ zIndex: "11" }}
        >
            <div
                id="liveToast"
                className="toast show tweet-mask"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
            >
                <div className="toast-header" style={{ color: "black" }}>
                    {/* <img src="..." className="rounded me-2" alt="..." /> */}
                    <strong className="me-auto">Rettiwt</strong>
                    {/* <small>11 mins ago</small> */}
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="toast"
                        aria-label="Close"
                    ></button>
                </div>
                <div className="toast-body">{notification.message}</div>
            </div>
        </div>
    );
};

export default Notification;