import pkg from 'fs-extra';

const { copy, copySync, readFileSync, appendFileSync, renameSync } = pkg;

const copyFiles = async () => {
    try {
        await copy('./node_modules/@pdftron/webviewer/public', './public/webviewer/lib');
        copySync('./node_modules/@pdftron/webviewer/webviewer.min.js', './public/webviewer/lib/webviewer.min.js');
        console.log('WebViewer files copied over successfully');
        updateRibbonName();
    } catch (err) {
        console.error(err);
    }
};


const updateRibbonName = async () => {
    try {
        const originalFile = './public/webviewer/lib/ui/i18n/translation-en.json';
        const tempFile = './public/webviewer/lib/ui/i18n/translation-en.json.tmp';
        readFileSync(originalFile).toString().split('\n').forEach(function (line) {
            if (line.includes('"toolbarGroup-Insert": "Insert",')) {
                line = line.replace('"Insert"', '"Comment"');
            }
            if (line.includes('"toolbarGroup-Annotate": "Annotate",')) {
                line = line.replace('"Annotate"', '"Annot. Tool"');
            }
            appendFileSync(tempFile, line.toString() + "\n");
        });
        renameSync(tempFile, originalFile);
        console.log('Ribbon string updated');
    } catch (err) {
        console.error(err);
    }
}

copyFiles();
