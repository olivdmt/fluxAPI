const input_titulo = document.querySelector('#titulo');
const input_descricao = document.querySelector('#descricao');
const input_preco = document.querySelector('#preco');
const input_marca = document.querySelector('#marca');
const input_categoria = document.querySelector('#categoria');
const input_imagem = document.querySelector('#imagem');
const listaProdutos = document.querySelector('#lista-produtos');

const btnEnviar = document.querySelector('#btn-send');

const mensagemErroTitulo = document.querySelector('#mensagemErroTitulo');
const mensagemErroDescricao = document.querySelector('#mensagemErroDescricao');
const mensagemErroPreco = document.querySelector('#mensagemErroPreco');
const mensagemErroMarca = document.querySelector('#mensagemErroMarca');
const mensagemErroCategoria = document.querySelector('#mensagemErroCategoria');

// Várivale para armazenar novos usuarios
let produtosLocais = [];

//Função que irá fazer a requisição na API
async function carregarProduto() {
    try {
        // Faz a requisição na API
        const response = await fetch("https://dummyjson.com/products");
        // Depois transforma em Objeto JSON
        const dados = await response.json();
        //Filtra apenas 4 usuários para  não lotar a tela
        produtosLocais = dados.products.slice(0, 4);
        // Chama a função renderizar tela para mostrar na tela
        renderizarTela();
    } catch (erro) {
        console.log('Erro ao fazer a requisição:', erro);
    }
}

// Função reponsável por exibir os dados na tela
function renderizarTela() {
    // Pega o elemento ul
    listaProdutos.innerHTML = '';
    
    // Adiciona a classe de grid para o CSS estilizar
    listaProdutos.classList.add('grids-container');

    // Percorre o array de produtos
    produtosLocais.forEach(produtos => {
        // Cria o elemento li
        const li = document.createElement('li');

        // Cria a classe de cartão para produtos 
        li.classList.add('product-card');
        
        //Lógica da imagem
        // const imagemSrc = produtos.image || usuariosLocias.imagemLocal || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        const imagemSrc = produtos.images || usuariosLocias.imagemLocal || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

        // Monta o HTML estruturado do cartão
        li.innerHTML = `
            <div class="card-header-bg"></div> <div class="card-content">
                <div class="avatares-wrapper">
                    <img src="${imagemSrc}" alt="Avatar" class="card-avatares">
                </div>

                <h3 class="card-title">${produtos.title}</h3>
                <p class="card-description"> ${produtos.description} </p>
                <p class="category">${produtos.brand}</p>

                <div class="card-badges">
                    <span class="badge-value"> $${produtos.price}</span>
                    <span class="badge-id"> ${produtos.id}</span>
                </div>

                <button class="btn-delete-card" onclick="removerProduto(${produtos.id})">
                    Remover Produto
                </button>
            </div>
        `;

        listaProdutos.appendChild(li);
    });

}

// Função responsável por mostrar o erro
function setError(input, message) {}

// Função responsável por limpar a mensagem de erro
function clearError(input) {}

// Função que "Ouve" o botão Enviar
btnEnviar.addEventListener('click', async (event) => {
    // Previne o navegador mudar de página instantâneamente
    event.preventDefault();
    // Pega os valores dos campos de input
    const tituloValue = input_titulo.value;
    const descricaoValue = input_descricao.value;
    const precoValue = input_preco.value;
    const marcaValue = input_marca.value;
    const categoriaValue = input_categoria.value;
    const imagemValue = input_imagem.value;

    let temErro = false;

    // Validação do campos Titulo 
    // Validação do campos Titulo 
    if (tituloValue.length < 3 || tituloValue.length > 50 ) {
        mensagemErroTitulo.textContent = 'Erro: Digite um título entre 3 e 50 caracteres';
        mensagemErroTitulo.style.color = 'red';
        temErro = true;
    } else {
        mensagemErroTitulo.textContent = '';
    };

    // Validação do campos Descrição
    if (descricaoValue.length < 3 || descricaoValue.length > 50) {
        mensagemErroDescricao.textContent = 'Erro. Digite uma Descricao entre 3 e 50 caracteres';
        mensagemErroDescricao.style.color = 'red';
        temErro = true;
    } else{
        mensagemErroDescricao.textContent = '';
    };

    // Validação do campos Preço
    const precoNumerio = parseFloat(precoValue)
    if (isNaN(precoNumerio) || precoNumerio <= 0 || precoNumerio > 120) {
        mensagemErroPreco.textContent = 'Erro. Digite um Numero entre 0 e 120';
        mensagemErroPreco.style.color = 'red';
        temErro = true;
    } else {
        mensagemErroPreco.textContent = '';
    }

    if (marcaValue.length < 3 ||  marcaValue.length > 50) {
        mensagemErroMarca.textContent = 'Erro. "Marca" deve ter entre 3 e 50 caracteres'
        mensagemErroMarca.style.color = 'red'
        temErro = true;
    } else{ 
        mensagemErroMarca.textContent = ''
    }

    if (categoriaValue.length < 3 ||  categoriaValue.length > 50) {
        mensagemErroCategoria.textContent = 'Erro. "Categoria" deve ter entre 3 e 50 caracteres'
        mensagemErroCategoria.style.color = 'red'
        temErro = true;
    } else{ 
        mensagemErroCategoria.textContent = ''
    } 

    // Se tiver erro para tudo e não envia
    if (temErro) {
        return;
    }

    // Pega a foto do input
    const arquivoImagem = input_imagem.files[0];
    let urlImagemLocal = '';

    if (arquivoImagem) {
        // Cria um URL tempóraria para a imagem 
        urlImagemLocal = URL.createObjectURL(arquivoImagem);
    }

    const novoProduto = {
        title: tituloValue,
        description: descricaoValue,
        price: precoValue,
        brand:marcaValue,
        id: Date.now(),
        imagemLocal: urlImagemLocal,
        images: [urlImagemLocal]
    };

    // Adiciona na tela imediatamente
    produtosLocais.unshift(novoProduto);
    renderizarTela();

    // Limpa inputs
    input_titulo.value = '';
    input_descricao.value = '';
    input_preco.value = '';
    input_marca.value = '';
    input_categoria.value = '';
    input_imagem.value = '';

    // Simula envio para API (sem travar a tela)
    try {
        await fetch('https://dummyjson.com/products/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoProduto)
        });
        // Sucesso silencioso
    } catch (erro) {
        console.log('Erro na API')
    }
});

window.removerProduto = async function (id) {
    if(!confirm('Tem certeza?')) return;

    //Remove da tela imediatamente
    produtosLocais = produtosLocais.filter(products => products.id !== id);
    renderizarTela();

    // // Tenta avisa a API
    // try {
    //     await fetch(`https://dummyjson.com/products/${id}`, {
    //         method: 'DELETE'
    //     });
    // } catch (erro) {
    //     console.log('Usuario era locao, ignorando erro da API.');
    // }
}


carregarProduto();
