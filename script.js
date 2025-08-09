const btnAdicionarProdutos = document.getElementById('btn-adicionar-produto');
const formulario = document.getElementById('formulario');
const adicionar = document.getElementById('adicionar');

let editando = false;
let indiceEdicao = null;

btnAdicionarProdutos.addEventListener('click', function () {
    formulario.classList.toggle('hidden');
});

const listaDeProdutos = JSON.parse(localStorage.getItem('listaDeProdutos')) || [];

function produtoGeral() {
    const produto = document.getElementById('produto').value.trim();
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const preco = parseFloat(document.getElementById('valor').value) || 0;

    if (!produto || isNaN(quantidade) || quantidade <= 0) {
        alert('Preencha todos os campos corretamente!');
        return;
    }

    const valorTotal = quantidade * preco;

    if (editando) {
        listaDeProdutos[indiceEdicao] = { produto, quantidade, preco, valorTotal, comprado: false };
        editando = false;
        indiceEdicao = null;
    } else {
        listaDeProdutos.unshift({ produto, quantidade, preco, valorTotal, comprado: false });
    }

    atualizarLista();
    limparFormulario();
}

function limparFormulario() {
    document.getElementById('produto').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('valor').value = '';
}

function excluirProduto(codigo) {
    listaDeProdutos.splice(codigo, 1);
    atualizarLista();
}

function editarProduto(codigo) {
    const produto = listaDeProdutos[codigo];
    document.getElementById('produto').value = produto.produto;
    document.getElementById('quantidade').value = produto.quantidade;
    document.getElementById('valor').value = produto.preco;
    formulario.classList.remove('hidden');
    editando = true;
    indiceEdicao = codigo;
}

function atualizarLista() {
    const ul = document.querySelector('.lista');
    ul.innerHTML = `
        <li class="lista-produtos">
            <p></p>
            <p class="listaProdutos">Produto</p>
            <p class="listaQuantidade">Quantidade</p>
            <p class="listaPreco">Preço</p>
            <p class="listaValorTotal">Valor Total</p>
        </li>
    `;

    listaDeProdutos.forEach((item, index) => {
        const li = document.createElement('li');
        li.classList.add('lista-produtos');
        li.innerHTML = `
            <p><input type="checkbox" class="checkbox-produto" /></p>
            <p class="listaProdutos">${item.produto}</p>
            <p class="listaQuantidade">${item.quantidade}</p>
            <p class="listaPreco">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
            <p class="listaValorTotal">R$ ${item.valorTotal.toFixed(2).replace('.', ',')}</p>
            <div class="acoes">
                <button class="btn-editar" data-codigo="${index}"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-excluir" data-codigo="${index}"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        li.querySelector('.btn-excluir').addEventListener('click', (e) => {
            excluirProduto(index);
        });

        li.querySelector('.btn-editar').addEventListener('click', (e) => {
            editarProduto(index);
        });

        const checkbox = li.querySelector('.checkbox-produto');
        checkbox.checked = item.comprado;
        checkbox.addEventListener('change', function() {
            item.comprado = this.checked;
            li.classList.toggle('comprado', this.checked);
            salvarLista();
        });
        li.classList.toggle('comprado', item.comprado);

        li.addEventListener('click', (e) => {
            if (
                !e.target.classList.contains('btn-editar') &&
                !e.target.classList.contains('btn-excluir') &&
                !e.target.classList.contains('checkbox-produto')
            ) {
                li.classList.toggle('show-actions');
            }
        });

        ul.appendChild(li);
    });

    salvarLista();
    const total = listaDeProdutos.reduce((soma, item) => soma + item.valorTotal, 0);
    document.getElementById('valor-total').textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
}

function salvarLista() {
    localStorage.setItem('listaDeProdutos', JSON.stringify(listaDeProdutos));
}

window.addEventListener('load', atualizarLista);

adicionar.addEventListener('click', function (event) {
    event.preventDefault();
    produtoGeral();
});