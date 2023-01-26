export function valida (input) {
    const tipoInput = input.dataset.tipo;

    if(tiposInput[tipoInput]) {
        tiposInput[tipoInput](input);
    }
    if(input.validity.valid) {
        input.parentElement.classList.remove('input-container--invalido');
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = '';
    } else {
        input.parentElement.classList.add('input-container--invalido');
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = verificaErroInput(tipoInput, input);
    }
}

const tiposInput = {
    dataNascimento: input => verificaIdade(input),
    cpf: input => validaCPF(input),
    cep: input => organizarCEP(input)
}

const tiposErros = [
    'customError',
    'patternMismatch',
    'tooShort',
    'typeMismatch',
    'valueMissing'
]

const mensagensErros = {
    nome: {
        tooShort: 'O nome deve conter mais letras.',
        valueMissing: 'O campo de nome não pode estar vazio.'
    },
    email: {
        tooShort: 'O E-mail deve conter mais letras.',
        typeMismatch: 'Adicione um @ e um dominio válido no E-mail digitado.',
        valueMissing: 'O campo de E-mail não pode estar vazio.'
    },
    senha: {
        patternMismatch: 'A senha deve conter uma letra minuscula, uma letra maiscula e um número. Não deve possuir caracteres especiais como !#$% e deve ter entre 8 a 12 digitos',
        valueMissing: 'O campo de senha não pode estar vazio.'
    },
    dataNascimento: {
        valueMissing: 'O campo de idade não pode estar vazio.',
        customError: 'Você deve ser maior de idade para se cadastrar.'
    },
    cpf: {
        valueMissing: 'O campo de CPF não pode estar vazio.',
        customError: 'O CPF digitado não é válido.'
    },
    cep: {
        valueMissing: 'O campo de CEP não pode estar vazio.',
        patternMismatch: 'O CEP digitado não atende ao formato esperado: "XXXXX-XXX" (apenas números).',
        customError: 'Esse Cep está incorreto!'
    },
    logradouro: {
        valueMissing: 'O campo de Logradouro não pode estar vazio.'
    },
    cidade: {
        valueMissing: 'O campo de Cidade não pode estar vazio.'
    },
    estado: {
        valueMissing: 'O campo de Estado não pode estar vazio.'
    },
    preco: {
        valueMissing: 'O campo de Preço deve ser preenchido com um valor maior que R$0,00.'
    }

}

function verificaErroInput(tipoInput, input) {
    let mensagem = '';

    tiposErros.forEach(erro => {
        if(input.validity[erro]) {
            mensagem = mensagensErros[tipoInput][erro];
        }
    })
    return mensagem;
}

function verificaIdade (input) {
    const idadeUsuario = new Date (input.value);
    let mensagem = '';

    if(!verifica18anos(idadeUsuario)) {
        mensagem = 'Você deve ser maior de idade para se cadastrar.';
    }

    input.setCustomValidity(mensagem);
}

function verifica18anos (data) {
    const dataAtual = new Date ();
    const dataUsuarioMais18 = new Date (data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate());

    return dataAtual >= dataUsuarioMais18;
}

function validaCPF (input) {
    let cpfLimpo = input.value.replace(/\D/g, '');
    let mensagem = '';

    if(verificaCpfRepete(cpfLimpo) || validaPrimeiroDigito(cpfLimpo) || validaSegundoDigito(cpfLimpo)) {
        mensagem = 'O CPF digitado não é válido.';
    }
    
    input.setCustomValidity(mensagem);
}

function verificaCpfRepete (CPF) {
    let repete = false;
    const cpfRepetidos = [
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ]
    
    cpfRepetidos.forEach(cpf => {
        if(CPF == cpf) {
            repete = true;
        }
    })

    return repete;
}

function validaPrimeiroDigito (cpf) {
    let soma = 0;
    let multiplicador = 10;

    for (let posicao = 0; posicao < 9; posicao++) {
        soma += cpf[posicao] * multiplicador;
        multiplicador--;
    }
    
    soma = (soma * 10) % 11;
    
    if(soma == 10 || soma == 11) {
        soma = 0;
    }

    //soma = 1         digito = 2
    // 1 =! 2
    // return : true === cpf invalido
    return soma != cpf[9]
}

function validaSegundoDigito (cpf) {
    let soma = 0;
    let multiplicador = 11;

    for (let posicao = 0; posicao < 10; posicao++) {
        soma += cpf[posicao] * multiplicador;
        multiplicador--;
    }
    
    soma = (soma * 10) % 11;
    
    if(soma == 10 || soma == 11) {
        soma = 0;
    }

    return soma != cpf[10]
}

function organizarCEP (input) {
    const cep = input.value.replace(/\D/g, '');
    const url = `https://viacep.com.br/ws/${cep}/json`;
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        }
    }
    if(!input.validity.valueMissing && !input.validity.patternMismatch) {
        fetch(url, options).then(
            response => response.json()
        ).then(
            data =>{
                if(data.erro) {
                    input.setCustomValidity('Esse Cep está incorreto!');
                    return;
                }
                preencherDadosCep(data);
                return;
            }
        )
    }
}

function preencherDadosCep (dadosCEP) {
    const logradouro = document.querySelector('[data-tipo="logradouro"]');
    const cidade = document.querySelector('[data-tipo="cidade"]');
    const estado = document.querySelector('[data-tipo="estado"]');

    logradouro.value = dadosCEP.logradouro;
    cidade.value = dadosCEP.localidade;
    estado.value = dadosCEP.uf
}