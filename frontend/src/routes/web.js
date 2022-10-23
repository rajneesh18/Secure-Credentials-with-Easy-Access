import axios from "axios";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { CSVLink } from "react-csv";

import '../css/app.css';


const PageNotFound = () => {
    return <>
        <div><p>Page Not Found</p></div>
    </>
}


let checkedlist = [];
let csvdata = [];
const ListCred = ({ id, type, user, password }) => {

    let handleCheckbox = (e) => {
        if(!checkedlist.includes(e.target.value)) {
            checkedlist = ([...checkedlist, e.target.value]);
        } else {
            checkedlist.splice(checkedlist.indexOf(e.target.value), 1);
        }
    }

    return <>
        <div className="listcred">
            <div>
                <input type="checkbox" className="passcheck" name="passcheck[]" value={id} onClick={(e) => { handleCheckbox(e) }} />
            </div>
            <div>
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
    const [resdata, setResdata] = useState([]);

    const label = {
        margin: "5px 20px 5px 5px",
        width: "80px",
        display: "inline-block"
    }

    let getCredentials = async (data, isexport = false) => {
        const params = new URLSearchParams(data);
        setLoading(true);
        var returndata = await axios.get(`https://cred-security.rajneeshshukla.in/api/v1/cred`, {params})
        .then(function (response) {
            if(response.status) {
                checkedlist = [];
                setResdata([]);
                if(!isexport) {
                    setShowCred(response.data.data);
                    setLoading(false);
                } else {
                    // console.log(response.data.data);
                    setLoading(false);
                    setResdata(response.data.data);
                    return response.data.data;
                }
            }
        })
        .catch(function (error) { 
            console.log(error); 
            setLoading(false);
        });   
        return returndata;
    }

    let deleteCredentials = (data) => {
        setLoading(true);
        if(data.id) {
            const params = new URLSearchParams(data);
            axios.post('https://cred-security.rajneeshshukla.in/api/v1/cred/delete', params)
            .then(function (response) {
                if(response.status) {
                    setShowCred(false);
                    alert(response.data.mgs);
                    handleReset();
                    setLoading(false);
                }
            })
            .catch(function (error) { 
                console.log(error); 
                setLoading(false); 
            });
        }   
    }
    let addUpdateCredentials = (data) => {
        const params = new URLSearchParams(data);
            
        setLoading(true);
        axios.post('https://cred-security.rajneeshshukla.in/api/v1/cred/add', params)
        .then(function (response) {    
            if(response.status) {
                setShowCred(false);
                alert(response.data.mgs);
                handleReset();
                setLoading(false);                
            }
        })
        .catch(function (error) { 
            console.log(error); 
            setLoading(false); 
        });
    }

    var handleSubmit = (e) => {
        e.preventDefault();
        if(active === 'get' || active === 'add') { setShowCred(false); }

        let errmsg = '';
        if(!active) {  alert('Click on Button Before'); return ; }
        if(active === 'get') {
            if(!secret) { errmsg += 'Secret Key is required \n'; }
            if(!type) { errmsg += 'Type is required \n'; }

            if(!secret || !type ) { alert(errmsg); return ; }

            let data = {
                secret: secret,
                type: type
            };
            if(user) { data.user = user; }            
            getCredentials(data);            

        } else if(active === 'add' || active === 'update') {
            if(!secret) { errmsg += 'Secret Key is required \n'; }
            if(!type) { errmsg += 'Type is required \n'; }
            if(!user) { errmsg += 'User is required \n'; }
            if(!password) { errmsg += 'Password is required \n'; }

            if(!secret || !type || !user || !password) { alert(errmsg); return; }

            let data = {
                secret: secret,
                type: type,
                user: user,
                password: password
            };
            addUpdateCredentials(data);

        } else if (active === 'delete') {
            if(checkedlist.length) {
                let data = {
                    id: checkedlist.toString()
                }
                deleteCredentials(data);
            }
        }
    }

    var handleReset = () => {
        setSecret(""); setUser(""); setPassword(""); setActive(""); setType(""); setShowCred(false); 
        checkedlist = [];
        return;
    }


    
    const headers = [
        { label: "ID", key: "id" },
        { label: "Password", key: "password" },
        { label: "Type", key: "type" },
        { label: "User", key: "user" }
    ];


    let handleDownload = (e) => {
        setResdata([]);

        let data = { secret: secret, isexport: true };
        if(type) { data.type = type; }
        if(user) { data.user = user; }

        const result = getCredentials(data, true);
        console.log(result);


    }

    const csvReport = {
        data: resdata,
        filename: 'credentials-list.csv',
        headers: headers
    };
	

    return <>
        <div className="secret-container">
            <div className="secret-box">
                <div style={{textAlign:"center", marginBottom: "30px"}}>
                    <div style={{fontFamily: "verdana", fontSize: "1rem", marginBottom: "7px", textAlign: "center", fontWeight: "500"}}>
                        Cred Security With Easy Access</div>
                    <div>Get Your Credentials</div>
                </div>
                <div style={{ display:'flex',justifyContent:'space-between', alignItems: 'center'}}>
                    <div>
                        <input className={`btn ${active === 'get' && 'active' }`} value="Get" type="button" onClick={(e) => setActive('get')} />&nbsp;
                        <input className={`btn ${active === 'add' && 'active' }`} value="Add OR Update" type="button" onClick={(e) => setActive('add')}  />&nbsp;
                        <input className={`btn ${active === 'delete' && 'active' }`} value="Delete" type="button" onClick={(e) => setActive('delete')}  />&nbsp;
                    </div>
                    <div>
                        {/* <input className="btn" type="button" id="import-btn" value="Import"  /> */}
                    </div>
                </div>
                
                <form id="cred-form" name="cred-form" onSubmit={handleSubmit} autoComplete="off">
                    <div>
                        <label style={label}>Secret Key</label>:&nbsp;
                        <input size="40" id="secret" name="secret" max="30" type="password" placeholder="Enter Secret Key" value={secret} onChange={(e) => setSecret(e.target.value) } autoComplete="off" />
                    </div>
                    <div>
                        <label style={label}>Type</label>:&nbsp;
                        <input size="40" id="type" name="type" max="30" placeholder="Enter Type" value={type} onChange={(e) => setType(e.target.value) } autoComplete="off" />
                    </div>
                    <div>
                        <label style={label}>User</label>:&nbsp;
                        <input size="40" id="user" name="user" max="40" placeholder="Enter User" value={user} onChange={(e) => setUser(e.target.value) } autoComplete="off" />
                    </div>
                    
                    <div>
                        <label style={label}>Password</label>:&nbsp;
                        <input size="40" id="password" name="password" max="40" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value) } autoComplete="off" />
                    </div>
                    <br />
                    <div style={{ display:'flex',justifyContent:'space-between', alignItems: 'center'}}>
                        <div>
                            <input className="btn" type="submit" id="submit-btn" value="Submit"  />
                            <input className="btn" type="button" id="reset-btn" value="Reset" onClick={handleReset} />
                        </div>
                        <div>
                            {/* <CSVLink {...csvReport} ><input className="btn" type="button" id="export-btn" value="Export"  onClick={handleDownload}   /></CSVLink> */}
                        </div>
                    </div>

                    <br />

                    {showCred && showCred.map((item) => {
                        return <ListCred key={item.id} id={item.id} type={item.type} user={item.user} password={item.password} />
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
