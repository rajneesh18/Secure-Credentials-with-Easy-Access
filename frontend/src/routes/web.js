import axios from "axios";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const baseURL = "https://localhost:3001/cred";

const PageNotFound = () => {
    return <>
        <p>Page Not Found</p>
    </>
}

const App = () => {
    const [secret, setSecret] = useState('');
    const [type, setType] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const [active, setActive] = useState('');

    const label = {
        margin: "5px 20px 5px 5px",
        width: "80px",
        display: "inline-block"
    }

    var handleSubmit = (e) => {
        e.preventDefault();
        if(!active) {  alert('Click on Button Before'); return ; }
        if(password) {
            axios.post(baseURL, {

            }).then((response) => {
                
            });

        } else {
            axios.get(baseURL).then((response) => {
    
            });
        }
    }

    return <>
        <div className="container">
            <div>
                <input value="Get" type="button" className={active === "get" ? "active" : undefined} onClick={(e) => setActive('get')} />&nbsp;
                <input value="Add" type="button" className={active === "add" ? "active" : undefined} onClick={(e) => setActive('add')}  />&nbsp;
                <input value="Update" type="button" className={active === "update" ? "active" : undefined} onClick={(e) => setActive('update')}  />&nbsp;
                <input value="Delete" type="button" className={active === "delete" ? "active" : undefined} onClick={(e) => setActive('delete')}  />&nbsp;
            </div>
            <form id="cred-form" name="cred-form" onSubmit={handleSubmit}>
                <div>
                    <label style={label}>Secret Key</label>:&nbsp;
                    <input size="40" id="secret" name="secret" max="30" type="password" placeholder="Enter Secret Key" value={secret} onChange={(e) => setSecret(e.target.value) } />
                </div>
                <div>
                    <label style={label}>Type</label>:&nbsp;
                    <input size="40" id="type" name="type" max="30" placeholder="Enter Type" value={type} onChange={(e) => setType(e.target.value) } />
                </div>
                <div>
                    <label style={label}>User</label>:&nbsp;
                    <input size="40" id="user" name="user" max="40" placeholder="Enter User" value={user} onChange={(e) => setUser(e.target.value) } />
                </div>
                <div>
                    <label style={label}>Password</label>:&nbsp;
                    <input size="40" id="password" name="password" max="40" placeholder="Enter Password" value={user} onChange={(e) => setPassword(e.target.value) } />
                </div>
                <br />
                <input type="submit" id="submit-btn" value="Submit"  />
            </form>

            {secret}<br />{type}<br/>{user}
        </div>
    </>
}

export default function Web() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />

            
            <Route path="/*" element={<PageNotFound />} />
        </Routes>
    </BrowserRouter>
  )
}
