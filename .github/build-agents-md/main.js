const fs = require('fs');
const path = require('path');

/**
 * Generate metadata content from skills folder
 * @param {string} skillPath - Path to the skill folder containing metadata.json
 * @returns {string} Generated metadata content
 */
function addMetadataToAgentsMd(skillPath) {
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

/**
 * Copy the created AGENTS.md file to the root directory
 * @param {string} sourcePath - Path to the AGENTS.md file
 * @param {string} rootDir - Root directory path
 */
function addAgentsMdToRoot(sourcePath, rootDir) {
    const destinationPath = path.join(rootDir, 'AGENTS.md');

    if (!fs.existsSync(sourcePath)) {
        throw new Error(`Source file not found at ${sourcePath}`);
    }

    const destExists = fs.existsSync(destinationPath);
    fs.copyFileSync(sourcePath, destinationPath);
    console.log(`✓ AGENTS.md ${destExists ? 'updated' : 'copied to'} ${destinationPath}`);

    return destinationPath;
}

/**
 * Add rules content from skills/rules folder based on _sections.md order
 * @param {string} rulesPath - Path to the rules folder containing _sections.md
 * @returns {string} Combined rules content
 */
function addRulesContent(rulesPath) {

    // Map section names to file prefixes
    const sectionPrefixMap = {
        'Foundation': 'foundation',
        'Model Context Protocol (MCP)': 'mcp',
        'Canvas': 'canvas',
        'Courier': 'courier',
        'Cassettes': 'cassettes',
        'Collections': 'collections',
        'Canopy': 'canopy'
    };

    // Define section order
    const sections = Object.keys(sectionPrefixMap);

    let rulesContent = "";

    // Read all files in the rules directory
    const allFiles = fs.readdirSync(rulesPath)
        .filter(file => file.endsWith('.md') && !file.startsWith('_') );

    // Process files in section order
    sections.forEach(sectionName => {
        const prefix = sectionPrefixMap[sectionName];
        if (!prefix) return;

        // Find all files that start with this prefix
        const sectionFiles = allFiles.filter(file => file.startsWith(prefix));

        if (sectionFiles.length > 0) {

            sectionFiles.forEach(file => {
                const filePath = path.join(rulesPath, file);
                const content = fs.readFileSync(filePath, 'utf8');
                rulesContent += content + '\n\n';
            });
        }
    });

    return rulesContent;
}

module.exports = {
    addMetadataToAgentsMd,
    addAgentsMdToRoot,
    addRulesContent
};
