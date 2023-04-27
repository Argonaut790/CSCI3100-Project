/* Module: NotificationProvider

    * Version: 1.0 (7/4/2023)
    * Description: This module is used to create a context for displaying notifications in
    * the app.
    * It uses the createContext method from React to create the NotificationContext object.
    * It exports two additional methods: useNotification, which returns the notification
    * context,
    * and NotificationProvider, which is a component that provides the notification
    * context to its children.
    * NotificationProvider has a state variable for storing the current notification
    * and a method for showing a new notification.
    * When a new notification is shown, it sets the notification state variable and then
    * clears it after a timeout.
    * Parameter: children - the child components that will have access to the
    * notification context

*/

import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    return (
        <NotificationContext.Provider value={{ notification, showNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};