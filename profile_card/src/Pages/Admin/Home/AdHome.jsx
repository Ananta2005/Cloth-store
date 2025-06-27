import React from "react"
import './AdHome.css'
import admin1 from "../../../assets/admin1.jpg"
import admin2 from "../../../assets/admin2.jpg"
import { useNavigate } from "react-router-dom"

const AdHome = () =>{

    const navigate = useNavigate()

    return(
        <div className="ad-home-container">
            <div className="ad-top-buttons">
                <button>Home</button>

                <button>Logout</button>
            </div>
            <div className="ad-section" style={{ backgroundImage: `url(${admin1})` }}>
                <h1>Add or remove clothes.</h1>
                <button onClick={() => navigate('/admin/modify')}>Modify</button>
            </div>

            <div className="ad-section" style={{ backgroundImage: `url(${admin2})` }}>
                <h1>Block or Ban users.</h1>
                <button>Block</button>
            </div>
        </div>
    )
}

export default AdHome