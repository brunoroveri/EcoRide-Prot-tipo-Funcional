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

// === 2. FUNÇÕES DE NAVEGAÇÃO E AUTENTICAÇÃO ===
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  
  if (id === 'historico') atualizarHistorico();
  if (id === 'impacto') atualizarImpacto();
  if (id === 'recompensas') atualizarRecompensas();
  if (id === 'qr') atualizarBilheteDigital();
  if (id === 'pontos') atualizarPontos();
}

// Simulação de Login - Leva para Onboarding e garante a mensagem
function simularLogin() {
    const nome = document.getElementById('login-nome').value.trim();
    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-senha').value.trim();

    if (nome && email && senha) {
        usuarioLogado.nomeCompleto = nome;
        usuarioLogado.email = email;

        // MENSAGEM DE SEGURANÇA: Bloqueia momentaneamente, mas segue o fluxo
        alert('ATENÇÃO: Este é um protótipo. Seus dados (Nome, Email, Senha) NÃO estão sendo salvos em um servidor. Clique OK para continuar.');
        
        // Fluxo: Atualiza -> Onboarding (que depois vai para a Home)
        atualizarTodosDados(); 
        show('onboarding');
    } else {
        alert('Por favor, preencha NOME, E-mail e Senha para simular o acesso.');
    }
}

function logout() {
    saldo = 1.50;
    viagensFeitas = 8;
    recompensasDisponiveis = 0;
    usuarioLogado = { nomeCompleto: "Visitante", pontos: 120, email: "" };
    desafiosConcluidos = 3;
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
    document.getElementById('nome-usuario-display').innerText = `Bem-vindo(a), ${usuarioLogado.nomeCompleto.split(' ')[0]}!`;
    document.getElementById('pontos-total-display').innerText = usuarioLogado.pontos;
    
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


// === 4. FUNCIONALIDADE PRINCIPAL (Recarga e Uso) ===

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
    
    setTimeout(() => {
        overlay.style.display = 'none';
        atualizarTodosDados(); 
        show('home');
    }, 1000); 
}

function recarregar(valor) {
  saldo += valor;
  desafiosConcluidos += 1; 
  usuarioLogado.pontos += 10; 

  exibirOverlay(valor, 'success'); 
}


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
    
    setTimeout(() => {
        document.getElementById('qr-status').innerText = '[QR CODE AQUI]';
        document.getElementById('qr-status').style.color = 'black';
        atualizarTodosDados(); 
        show('home');
    }, 2000);
}



window.onload = function() {
    show('login'); 
};