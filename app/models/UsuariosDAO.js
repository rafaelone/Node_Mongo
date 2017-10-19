var crypto = require('crypto');

function UsuariosDAO(connection) {
//  console.log('Função Carregou');
this._connection = connection();
}

UsuariosDAO.prototype.inserirUsuario = function(usuario) {
  this._connection.open(function(err, mongoclient) {
    mongoclient.collection("usuarios", function(err, collection) {
      //console.log(usuario.senha);
      var senha_criptografada = crypto.createHash("md5").update(usuario.senha).digest("hex");
      //console.log(senha_criptografada);
      usuario.senha = senha_criptografada;
      
      collection.insert(usuario);

      mongoclient.close();
    });
  }

  );
}

UsuariosDAO.prototype.autenticar = function(usuario, req, res){
  // console.log(usuario);
  this._connection.open(function(err, mongoclient) {
    mongoclient.collection("usuarios", function(err, collection) {
      var senha_criptografada = crypto.createHash("md5").update(usuario.senha).digest("hex");
      usuario.senha = senha_criptografada;
      collection.find(usuario).toArray(function(err, result){
        //console.log(result);

        if(result[0] != undefined){
          req.session.autorizado = true;
        }

        if(req.session.autorizado){
          res.redirect('jogo');
        }else {
          res.render('index', {validacao: {}});
        }

      });

      mongoclient.close();
    });
  });
}

module.exports = function() {
    return UsuariosDAO;
}