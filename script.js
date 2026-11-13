
const btnNovoChamado = document.getElementById("btnNovoChamado");
const cadastroChamado = document.getElementById("cadastroChamado");
const formChamado = document.getElementById("formChamado");

// Recupera os chamados salvos no navegador
let chamados = JSON.parse(localStorage.getItem("chamados")) || [];

// Define a numeração dos chamados
let proximoNumero = Number(localStorage.getItem("proximoNumero")) || 1;

// Atribui números aos chamados já cadastrados
chamados.forEach(function (chamado) {
    if (chamado.numero == null) {
        chamado.numero = proximoNumero;
        proximoNumero++;
    } else if (chamado.numero >= proximoNumero) {
        proximoNumero = chamado.numero + 1;
    }
});

// Salva a numeração no navegador
localStorage.setItem("chamados", JSON.stringify(chamados));
localStorage.setItem("proximoNumero", proximoNumero);


// Identifica se estamos editando algum chamado
let idEmEdicao = null;

// Abre o formulário para um novo chamado
btnNovoChamado.addEventListener("click", function () {
    if (cadastroChamado.hidden) {
        idEmEdicao = null;
        formChamado.reset();
        cadastroChamado.hidden = false;
    } else {
        cadastroChamado.hidden = true;
    }
});

// Salva um novo chamado ou uma edição
formChamado.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const dadosChamado = {
        condominio: document.getElementById("condominio").value,
        endereco: document.getElementById("endereco").value,
        elevador: document.getElementById("elevador").value,
        descricao: document.getElementById("descricao").value,
        prioridade: document.getElementById("prioridade").value,
        status: document.getElementById("status").value
    };

    if (idEmEdicao === null) {
        // Cadastra um novo chamado
        

        const chamado = {
            id: Date.now(),
            numero: proximoNumero,
            ...dadosChamado
        };

        proximoNumero++;
        localStorage.setItem("proximoNumero", proximoNumero);

        chamados.push(chamado);

        alert("Chamado cadastrado com sucesso!");
    } else {
        // Atualiza o chamado existente
        const chamado = chamados.find(function (item) {
            return item.id === idEmEdicao;
        });

        if (chamado) {
            Object.assign(chamado, dadosChamado);
            alert("Chamado atualizado com sucesso!");
        }
    }

    // Salva os dados no navegador
    localStorage.setItem("chamados", JSON.stringify(chamados));

    // Atualiza a tabela
    listarChamados();

    formChamado.reset();
    cadastroChamado.hidden = true;
    idEmEdicao = null;
});

// Exibe os chamados na tabela
function listarChamados() {
    const corpoTabela = document.getElementById("corpoTabela");

    corpoTabela.innerHTML = "";

    chamados.forEach(function (chamado, indice) {
        const linha = document.createElement("tr");

        const numeroChamado = String(chamado.numero).padStart(4, "0");

        const dados = [
            numeroChamado,
            chamado.condominio,
            chamado.elevador,
            chamado.prioridade,
            chamado.status
        ];

        dados.forEach(function (dado) {
            const coluna = document.createElement("td");
            coluna.textContent = dado;
            linha.appendChild(coluna);
        });

        // Cria o botão Editar
        const colunaAcoes = document.createElement("td");
        const btnEditar = document.createElement("button");

        btnEditar.textContent = "Editar";

        btnEditar.addEventListener("click", function () {
            editarChamado(chamado.id);
        });

        
colunaAcoes.appendChild(btnEditar);

// Cria o botão Excluir
const btnExcluir = document.createElement("button");
btnExcluir.textContent = "Excluir";

btnExcluir.addEventListener("click", function () {
    excluirChamado(chamado.id);
});

colunaAcoes.appendChild(btnExcluir);
linha.appendChild(colunaAcoes);


        
        corpoTabela.appendChild(linha);
    });

    atualizarPainel();
}


// Preenche o formulário com os dados do chamado
function editarChamado(id) {
    const chamado = chamados.find(function (item) {
        return item.id === id;
    });

    if (!chamado) {
        return;
    }

    idEmEdicao = id;

    document.getElementById("condominio").value = chamado.condominio;
    document.getElementById("endereco").value = chamado.endereco;
    document.getElementById("elevador").value = chamado.elevador;
    document.getElementById("descricao").value = chamado.descricao;
    document.getElementById("prioridade").value = chamado.prioridade;
    document.getElementById("status").value = chamado.status;

    cadastroChamado.hidden = false;

    // Leva a página até o formulário
    cadastroChamado.scrollIntoView({ behavior: "smooth" });
}

// Exclui um chamado após confirmação
function excluirChamado(id) {
    const confirmar = confirm(
        "Tem certeza que deseja excluir este chamado?"
    );

    if (confirmar) {
        chamados = chamados.filter(function (chamado) {
            return chamado.id !== id;
        });

        localStorage.setItem("chamados", JSON.stringify(chamados));

        listarChamados();

        alert("Chamado excluído com sucesso!");
    }
}

/* Atualiza os indicadores do painel */
function atualizarPainel() {
    const abertos = chamados.filter(function (chamado) {
        return chamado.status === "Aberto";
    }).length;

    const andamento = chamados.filter(function (chamado) {
        return chamado.status === "Em andamento";
    }).length;

    const concluidos = chamados.filter(function (chamado) {
        return chamado.status === "Concluído";
    }).length;

    document.getElementById("totalAbertos").textContent = abertos;
    document.getElementById("totalAndamento").textContent = andamento;
    document.getElementById("totalConcluidos").textContent = concluidos;
}

// Carrega os chamados ao abrir a página
listarChamados();


