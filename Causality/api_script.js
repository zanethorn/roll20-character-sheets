class Causality {


    constructor() {
        this.VERSION = '0.0.0.1';
        this.LAST_UPDATE = ''
    }

    checkInstall() {
        log(`-=> CausalityApi v${this.VERSION} <=-  [${this.LAST_UPDATE}]`);
    }

    register() {
        on('add:character', this.onCharacterAdded);
        on('chat:message', this.onParseMessage);
    }

    onCharacterAdded() {

    }

    onParseMessage(msg) {
        if (msg.type == "api") {
            
        }
    }
}


on("ready", function () {
    'use strict';
    var newGame = new Causality();
    newGame.checkInstall();
    newGame.register();
});