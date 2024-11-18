

var menuItem = document.querySelectorAll('.item-menu');

function selectLink() {
    menuItem.forEach((item) =>
        item.classList.remove('ativo')
    );
    this.classList.add('ativo');
}

menuItem.forEach((item) =>
    item.addEventListener('click', selectLink)
);

var exp = document.querySelector('#expan');
var menuside = document.querySelector('.menu-lateral');

exp.addEventListener('click', function () {
    menuside.classList.toggle('expandir');
});

const vagasEstacionamento = 20; // Limite máximo de vagas

async function ArmazenarRegistro() {
    let tabela = document.getElementById('resultado');
    tabela.innerHTML = ''; // Limpa a tabela antes de adicionar os novos registros

    try {
        const response = await fetch('/api/veiculos');
        if (!response.ok) {
            throw new Error('Falha ao buscar registros');
        }
        const entries = await response.json();

        entries.forEach((entry) => {
            let novaLinha = tabela.insertRow();

            novaLinha.insertCell(0).innerText = entry.proprietario;
            novaLinha.insertCell(1).innerText = entry.placa;
            novaLinha.insertCell(2).innerText = entry.tipo;
            novaLinha.insertCell(3).innerText = entry.cor;
            novaLinha.insertCell(4).innerText = entry.horario_entrada;

            let deleteCell = novaLinha.insertCell(5);
            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.onclick = function () {
                deletarRegistro(entry.placa); // Use a placa para deletar o registro
            };

            deleteCell.appendChild(deleteButton);
        });
    } catch (err) {
        console.error('Erro ao buscar registros:', err);
    }
}

async function cadastrar() {
     // Previne o comportamento padrão do formulário

    let inputNome = document.getElementById('nome').value;
    let inputPlaca = document.getElementById('placa').value;
    let inputTipo = document.getElementById('tipo').value;
    let inputcor = document.getElementById('cor').value;
    let inputTime = document.getElementById('data').value;

    if (!inputNome || !inputPlaca || !inputTipo || !inputcor || !inputTime) {
        Swal.fire({
            title: "Erro",
            text: "Por favor, preencha todos os campos.",
            icon: "error"
        });
        return;
    }

    if (inputPlaca.length !== 7) {
        Swal.fire({
            title: "A placa do carro deve ter exatamente 7 caracteres.",
            icon: "info"
        });
        return;
    }

    try {
        const response = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: inputNome,
                placa: inputPlaca,
                tipo: inputTipo,
                cor: inputcor,
                horario_entrada: inputTime
            }),
        });

        if (!response.ok) {
            throw new Error('Falha ao cadastrar veículo');
        }

        ArmazenarRegistro();
        atualizarVagas();
    } catch (error) {
        console.error('Erro:', error);
    }
}


async function deletarRegistro(placa) {
    try {
        const response = await fetch(`/api/veiculos?placa=${encodeURIComponent(placa)}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Falha ao deletar veículo');
        }

        ArmazenarRegistro();
        atualizarVagas();
    } catch (error) {
        console.error('Erro:', error);
    }
}
window.cadastrar = cadastrar