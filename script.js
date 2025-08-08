/*const btnAdicionarProdutos = document.getElementById('btn-adicionar-produto');
const formulario = document.getElementById('formulario');
const adicionar = document.getElementById('adicionar');

btnAdicionarProdutos.addEventListener('click', function() {
    formulario.classList.toggle('hidden')
});

let listaDeProdutos = [];

function produtoGeral () {
    const produto = document.getElementById('produto').value;
    const quantidade = document.getElementById('quantidade').value;
    const preco = parseFloat(document.getElementById('valor').value);

    const valorTotal = quantidade * preco;

    listaDeProdutos.push({produto, quantidade, preco});

    atualizarLista();

    console.log(produto);
    console.log(quantidade);
    console.log(valorFormatado);
}

// Adicionar Produto na lista
function atualizarLista() {
    const ul = document.getElementById('lista');

    ul.innerHTML = "";

    listaDeProdutos.forEach(produtoGeral => {
        const li = document.createElement('li');
        li.classList.add('lista-produtos');

        li.innerHTML = `
            <p class="listaProdutos">${produtoGeral.produto}</p>
            <p class="listaQuantidade">${produtoGeral.quantidade}</p>
            <p class="listaPreco">${produtoGeral.preco.toFixed(2).replace('.',',')}</p>
            <p class="listaValorTotal">${produtoGeral.valorTotal.toFixed(2).replace('.',',')}</p>
        `
        ul.appendChild(li);
    });
}

adicionar.addEventListener('click', function () {
    event.preventDefault(); //Impede o recarregamento da página 
    atualizarLista();
}) */
const btnAdicionarProdutos = document.getElementById('btn-adicionar-produto');
const formulario = document.getElementById('formulario');
const adicionar = document.getElementById('adicionar');

btnAdicionarProdutos.addEventListener('click', function () {
    formulario.classList.toggle('hidden');
});

const listaDeProdutos = JSON.parse(localStorage.getItem('listaDeProdutos')) || [];

function produtoGeral() {
    const produto = document.getElementById('produto').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const preco = parseFloat(document.getElementById('valor').value);

    if (!produto || isNaN(quantidade)) {
        alert('Preencha todos os campos corretamente!');
        return;
    }

    const valorTotal = quantidade * preco;

    listaDeProdutos.unshift({ produto, quantidade, preco, valorTotal, comprado: false });
    atualizarLista();
}
function limparFormulario() {
    document.getElementById('produto').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('valor').value = '';
}

//função excluir

function excluirProduto(codigo) {
  listaDeProdutos.splice(codigo, 1); // remove 1 item da lista no índice informado
  atualizarLista(); // atualiza a lista na tela
}

//função editar

function editarProduto(codigo) {
  const produto = listaDeProdutos[codigo];

  // Preenche o formulário com os dados do produto
  document.getElementById('produto').value = produto.produto;
  document.getElementById('quantidade').value = produto.quantidade;
  document.getElementById('valor').value = produto.preco;

  // Mostrar o formulário
  document.getElementById('formulario').classList.remove('hidden');

  // Remove o item antigo da lista
  listaDeProdutos.splice(codigo, 1);

  // Quando clicar no botão "Adicionar", ele vai adicionar como novo
}

function atualizarLista() {
    const ul = document.querySelector('.lista');

    // Limpa a lista, mas mantém o cabeçalho (primeiro item)
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
            const codigo = Number(e.currentTarget.getAttribute('data-codigo'));
            excluirProduto(codigo);
        });

        li.querySelector('.btn-editar').addEventListener('click', (e) => {
            const codigo = Number(e.currentTarget.getAttribute('data-codigo'));
            editarProduto(codigo);
        });

        const checkbox = li.querySelector('.checkbox-produto');
        checkbox.checked = item.comprado;
        checkbox.addEventListener('change', function() {
            item.comprado = this.checked;
            li.classList.toggle('comprado', this.checked);
            localStorage.setItem('listaDeProdutos', JSON.stringify(listaDeProdutos));
        });
        li.classList.toggle('comprado', item.comprado);

        // esconde ou mostrar o icone de editar ou excluir

        li.addEventListener('click', (e) => {
            if(
                !e.target.classList.contains('btn-editar') &&
                !e.target.classList.contains('btn-excluir') &&
                !e.target.classList.contains('checkbox-produto')
            ){
                li.classList.toggle('show-actions');
            }
        });

        ul.appendChild(li);
    });

    localStorage.setItem('listaDeProdutos', JSON.stringify(listaDeProdutos));

    // Valor Total - calcular o valor total
    const total = listaDeProdutos.reduce((soma, item) => soma + item.valorTotal, 0);
    //Exibir o valor total formatado
    document.getElementById('valor-total').textContent = '  R$ ' + total.toFixed(2).replace('.',',');

    
}
window.addEventListener('load', atualizarLista);

adicionar.addEventListener('click', function (event) {
    event.preventDefault(); // Impede o recarregamento da página
    produtoGeral();
    limparFormulario();

    
});



