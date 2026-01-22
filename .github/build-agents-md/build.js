#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { getMetadataContent, getRulesContent } = require('./main.js');

function buildAgentsMd() {
  try {
    console.log('Starting AGENTS.md build process...\n');
    
    const rootDir = path.join(__dirname, '../..');
    const skillPath = path.join(rootDir, 'skills/blutui-project-guidelines');
    const rulesPath = path.join(skillPath, '/rules');
    const rootAgentsMdPath = path.join(rootDir, 'AGENTS.md');
    
    console.log('Step 1: Generating metadata content...');
    let agentsContent = getMetadataContent(skillPath);
    
    console.log('\nStep 2: Adding rules content...');
    const rulesContent = getRulesContent(rulesPath);
    agentsContent += '\n\n' + rulesContent;
    
    console.log('\nStep 3: Writing AGENTS.md to root directory...');
    const agentsExists = fs.existsSync(rootAgentsMdPath);
    fs.writeFileSync(rootAgentsMdPath, agentsContent, 'utf8');
    console.log(`AGENTS.md ${agentsExists ? 'updated' : 'created'} at ${rootAgentsMdPath}`);
    
    console.log('\nBuild completed successfully!\n');
    
    console.log('Summary:');
    console.log(`   - AGENTS.md: ${rootAgentsMdPath}`);
    console.log(`   - Total size: ${(agentsContent.length / 1024).toFixed(2)} KB\n`);
    
    return 0;
    
  } catch (error) {
    console.error('\nBuild failed:', error.message);
    console.error(error.stack);
    return 1;
  }
}

if (require.main === module) {
  const exitCode = buildAgentsMd();
  process.exit(exitCode);
}

module.exports = { buildAgentsMd };
