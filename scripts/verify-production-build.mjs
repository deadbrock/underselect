#!/usr/bin/env node
/**
 * Simula o build Docker/Railway sem DATABASE_URL configurada.
 * Deve passar antes de cada deploy.
 */

import { execSync } from 'node:child_process';

const env = { ...process.env };
delete env.DATABASE_URL;
delete env.DIRECT_URL;

console.log('Verificando build de produção sem DATABASE_URL...\n');

try {
  execSync('npm run build', {
    stdio: 'inherit',
    env,
  });
  console.log('\n✅ Build de produção validado sem DATABASE_URL.');
} catch {
  console.error('\n❌ Build falhou sem DATABASE_URL. Corrija antes do deploy.');
  process.exit(1);
}
