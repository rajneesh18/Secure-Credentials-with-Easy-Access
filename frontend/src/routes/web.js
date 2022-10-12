import axios from "axios";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import '../css/app.css';


const PageNotFound = () => {
    return <>
        <p>Page Not Found</p>
    </>
}

const ListCred = ({ type, user, password }) => {
    return <>
        <div className="listcred">
            <div>
                <span className="cred-head">Type</span> : <span>{type}</span>
            </div>
            <div>
                <span className="cred-head">User</span> : <span>{user}</span>
            </div>
            <div>
                <span className="cred-head">Password</span> : <span>{password}</span>
            </div>
        </div>
    </>
}

const App = () => {
    const [secret, setSecret] = useState('');
    const [type, setType] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const [active, setActive] = useState('');

    const [showCred, setShowCred] = useState('');

    const label = {
        margin: "5px 20px 5px 5px",
        width: "80px",
        display: "inline-block"
    }

    var handleSubmit = (e) => {
        e.preventDefault();
        let errmsg = '';
        if(!active) {  alert('Click on Button Before'); return ; }
        if(active === 'get') {
            if(!secret) { errmsg += 'Secret Key is required \n'; }
            if(!type) { errmsg += 'Type is required \n'; }
            if(!user) { errmsg += 'User Key is required \n'; }

            if(!secret || !type || !user) {
                alert(errmsg);
            }

            var data = {
                secret: secret,
                type: type,
                user: user
            };
            const params = new URLSearchParams(data);
            axios.get('http://localhost:3001/api/v1/cred', {params})
            .then(function (response) {
                // console.log(JSON.stringify(response.data));                
                if(response.status) {
                    setShowCred(response.data.data);
                }

            })
            .catch(function (error) {
                console.log(error);
            });

        } else {
            // axios.get(baseURL).then((response) => {
    
            // });
        }
    }

    return <>
        <div className="secret-container">
            <div className="secret-box">
                <div>
                    <h3 style={{fontFamily: "verdana", fontSize: "1rem", marginBottom: "30px", textAlign: "center"}}>Get Your Credentials</h3>
                </div>
                <div>
                    <input className={`btn ${active === 'get' && 'active' }`} value="Get" type="button" onClick={(e) => setActive('get')} />&nbsp;
                    <input className={`btn ${active === 'add' && 'active' }`} value="Add" type="button" onClick={(e) => setActive('add')}  />&nbsp;
                    <input className={`btn ${active === 'update' && 'active' }`} value="Update" type="button" onClick={(e) => setActive('update')}  />&nbsp;
                    <input className={`btn ${active === 'delete' && 'active' }`} value="Delete" type="button" onClick={(e) => setActive('delete')}  />&nbsp;
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
                        <input size="40" id="password" name="password" max="40" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value) } />
                    </div>
                    <br />
                    <input className="btn" type="submit" id="submit-btn" value="Submit"  />

                    <br />

                    {showCred && showCred.map((item) => {
                        return (
                           <ListCred key={item.key} type={item.type} user={item.user} password={item.password}   /> 
                        );
                    })}

                    {!showCred && (() => {
                        return (<b>No Record Found</b>)
                    })}
                </form>
            </div>
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
