const moment = require("moment");
const { google } = require('googleapis');
const keys = require('../keys.json');

module.exports = {
  
  getUserMail(req, res, next) {
    console.log("get user mail request accepted");

    let { email = null } = req.query;
    if(email === null) {
      res.status(401).send('unvalid user email');
    }
    let date = moment().format('MMM Do YYYY, h:mm:dd a');
    // consider if you want to change the dateTime format
    console.log(`params accepted! date = ${date}, mail = ${email}`);

    // google auth 
    const client = new google.auth.JWT(
      keys.client_email, // in this spreadsheet i've auth this client email
      null, 
      keys.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    
    client.authorize(function(err, token) {
      if(err) {
        console.log(`some error occured at ${date} for user ${mail}\nerror: ${err}`);
        res.status(500).send('some internal error occured, your data wasent saved');
      } else {
        console.log('authorization complete!');
        // if client authorized make request to google sheets
        gsRun(client);
      }
    });
    
    async function gsRun(client) {
      const gsApi = google.sheets({ version: 'v4', auth: client });
      const writeOptions = {
        // https://docs.google.com/spreadsheets/d/{#spreadsheetId#}/edit#gid=0
        spreadsheetId: '1ov0HQqeXvS74s49YLSLsvGxFVWOf175DwKptaiW5luY', // change this to your spreadsheet id
        // range: {#sheet name#}!{#start position#}
        range: 'emails!A1',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS', 
        resource: { 
          values: [
            [date, email]
          ] 
        }
    
      };
    
      let result = await gsApi.spreadsheets.values.append(writeOptions)
      console.log(result);
      // return sutable response to client ??
      if(result) {
        res.status(200).json(result);
      } else {
        res.status(500).send('some internal error occured, your data wasent saved');
      }
    }
  }
};
