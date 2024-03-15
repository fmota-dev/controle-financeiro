let inputDeposito = document.getElementById('inputDeposito');
let inputRetirada = document.getElementById('inputRetirada');

let containerSaldo = document.querySelector('.container-saldo');
let saldo = document.getElementById('saldo');
let transacoes = document.querySelector('.transacoes');
let saldoAtual = localStorage.getItem('saldo')
	? parseFloat(localStorage.getItem('saldo'))
	: 0;
let transacoesLista = localStorage.getItem('transacoes')
	? JSON.parse(localStorage.getItem('transacoes'))
	: [];

let btnDepositar = document.getElementById('btnDepositar');
let btnRetirar = document.getElementById('btnRetirar');
let btnDesbugar = document.getElementById('btnDesbugar');
let valorInvalido = document.createElement('span');

const data = new Date();
let dia = data.getDate(); // 1-31
let mes = data.getMonth() + 1; // 0-11 (zero=janeiro)
let mesFormatado = mes.toString().padStart(2, '0');
let ano = data.getFullYear(); // 4 dígitos
let dataCompleta = `${dia}/${mesFormatado}/${ano}`;

function depositarValor(event) {
	event.preventDefault();
	let valorDeposito = parseFloat(inputDeposito.value);
	const LIMITE_DEPOSITO = 1000000;

	if (!valorDeposito || valorDeposito <= 0) {
		valorInvalido.innerText = 'Digite um valor válido!';
		valorInvalido.classList.add('valor-invalido', 'ativo');
		containerSaldo.appendChild(valorInvalido);
		inputDeposito.value = '';
	} else if (valorDeposito <= LIMITE_DEPOSITO) {
		saldoAtual += valorDeposito;
		localStorage.setItem('saldo', saldoAtual);
		saldo.innerText = `Saldo atual: R$ ${saldoAtual.toLocaleString('pt-BR', {
			minimumFractionDigits: 2,
		})}`;
		inputDeposito.value = '';
		adicionarTransacao(
			'Depósito',
			valorDeposito.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
		);
	} else {
		valorInvalido.innerText = `Depósito máximo: R$ ${LIMITE_DEPOSITO.toLocaleString(
			'pt-BR',
			{
				minimumFractionDigits: 2,
			}
		)}`;
		valorInvalido.classList.add('valor-invalido', 'ativo');
		containerSaldo.appendChild(valorInvalido);
	}

	inputDeposito.addEventListener('click', () => {
		valorInvalido.classList.remove('ativo');
	});
}

function retirarValor(event) {
	event.preventDefault();
	let valorRetirada = parseFloat(inputRetirada.value);
	const LIMITE_RETIRADA = 500000;

	if (!valorRetirada || valorRetirada <= 0) {
		valorInvalido.innerText = 'Digite um valor válido!';
		valorInvalido.classList.add('valor-invalido', 'ativo');
		containerSaldo.appendChild(valorInvalido);
		inputDeposito.value = '';
	} else if (valorRetirada > saldoAtual) {
		valorInvalido.innerText = 'Saldo insuficiente';
		valorInvalido.classList.add('valor-invalido', 'ativo');
		containerSaldo.appendChild(valorInvalido);
	} else if (valorRetirada > LIMITE_RETIRADA) {
		valorInvalido.innerText = `Limite de retirada: R$ ${LIMITE_RETIRADA.toLocaleString(
			'pt-BR',
			{
				minimumFractionDigits: 2,
			}
		)}`;
		valorInvalido.classList.add('valor-invalido', 'ativo');
		containerSaldo.appendChild(valorInvalido);
	} else {
		saldoAtual -= valorRetirada;
		localStorage.setItem('saldo', saldoAtual);
		saldo.innerText = `Saldo atual: R$ ${saldoAtual.toLocaleString('pt-BR', {
			minimumFractionDigits: 2,
		})}`;
		inputRetirada.value = '';
		adicionarTransacao(
			'Retirada',
			valorRetirada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
		);
	}

	inputRetirada.addEventListener('click', () => {
		valorInvalido.classList.remove('ativo');
	});
}

function adicionarTransacao(tipoTransacao, valor) {
	let novaTransacao = {
		tipo: tipoTransacao,
		valor: valor,
		data: dataCompleta,
		saldoAtual: saldoAtual, // Armazenar saldoAtual dentro da transação
	};
	transacoesLista.push(novaTransacao);
	localStorage.setItem('transacoes', JSON.stringify(transacoesLista));
	atualizarListaTransacoes();
}

function atualizarListaTransacoes() {
	let listaTransacoes = document.createElement('ul');
	listaTransacoes.classList.add('transacoes-lista');

	let ultimoIndiceExibido = 0;

	transacoesLista.forEach((transacao, index) => {
		if (index >= ultimoIndiceExibido) {
			let novaTransacao = document.createElement('li');

			novaTransacao.textContent = `${transacao.tipo}: R$ ${transacao.valor} (${
				transacao.data
			}) - Novo saldo R$ ${transacao.saldoAtual.toLocaleString('pt-BR', {
				minimumFractionDigits: 2,
			})}`;

			novaTransacao.classList.add('transacao-item');

			if (transacao.tipo === 'Depósito') {
				novaTransacao.classList.add('transacao-deposito');
			} else {
				novaTransacao.classList.add('transacao-retirada');
			}

			listaTransacoes.appendChild(novaTransacao);

			ultimoIndiceExibido = index;
		}
	});

	let transacoesElement = document.querySelector('.transacoes');
	transacoesElement.innerHTML = '';

	let tituloTransacoes = document.createElement('h2');
	tituloTransacoes.textContent = 'Últimas Movimentações';
	transacoesElement.appendChild(tituloTransacoes);
	transacoesElement.appendChild(listaTransacoes);
}

function atualizarSaldoAtual() {
	if (localStorage.getItem('saldo')) {
		saldoAtual = parseFloat(localStorage.getItem('saldo'));
		saldo.innerText = `Saldo atual: R$ ${saldoAtual.toLocaleString('pt-BR', {
			minimumFractionDigits: 2,
		})}`;
	}
}

atualizarSaldoAtual();
atualizarListaTransacoes();

function desbugar() {
	localStorage.removeItem('saldo');
	localStorage.removeItem('transacoes');
	localStorage.removeItem('transacoesLista');
	localStorage.clear();
	location.reload();
}

btnDesbugar.addEventListener('click', desbugar);
btnDepositar.addEventListener('click', depositarValor);
btnRetirar.addEventListener('click', retirarValor);
