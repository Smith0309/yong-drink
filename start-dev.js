const { spawn } = require('child_process');
const net = require('net');

// 사용 가능한 포트를 찾는 함수
function findAvailablePort(startPort = 3000) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    
    server.on('error', () => {
      findAvailablePort(startPort + 1).then(resolve);
    });
  });
}

// 개발 서버 시작
async function startDevServer() {
  try {
    const port = await findAvailablePort();
    console.log(`Starting development server on port ${port}...`);
    
    const child = spawn('npx', ['next', 'dev', '-p', port.toString()], {
      stdio: 'inherit',
      shell: true
    });
    
    child.on('error', (error) => {
      console.error('Failed to start server:', error);
      process.exit(1);
    });
    
    child.on('exit', (code) => {
      console.log(`Server exited with code ${code}`);
      process.exit(code);
    });
    
  } catch (error) {
    console.error('Error starting development server:', error);
    process.exit(1);
  }
}

startDevServer();
