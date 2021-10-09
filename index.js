const fs = require('fs');

module.exports = (() => {

    const options = {
        providers: {},
        models: {}
    }

    const setProviders = (providers) => {
        options.providers = providers;
    }

    const loadControllers = (dir) => {
        return new Promise((resolve, reject) => {
            let controllerList = {};

            fs.readdir(dir, (err, files) => {
                for (let file of files) {
                    if (file.indexOf('.controller.js') > 0) {
                        const mod = require(`${dir}/${file}`);
                        let name = file.split('.')[0];
                        console.log(`Adding ${name} (controller)`)
                        controllerList[name] = mod;
                    }
                }
                options.controllers = controllerList;
                resolve();
            });
        });
    }

    const loadModels = (dir) => {
        return new Promise((resolve, reject) => {

            let modelList = [];

            fs.readdir(dir, (err, files) => {
                if (err) return reject(err);
                for (let file of files) {
                    if (file.indexOf('.model.js') > 0) {
                        const mod = require(`${dir}/${file}`);
                        let name = file.split('.')[0];

                        console.log(`Adding ${name} (${mod.provider})`)

                        let data = null;
                        switch (mod.provider) {
                            case 'mongodb':
                                data = options.providers.mongodb(name, mod.schema);
                                break;
                            default:
                                data = {};
                        }
                        modelList.push({
                            name,
                            data
                        });
                    }
                }
                options.models = modelList;
                resolve();
            });
        });
    }

    const restify = (app) => {
        const rest = require('./lib')(app);

        for (let model of options.models) {
            rest.add(model.name, model.data, (typeof options.controllers[model.name] !== 'undefined') ? options.controllers[model.name] : {});
        }
    }

    return {
        setProviders,
        loadModels,
        loadControllers,
        restify,
    }
})();