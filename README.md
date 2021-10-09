# restLib

> Note this project is only intended for personal projects

restLib is a simplistic API framework, built on top of expressJS. It is intended to help aid in the setup of RESTful APIs in a structured way.
It is ismilar in concept to frameworks such as Loopback, however, is entended to be far less combersome.

# Installation

1. Clone this repository
2. run `npm ci`

# Usage

restLib generates RESTful endpoints based on model descriptions. It also allows for custom controllers.

## Creating Models

To add a new RESTful model, add a new file with the extention model.js into the models directory. This file will export a model description.

### Sample

```javascript
module.exports = {
  provider: "mongodb",
  schema: {
    _id: {
      type: "mongoid",
      primary: true,
      required: true,
    },
    name: {
      type: "string",
      required: false,
    },
  },
};
```

### Provider

Every model description needs to define what database provider to use to store and retrieve the data.

#### Available Providers

- mongodb

### Schema

Every model description needs to define a schema. Each schema entry equates to one column in a database table.

#### Schema Options

**type**
defines the datatype for the schema key

| name    | description            |
| ------- | ---------------------- |
| mongoid | MongoDB UUID           |
| string  | Basic string (varchar) |

**primary**
is a boolean value (defaults to false) which deternines if the key should be treated as a primary key

**required**
is a boolean value (defaults to false) which determines if the key is required to be set on RESTful create and update opperations.

## Creating Controllers

Controllers can be added to augment the RESTful endpoints with custom logic. Models are **NOT** required to have a controller.
To create a controller add a file with the extension .controler.js to the controllers directory.

### Sample

```javascript
module.exports = {
  auth: (request, response, next) => {
    next(request, response);
  },
  deleteMany: {
    skip: true,
    fn: (request, response, results) => {
      response.send(405);
    },
  },
  endpoints: [
    {
      path: "and/stuff",
      method: "get",
      fn: (request, response) => {
        response.send("Custom!!!");
      },
    },
  ],
};
```

### auth

Every controller can have a custom auth middleware which will be applied to every RESTful request on the model.

### Override endoints

Every controller can accept an override object for each RESTful endpoint.

**skip** is a boolean value (default false) that disables the default CRUD opperation of the endpoint

**fn** is a function that will be ran after the default CRUD operation has completed (unless skipped)

#### Available Override Endpoints

- get
- getAll
- put
- putAll
- delete
- deleteMany

### endpoints

Every controller can have a number of custom endpoints. These are provided as an array of endpoint objects

#### Endpoint options

**path**
is a string path to append to the model's default path (`/{modelname}/{path}`). This path conforms to Express' path format.

**method**
is the HTTP method the endpoint will listen on.

**fn**
is the express function the endpoint will use.

## Default RESTful Endpoints

- get (GET:/model/:id)
- getAll (GET:/model/)
- put (PUT:/model/:id)
- putAll (PUT:/model/)
- delete (DELETE:/model/:id)
- deleteMany (DELETE:/model/)
