var EveryoneIsJohn = EveryoneIsJohn || (function () {
    'use strict'

    const SCRIPT_NAME = 'Everyone Is John';
    const SCRIPT_VERSION = '0.0.2.19'

    let apiFunctions = {
        reset: function (charId) {
            let character = findObjs({
                _type: "character",
                _id: charId
            });

            if (character !== undefined) {
                log(character);
            }
        }
    };

    let checkDefaults = function () {
        let players = findObjs({
            _type: "player"
        });
        let characters = findObjs({
            _type: "character"
        });

        _.each(players, (p) => ensurePlayerHasCharacter(p, characters));
    }

    let ensurePlayerHasCharacter = function (player, characters) {
        let id = player.get('_id');
        let userId = player.get('_d20userid');
        let playerName = player.get('_displayname');
        let pc = null;

        for (let c of characters) {
            var name = c.get("name");
            var controlledBy = c.get("controlledby");
            if (controlledBy == id) {
                pc = c;
                log(`${name} is controlled by ${playerName}`);
                break;
            }
        }

        if (pc === null) {
            log(`${playerName} does not have a character, creating one...`);

            pc = createObj('character', {
                name: playerName,
                inplayerjournals: id,
                controlledby: id
            });
        }
    }

    let checkInstall = function () {
        log(`Loading ${SCRIPT_NAME} v${SCRIPT_VERSION}`);
        checkDefaults();
    }

    let onPlayerAdded = function (obj) {
        log('player Added' + obj)
    }

    let onChatMessage = function (obj) {
        let bangIndex = obj.content.indexOf("!");
        log(`got message '${obj.content}' has bangIndex of ${bangIndex}`);
        if (obj.type == "api" && bangIndex !== -1) {
            let leftParnIndex = obj.content.indexOf("(");
            let rightParnIndex = obj.content.indexOf(")");

            if (leftParnIndex !== -1 && rightParnIndex !== -1) {
                let funcName = obj.content.substring(bangIndex + 1, leftParnIndex);
                log(`function name=${funcName}`);
                let paramsRaw = obj.content.substring(leftParnIndex + 1, rightParnIndex);
                log(`paramsRaw = ${paramsRaw}`);
                let params = paramsRaw.split(",");

                var func = apiFunctions[funcName];
                if (func !== undefined) {
                    func.call(EveryoneIsJohn, params);
                }
            }
        }
    }

    let registerEventHandlers = function () {
        log(`${SCRIPT_NAME} registering event handlers`);

        on('add:player', onPlayerAdded);
        on('chat:message', onChatMessage);
    };

    return {
        CheckInstall: checkInstall,
        RegisterEventHandlers: registerEventHandlers
    };
})(); // EveryoneIsJohn

on('ready', function () {
    'use strict'

    EveryoneIsJohn.CheckInstall();
    EveryoneIsJohn.RegisterEventHandlers();
});