define({ "api": [
  {
    "type": "get",
    "url": "/consumers/:id/savings",
    "title": "Request to retrieve savings information for a user",
    "name": "GetConsumerSavings",
    "group": "Consumers",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>Unique id to identify user</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/api/v1/consumers/123/savings",
        "type": "curl"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\" : 123\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/consumers.js",
    "groupTitle": "Consumers"
  },
  {
    "type": "get",
    "url": "/products",
    "title": "Request all available product information",
    "name": "GetProducts",
    "group": "Products",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Date</p> ",
            "optional": true,
            "field": "lastFetchedDate",
            "defaultValue": "15-07-2015",
            "description": "<p>Request all products above this date</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Boolean</p> ",
            "optional": true,
            "field": "frequentList",
            "description": "<p>Give me list of frequently using grocery products</p> "
          }
        ]
      }
    },
    "sampleRequest": [
      {
        "url": "/products"
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/api/v1/products?frequentList=true\ncurl -i http://localhost:3000/api/v1/products?lastFetchedDate=15-07-2015",
        "type": "curl"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\" : 123\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/products.js",
    "groupTitle": "Products"
  }
] });