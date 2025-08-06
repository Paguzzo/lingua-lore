const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando servidor CriativeIA...');
console.log('📍 Diretório:', __dirname);

// Configurar variáveis de ambiente
process.env.NODE_ENV = 'development';

// Iniciar o servidor
const serverPath = path.join(__dirname, 'server', 'index.ts');
const command = `npx tsx "${serverPath}"`;

console.log('📂 Executando:', command);

const server = exec(command, { cwd: __dirname });

server.stdout.on('data', (data) => {
  console.log(data.toString());
});

server.stderr.on('data', (data) => {
  console.error(data.toString());
});

server.on('close', (code) => {
  console.log(`Servidor finalizado com código: ${code}`);
});

// Manter o processo vivo
process.on('SIGINT', () => {
  console.log('\n🛑 Parando servidor...');
  server.kill();
  process.exit();
});