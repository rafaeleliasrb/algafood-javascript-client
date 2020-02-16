const config = {
	clientId: "foodanalytics",
  	clientSecret: "",
  	authorizeUrl: "http://localhost:8081/oauth/authorize",
  	tokenUrl: "http://localhost:8081/oauth/token",
  	callbackUrl: "http://localhost:8082",
  	cozinhasUrl: "http://localhost:8080/v1/cozinhas"
};

let accessToken = "";

function generateCodeVerifierEArmazena() {
	let codeVerifier = generateRandomString(128);
	localStorage.setItem("codeVerifier", codeVerifier);

	return codeVerifier;
}

function generateRandomString(length) {
	let text = "";
	let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
  
	return text;
}

function generateCodeChallenge(codeVerifier) {
	return base64URL(CryptoJS.SHA256(codeVerifier));
}

function getCodeVerifier() {
	return localStorage.getItem("codeVerifier");
}

function base64URL(string) {
	return string.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function consultar() {
	console.log("Consultando recurso com accessToken: " + accessToken);

	$.ajax({
		url: config.cozinhasUrl,
		type: "get",

		beforeSend: function(request) {
			request.setRequestHeader("Authorization", "Bearer " + accessToken);
		},

		success: function(response) {
			var json = JSON.stringify(response);
			$("#resultado").text(json);
		},

		error: function(error) {
			alert("Erro consultar recurso");
		}
	});
}

function gerarAccessToken(code) {
	console.log("Gerando accessToken com code: " + code);

	let codeVerifier = getCodeVerifier();

	let params = new URLSearchParams();
	params.append("grant_type", "authorization_code");
	params.append("code", code);
	params.append("redirect_uri", config.callbackUrl);
	params.append("client_id", config.clientId);
	params.append("code_verifier", codeVerifier);

	$.ajax({
		url: config.tokenUrl,
		type: "post",
		data: params.toString(),
		contentType: "application/x-www-form-urlencoded",

		success: function(response) {
			accessToken = response.access_token;

			console.log("Access token gerado: " + accessToken);
		},

		error: function(error) {
			console.log("Erro ao gerar access token: " + JSON.stringify(error));
		}
	});
}

function login() {
	// https://auth0.com/docs/protocols/oauth2/oauth-state
	let codeVerifier = generateCodeVerifierEArmazena();
	let codeChallenge = generateCodeChallenge(codeVerifier);

	window.location.href = `${config.authorizeUrl}?response_type=code&client_id=${config.clientId}&redirect_uri=${config.callbackUrl}&code_challenge_method=s256&code_challenge=${codeChallenge}`;
}

$(document).ready(function() {
	let params = new URLSearchParams(window.location.search);

	let code = params.get("code");

	if(code) {
		gerarAccessToken(code);
	}
});

$("#btn-consultar").click(consultar);
$("#btn-login").click(login);
