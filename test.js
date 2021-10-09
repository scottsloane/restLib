const app = require('express')();
const restLib = require('./index');

(async () => {

    const client = {};

    restLib.setProviders({
        mongodb: require('./mongomodel')(client)
    });

    await restLib.loadModels('./models');
    await restLib.loadControllers('./controllers');

    restLib.restify(app);

    app.listen(8000, () => {
        console.log('server listening')
    });

})()