module.exports = {
    provider: 'mongodb',
    schema: {
        _id: {
            type: 'mongoid',
            primary: true,
            required: true,
        },
        name: {
            type: 'string',
            required: false,
        }
    }
}