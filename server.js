const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))

const { readFileSync } = require('fs');
const { writeFileSync } = require('fs');

var deviceArr=[]
var devicess = readFileSync('./devices.json');      //reading the JSON file into the meory
var logs =  readFileSync('./logs.txt','utf-8');     //reading the LOGS file in the memory

var myDevices
const ErrorCode =      //Enumerator for the error messages in the response
{
    empty:"Error! The request can't have an empty values ",
    deviceid:"Error! The request can't have an empty Device Id",
    deviceType:"Error! The request can't have an empty Device Type",
    data:"Error! The request can't have an empty Data",
    command:"Error! The request can't have an empty Command",
    exists:"Device Id Already Registered !!\n Enter new Device Id",
    notRegistered:"Device not registered !! \n Register device to send data/command"
}


if(devicess.length>0)
{
    deviceArr=JSON.parse(devicess);
}

//console.log(logs)

function logData(reqType)       //Function to save the data in the logs.txt file
{
    switch(reqType)
    {
        case "register": logs=logs + "Device Registration\t"+ new Date()+"\n";
            break;
        case "data":     logs=logs + "Device Data\t"+ new Date()+"\n";       
            break;
        case "command":  logs=logs + "Device Command\t"+ new Date()+"\n";
            break;
    }
    writeFileSync("./logs.txt",logs,'utf-8')
}

function deviceExists( rest)         //Function to check if the device already exists in the stored JSON and return its array index.
{                               //If not found return -1
    let deviceExists=false
    for (let i=0;i<deviceArr.length;i++)
                {
                    console.log(deviceArr[i].deviceId)
                    console.log(rest.deviceId)
                    if(deviceArr[i].deviceId==rest.deviceId)
                    {
                        console.log("Device Registered")
                        deviceExists=true;
                        return i;
                    }
                }
    return -1            
}

app.get('/web.html', function (req, res) {
      res.sendFile( __dirname + "/" + "web.html" )
})

app.get('/show', function(req,res)              //Responds with an array with all the device Ids
    {
        let temp_arr=deviceArr
        for(let i=0; i < temp_arr.length;i++)
        {
            delete(temp_arr[i].data)
            delete(temp_arr[i].commands)
        }

        res.send(JSON.stringify(temp_arr,null,2))

    })

app.post('/register', function (req, res)       //POST request to register the devices  
{
    var deviceJSON=                 //Iniitializing the JSON for storing the data
{
    deviceId:"",
    deviceType:"",
    data:[],
    commands:[]
}
    let deviceId= deviceJSON.deviceId = req.body.deviceId
    let deviceType= deviceJSON.deviceType =req.body.deviceType
    response = {
        deviceId : deviceId,
        deviceType : deviceType,
    };
    console.log(response)
          
        if(deviceId.length ==0 && deviceType.length ==0)
        {
            res.send(ErrorCode.empty)
        }
        else if(deviceId.length==0)
        {
            res.send(ErrorCode.deviceid)
        }
        else if(deviceType.length==0)
        {
            res.send(ErrorCode.deviceType)
        }
        else
        {
            if(deviceExists(response) == -1)
            {  
                //console.log(deviceExists(response))
                deviceArr.push(deviceJSON)
                try {
                    writeFileSync("./devices.json", JSON.stringify(deviceArr, null, 2), 'utf8');
                   // console.log('Data successfully saved to disk');
                    res.status(201)
                    res.send("Device Registered Successfully !")
                    logData("register")
                } catch (error) {
                   // console.log('An error has occurred ', error);
                }
            
           // console.log(response)
            }
            else
            {
                //console.log(deviceExists(response))
                res.send(ErrorCode.exists)
            }
        }
})

app.post('/data', function (req, res)           //POST request to send data to the devices 
{
    let deviceId= req.body.deviceId
    let datas=req.body.data
    response = {
        deviceId : deviceId,
        data : []
    };
    response.data.push({"val":datas,"timestamp": new Date()})
   // console.log(response)
        if(deviceId.length ==0 && datas.length ==0)
            {
             res.send(ErrorCode.empty)
            }
        else if(deviceId.length==0)
            {
            res.send(ErrorCode.deviceid)
            }
        else if(datas.length==0)
            {
            res.send(ErrorCode.data)
            }
        else
            {
                let index= deviceExists(response)
                if(index > -1)
                {
                    try {
                        deviceArr[index].data.push({"val":datas,"timestamp": new Date()})
                       // console.log(response) 
                        writeFileSync("./devices.json", JSON.stringify(deviceArr, null, 2), 'utf8');
                       // console.log('Data successfully saved to disk');
                        res.status(201)
                        res.send("Device data saved Successfully !")
                        logData("data")
                    } catch (error) {
                       // console.log('An error has occurred ', error);
                    }
                }
                else
                {
                    res.send(ErrorCode.notRegistered)
                }
            }   
})

app.post('/command', function (req, res)            //POST request to send command to the devices
{
    let deviceId= req.body.deviceId
    let commands=req.body.command
    response = {
        deviceId : deviceId,
        command : [],
    };
    response.command.push({"val":commands,"timestamp": new Date()})
   // console.log(response)
        if(deviceId.length ==0 && commands.length ==0)
            {
                res.send(ErrorCode.empty)
            }
        else if(deviceId.length==0)
            {
                res.send(ErrorCode.deviceid)
            }
        else if(commands.length==0)
            {
                res.send(ErrorCode.command)
            }
        else
            {
                let index= deviceExists(response)
                if(index >-1)
                {       
                    try {
                        deviceArr[index].commands.push({"val":commands,"timestamp": new Date()})
                      //  console.log(response) 
                        writeFileSync("./devices.json", JSON.stringify(deviceArr, null, 2), 'utf8');
                      //  console.log('Command successfully saved to disk');
                        res.status(201)
                        res.send("Device command saved Successfully !")
                        logData("command")
                    } catch (error) {
                       // console.log('An error has occurred ', error);
                    }
                }
                else
                {
                    res.send(ErrorCode.notRegistered)
                }
            }
})

var server = app.listen(port, function () {
  console.log(`Server listening on port ${port}`)
})

