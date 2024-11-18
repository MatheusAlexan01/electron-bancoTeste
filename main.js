const { app, BrowserWindow, Menu, shell } = require("electron");
const { spawn } = require('child_process');
const path = require('path');

let mainWindow = null;

// Função para iniciar o servidor Express
function startServer() {
    const serverProcess = spawn('node', ['index.js']);
    
    serverProcess.stdout.on('data', (data) => {
        console.log(`Servidor Node.js: ${data}`);
    });

    serverProcess.stderr.on('data', (data) => {
        console.error(`Erro no servidor Node.js: ${data}`);
    });

    serverProcess.on('close', (code) => {
        console.log(`Servidor Node.js encerrado com o código ${code}`);
    });

    return serverProcess;
}

// Função para criar a janela principal
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
    });

    // Carrega o endereço do servidor Express
    mainWindow.loadURL('http://localhost:3000');
    
    Menu.setApplicationMenu(Menu.buildFromTemplate(abas));
}

// Configura o menu personalizado
const abas = [
    {
        label: 'Arquivo',
        submenu: [
            { label: 'Sair', click: () => app.quit(), accelerator: 'Alt+F4' },
            { label: 'Atualizar', role: 'reload' },
            { label: 'Cortar', role: 'cut' },
            { label: 'Copiar', role: 'copy' },
        ],
    },
    {
        label: 'Exibir',
        submenu: [
            { label: 'Aumentar Zoom', role: 'zoomIn' },
            { label: 'Diminuir Zoom', role: 'zoomOut' },
            { label: 'Restaurar Zoom', role: 'resetZoom' },
            { label: 'Ferramenta de Desenvolvedor', role: 'toggleDevTools' },
        ],
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Manual',
                click: () => paginaManual(),
            },
        ],
    },
];

// Função para abrir a página de Manual
function paginaManual() {
    const manual = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
    });
    manual.loadFile('app/Manual.html');
}

// Evento para inicializar o app e servidor
app.whenReady().then(() => {
    const serverProcess = startServer(); // Inicia o servidor Express
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    app.on('before-quit', () => {
        serverProcess.kill(); // Finaliza o processo do servidor
    });
});

// Fecha a aplicação ao fechar todas as janelas
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
