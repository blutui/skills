#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { addMetadataToAgentsMd, addAgentsMdToRoot, addRulesContent } = require('./main.js');

/**
 * Main build function that orchestrates the generation of AGENTS.md
 */
function buildAgentsMd() {
  try {
    console.log('🚀 Starting AGENTS.md build process...\n');
    
    // Define paths
    const rootDir = path.join(__dirname, '../..');
    const skillPath = path.join(rootDir, 'skills/blutui-project-guidelines');
    const rulesPath = path.join(skillPath, 'rules');
    const rootAgentsMdPath = path.join(rootDir, 'AGENTS.md');
    
    // Step 1: Generate metadata content
    console.log('📝 Step 1: Generating metadata content...');
    const tempPath = path.join(rulesPath, 'temp-agents.md');
    addMetadataToAgentsMd(skillPath, tempPath);
    let agentsContent = fs.readFileSync(tempPath, 'utf8');
    fs.unlinkSync(tempPath); // Clean up temp file
    
    // Step 2: Add rules content
    console.log('\n📦 Step 2: Adding rules content...');
    const rulesContent = addRulesContent(rulesPath);
    agentsContent += '\n\n' + rulesContent;
    
    // Step 3: Write AGENTS.md directly to root
    console.log('\n💾 Step 3: Writing AGENTS.md to root directory...');
    const agentsExists = fs.existsSync(rootAgentsMdPath);
    fs.writeFileSync(rootAgentsMdPath, agentsContent, 'utf8');
    console.log(`✓ AGENTS.md ${agentsExists ? 'updated' : 'created'} at ${rootAgentsMdPath}`);
    
    console.log('\n✅ Build completed successfully!\n');
    
    // Summary
    console.log('📊 Summary:');
    console.log(`   - AGENTS.md: ${rootAgentsMdPath}`);
    console.log(`   - Total size: ${(agentsContent.length / 1024).toFixed(2)} KB\n`);
    
    return 0;
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    console.error(error.stack);
    return 1;
  }
}

// Execute if run directly
if (require.main === module) {
  const exitCode = buildAgentsMd();
  process.exit(exitCode);
}

module.exports = { buildAgentsMd };
