#!/usr/bin/env node
/**
 * Verifica arquivos em busca de segredos comuns.
 * Uso: node scripts/check-secrets.mjs
 *      node scripts/check-secrets.mjs --staged
 */

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const args = new Set(process.argv.slice(2));
const useStaged = args.has('--staged');

const SECRET_PATTERNS = [
  {
    name: 'PostgreSQL connection string com credenciais',
    regex: /postgresql:\/\/[^\s'"`]+:[^\s'"`]+@/gi,
    allowIn: ['.env.example', 'docker-compose.yml', 'env.ts'],
  },
  {
    name: 'Supabase service role / anon key JWT',
    regex: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
    allowIn: [],
  },
  {
    name: 'AUTH_SECRET atribuído',
    regex: /AUTH_SECRET\s*=\s*[^\s#][^\n\r]{7,}/g,
    allowIn: ['.env.example'],
  },
  {
    name: 'Senha de banco em variável',
    regex: /(POSTGRES_PASSWORD|DATABASE_PASSWORD|DB_PASSWORD)\s*=\s*[^\s#][^\n\r]+/gi,
    allowIn: ['.env.example', 'docker-compose.yml'],
  },
  {
    name: 'Private key PEM',
    regex: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
    allowIn: [],
  },
  {
    name: 'AWS access key',
    regex: /AKIA[0-9A-Z]{16}/g,
    allowIn: [],
  },
];

const BLOCKED_FILES = new Set([
  '.env',
  '.env.local',
  '.env.production',
  '.env.development',
]);

const PLACEHOLDER_VALUES = [
  'sua_infinite_tag',
  'gere_um_segredo_longo_e_aleatorio_aqui',
  'Admin@123456',
  'SenhaSegura123',
  'postgres:postgres@localhost',
  'SEU_IP',
  'xxxx.ngrok-free.app',
  '[SENHA]',
  '[ref]',
];

function getFilesToScan() {
  if (useStaged) {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf8',
    }).trim();
    return output ? output.split('\n').filter(Boolean) : [];
  }

  const output = execSync('git ls-files', { encoding: 'utf8' }).trim();
  return output ? output.split('\n').filter(Boolean) : [];
}

function isAllowed(path, allowIn) {
  return allowIn.some((suffix) => path.endsWith(suffix));
}

function isPlaceholder(match) {
  return PLACEHOLDER_VALUES.some((value) => match.includes(value));
}

const files = getFilesToScan();
const findings = [];

for (const file of files) {
  const normalized = file.replace(/\\/g, '/');

  if (BLOCKED_FILES.has(normalized) || normalized.startsWith('.env.')) {
    if (normalized !== '.env.example') {
      findings.push({
        file: normalized,
        reason: 'Arquivo de ambiente não deve ser commitado.',
      });
      continue;
    }
  }

  let content;
  try {
    content = readFileSync(file, 'utf8');
  } catch {
    continue;
  }

  if (
    normalized.endsWith('docker-compose.yml') ||
    normalized.endsWith('env.ts')
  ) {
    continue;
  }

  for (const pattern of SECRET_PATTERNS) {
    const matches = content.match(pattern.regex) ?? [];
    for (const match of matches) {
      if (isAllowed(normalized, pattern.allowIn) && isPlaceholder(match)) {
        continue;
      }

      if (isPlaceholder(match)) continue;

      findings.push({
        file: normalized,
        reason: `${pattern.name}: ${match.slice(0, 48)}...`,
      });
    }
  }
}

if (findings.length > 0) {
  console.error('\n❌ Possíveis segredos detectados. Commit/push bloqueado.\n');
  for (const finding of findings) {
    console.error(`- ${finding.file}: ${finding.reason}`);
  }
  console.error(
    '\nRevise os arquivos acima. Segredos devem ficar apenas no painel da Vercel/Railway.\n',
  );
  process.exit(1);
}

console.log('✅ Nenhum segredo detectado nos arquivos verificados.');
