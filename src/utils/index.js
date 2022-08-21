const path = require('path');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');

// // Only include bundle/chunk associated with HTML file
function generateHtmlPlugins(root, excludeDirs) {
  let plugins = [];
  const rootDir = fs.readdirSync(path.resolve(__dirname, root));
  // Find directories in root folder
  rootDir.forEach((templateDir) => {
    const stats = fs.lstatSync(path.resolve(__dirname, root, templateDir));
    if (stats.isDirectory() && !excludeDirs.includes(templateDir)) {
      // Read files in template directory
      const dirName = templateDir;
      const templateFiles = fs.readdirSync(
        path.resolve(__dirname, root, templateDir),
      );
      templateFiles.forEach((item) => {
        // Split names and extension
        const parts = item.split('.');
        const name = parts[0];
        const extension = parts[1];
        // If we find an html file then create an HtmlWebpackPlugin
        if (extension === 'html') {
          // Create new HTMLWebpackPlugin with options
          plugins.push(
            new HtmlWebpackPlugin({
              filename: `${dirName}/index.html`,
              template: path.resolve(
                __dirname,
                `${root}/${templateDir}/${name}.${extension}`,
              ),
              inject: 'body',
              // Only include bundle/chunk associated with the templateDir directory
              chunks: [`${dirName}`],
            }),
          );
        }
      });
    }
  });
  return plugins;
}

function generateEntryPoints(root, entryScript, excludeDirs) {
  const rootDir = fs.readdirSync(path.resolve(__dirname, root));
  let entryPoints = { css: './src/css/style.scss' };
  rootDir.forEach((templateDir) => {
    const stats = fs.lstatSync(path.resolve(__dirname, root, templateDir));
    if (stats.isDirectory() && !excludeDirs.includes(templateDir)) {
      entryPoints[templateDir] = `${root}/${templateDir}/${entryScript}`;
    }
  });
  return entryPoints;
}

const excludeDirs = ['css', 'images', 'lib', 'api', '_hello-ts', 'utils'];
const htmlPlugins = generateHtmlPlugins('../', excludeDirs);
const entryPoints = generateEntryPoints('../', 'index.ts', excludeDirs);

console.log('excludeDirs', excludeDirs);
console.log('\n');
console.log('htmlPlugins', htmlPlugins);
console.log('\n');
console.log('entryPoints', entryPoints);
