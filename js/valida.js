export function valida (input) {
    const tipoInput = input.dataset.tipo;
    console.log(tiposInput);
}

const tiposInput = {
    dataNascimento: verificaIdade(input)
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