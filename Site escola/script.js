// =========================================================
// 1. LÓGICA DE TROCA DE JOGOS E NAVEGAÇÃO
// =========================================================

function mudarParaDemonstracao(jogoId) {
    // 1. Oculta todos os containers de jogos
    const containers = document.querySelectorAll('.jogo-container');
    containers.forEach(container => {
        container.classList.remove('ativo');
    });

    // 2. Torna o container do jogo selecionado visível
    const jogo = document.getElementById(jogoId);
    if (jogo) {
        // Usa setTimeout para garantir que a transição CSS funcione suavemente
        setTimeout(() => {
             jogo.classList.add('ativo');
        }, 50); 
        
        // 3. Rola a tela para a seção de demonstração
        document.getElementById('area-demonstracao').scrollIntoView({ behavior: 'smooth' });

        // 4. Se for o Pong, inicializa o loop do jogo
        if (jogoId === 'pong') {
            loopJogo();
        }
    }
}

// =========================================================
// 2. LÓGICA DO JOGO PONG (Mantida da versão anterior)
// =========================================================

// Variáveis do Canvas e Contexto
const canvas = document.getElementById('pong-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

// Só inicializa variáveis do Pong se o Canvas existir
if (ctx) {
    const LARGURA = canvas.width;
    const ALTURA = canvas.height;
    const RAQUETE_LARGURA = 10;
    const RAQUETE_ALTURA = 80;

    let raquete1Y = ALTURA / 2 - RAQUETE_ALTURA / 2; 
    let raquete2Y = ALTURA / 2 - RAQUETE_ALTURA / 2; 
    const BOLA_RAIO = 6;
    let bolaX = LARGURA / 2;
    let bolaY = ALTURA / 2;
    let velocidadeBolaX = 3;
    let velocidadeBolaY = 3;
    let pontuacao1 = 0;
    let pontuacao2 = 0;
    
    // Funções de Desenho
    function desenharRetangulo(x, y, largura, altura, cor) {
        ctx.fillStyle = cor;
        ctx.fillRect(x, y, largura, altura);
    }

    function desenharBola(x, y, raio, cor) {
        ctx.fillStyle = cor;
        ctx.beginPath();
        ctx.arc(x, y, raio, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    function desenharPontuacao() {
        ctx.fillStyle = 'white';
        ctx.font = '24px Inter';
        ctx.fillText(pontuacao1, LARGURA / 4, 30);
        ctx.fillText(pontuacao2, LARGURA * 3 / 4, 30);
    }

    function desenharLinhaCentral() {
        ctx.strokeStyle = '#333'; 
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(LARGURA / 2, 0);
        ctx.lineTo(LARGURA / 2, ALTURA);
        ctx.stroke();
    }

    // Lógica do Jogo
    function atualizarJogo() {
        desenharRetangulo(0, 0, LARGURA, ALTURA, 'black');
        desenharLinhaCentral();
        
        // Movimento da bola
        bolaX += velocidadeBolaX;
        bolaY += velocidadeBolaY;

        // Colisão com o topo/base
        if (bolaY + BOLA_RAIO > ALTURA || bolaY - BOLA_RAIO < 0) {
            velocidadeBolaY = -velocidadeBolaY; 
        }

        // Pontuação e Reset
        if (bolaX - BOLA_RAIO < 0) {
            pontuacao2++;
            resetarBola();
        }
        if (bolaX + BOLA_RAIO > LARGURA) {
            pontuacao1++;
            resetarBola();
        }

        // Colisão com Raquetes (1 e 2)
        if (bolaX - BOLA_RAIO < RAQUETE_LARGURA && bolaY > raquete1Y && bolaY < raquete1Y + RAQUETE_ALTURA && velocidadeBolaX < 0) {
            velocidadeBolaX = -velocidadeBolaX * 1.05; 
        }
        if (bolaX + BOLA_RAIO > LARGURA - RAQUETE_LARGURA && bolaY > raquete2Y && bolaY < raquete2Y + RAQUETE_ALTURA && velocidadeBolaX > 0) {
            velocidadeBolaX = -velocidadeBolaX * 1.05; 
        }

        // Desenho
        desenharRetangulo(0, raquete1Y, RAQUETE_LARGURA, RAQUETE_ALTURA, 'white');
        desenharRetangulo(LARGURA - RAQUETE_LARGURA, raquete2Y, RAQUETE_LARGURA, RAQUETE_ALTURA, 'white');
        desenharBola(bolaX, bolaY, BOLA_RAIO, 'white');
        desenharPontuacao();
    }

    function resetarBola() {
        bolaX = LARGURA / 2;
        bolaY = ALTURA / 2;
        velocidadeBolaX = -velocidadeBolaX; 
        velocidadeBolaY = (Math.random() > 0.5 ? 3 : -3); 
    }

    // Controle das Raquetes (Teclado)
    const VELOCIDADE_RAQUETE = 8;
    const teclasPressionadas = {};

    document.addEventListener('keydown', (e) => {
        teclasPressionadas[e.key] = true;
    });

    document.addEventListener('keyup', (e) => {
        teclasPressionadas[e.key] = false;
    });

    function moverRaquetes() {
        // Raquete 1 (Esquerda) - W e S
        if (teclasPressionadas['w'] || teclasPressionadas['W']) {
            raquete1Y -= VELOCIDADE_RAQUETE;
        }
        if (teclasPressionadas['s'] || teclasPressionadas['S']) {
            raquete1Y += VELOCIDADE_RAQUETE;
        }

        // Raquete 2 (Direita) - Setas
        if (teclasPressionadas['ArrowUp']) {
            raquete2Y -= VELOCIDADE_RAQUETE;
        }
        if (teclasPressionadas['ArrowDown']) {
            raquete2Y += VELOCIDADE_RAQUETE;
        }

        // Limitar o movimento das raquetes
        raquete1Y = Math.max(0, Math.min(raquete1Y, ALTURA - RAQUETE_ALTURA));
        raquete2Y = Math.max(0, Math.min(raquete2Y, ALTURA - RAQUETE_ALTURA));
    }

    // Loop Principal do Jogo
    function loopJogo() {
        moverRaquetes();
        atualizarJogo();
        requestAnimationFrame(loopJogo); 
    }
}

// =========================================================
// 3. INICIALIZAÇÃO
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // Ao carregar a página, o Pong deve ser o projeto ativo na seção de demonstração
    // Não precisa rolar para baixo, apenas garantir que está ativo
    mudarParaDemonstracao('pong');
});