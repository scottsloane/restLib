module.exports = (app) => {

    const validateId = (data, proto) => {
        for (const item of proto) {
            if (item.primary) return validateItem(item.type, data);
        }
        return false;
    }

    const validateItem = (type, value) => {
        switch (type) {
            case 'string':
                return typeof value === 'string';
            case 'mongoid':
                return typeof value === 'string';
        }
    }

    const validateData = (data, proto) => {
        let datapoints = Object.entries(data);
        for (let i = 0; i < datapoints; i++) {
            if (typeof proto[datapoints[i].key] !== 'undefined' && !validateItem(proto[datapoints[i].key].type, datapoints[i].value)) return false;
        }
        let protoItems = Object.entries(proto);
        for (const i = 0; i < protoItems.length; i++) {
            if (typeof data[protoItems[i]] === 'undefined' && protoItems[i].required) return false;
        }
        return true;
    }

    const passThrough = (request, response, next) => next(request, response);
    const passThroughResults = (request, response, results) => response.send(results);

    const add = (node, model = {}, options = {}) => {

        if (typeof options.get === 'undefined') options.get = {};
        if (typeof options.getAll === 'undefined') options.getAll = {};
        if (typeof options.post === 'undefined') options.post = {};
        if (typeof options.putAll === 'undefined') options.putAll = {};
        if (typeof options.put === 'undefined') options.put = {};
        if (typeof options.deleteMany === 'undefined') options.deleteMany = {};
        if (typeof options.delete === 'undefined') options.delete = {};

        if (typeof options.auth !== 'function') options.auth = passThrough;
        if (typeof options.get.fn !== 'function') options.get.fn = passThroughResults;
        if (typeof options.getAll.fn !== 'function') options.getAll.fn = passThroughResults;
        if (typeof options.post.fn !== 'function') options.post.fn = passThroughResults;
        if (typeof options.putAll.fn !== 'function') options.putAll.fn = passThroughResults;
        if (typeof options.deleteMany.fn !== 'function') options.deleteMany.fn = passThroughResults;
        if (typeof options.delete.fn !== 'function') options.delete.fn = passThroughResults;

        if (!Array.isArray(options.endpoints)) options.endpoints = [];

        const nodeRoot = `/${node}`;
        const nodeId = `/${node}/:id`;


        app.get(nodeRoot, (request, response) => {
            // Get all entries
            options.auth(request, response, async (request, response) => {
                if (response.headersSent) return;
                let results = (options.getAll.skip) ? {} : await model.read();
                options.getAll.fn(request, response, results);
            });
        });

        app.get(nodeId, (request, response) => {
            // Get single entry
            options.auth(request, response, async (request, response) => {
                if (response.headersSent) return;
                const {
                    id
                } = request.query;
                const results = (options.get.skip) ? {} : await model.read({
                    id
                });
                options.getAll.fn(request, response, results);
            });
        });

        app.post(nodeRoot, (request, response) => {
            // Add an entry
            options.auth(request, response, async (request, response) => {
                if (response.headersSent) return;
                const {
                    body
                } = request;
                if (!validateData(body)) return response.send(500);
                const results = (options.post.skip) ? {} : await model.add();
                options.post.fn(request, response, results);
            });
        });

        app.put(nodeRoot, (request, response) => {
            // update many
            options.auth(request, response, async (request, response) => {
                if (response.headersSent) return;
                let {
                    body
                } = request;
                if (!Array.isArray(body)) body = [body];
                for (let item of body) {
                    if (!validateData(item)) return response.send(500);
                }
                const results = (options.putAll.skip) ? {} : await model.update(body);
                options.putAll.fn(request, response, results);
            });
        });

        app.put(nodeId, (request, response) => {
            // Update an entry
            options.auth(request, response, async (request, response) => {
                if (response.headersSent) return;
                const {
                    id
                } = request.query;
                let {
                    body
                } = request;
                body.id = id;
                if (!validateData(body)) return response.send(500);
                let results = (options.put.skip) ? {} : await model.update([body]);
                options.put.fn(request, response, results);
            });
        });

        app.delete(nodeRoot, (request, response) => {
            // delete many
            options.auth(request, response, async (request, response) => {
                if (response.headersSent) return;
                let {
                    body
                } = request;
                if (!Array.isArray(body)) body = [body];
                for (let item of body) {
                    if (!validateId(item)) return response.send(500);
                }
                let results = (options.deleteMany.skip) ? {} : await model.delete(body);
                options.deleteMany.fn(request, response, results);
            });
        });

        app.delete(nodeId, (request, response) => {
            //delete an entry
            options.auth(request, response, async (request, response) => {
                if (response.headersSent) return;
                const {
                    id
                } = request.query;
                const results = (options.delete.skip) ? {} : await model.delete(id);
                options.deleteMany.fn(request, response, results);
            });
        });

        for(const endpoint of options.endpoints) {
            console.log(`adding ${nodeRoot}/${endpoint.path}`);
            app[endpoint.method](`${nodeRoot}/${endpoint.path}`, endpoint.fn);
        }
    }

    return {
        add,
    }

}