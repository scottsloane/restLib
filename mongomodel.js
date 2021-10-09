module.exports = (client) => {

    return (name, schema, options = {}) => {

        // const passThrough = (request, response, next) => next(request, response);

        return {
            create: () => {
                return new Promise((resolve, reject) => {
                    return resolve(true);
                });
            },
            read: () => {
                return new Promise((resolve, reject) => {
                    return resolve(true);
                });
            },
            update: () => {
                return new Promise((resolve, reject) => {
                    return resolve(true);
                });
            },
            delete: () => {
                return new Promise((resolve, reject) => {
                    return resolve(true);
                });
            },
            schema
        }

    }
}