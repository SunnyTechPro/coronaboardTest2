const path = require('path');
const fs = require('fs');
const ApiClient = require('./api-client');
const { crawlAndUpdateDomestic } = require('./domestic-updater');
const { crawlAndUpdateGlobal } = require('./global-updater');

async function main() {
    const outputPath = path.join(process.cwd(), 'output');

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }

    const apiClient = new ApiClient();
    try {
        await crawlAndUpdateDomestic(outputPath, apiClient);
    } catch (e) {
        console.error('crawlAndUpdateDomestic failed', e);
    }

    try {
        await crawlAndUpdateGlobal(outputPath, apiClient);
    } catch (e) {
        console.error('crawlAndUpdateGlobal failed', e);
    }
}

main();