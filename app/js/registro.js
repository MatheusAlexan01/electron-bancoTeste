document.addEventListener('DOMContentLoaded', () => {
    carregarRegistros();
    exibirDataAtual();
});

function carregarRegistros() {
    let registrosDiarios = JSON.parse(localStorage.getItem('registrosDiarios')) || [];
    let tabelaRegistros = document.getElementById('tabelaRegistros').getElementsByTagName('tbody')[0];
    let valorTotal = 0;
    let numeroEntradas = 0; // Variável para contar o número de entradas

    registrosDiarios.forEach(registro => {
        let novaLinha = tabelaRegistros.insertRow();
        novaLinha.insertCell(0).innerText = registro.nome;
        novaLinha.insertCell(1).innerText = registro.placa;
        novaLinha.insertCell(2).innerText = registro.horarioEntrada;
        novaLinha.insertCell(3).innerText = registro.horarioSaida;
        novaLinha.insertCell(4).innerText = Math.floor(registro.tempoTotal);
        novaLinha.insertCell(5).innerText = `R$ ${registro.valorPagar} ${registro.mensagemResultado}`;
        novaLinha.insertCell(6).innerText = registro.statusPagamento;
        novaLinha.insertCell(7).innerText = registro.dataPagamento;

        valorTotal += parseFloat(registro.valorPagar);
        numeroEntradas++; // Incrementa a contagem de entradas a cada registro
    });

    // Atualiza o lucro diário
    document.getElementById('valorLucro').innerText = valorTotal.toFixed(2);

    // Atualiza o número de entradas no <span> com id "contadorEntradas"
    document.getElementById('contadorEntradas').innerText = numeroEntradas;
}

function exibirDataAtual() {
    const dataAtual = new Date();
    const dia = dataAtual.getDate().toString().padStart(2, '0');
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataAtual.getFullYear();
    const dataFormatada = `${dia}/${mes}/${ano}`;

    document.getElementById('dataAtual').textContent = dataFormatada;
}

function limparRegistros() {
    localStorage.removeItem('registrosDiarios');
    let tabelaRegistros = document.getElementById('tabelaRegistros').getElementsByTagName('tbody')[0];
    tabelaRegistros.innerHTML = '';
    document.getElementById('valorLucro').innerText = '0.00';
    document.getElementById('contadorEntradas').innerText = '0'; // Zera a contagem de entradas
    Swal.fire({
        title: "Limpeza Feita",
        text: "Todos os registros de pagamentos foram apagados.",
        icon: "success"
    });
}

async function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const tabela = document.getElementById('tabelaRegistros');
    const pdf = new jsPDF('p', 'pt', 'a4');

    // Adiciona o título e a data ao PDF
    pdf.setFontSize(18);
    pdf.text('Registro de Pagamentos', 40, 40);
    pdf.setFontSize(12);
    pdf.text('Data: ' + document.getElementById('dataAtual').innerText, 40, 60);

    // Converte a tabela para um canvas
    const canvas = await html2canvas(tabela, { scale: 1 });
    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth() - 80;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Adiciona a tabela ao PDF
    pdf.addImage(imgData, 'PNG', 40, 80, pdfWidth, pdfHeight);

    // Adiciona lucro diário e número de entradas no PDF
    const lucroYPosition = 80 + pdfHeight + 20;
    pdf.setFontSize(14);
    pdf.text(`Lucro Diário: R$ ${document.getElementById('valorLucro').innerText}`, 40, lucroYPosition);

    // Exibe o número de entradas no PDF logo abaixo do lucro diário
    const entradasYPosition = lucroYPosition + 20;
    pdf.text(`Entrada de Veículos do dia: ${document.getElementById('contadorEntradas').innerText}`, 40, entradasYPosition);

    // Salva o PDF
    pdf.save('Registro_de_Pagamentos.pdf');
}
