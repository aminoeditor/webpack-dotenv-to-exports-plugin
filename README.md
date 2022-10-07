# Dotenv to Exports Plugin
**The webpack plugin you never knew you always needed**

This plugin will convert your .env files to a file of individual js exports. This is really useful if you're using .env and also have other files with no access to process.env that need the environment variables as well.

**Usage Example**
```
const DotenvToExportsPlugin = require('@aminoeditor/webpack-dotenv-to-exports');
{
	...,
	plugins: [
		new DotenvToExportsPlugin({
			// the environment name
			env: process.env.NODE_ENV,
			// output filename in your /dist
			filename: './.env.js',
			// filter entries
			// return false to exclude entry
			filter (key, val) {
				return key.length && val.length;
			},
			// transform entry key
			// alters key name in the resulting file
			transformKey ({key, val}) {
				return `DOTENV_${key}`;
			},
			// transform entry value
			// alters value in resulting file
			transformValue ({key, val}) {
				if (key === 'MUST_BE_UPPER') {
					return val.toUpperCase();
				}
				return val;
			}
		})
	]
}
```
