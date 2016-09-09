## Server-side implementation for handling JSON-RPC requests


### Simple description
 JSON-RPC presence service was used for my bachelor thesis "Web Presence Detection", 
but other services could be added as well.

#### Structure
 The code is structured as follows:
 * Request layer - It intercepts and handles the request. Also an object with request information is built
 * Executor layer
 * Service layer
 * Data access object (DAO) layer 
 
####Diagram that describes the architecture

![Architecture](/images/jsonrpc_diagram.png)

### Technologies
 * Node.js
 * Elasticsearch

### Examples

#### Request
```json
{
  "jsonrpc": "2.0",
  "method": "PresenceService.update",
  "params": {
    "personId": "007",
    "agentId": "112233",
    "created": "2013-08-27T15:16:16Z",
    "updated": "2013-08-27T19:16:16Z",
    "lastUpdate": {
      "class": "ACTIVITY",
      "content": {
        "type": "status",
        "message": "Lorem ipsum dolor",
        "description": "Short description",
        "url": "http://www.example.com",
        "thumbnail": {
          "URL": "http://www.example.com/image.jpg",
          "width": 500,
          "height": 500,
          "type": "IMAGE"
        }
      },
      "source": {
        "appId": "007",
        "type": "EXTERNAL",
        "title": "Facebook",
        "link": "https://www.facebook.com"
      },
      "userGenerated": true,
      "sync": true
    }
  },
  "id": 1
}
```

#### Response
```json
{
  "jsonrpc": "2.0",
  "result": true,
  "id": 1
}
```
