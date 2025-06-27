import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Navigate } from 'react-router-dom'
import Toggle_form from "../Pages/Login/Toggle_form"

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        setShowModal(!isAuthenticated)
    }, [isAuthenticated])

    if(!isAuthenticated && showModal)
    {
        return <Toggle_form isModal={true} onClose={() => setShowModal(false)} />
    }

    if(!isAuthenticated && !showModal)
    {
        return <Navigate to='/' />
    }

    return children
}

export default ProtectedRoute