const fs = require('fs');
const dotenv = require('dotenv');
const { RawSource } = require('webpack-sources');

class DotenvToExportsPlugin {
    constructor (config = {}) {
        this.config = {
            filename: './env.js',
            ...config
        }
    }

    apply (compiler) {
        const pluginName = this.constructor.name;
		const { env, filter, transformKey, transformValue } = this.config;
        compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
            const defaultsFile = dotenv.parse(fs.readFileSync('./.env'));
            let envFile = {}
            if (env) {
                try {
                	envFile = dotenv.parse(fs.readFileSync(`./.env.${env}`));
                } catch (e) {
                    console.log('No config file for env:', env);
                }
			}
            const combinedFile = {
                ...defaultsFile,
                ...envFile
            };
            const activeKeys = [];
            // format to exports
            let exportFile = "";
            for (let key in combinedFile) {
				let val = combinedFile[key];
				if (filter && !filter(key, val)) {
					continue;
				}
				if (transformKey) {
					key = transformKey(key);
				}
				if (transformValue) {
					val = transformValue(val);
				}
				activeKeys.push(key);
				exportFile += `const ${key} = "${val}";\n`;
            }
            exportFile += `\nexport { ${activeKeys.join(', ')} }`;
            compilation.emitAsset(this.config.filename, new RawSource(exportFile));
        });
    }
}

module.exports = DotenvToExportsPlugin;
