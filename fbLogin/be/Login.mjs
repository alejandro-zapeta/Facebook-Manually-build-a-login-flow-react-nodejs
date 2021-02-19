import express from "express";
import HttpClient from "./HttpClient.mjs"
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
const port = 5050;

// you will need this 3 keys
const FB_ID = "125385812817807";
const FB_SECRET = "04f52aacd0185aa4ae7a37dce445ff93";
const FB_APP_TOKEN = "125385812817807|0wzHaUa8grgAQiP3DiXlcmMxjYM";

const buildUrlFbInspectToken = (token) => `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${FB_APP_TOKEN}`
const buildUrlFbMe = (FB_ID_PERSON, token) => `https://graph.facebook.com/${FB_ID_PERSON}?fields=id,name,email&access_token=${token}`

const getDataFromFbUsingAToken = async (data) => {
    try {
        let code = data["token"]; // this is the token from facebook that the user already authorized the app, logged in.
        let redirectUri = data["redirectUri"];
        let uriX2 = encodeURIComponent(redirectUri);
        //Get another token
        let uri02 = `https://graph.facebook.com/v8.0/oauth/access_token?client_id=${FB_ID}&redirect_uri=${uriX2}&client_secret=${FB_SECRET}&code=${code}`
        let result = await HttpClient.get(uri02);
        let token = result["access_token"];
        //Get the user id from the user.
        let dataFbToken = await HttpClient.get(buildUrlFbInspectToken(token));
        let userFbId = dataFbToken["data"]["user_id"];
        // get the whole data. // Put the data you want in the URL.
        let userData = await HttpClient.get(buildUrlFbMe(userFbId, token));
        return userData;
    } catch (ex) {
        throw ex;
    }
}

app.post("/fblogin", async (req, res) => {
    try {
        let data = req.body["dt"];
        let response = await getDataFromFbUsingAToken(data);
        res.json(response);
    } catch (ex) {
        res.json({ "code": 500, "ex": JSON.stringify(ex) })
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}! *-*-*-*-*-`))