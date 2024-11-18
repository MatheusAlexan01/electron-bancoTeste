var menuItem = document.querySelectorAll('.item-menu')

function selectLink(){
    menuItem.forEach((item)=>
    item.classList.remove('ativo')
    )
    this.classList.add('ativo')
}

menuItem.forEach((item)=>
    item.addEventListener('click',selectLink)
)

var exp = document.querySelector('#expan');
var menuside = document.querySelector('.menu-lateral')

exp.addEventListener('click', function (){
    menuside.classList.toggle('expandir')
})




function buscarVeiculo() {
    let placa = document.getElementById('placa').value;
    let buscar = JSON.parse(localStorage.getItem('entries')) || [];
    let veiculo = buscar.find(entry => entry.placa === placa);

    let detalhesVeiculo = document.getElementById('detalhesVeiculo');
    detalhesVeiculo.innerHTML = '';

    if (veiculo) {
        adicionarDetalhesVeiculo(detalhesVeiculo, veiculo);
    } else {
        alert('Veículo não encontrado.');
    }
}

function sugerirPlacas() {
    let placaDigitada = document.getElementById('placa').value.toUpperCase();
    let buscar = JSON.parse(localStorage.getItem('entries')) || [];
    let placasSugestoes = document.getElementById('placasSugestoes');
    
    placasSugestoes.innerHTML = ''; // Limpa as sugestões anteriores

    buscar
        .filter(entry => entry.placa.startsWith(placaDigitada))
        .forEach(entry => {
            let option = document.createElement('option');
            option.value = entry.placa;
            placasSugestoes.appendChild(option);
        });
}


function adicionarDetalhesVeiculo(detalhesVeiculo, veiculo) { 
    let novaLinha = detalhesVeiculo.insertRow();
    
    novaLinha.insertCell(0).innerText = veiculo.nome;
    novaLinha.insertCell(1).innerText = veiculo.placa;
    novaLinha.insertCell(2).innerText = veiculo.tipo;
    novaLinha.insertCell(3).innerText = veiculo.cor;
    novaLinha.insertCell(4).innerText = veiculo.time;

    novaLinha.insertCell(5).innerHTML = `<input type="time" id="horarioSaida">`;
    novaLinha.insertCell(6).innerHTML = `
        <select id="statusPagamento">
            <option value="Pago">Pago</option>
            <option value="Pendente">Pendente</option>
        </select>
    `;
    novaLinha.insertCell(7).innerText = obterDataAtual();

    let acoesCell = novaLinha.insertCell(8);
    let calcularButton = document.createElement('button');
    calcularButton.textContent = 'Calcular';
    calcularButton.onclick = function () {
        calcularValor(veiculo.time, veiculo.placa, veiculo);
    };
    acoesCell.appendChild(calcularButton);
}

function obterDataAtual() {
    let dataAtual = new Date();
    let dia = dataAtual.getDate().toString().padStart(2, '0');
    let mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0'); 
    let ano = dataAtual.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function calcularValor(horarioEntrada, placa, veiculo) {
    let horarioSaida = document.getElementById('horarioSaida').value;
    let statusPagamento = document.getElementById('statusPagamento').value;

    if (!horarioSaida || !statusPagamento) {
        alert('Preencha todos os campos.');
        return;
    }

    let diferencaMinutos = calcularDiferencaMinutos(horarioEntrada, horarioSaida);
    let valorPagar = calcularValorPagamento(diferencaMinutos);
    let mensagemResultado = diferencaMinutos <= 15 ? "(Tempo limite de 15 minutos não excedido, isento de pagamento.)" : "";

    exibirResultadoCalculo(veiculo, placa, horarioEntrada, horarioSaida, diferencaMinutos, valorPagar, mensagemResultado, statusPagamento);
    salvarResultado(veiculo, placa, horarioEntrada, horarioSaida, diferencaMinutos, valorPagar, mensagemResultado, statusPagamento);
    removerVeiculo(placa);
}

function calcularDiferencaMinutos(horarioEntrada, horarioSaida) {
    let [horaEntrada, minutoEntrada] = horarioEntrada.split(':').map(Number);
    let [horaSaida, minutoSaida] = horarioSaida.split(':').map(Number);

    let tempoEntrada = new Date();
    tempoEntrada.setHours(horaEntrada, minutoEntrada, 0);

    let tempoSaida = new Date();
    tempoSaida.setHours(horaSaida, minutoSaida, 0);

    if (tempoSaida < tempoEntrada) {
        tempoSaida.setDate(tempoSaida.getDate() + 1);
    }

    return (tempoSaida - tempoEntrada) / (1000 * 60);
}

function calcularValorPagamento(diferencaMinutos) {
    if (diferencaMinutos <= 15) return 0;
    if (diferencaMinutos <= 60) return 3;
    if (diferencaMinutos <= 120) return 6;
    if (diferencaMinutos <= 180) return 9;
    if (diferencaMinutos <= 240) return 13;
    return 18;
}

function exibirResultadoCalculo(veiculo, placa, horarioEntrada, horarioSaida, diferencaMinutos, valorPagar, mensagemResultado, statusPagamento) {
    let resultadoCalculo = document.getElementById('resultadoCalculo');
    resultadoCalculo.innerHTML = `
        <h2>Detalhes do Pagamento</h2>
        <p>Proprietário: ${veiculo.nome}</p>
        <p>Placa: ${placa}</p>
        <p>Horário de Entrada: ${horarioEntrada}</p>
        <p>Horário de Saída: ${horarioSaida}</p>
        <p>Tempo Total: ${Math.floor(diferencaMinutos)} minutos</p>
        <p>Valor a Pagar: R$ ${valorPagar} ${mensagemResultado}</p>
        <p>Status de Pagamento: ${statusPagamento}</p>
        <p>Data do Pagamento: ${obterDataAtual()}</p>
    `;
    resultadoCalculo.style.display = 'block';
}

function salvarResultado(veiculo, placa, horarioEntrada, horarioSaida, diferencaMinutos, valorPagar, mensagemResultado, statusPagamento) {
    let registro = {
        nome: veiculo.nome,
        placa: placa,
        horarioEntrada: horarioEntrada,
        horarioSaida: horarioSaida,
        tempoTotal: diferencaMinutos,
        valorPagar: valorPagar,
        mensagemResultado: mensagemResultado,
        statusPagamento: statusPagamento,
        dataPagamento: obterDataAtual()
    };

    let registrosDiarios = JSON.parse(localStorage.getItem('registrosDiarios')) || [];
    registrosDiarios.push(registro);
    localStorage.setItem('registrosDiarios', JSON.stringify(registrosDiarios));

    /*fetch('https://sheetdb.io/api/v1/i48a52jurnp1u', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: [
                {
                    'Proprietário': veiculo.nome,
                    'Placa': placa,
                    'Horário de Entrada': horarioEntrada,
                    'Horário de Saída': horarioSaida,
                    'Status de Pagamento': statusPagamento,
                    'Data' : obterDataAtual()

                }
            ]
        })
    })
      .then((response) => response.json())
      .then((data) => console.log(data));*/

}

function removerVeiculo(placa) {
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    let updatedEntries = entries.filter(entry => entry.placa !== placa);
    localStorage.setItem('entries', JSON.stringify(updatedEntries));
}

document.getElementById('enviarRegistroGeral').addEventListener('click', function () {
    Swal.fire({
        title: 'Registro Enviado!',
        text: 'Os dados do pagamento foram enviados para o registro geral com sucesso.',
        icon: 'success',
        confirmButtonText: 'OK'
    });
});
