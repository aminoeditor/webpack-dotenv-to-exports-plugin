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
        compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
            const defaults = dotenv.parse(fs.readFileSync('./.env'));
            let env = {}
            if (this.config.env) {
                try {
                env = dotenv.parse(fs.readFileSync(`./.env.${this.config.env}`));
                } catch (e) {
                    console.log('No config file for env:', this.config.env);
                }
            }
            const combined = {
                ...defaults,
                ...env
            };
            const activeKeys = [];
            // format to exports
            let exportFile = "";
            for (let key in combined) {
                if (key.match("VUE_APP_")) {
                    const val = combined[key];
                    key = key.replace("VUE_APP_", "");
                    activeKeys.push(key);
                    exportFile += `const ${key} = "${val}";\n`;
                }
            }
            exportFile += `\nexport { ${activeKeys.join(', ')} }`;
            compilation.emitAsset(this.config.filename, new RawSource(exportFile));
        });
    }
}

module.exports = DotenvToExportsPlugin;
