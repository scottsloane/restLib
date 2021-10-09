module.exports = {
    auth: (request, response, next) => {
        next(request, response);
    },
    endpoints: [{
        path: 'and/stuff',
        method: 'get',
        fn: (request, response) => {
            response.send('Fuck yeah!!!');
        }
    }]
}