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


document.addEventListener('DOMContentLoaded', () => {
    const clienteForm = document.getElementById('clienteForm');
    const nomeCliente = document.getElementById('nomeCliente');
    const tipoVeiculo = document.getElementById('tipoVeiculo');
    const placaVeiculo = document.getElementById('placaVeiculo');
    const corVeiculo = document.getElementById('corVeiculo');
    const telefoneCliente = document.getElementById('telefoneCliente');
    const clienteIndex = document.getElementById('clienteIndex');
    const tabelaClientes = document.querySelector('table tbody');

    // Carregar clientes armazenados ao carregar a página
    loadClientes();

    clienteForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const cliente = {
            nome: nomeCliente.value,
            tipo: tipoVeiculo.value,
            placa: placaVeiculo.value,
            cor: corVeiculo.value,
            telefone: telefoneCliente.value
        };

        if (clienteIndex.value === "") {
            addCliente(cliente);
        } else {
            updateCliente(clienteIndex.value, cliente);
        }

        clienteForm.reset();
        clienteIndex.value = "";
        loadClientes();
    });

    function addCliente(cliente) {
        let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    
        // Verifica se todos os campos estão preenchidos
        if (!cliente.nome || !cliente.placa || !cliente.tipo || !cliente.cor || !cliente.telefone) {
            Swal.fire({
                title: "Erro",
                text: "Por favor, preencha todos os campos.",
                icon: "error"
            });
            return; // Não prossegue se houver campos vazios
        }
    
        // Verifica se a placa tem exatamente 7 caracteres
        if (cliente.placa.length !== 7) {
            Swal.fire({
                title: "Erro",
                text: "A placa do carro deve ter exatamente 7 caracteres.",
                icon: "info"
            });
            return; // Não prossegue se a placa não tiver 7 caracteres
        }
    
        // Se tudo estiver correto, o cliente é adicionado à lista
        clientes.push(cliente);
        localStorage.setItem('clientes', JSON.stringify(clientes));
    }
    

    function loadClientes() {
        tabelaClientes.innerHTML = '';
        let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        clientes.forEach((cliente, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cliente.nome}</td>
                <td>${cliente.tipo}</td>
                <td>${cliente.placa}</td>
                <td>${cliente.cor}</td>
                <td>${cliente.telefone}</td>
                <td>
                    <button onclick="editCliente(${index})"><i class="bi bi-pencil-square"></i></button>
                    <button onclick="deleteCliente(${index})"><i class="bi bi-trash-fill"></i></button>
                </td>
            `;
            tabelaClientes.appendChild(tr);
        });
    }

    function editCliente(index) {
        let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        const cliente = clientes[index];
        nomeCliente.value = cliente.nome;
        tipoVeiculo.value = cliente.tipo;
        placaVeiculo.value = cliente.placa;
        corVeiculo.value = cliente.cor;
        telefoneCliente.value = cliente.telefone;
        clienteIndex.value = index;
    }

    window.editCliente = editCliente;

    function updateCliente(index, cliente) {
        let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        clientes[index] = cliente;
        localStorage.setItem('clientes', JSON.stringify(clientes));
    }

    function deleteCliente(index) {
        let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        clientes.splice(index, 1);
        localStorage.setItem('clientes', JSON.stringify(clientes));
        loadClientes();
    }

    window.deleteCliente = deleteCliente;
});
