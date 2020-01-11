"use strict"

class Conecta4 {
	players = {};
	machineName = 'Sentinel 🦾🤖';
	matrix_array = [];
	mirror_matrix_array = [];
	totalColumns = 7;
	totalRows = 6;
	current_player = {};


	constructor() {
		this.resetGame();
	}

	resetGame() {
		this.players = { player1: { name: '', points: 0, blockColor: '', isMachine: false }, player2: { name: '', points: 0, blockColor: '', isMachine: false } };
	}

	getRandomNumber(min, max, max_exclusive) {
		//https://stackoverflow.com/a/1527820
		/* MIN-MAX (inclusive) */
		if (max_exclusive) return Math.floor(Math.random() * (max - min)) + min;
		else return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	setPlayer1Infos(obj){
		this.players.player1 = Object.assign(this.players.player1, obj);
	}

	setPlayer2Infos(obj) {
		this.players.player2 = Object.assign(this.players.player2, obj);
	}

	showPage(page, callback) {
		var initialPage = document.getElementById("initial-page");
		var readinessPage = document.getElementById("confirm-readiness-page");
		var gamePlayPage = document.getElementById("gameplay-page");
		var mainContainer = document.getElementById("container");
		mainContainer.classList.add("flex-centric-items")

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
			mainContainer.classList.remove("flex-centric-items")
		}

		if (typeof callback === "function") {
			callback();
		}
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
		this.setPlayer1Infos({ name: d.player1, points: 0, isMachine: false });
		this.setPlayer2Infos({ name: d.player2, points: 0, isMachine: d.isMachine });
	}

	assignColorToPlayers() {
		// odd - red | even - blue
		var rand = this.getRandomNumber(1, 100);
		var playerSection1 = document.getElementById('gp-player1-section');
		var playerSection2 = document.getElementById('gp-player2-section');

		var toggleClasses = function(p1_color, p2_color){
			playerSection1.classList.remove(p2_color);
			playerSection1.classList.add(p1_color);
			playerSection2.classList.remove(p1_color);
			playerSection2.classList.add(p2_color);
		};

		if ((rand % 2) === 0) {
			this.setPlayer1Infos({ blockColor: 'bl-active' })
			this.setPlayer2Infos({ blockColor: 'rd-active' })
			toggleClasses('bl-active', 'rd-active');
		} else {
			this.setPlayer1Infos({ blockColor: 'rd-active' })
			this.setPlayer2Infos({ blockColor: 'bl-active' })
			toggleClasses('rd-active', 'bl-active');
		}
	}

	validatePlayersForm() {
		var self = this;
		var initialPage = document.getElementById("initial-page");
		var form = self.isPlayersInfosValid();

		if (form.isValid) {
			self.savePlayersInfos(form);
			// print names to UI
			var player1Name = document.getElementById('player1-name');
			var player2Name = document.getElementById('player2-name');

			// assign colors to players
			self.assignColorToPlayers();

			player1Name.innerHTML = form.player1;
			player2Name.innerHTML = form.player2;

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

	createNodeElement(tagName, classString, value, idString){
		var el = document.createElement(tagName);

		if (typeof idString !== "undefined"){
			var elId = document.createAttribute("id");
			elId.value = idString;
			el.setAttributeNode(elId);
		}

		if (typeof classString !== "undefined") {
			var elClass = document.createAttribute("class");
			elClass.value = classString;
			el.setAttributeNode(elClass);
		}

		if (typeof value !== "undefined"){
			el.innerHTML = value;
		}

		return el;
	}

	getColumnLastEmptyBlock(columnId) {
		var self = this;
		var currentBlockId = 0;
		var maxCapacity = false;

		// reverse checking
		for(var x = (this.totalRows - 1); x !== -1; x--){
			currentBlockId = (self.totalColumns * x) + columnId;
			if (self.mirror_matrix_array[currentBlockId - 1] === 0){
				maxCapacity = false;
				break;
			}else{
				maxCapacity = true;
			}
		}

		return {
			faceId: currentBlockId,
			arrayId: currentBlockId - 1,
			maxCapacity, // if true, then column already @max-capacity
			blockEl: document.getElementById('block-' + currentBlockId)
		}
	}

	highlightBlock(columnId) {
		var result = this.getColumnLastEmptyBlock(columnId);
		if (!result.maxCapacity){
			result.blockEl.classList.add('bl-active');
			this.mirror_matrix_array[result.arrayId] = 1;
		}
	}

	generateBlocks(){
		var columns = this.totalColumns;
		var rows = this.totalRows;
		var self = this;
		var counter = 0;
		var fakeCounter = 0;

		var container = document.getElementById('interactive-blocks-container');
		container.innerHTML = '';

		for(var col = 0; col < columns; col++){
			var htmlColumn = self.createNodeElement('div', 'ibc-column');
			fakeCounter = col;

			for (var row = 0; row < rows; row++) {
				//counter++;
				counter = fakeCounter + 1;

				self.matrix_array.push(self.matrix_array.length + 1);
				self.mirror_matrix_array.push(0);

				var htmlBlockNum = self.createNodeElement('h4', 'block-num hide_', counter, 'block-num-' + counter);
				var htmlBlock = self.createNodeElement('div', 'block block--id-' + fakeCounter, undefined, 'block-' + counter);
				htmlBlock.appendChild(htmlBlockNum);
				htmlColumn.appendChild(htmlBlock);

				fakeCounter = fakeCounter + columns;
			}

			// add click event to each column container
			htmlColumn.addEventListener('click', function (col) {
				console.clear();
				self.highlightBlock(col);
			}.bind(this, col + 1));

			container.appendChild(htmlColumn);
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

		//player readiness confirmation - NO
		document.getElementById("playerNotReady").addEventListener('click', function (e) {
			self.showPage("initial")
		});

		//player readiness confirmation - Yes
		document.getElementById("playIsReady").addEventListener('click', function (e) {
			self.showPage("gameplay", function () {
				self.generateBlocks();
			});
		});
	}
}

document.addEventListener('DOMContentLoaded', function () {
	var conecta4 = new Conecta4();
	conecta4.init()
}, false);