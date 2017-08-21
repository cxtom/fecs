/**
 * @file hook esnext.checkNext in eslint.js
 * @author chris<wfsr@foxmail.com>
 */

var fs = require('fs');
var path = require('path');
var eslintPath = require.resolve('eslint/lib/eslint.js');

var eslintBackup = eslintPath + '.bak';

if (fs.existsSync(eslintBackup)) {
    console.log('had been injected.');
}
else {
    console.log('inject eslint.js...');

    var code = fs.readFileSync(eslintPath, 'utf-8');

    fs.renameSync(eslintPath, eslintBackup);

    var esnextPath = path.join(__dirname, '..', 'lib/js/esnext');
    var relativePath = path.relative(path.dirname(eslintPath), esnextPath)
        // 修复 windows 上的路径是 \ 的问题
        .replace(/\\/g, '/');
    var injectCode = 'require("' + relativePath + '").detect(ast, config, currentFilename);';

    code = code.replace(/(\s*)(sourceCode = new SourceCode\(text, ast\);)/, '$1$2$1' + injectCode);

    fs.writeFileSync(eslintPath, code, 'utf-8');

    console.log('finish.');

}
