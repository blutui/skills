const fs = require('fs');
const path = require('path');

function getMetadataContent(skillPath) {
    const metadataPath = path.join(skillPath, 'metadata.json');

    if (!fs.existsSync(metadataPath)) {
        throw new Error(`Metadata file not found at ${metadataPath}`);
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

    let agentsContent = `# ${metadata.title}\n\n`;

    if (metadata.abstract) {
        agentsContent += `${metadata.abstract}\n\n`;
    }

    agentsContent += `* Version: ${metadata.version}\n`;
    agentsContent += `* Organization: ${metadata.organization}\n`;
    agentsContent += `* Date: ${metadata.date}\n`;

    if (metadata.references && metadata.references.length > 0) {
        agentsContent += '* References:\n';
        metadata.references.forEach(ref => {
            agentsContent += `  - ${ref}\n`;
        });
        agentsContent += '\n';
    }

    return agentsContent;
}

function getRulesContent(rulesPath) {
    const sectionPrefixMap = {
        'Foundation': 'foundation',
        'Model Context Protocol (MCP)': 'mcp',
        'Canvas': 'canvas',
        'Courier': 'courier',
        'Cassettes': 'cassettes',
        'Collections': 'collections',
        'Canopy': 'canopy'
    };

    const sections = Object.keys(sectionPrefixMap);

    let rulesContent = "";

    const allFiles = fs.readdirSync(rulesPath)
        .filter(file => file.endsWith('.md') && !file.startsWith('_') );

    sections.forEach(sectionName => {
        const prefix = sectionPrefixMap[sectionName];
        if (!prefix) return;

        const sectionFiles = allFiles.filter(file => file.startsWith(prefix));

        if (sectionFiles.length > 0) {
            sectionFiles.forEach(file => {
                const filePath = path.join(rulesPath, file);
                const content = fs.readFileSync(filePath, 'utf8');
                rulesContent += content + '\n\n';
                rulesContent += `\n\n`;
            });
        }
    });

    return rulesContent;
}

module.exports = {
    getMetadataContent,
    getRulesContent
};
