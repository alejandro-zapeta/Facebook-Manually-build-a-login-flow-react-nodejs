import 'regenerator-runtime/runtime'
import React from 'react';
import ReactDOM from 'react-dom';
import HttpClient from "./HttpClient.js"

const FB_ID = "";
const redirectUri = "http://localhost:8080/test"; // tricky test.  

function FbLogin() {

 	const getUrlParameter = (e, uri) => { e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]"); var t = new RegExp("[\\?&]" + e + "=([^&#]*)").exec(uri); return null === t ? null : decodeURIComponent(t[1].replace(/\+/g, " ")) }

	const buildUrlFb = () => {
        let params = "fbloged=1";
        let uriX2 = encodeURIComponent(redirectUri);
        return (`https://www.facebook.com/v8.0/dialog/oauth?client_id=${FB_ID}&redirect_uri=${uriX2}&state=${params}`);
    }

	const popupWindow = (url, windowName, win, w, h) => {
        const y = win.top.outerHeight / 2 + win.top.screenY - (h / 2);
        const x = win.top.outerWidth / 2 + win.top.screenX - (w / 2);
        return win.open(url, windowName, `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`);
    }

    const openFbDialog = async () => {
        return new Promise((resolve, reject) => {
            let uri = buildUrlFb();
            let window01 = popupWindow(uri,  "", window, 500, 500);
            // fire this immediately after the user accept the logged in
            window01.addEventListener("load", async (event) => {
            	try{
            		let uri02 = window01.location.href;
            		let token = getUrlParameter("code", uri02);
            		resolve(token);
            		window01.close();
            	}catch(ex){
            		reject(null);
            	}
            });
        });
    }

    const myFbLogin = async () => {
    	try{
    		let token = await openFbDialog();
    		let response = await HttpClient.post("http://localhost:5050/fblogin", {"token": token, "redirectUri": redirectUri});
    		console.log(response);
    	}catch(ex){
    		console.log("there was an error");
    	}
    }

    return (
        <div>
		<h1>Manually FB login!</h1>
			<hr />
		<button onClick={()=>{myFbLogin()}}>Login with Fb manually</button>
		</div>
    )
}

ReactDOM.render(<FbLogin />, document.getElementById('root'));
