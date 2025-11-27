// SELETORES
const input_nome = document.querySelector('#nome');
const input_sobrenome = document.querySelector('#sobrenome');
const input_email = document.querySelector('#email');
const input_idade = document.querySelector('#idade');
const input_imagem = document.querySelector('#imagem'); 
const btnEnviar = document.querySelector('#btn-enviar');
const listaElemento = document.querySelector('#lista-usuarios');

const mensagemErroNome = document.querySelector('.mensagemErroNome');
const mensagemErroSobrenome = document.querySelector('.mensagemErroSobrenome');
const mensagemErroEmail = document.querySelector('.mensagemErroEmail');
const mensagemErroIdade = document.querySelector('.mensagemErroIdade');

const emailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-1]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


let usuariosLocais = [];

// --- FUNÇÃO CARREGAR USUÁRIOS DA API ---
async function carregarUsuarios() {
    try {
        const response = await fetch('https://dummyjson.com/users');
        const dados = await response.json();
        usuariosLocais = dados.users.slice(0, 4); // Pegando 4 usuários
        // usuariosLocais = dados.users
        renderizarTela(); 
    } catch (erro) {
        console.log('Erro ao buscar:', erro);
    }
}

// --- FUNÇÃO RENDERIZAR (A Mágica da Organização) ---
function renderizarTela() {
    // 1. Pega o elemento UL
    listaElemento.innerHTML = ''; 

    // 2. Adiciona a classe de Grid para o CSS funcionar
    listaElemento.classList.add('grid-container');

    usuariosLocais.forEach(usuario => {
        const li = document.createElement('li');
        
        // Adiciona a classe do cartão
        li.classList.add('user-card');

        // Lógica da imagem
        const nome = usuario.firstName;
        const estiloAvatar = 'bottts';
        const avatarCustomizado = usuario.imagemLocal || `https://api.dicebear.com/9.x/${estiloAvatar}/svg?seed=${nome}`;
        // const imagemSrc = usuario.image || usuario.imagemLocal || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

        // 3. Monta o HTML Estruturado do Cartão
        li.innerHTML = `
            <div class="card-header-bg"></div> <div class="card-content">
                <div class="avatar-wrapper">
                    <img src="${avatarCustomizado}" alt="Avatar" class="card-avatar">
                </div>
                
                <h3 class="card-name">${usuario.firstName} ${usuario.lastName || ''}</h3>
                <p class="card-email">${usuario.email}</p>
                
                <div class="card-badges">
                    <span class="badge-age">${usuario.age || '?'} anos</span>
                    <span class="badge-id">#${String(usuario.id).slice(-4)}</span>
                </div>

                <button class="btn-delete-card" onclick="removerUsuario(${usuario.id})">
                    Remover Usuário
                </button>
            </div>
        `;
        
        listaElemento.appendChild(li);
    });
}

// Função para mostrar erro
function setError(input, message) {
    input.style.border = '1px solid red';
    alert(message)
}

function clearError(input) {
    input.textContent = ''
    input.style.border = 'none'
}

// --- FUNÇÃO ADICIONAR  ---
btnEnviar.addEventListener('click', async (event) => {
    event.preventDefault();

    let temErro = false;

    const nomeValue = input_nome.value;
    const sobrenomeValue = input_sobrenome.value;
    const emailValue = input_email.value;
    const idadeValue = input_idade.value;

   // Validação Nome
    if (nomeValue.length < 3 || nomeValue.length > 50) {
        mensagemErroNome.textContent = 'Erro: Nome deve ter entre 3 e 50 chars';
        mensagemErroNome.style.color = 'red';
        temErro = true;
    } else {
        mensagemErroNome.textContent = '';
    }

    // Validação Sobrenome
    if (sobrenomeValue.length < 3 || sobrenomeValue.length > 50) {
        mensagemErroSobrenome.textContent = 'Erro: Sobrenome inválido';
        mensagemErroSobrenome.style.color = 'red';
        temErro = true;
    } else {
        mensagemErroSobrenome.textContent = ''; 
    }

    // Validação Email
    if (!emailregex.test(emailValue)) {
        mensagemErroEmail.textContent = 'Erro: Email inválido';
        mensagemErroEmail.style.color = 'red';
        setError(input_email, 'Erro: Verfique seu Email novamente!');
        temErro = true;
    } else {
        mensagemErroEmail.textContent = '';
        clearError(input_email);
    }
    // Validação Idade
    if (isNaN(idadeValue) || idadeValue <= 0 || idadeValue > 120 ) {
        mensagemErroIdade.textContent = 'Erro: Idade entre 1 e 120';
        mensagemErroIdade.style.color = 'red';
        setError(input_idade);
        temErro = true;
    } else {
        mensagemErroIdade.textContent = '';
        clearError(input_idade);
    }

    // 3. PARADA OBRIGATÓRIA: Se tiver erro, para tudo e não envia
    if (temErro) {
        return; 
    }
    
    // LÓGICA PARA PEGAR A FOTO DO INPUT
    const arquivoImagem = input_imagem.files[0];
    let urlImagemLocal = '';

    if (arquivoImagem) {
        // Cria uma URL temporária para a imagem que o usuário subiu
        urlImagemLocal = URL.createObjectURL(arquivoImagem);
    }

    const novoUsuario = {
        firstName: input_nome.value,
        lastName: input_sobrenome.value,
        email: input_email.value,
        age: input_idade.value,
        id: Date.now(), // Gera ID único
        imagemLocal: urlImagemLocal // Salvamos a URL aqui
    };

    // ADICIONA NA TELA IMEDIATAMENTE (Não espera a API)
    usuariosLocais.unshift(novoUsuario);
    renderizarTela();

    // Limpa inputs
    input_nome.value = '';
    input_sobrenome.value = '';
    input_email.value = '';
    input_idade.value = '';
    input_imagem.value = ''; // Limpa o input file

    // Simula envio para API (sem travar a tela)
    try {
        await fetch('https://dummyjson.com/users/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoUsuario)
        });
        // Sucesso silencioso
    } catch (erro) {
        console.log('Erro na API (mas usuário já está na tela)');
    }
});


window.removerUsuario = async function(id) {
    if(!confirm('Tem certeza?')) return;
    
    // 1. REMOVE DA TELA IMEDIATAMENTE (Isso resolve o problema dos locais)
    usuariosLocais = usuariosLocais.filter(user => user.id !== id);
    renderizarTela();

    // 2. Tenta avisar a API (só funciona para usuários reais da API)
    try {
        await fetch(`https://dummyjson.com/users/${id}`, { method: 'DELETE' });
    } catch (erro) {
        console.log('Usuário era local, ignorando erro da API.');
    }
}

// Inicia
carregarUsuarios();