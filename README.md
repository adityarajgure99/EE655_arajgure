# EE655_arajgure
A Node JS server to add/register various devices on the network. The server can be used to send the data and commands for the devices using the HTTP network protocol.
The data is stored in JSON format in "devices.json" file
The data is stored as an array of JSON objects.
Eg:
[
{
    "deviceId": "fan_4",
    "deviceType": "fan",
    "data": [],
    "commands": []
  },
  {
    "deviceId": "light_1",
    "deviceType": "light",
    "data": [
      {
        "val": "100 lumen",
        "timestamp": "2024-02-13T04:29:12.501Z"
      }
    ],
    "commands": [
      {
        "val": "ON",
        "timestamp": "2024-02-13T04:29:47.525Z"
      },
      {
        "val": "OFF",
        "timestamp": "2024-02-13T04:30:04.792Z"
      }
    ]
  }
]
