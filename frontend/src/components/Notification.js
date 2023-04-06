// Notification.js
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