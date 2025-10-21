// === 1. BACK-END SIMULADO (Variáveis de Estado) ===
let saldo = 1.50; 
let co2Evitado = 12;
const custoViagem = 4.50;
const metaViagens = 10; 
let viagensFeitas = 8; 
let recompensasDisponiveis = 0; 
let desafiosConcluidos = 3; 
let usuarioLogado = { nomeCompleto: "Visitante", pontos: 120, email: "" }; 

let historicoViagens = [
    { desc: 'Viagem: Casa → Centro', valor: 4.50 },
    { desc: 'Viagem: Centro → Bairro', valor: 4.50 }
];

// NOVO: Lista de Desafios (Simulação)
const desafiosAtivos = [
    { id: 1, titulo: "Eco-Commuter Semanal", progresso: 4, meta: 5, unidade: "viagens", descricao: "Utilize transporte público ou compartilhado 5 vezes esta semana." },
    { id: 2, titulo: "Neutralizador de Carbono", progresso: 10, meta: 15, unidade: "kg", descricao: "Evite 15kg de CO₂ em suas viagens (Simulado por Recarga)." },
    { id: 3, titulo: "Ciclista do Fim de Semana", progresso: 0, meta: 1, unidade: "recarga", descricao: "Recarregue o saldo da carteira nos finais de semana." }
];


// === 2. FUNÇÕES DE NAVEGAÇÃO E AUTENTICAÇÃO ===
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  
  if (id === 'historico') atualizarHistorico();
  if (id === 'impacto') atualizarImpacto();
  if (id === 'recompensas') atualizarRecompensas();
  if (id === 'qr') atualizarBilheteDigital();
  if (id === 'pontos') atualizarPontos();
  if (id === 'desafios') listarDesafios(); // NOVA CHAMADA
}

function simularLogin() {
    const nome = document.getElementById('login-nome').value;
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;

    if (nome && email && senha) {
        usuarioLogado.nomeCompleto = nome;
        usuarioLogado.email = email;

        alert('Atenção: Este é um protótipo. Seus dados NÃO estão sendo salvos em um servidor.');
        
        atualizarTodosDados(); 
        show('home');
    } else {
        alert('Por favor, preencha NOME, E-mail e Senha para simular o acesso.');
    }
}

function logout() {
    // Resetar o estado para simular novo acesso
    saldo = 1.50;
    viagensFeitas = 8;
    recompensasDisponiveis = 0;
    desafiosConcluidos = 3;
    usuarioLogado = { nomeCompleto: "Visitante", pontos: 120, email: "" };
    show('login');
}

// === 3. FUNÇÕES DE ATUALIZAÇÃO DE DADOS (DOM) ===
function atualizarTodosDados() {
    atualizarSaldoDisplay();
    atualizarProgressoRecompensa();
    atualizarHistorico(); 
    atualizarImpacto();
    atualizarBilheteDigital();
    atualizarPontos();
}

function atualizarSaldoDisplay() {
  document.getElementById('saldo-valor').innerText = `R$ ${saldo.toFixed(2).replace('.', ',')}`;
}

function atualizarPontos() {
    // Exibe o nome do usuário logado
    document.getElementById('nome-usuario-display').innerText = `Bem-vindo(a), ${usuarioLogado.nomeCompleto.split(' ')[0]}!`;
    document.getElementById('pontos-total-display').innerText = usuarioLogado.pontos;
    
    // Atualiza a contagem de desafios na tela de Pontos
    document.getElementById('desafios-concluidos-num').innerText = desafiosConcluidos;
}

function atualizarHistorico() {
  const lista = document.getElementById('historico-lista');
  lista.innerHTML = '';
  historicoViagens.forEach(viagem => {
      const p = document.createElement('p');
      p.innerText = `• ${viagem.desc} (R$ ${viagem.valor.toFixed(2).replace('.', ',')})`;
      lista.appendChild(p);
  });
}

function atualizarImpacto() {
    document.getElementById('co2-evitado').innerText = `CO₂ evitado: ${co2Evitado.toFixed(1)} kg`;
}

function atualizarBilheteDigital() {
    const btnUso = document.getElementById('btn-usar-bilhete');
    
    if (recompensasDisponiveis > 0) {
        btnUso.innerText = `USAR VIAGEM GRATUITA (${recompensasDisponiveis} disponíveis)`;
    } else {
        btnUso.innerText = `Usar Bilhete (Simular Débito)`;
    }
}

function atualizarProgressoRecompensa() {
    const restantes = metaViagens - viagensFeitas;
    const porcentagem = (viagensFeitas / metaViagens) * 100;
    
    document.getElementById('viagens-restantes').innerText = restantes < 0 ? 0 : restantes;
    document.getElementById('progress-fill').style.width = `${porcentagem}%`;

    if (viagensFeitas >= metaViagens) {
        recompensasDisponiveis += 1;
        viagensFeitas = 0; 
        document.getElementById('viagens-restantes').innerText = metaViagens; 
        document.getElementById('progress-fill').style.width = '0%'; 
        
        exibirOverlay('PARABÉNS! Você ganhou 1 viagem grátis!', 'reward');
    }
}

function atualizarRecompensas() {
    document.getElementById('reward-count').innerText = recompensasDisponiveis;
    document.getElementById('resgatar-restantes').innerText = metaViagens - viagensFeitas;
    
    const resgatarBtn = document.getElementById('resgatar-btn');
    if (recompensasDisponiveis > 0) {
        resgatarBtn.disabled = false;
        resgatarBtn.innerText = `RESGATAR 1 VIAGEM GRÁTIS`;
    } else {
        resgatarBtn.disabled = true;
        resgatarBtn.innerText = `Nenhuma recompensa disponível`;
    }
}

function resgatarRecompensa() {
    if (recompensasDisponiveis > 0) {
        recompensasDisponiveis -= 1;
        
        historicoViagens.push({ desc: 'Viagem: Resgate de Recompensa (Grátis)', valor: 0.00 });
        exibirOverlay('Viagem GRÁTIS resgatada!', 'reward');
    }
}

// NOVO: Função para listar e exibir os desafios
function listarDesafios() {
    const lista = document.getElementById('desafios-lista');
    lista.innerHTML = '';
    
    desafiosAtivos.forEach(desafio => {
        const progressoPercent = (desafio.progresso / desafio.meta) * 100;
        const status = desafio.progresso >= desafio.meta ? 'CONCLUÍDO' : `${desafio.progresso} de ${desafio.meta} ${desafio.unidade}`;
        const corStatus = desafio.progresso >= desafio.meta ? '#1a7f4c' : '#ff9800'; // Verde para concluído, Laranja para ativo

        const desafioHtml = `
            <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 15px; border-radius: 8px; text-align: left;">
                <h3 style="color: #1a7f4c; margin-top: 5px; font-size: 18px;">${desafio.titulo}</h3>
                <p style="font-size: 14px; color: #555;">${desafio.descricao}</p>
                <div class="progress-bar" style="height: 8px; margin: 10px 0;">
                    <div style="height: 100%; background-color: ${corStatus}; width: ${progressoPercent > 100 ? 100 : progressoPercent}%;"></div>
                </div>
                <p style="font-weight: bold; color: ${corStatus}; font-size: 14px;">Status: ${status}</p>
            </div>
        `;
        lista.innerHTML += desafioHtml;
    });
}


// === 4. FUNCIONALIDADE PRINCIPAL (Recarga e Uso) ===

// CORREÇÃO DE TIMING: Reduzido o tempo de espera para 1s (Maior eficiência percebida)
function exibirOverlay(valor, tipo) { 
    const overlay = document.getElementById('success-overlay');
    const valorDisplay = document.getElementById('recharge-amount-feedback');
    const mensagemDisplay = document.getElementById('overlay-message');

    if (tipo === 'success') {
        mensagemDisplay.innerText = "CONFIRMADA com sucesso!";
        valorDisplay.innerText = `Recarga de R$ ${valor.toFixed(2).replace('.', ',')}`;
    } else if (tipo === 'reward') {
        mensagemDisplay.innerText = valor;
        valorDisplay.innerText = "PARABÉNS!";
    }
    
    overlay.style.display = 'flex'; 
    
    // TEMPO REDUZIDO PARA 1 SEGUNDO
    setTimeout(() => {
        overlay.style.display = 'none';
        atualizarTodosDados(); 
        show('home');
    }, 1000); 
}

function recarregar(valor) {
  saldo += valor;
  
  // Simulação de Desafio: Concluir um desafio a cada recarga (para fins de protótipo)
  desafiosConcluidos += 1; 
  usuarioLogado.pontos += 10; // Adiciona pontos por recarga simulada

  exibirOverlay(valor, 'success'); 
}


// CORREÇÃO DE TIMING: Reduzido o tempo de espera para 2s (Maior eficiência percebida)
function simularUso() {
    const isFreeTrip = recompensasDisponiveis > 0;
    let mensagemFeedback;

    if (isFreeTrip) {
        recompensasDisponiveis -= 1;
        mensagemFeedback = `[VIAGEM GRATUITA USADA - R$ 0,00]`;
        historicoViagens.push({ desc: 'Viagem: Resgate de Recompensa (Grátis)', valor: 0.00 });
    } 
    else if (saldo >= custoViagem) {
        saldo -= custoViagem;
        viagensFeitas += 1; 
        mensagemFeedback = `[VIAGEM CONFIRMADA - R$ ${custoViagem.toFixed(2).replace('.', ',')} DEBITADO]`;
        historicoViagens.push({ desc: 'Viagem: Simulação de Uso (Débito QR)', valor: custoViagem });
    } 
    else {
        alert('Saldo insuficiente para esta viagem. Por favor, recarregue.');
        return; 
    }
    
    co2Evitado += 0.5;
    
    document.getElementById('qr-status').innerText = mensagemFeedback;
    document.getElementById('qr-status').style.color = isFreeTrip ? 'green' : 'red'; 
    
    // TEMPO REDUZIDO PARA 2 SEGUNDOS
    setTimeout(() => {
        document.getElementById('qr-status').innerText = '[QR CODE AQUI]';
        document.getElementById('qr-status').style.color = 'black';
        atualizarTodosDados(); 
        show('home');
    }, 2000);
}


// Chamada inicial: O protótipo AGORA COMEÇA NA TELA DE LOGIN
window.onload = function() {
    show('login'); 
};