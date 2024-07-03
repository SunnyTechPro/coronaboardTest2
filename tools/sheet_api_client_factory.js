const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'accessToken.json';

/*
    procedure
    1. Read the 'credentials.json' file to use the Google OAuth client.
    2. Begin the authentication process using the result from step 1.
    3. Create a Google Sheets API client using the created OAuth client.
    4. Initialize the Google OAuth.
    5. request a Token if don't have a access Token
        5.1. Create a URL for OAuth authentication.
        5.2. Wait for keyboard input in the terminal.
        5.3. Obtain an access token using the authentication code.
    6. Use the access token if you already have it.
*/

class SheetApiClientFactory {
   static async create() {
       const credential = fs.readFileSync('credentials.json');
       const auth = await this._authorize(JSON.parse(credential));
       return google.sheets({ version: 'v4', auth });
   }

   static async _authorize(credentials) {
       const { client_secret, client_id, redirect_uris } = credentials.installed;
       const oAuth2Client = new google.auth.OAuth2(
           client_id,
           client_secret,
           redirect_uris[0],
       );

       if (!fs.existsSync(TOKEN_PATH)) {
           const token = await this._getNewToken(oAuth2Client);
           oAuth2Client.setCredentials(token);

           fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
           console.log('Token stored to', TOKEN_PATH);

           return oAuth2Client;
       }

       const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
       oAuth2Client.setCredentials(token);
       return oAuth2Client;
   }

   static async _getNewToken(oAuth2Client) {
       const authUrl = oAuth2Client.generateAuthUrl({
           access_type: 'offline',
           scope: SCOPES,
       });

       console.log('다음 URL을 브라우저에서 열어 인증을 진행하세요:', authUrl);

       const rl = readline.createInterface({
           input: process.stdin,
           output: process.stdout,
       });

       const code = await new Promise((resolve) => {
           rl.question(
               '인증이 완료되어 발급된 코드를 여기에 붙여넣으세요:',
               (code) => { resolve(code) }
           );
       });

       rl.close();

       const resp = await oAuth2Client.getToken(code);
       return resp.tokens;
   }
}

module.exports = SheetApiClientFactory;
















