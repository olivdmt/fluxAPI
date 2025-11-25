
const btnConhecer = document.querySelector('.btn-send');
const backgroundDiv = document.querySelector('.background-curvo');
const conteudo = document.querySelector('.artigo-inicial');


if(btnConhecer) {
    btnConhecer.addEventListener('click', function(event) {
        //  Previne o navegador de mudar de página imediatamente
        event.preventDefault();
        
        // Pega o link de destino do href do botão
        const destino = this.getAttribute('href');

        //  Adiciona a classe que move o fundo (CSS)
        backgroundDiv.classList.add('slide-transition');
        
        // Faz o texto sumir suavemente
        if(conteudo) {
            conteudo.classList.add('fade-out-content');
        }

        // 3. Espera o tempo da animação (800ms definidos no CSS) antes de mudar
        setTimeout(function() {
            window.location.href = destino;
        }, 800); // 800 milissegundos = 0.8 segundos
    });
}