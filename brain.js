const express = require("express");
const BodyParser = require("body-parser");
// const request = require("request");
const path = require("path");
const https = require("https");

const app = express();



app.use(express.static("Public"));
app.use(BodyParser.urlencoded({extended: true}))


app.get("/",(req,res) => {
    res.sendfile(path.join(__dirname+"/index.html"));
})

app.post("/",(req,res) => {
    const fname = req.body.firstName;
    const sname = req.body.SecondName;
    const email = req.body.EmailAdd;

    let UserObj = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: fname,
                    LNAME: sname
                }
            }
        ]
    };

    let JSONData = JSON.stringify(UserObj);

    const URL = `https://us10.api.mailchimp.com/3.0/lists/3269bdc3f9`;
    const options = {
        method: "POST",
        auth: "Zeno:f418ceecfb28cc2f378a8fb47c7b0bc9-us10"
    }

    const request = https.request(URL,options,(response) => {
        if(response.statusCode === 200) {
            res.sendFile(path.join(__dirname+"/sucess.html"));
        }
        else {
            res.sendFile(path.join(__dirname+"/faliure.html"));
        }
        response.on("data",(data) => {
            console.log(JSON.parse(data))
        })
    })

    request.write(JSONData);
    request.end();

})

app.post("/failure",(req,res) => {
    res.redirect("/");
})



const PORT = process.env.PORT||3000;
app.listen(PORT,(err) => {
    if(err) {
        console.log("Here is your error",err);
    }
    console.log("Server is running port "+ PORT + "...");
})
