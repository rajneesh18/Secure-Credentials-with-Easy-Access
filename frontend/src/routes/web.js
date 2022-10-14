import axios from "axios";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import '../css/app.css';


const PageNotFound = () => {
    return <>
        <div><p>Page Not Found</p></div>
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
    const [loading, setLoading] = useState(false);

    const label = {
        margin: "5px 20px 5px 5px",
        width: "80px",
        display: "inline-block"
    }

    var handleSubmit = (e) => {
        e.preventDefault();
        setShowCred(false);

        let errmsg = '';
        if(!active) {  alert('Click on Button Before'); return ; }
        if(active === 'get') {
            if(!secret) { errmsg += 'Secret Key is required \n'; }
            if(!type) { errmsg += 'Type is required \n'; }
            // if(!user) { errmsg += 'User is required \n'; }

            if(!secret || !type ) { alert(errmsg); }

            let data = {
                secret: secret,
                type: type
            };
            if(user) { data.user = user; }
            const params = new URLSearchParams(data);

            setLoading(true);
            axios.get(`https://cred-security.rajneeshshukla.in/api/v1/cred`, {params})
            .then(function (response) {
                if(response.status) {
                    setShowCred(response.data.data);
                }
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);            
                setLoading(false);
            });

        } else if(active === 'add' || active === 'update') {
            if(!secret) { errmsg += 'Secret Key is required \n'; }
            if(!type) { errmsg += 'Type is required \n'; }
            if(!user) { errmsg += 'User is required \n'; }
            if(!password) { errmsg += 'Password is required \n'; }

            if(!secret || !type || !user || !password) { alert(errmsg); }

            let data = {
                secret: secret,
                type: type,
                user: user,
                password: password
            };
            const params = new URLSearchParams(data);
            
            setLoading(true);
            axios.post('https://cred-security.rajneeshshukla.in/api/v1/cred/add', params)
            .then(function (response) {    
                if(response.status) {
                    setShowCred(false);
                    setLoading(false);
                    alert(response.data.mgs);
                }
            })
            .catch(function (error) {
                console.log(error);
                setLoading(false);
            });

        }
    }

    var handleReset = () => {
        setSecret(""); setUser(""); setPassword(""); setActive(""); setType(""); setShowCred(false);
        return;
    }


    return <>
        <div className="secret-container">
            <div className="secret-box">
                <div>
                    <h3 style={{fontFamily: "verdana", fontSize: "1rem", marginBottom: "30px", textAlign: "center"}}>Get Your Credentials</h3>
                </div>
                <div style={{ display:'flex',justifyContent:'space-between', alignItems: 'center'}}>
                    <div>
                        <input className={`btn ${active === 'get' && 'active' }`} value="Get" type="button" onClick={(e) => setActive('get')} />&nbsp;
                        <input className={`btn ${active === 'add' && 'active' }`} value="Add" type="button" onClick={(e) => setActive('add')}  />&nbsp;
                        <input className={`btn ${active === 'update' && 'active' }`} value="Update" type="button" onClick={(e) => setActive('update')}  />&nbsp;
                        <input className={`btn ${active === 'delete' && 'active' }`} value="Delete" type="button" onClick={(e) => setActive('delete')}  />&nbsp;
                    </div>
                    <div>
                        <input className="btn" type="button" id="submit-btn" value="Import"  />
                    </div>
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
                    <div style={{ display:'flex',justifyContent:'space-between', alignItems: 'center'}}>
                        <div>
                            <input className="btn" type="submit" id="submit-btn" value="Submit"  />
                            <input className="btn" type="button" id="reset-btn" value="Reset" onClick={handleReset} />
                        </div>
                        <div>
                            <input className="btn" type="button" id="submit-btn" value="Export"  />
                        </div>
                    </div>

                    <br />

                    {showCred && showCred.map((item) => {
                        return <ListCred key={item.id} type={item.type} user={item.user} password={item.password} />
                    })}

                    { loading && (
                        <div>Loading...</div>
                    )}

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
