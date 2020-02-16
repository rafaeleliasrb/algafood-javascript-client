function consultar() {
  $.ajax({
    url: "http://localhost:8080/formas-pagamento",
    type: "get",

    success: function(response) {
      preencherTabela(response);
    }
  });
}

function cadastrar() {
  var formaPagamentoJson = JSON.stringify({
    "descricao": $("#campo-descricao").val()
  });

  $.ajax({
    url: "http://localhost:8080/formas-pagamento",
    type: "post",
    data: formaPagamentoJson,
    contentType: "application/json",

    success: function(response) {
      alert("Forma pagamento adicionada com sucesso");
      consultar();
    },

    error: function(error) {
      if(error.status == 400) {
        var problema = JSON.parse(error.responseText);
        alert(problema.userMessage);
      }
      else {
        alert("Erro ao cadastrar forma de pagamento");
      }
      
    }
  });
}

function excluir(formaPagamento) {
  $.ajax({
    url: "http://localhost:8080/formas-pagamento/" + formaPagamento.id,
    type: "delete",

    success: function(response) {
      alert("Forma pagamento removida com sucesso");
      consultar();
    },

    error: function(error) {
      if(error.status >= 400 && error.status <= 499) {
        var problema = JSON.stringify(error.responseText);
        alert(problema.userMessage);
      }
      else {
        alert("Problema ao remover forma de pagamento");
      }
    }
  });
}

function preencherTabela(formasPagamento) {
  $("#tabela tbody tr").remove();

  $.each(formasPagamento, function(i, formaPagamento) {
    var linha = $("<tr>");

    var linkAcao = $("<a href='#'>")
      .text("Excluir")
      .click(function(event) {
        event.preventDefault();
        excluir(formaPagamento);
      });

    linha.append(
      $("<td>").text(formaPagamento.id),
      $("<td>").text(formaPagamento.descricao),
      $("<td>").append(linkAcao)
    );

    linha.appendTo("#tabela");
  });
}


$("#btn-consultar").click(consultar);
$("#btn-cadastrar").click(cadastrar);
