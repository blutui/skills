const fs = require('fs');
const path = require('path');

/**
 * Add metadata from skills folder to a Claude.md file
 * @param {string} skillPath - Path to the skill folder containing metadata.json
 * @param {string} outputPath - Path where Claude.md should be created
 */
function addMetadataToClaudeMd(skillPath, outputPath) {
  const metadataPath = path.join(skillPath, 'metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    throw new Error(`Metadata file not found at ${metadataPath}`);
  }
  
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  
  let claudeContent = `# ${metadata.title}\n\n`;
  
  if (metadata.abstract) {
    claudeContent += `${metadata.abstract}\n\n`;
  }
  
  claudeContent += '---\n\n';
  claudeContent += `**Version:** ${metadata.version}\n`;
  claudeContent += `**Organization:** ${metadata.organization}\n`;
  claudeContent += `**Date:** ${metadata.date}\n\n`;
  
  if (metadata.references && metadata.references.length > 0) {
    claudeContent += '**References:**\n';
    metadata.references.forEach(ref => {
      claudeContent += `- ${ref}\n`;
    });
    claudeContent += '\n';
  }
  
  claudeContent += '---\n\n';
  
  // Read and append SKILL.md content if it exists
  const skillMdPath = path.join(skillPath, 'SKILL.md');
  if (fs.existsSync(skillMdPath)) {
    const skillContent = fs.readFileSync(skillMdPath, 'utf8');
    claudeContent += skillContent;
  }
  
  // Write to output path
  const claudeExists = fs.existsSync(outputPath);
  fs.writeFileSync(outputPath, claudeContent, 'utf8');
  console.log(`✓ Claude.md ${claudeExists ? 'updated' : 'created'} at ${outputPath}`);
  
  return outputPath;
}

/**
 * Copy the created Claude.md file to the root directory
 * @param {string} sourcePath - Path to the Claude.md file
 * @param {string} rootDir - Root directory path
 */
function addClaudeMdToRoot(sourcePath, rootDir) {
  const destinationPath = path.join(rootDir, 'Claude.md');
  
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source file not found at ${sourcePath}`);
  }
  
  const destExists = fs.existsSync(destinationPath);
  fs.copyFileSync(sourcePath, destinationPath);
  console.log(`✓ Claude.md ${destExists ? 'updated' : 'copied to'} ${destinationPath}`);
  
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
  const sections = [
    'foundation',
    'mcp',
    'canvas',
    'courier',
    'cassettes',
    'collections',
    'canopy'
  ];
  
  let rulesContent = "";

  // Read all files in the rules directory
  const allFiles = fs.readdirSync(rulesPath)
    .filter(file => file.endsWith('.md') && !file.startsWith('_'));
  
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
  addMetadataToClaudeMd,
  addClaudeMdToRoot,
  addRulesContent
};
