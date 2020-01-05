"use strict"

class Conecta4 {
	players = {};
	machineName = 'Sentinel 🦾🤖';

	constructor() {
		this.resetGame();
	}

	resetGame() {
		this.players = { player1: { name: '', points: 0, isMachine: false }, player2: { name: '', points: 0, isMachine: false } };
	}

	showPage(page, callback) {
		var initialPage = document.getElementById("initial-page");
		var readinessPage = document.getElementById("confirm-readiness-page");
		var gamePlayPage = document.getElementById("gameplay-page");

		if (page === "initial") {
			initialPage.classList.remove("hide");
			readinessPage.classList.add("hide");
			gamePlayPage.classList.add("hide");
		} else if (page === "readiness") {
			initialPage.classList.add("hide");
			readinessPage.classList.remove("hide");
			gamePlayPage.classList.add("hide");
		} else if (page === "gameplay") {
			initialPage.classList.add("hide");
			readinessPage.classList.add("hide");
			gamePlayPage.classList.remove("hide");
		}

		if (typeof callback === "function") {
			callback();
		}
	}

	setPlayer1Infos(name, points, isMachine) {
		if (typeof name !== 'undefined') { this.players.player1.name = name; }
		if (typeof points !== 'undefined') { this.players.player1.points = points; }
		if (typeof isMachine !== 'undefined') { this.players.player1.isMachine = isMachine; }
	}

	setPlayer2Infos(name, points, isMachine) {
		if (typeof name !== 'undefined') { this.players.player2.name = name; }
		if (typeof points !== 'undefined') { this.players.player2.points = points; }
		if (typeof isMachine !== 'undefined') { this.players.player2.isMachine = isMachine; }
	}

	togglePlayerRanking() {
		var playerRanking = document.getElementById("player-ranking");
		playerRanking.classList.toggle("show")
	}

	hidePlayerRanking() {
		var playerRanking = document.getElementById("player-ranking");
		playerRanking.classList.remove("show")
	}

	showPlayerRanking() {
		var playerRanking = document.getElementById("player-ranking");
		playerRanking.classList.add("show")
	}

	isPlayersInfosValid() {
		var player1 = document.getElementById("player1").value;
		var player2 = document.getElementById("player2").value;
		var isMachine = document.getElementById("play-machine-cb").checked;
		var isValid = false;
		player1 = player1.trim();
		player2 = player2.trim();

		if (isMachine) {
			isValid = typeof player1 === "string" && !!player1;
		} else if (!isMachine) {
			isValid = typeof player1 === "string" && !!player1 && typeof player2 === "string" && !!player2;
		}

		return {
			isValid: isValid,
			player1: player1,
			player2: player2,
			isMachine: isMachine,
		};
	}

	savePlayersInfos(d) {
		this.setPlayer1Infos(d.player1, 0, false);
		this.setPlayer2Infos(d.player2, 0, d.isMachine);
	}

	validatePlayersForm() {
		var self = this;
		var initialPage = document.getElementById("initial-page");
		var form = self.isPlayersInfosValid();

		if (form.isValid) {
			self.savePlayersInfos(form);
			initialPage.classList.add("hide");
			self.hidePlayerRanking(); //just in case it's open in 'initial page'
			self.showPage("readiness");
		} else {
			alert("Please enter valid players name");
		}
	}

	togglePlayerRanking() {
		var playerRanking = document.getElementById("player-ranking");
		//playerRanking.classList.toggle("show")
		if (playerRanking.classList.contains('hide')) {
			playerRanking.classList.remove('hide');
			playerRanking.classList.add('show');
		} else {
			playerRanking.classList.add('hide');
			playerRanking.classList.remove('show');
		}
	}

	init() {
		var self = this;

		// play against machine check box
		var playAgainstMachine = document.getElementById('play-machine-cb');
		playAgainstMachine.addEventListener('click', function () {
			var isChecked = playAgainstMachine.checked;
			var player2 = document.getElementById('player2');
			if (isChecked) {
				player2.value = self.machineName;
				self.players.player2.isMachine = true;
				player2.setAttribute('disabled', 'disabled');
			} else {
				player2.value = '';
				self.players.player2.isMachine = false;
				player2.removeAttribute('disabled');
			}
		});

		//player form on keypresses
		document.getElementById("player2").addEventListener('keypress', function (e) {
			var keyCode = e.keyCode || e.which;
			if (keyCode === 13) {
				//self.validatePlayersForm()
			} else {

			}
		});

		//player form info submit button
		document.getElementById("validatePlayerFormBtn").addEventListener('click', function (e) {
			self.validatePlayersForm()
		});

		// toggle player ranking btns
		var rankingBtns = document.getElementsByClassName("togglePlayerRankingBtns")
		for (var x = 0; x < rankingBtns.length; x++) {
			rankingBtns[x].addEventListener('click', function (e) {
				self.togglePlayerRanking();
			});
		}
	}
}

document.addEventListener('DOMContentLoaded', function () {
	var conecta4 = new Conecta4();
	conecta4.init()
}, false);