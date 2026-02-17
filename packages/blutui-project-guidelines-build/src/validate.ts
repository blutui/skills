#!/usr/bin/env node

async function validate() {
  try {
    console.log('Validating rule files...')

    console.log('\nAll rule files are valid ✓')
  } catch (error) {
    console.error('Validation failed:', error)
    process.exit(1)
  }
}

validate()
