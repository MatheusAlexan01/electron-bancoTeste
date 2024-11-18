// Seleciona os itens do menu e ativa o item clicado
var menuItem = document.querySelectorAll('.item-menu');

function selectLink() {
    menuItem.forEach((item) => item.classList.remove('ativo'));
    this.classList.add('ativo');
}

menuItem.forEach((item) => item.addEventListener('click', selectLink));

// Expande e contrai o menu lateral
var exp = document.querySelector('#expan');
var menuside = document.querySelector('.menu-lateral');

exp.addEventListener('click', function () {
    menuside.classList.toggle('expandir');
});

// Carregar PDF e converter para Base64
function carregarPdf() {
    const pdfInput = document.getElementById('pdfRelatorio').files[0];
    const reader = new FileReader();
    reader.onload = function () {
        const pdfBase64 = reader.result;
        sessionStorage.setItem('pdfRelatorio', pdfBase64);
    };
    if (pdfInput) {
        reader.readAsDataURL(pdfInput); // Converte para Base64
    }
}

// Função para cadastrar valores no localStorage
function cadastrarValor() {
    const inputLucro = parseFloat(document.getElementById('lucro').value);
    const inputDespesas = parseFloat(document.getElementById('dispesas').value);
    const inputEntradas = parseInt(document.getElementById('entradas').value);
    const inputMotivoD = document.getElementById('Mdispesas').value;
    const inputStatus = document.getElementById('status').value;
    const pdfRelatorio = sessionStorage.getItem('pdfRelatorio');

    if (!inputLucro || !inputDespesas || !inputEntradas || !inputMotivoD || !inputStatus || !pdfRelatorio) {
        Swal.fire({
            title: "Erro",
            text: "Por favor, preencha todos os campos.",
            icon: "error"
        });
        return;
    }

    let entradaLucros = JSON.parse(localStorage.getItem('lucro')) || [];

    entradaLucros.push({
        data: new Date().toLocaleDateString('pt-BR'),
        lucro: inputLucro,
        despesas: inputDespesas,
        entradas: inputEntradas,
        motivo: inputMotivoD,
        status: inputStatus,
        pdf: pdfRelatorio
    });

    localStorage.setItem('lucro', JSON.stringify(entradaLucros));
    armazenamentoLucro();
}

// Exibir registros na tabela
function armazenamentoLucro() {
    let tabela = document.getElementById('resultado');
    tabela.innerHTML = '';  // Limpa a tabela antes de adicionar novos dados

    let entradaLucros = JSON.parse(localStorage.getItem('lucro')) || [];

    entradaLucros.forEach((entrada, index) => {
        let novaLinha = tabela.insertRow();

        const lucro = parseFloat(entrada.lucro) || 0;
        const despesas = parseFloat(entrada.despesas) || 0;
        const receita = (lucro - despesas).toFixed(2);

        novaLinha.insertCell(0).innerText = entrada.data;
        novaLinha.insertCell(1).innerText = lucro.toFixed(2);
        novaLinha.insertCell(2).innerText = despesas.toFixed(2);
        novaLinha.insertCell(3).innerText = receita;
        novaLinha.insertCell(4).innerText = entrada.status;

        // Cria a célula para os ícones de ação
        let celulaAcoes = novaLinha.insertCell(5);

        // Cria o ícone de lixeira
        let iconeDeletar = document.createElement('i');
        iconeDeletar.className = 'bi bi-trash3';
        iconeDeletar.style.cursor = 'pointer';
        iconeDeletar.title = 'Deletar';
        iconeDeletar.style.color = 'white';
        iconeDeletar.style.border = '2px solid red';
        iconeDeletar.style.borderRadius = '50%';
        iconeDeletar.style.padding = '4px';
        iconeDeletar.style.background = 'red';
        iconeDeletar.style.marginRight = '8px'; // Espaço entre os ícones
        iconeDeletar.addEventListener('click', () => excluirRegistro(index));

        // Cria o ícone de "ver mais"
        let iconeVerMais = document.createElement('i');
        iconeVerMais.className = 'bi bi-eye';
        iconeVerMais.style.cursor = 'pointer';
        iconeVerMais.title = 'Visualizar';
        iconeVerMais.style.color = 'white';
        iconeVerMais.style.border = '2px solid #02c6f9';
        iconeVerMais.style.borderRadius = '50%';
        iconeVerMais.style.padding = '4px';
        iconeVerMais.style.background = '#02c6f9';
        iconeVerMais.addEventListener('click', () => mostrarDetalhes(index));

        // Adiciona os ícones na mesma célula
        celulaAcoes.appendChild(iconeDeletar);
        celulaAcoes.appendChild(iconeVerMais);
    });
}

// Exibe os detalhes completos abaixo da tabela
function mostrarDetalhes(index) {
    let entradaLucros = JSON.parse(localStorage.getItem('lucro')) || [];
    const entrada = entradaLucros[index];

    const detalhesDiv = document.getElementById('detalhesFaturamento');
    detalhesDiv.innerHTML = `
        <h2>Detalhes do Faturamento</h2>
        <p><strong>Data:</strong> ${entrada.data}</p>
        <p><strong>Lucro:</strong> ${entrada.lucro.toFixed(2)}</p>
        <p><strong>Despesas:</strong> ${entrada.despesas.toFixed(2)}</p>
        <p><strong>Entradas de Veículos:</strong> ${entrada.entradas}</p>
        <p><strong>Motivo:</strong> ${entrada.motivo}</p>
        <p><strong>Status:</strong> ${entrada.status}</p>
        <p><strong>Relatório PDF:</strong> <a href="${entrada.pdf}" target="_blank">Visualizar PDF</a></p>
        <button onclick="fecharDetalhes()" class="btn-fechar">Fechar</button>
    `;
    detalhesDiv.style.display = 'block'; // Mostra a seção de detalhes
}

// Função para fechar os detalhes do faturamento
function fecharDetalhes() {
    const detalhesDiv = document.getElementById('detalhesFaturamento');
    detalhesDiv.style.display = 'none'; // Oculta a seção de detalhes
}

// Função para excluir um registro específico
function excluirRegistro(index) {
    let entradaLucros = JSON.parse(localStorage.getItem('lucro')) || [];
    entradaLucros.splice(index, 1); // Remove o item no índice especificado
    localStorage.setItem('lucro', JSON.stringify(entradaLucros));
    armazenamentoLucro(); // Atualiza a tabela
}

// Inicializa os dados na tabela ao carregar a página
document.addEventListener('DOMContentLoaded', armazenamentoLucro);
