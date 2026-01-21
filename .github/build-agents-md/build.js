#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { addMetadataToClaudeMd, addClaudeMdToRoot, addRulesContent } = require('./main.js');

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
    const claudeMdPath = path.join(skillPath, 'Claude.md');
    
    // Step 1: Generate Claude.md with metadata in the skill folder
    console.log('📝 Step 1: Generating Claude.md with metadata...');
    addMetadataToClaudeMd(skillPath, claudeMdPath);
    
    // Step 2: Copy Claude.md to root directory
    console.log('\n📋 Step 2: Copying Claude.md to root directory...');
    addClaudeMdToRoot(claudeMdPath, rootDir);
    
    // Step 3: Generate AGENTS.md with combined content
    console.log('\n📦 Step 3: Generating AGENTS.md with rules content...');
    
    // Read the Claude.md content from root
    const rootClaudeMdPath = path.join(rootDir, 'Claude.md');
    let agentsContent = fs.readFileSync(rootClaudeMdPath, 'utf8');
    
    // Add rules content
    const rulesContent = addRulesContent(rulesPath);
    agentsContent += '\n\n' + rulesContent;
    
    // Write AGENTS.md to root
    const agentsMdPath = path.join(rootDir, 'AGENTS.md');
    const agentsExists = fs.existsSync(agentsMdPath);
    fs.writeFileSync(agentsMdPath, agentsContent, 'utf8');
    console.log(`✓ AGENTS.md ${agentsExists ? 'updated' : 'created'} at ${agentsMdPath}`);
    
    console.log('\n✅ Build completed successfully!\n');
    
    // Summary
    console.log('📊 Summary:');
    console.log(`   - Claude.md: ${rootClaudeMdPath}`);
    console.log(`   - AGENTS.md: ${agentsMdPath}`);
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
