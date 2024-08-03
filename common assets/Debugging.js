/*

Extension started by JeremyGamer13
Continued by SCsupercraft

I (SCsupercraft) added pretty much all commands but exit and help, I also added the debug block and debug mode

You can find the original below
https://github.com/PenguinMod/PenguinMod-Vm/blob/develop/src/extensions/jg_debugging/index.js

You can always find the most up-to date version of my version of this extension below
https://github.com/SCsupercraft/projectloader/blob/main/common%20assets/Debugging.js

*/
(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
      throw new Error("Debugging must be run unsandboxed to work properly!");
    }

    const vm = Scratch.vm;
    const runtime = vm.runtime;

    const BlockType = Scratch.BlockType
    const ArgumentType = Scratch.ArgumentType
    const Cast = Scratch.Cast

    function xmlEscape (unsafe) {
        if (typeof unsafe !== 'string') {
            if (Array.isArray(unsafe)) {
                // This happens when we have hacked blocks from 2.0
                // See #1030
                unsafe = String(unsafe);
            } else {
                return unsafe;
            }
        }
        return unsafe.replace(/[<>&'"]/g, c => {
            switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            }
        });
    };

    const escapeAttribute = unsafe => {
        const escaped = xmlEscape(unsafe);
        return JSON.stringify(escaped).slice(1, -1);
    };

    const isEscapedQuote = (line, index) => {
        const quote = line.charAt(index);
        if (quote !== '"') return false;
        let lastIndex = index - 1;
        let escaped = false;
        while (line.charAt(lastIndex) === "\\") {
            escaped = !escaped;
            lastIndex -= 1;
        }
        return escaped;
    }
    const CommandDescriptions = {
        "help": "List all commands and how to use them.\n\tSpecify a command after to only include that explanation.",
        "exit": "Closes the debugger.",
        "clear": "Clears the console.",
        "start": "Restarts the project like the flag was clicked.",
        "stop": "Stops the project.",
        "pause": "Pauses the project.",
        "resume": "Resumes the project.",
        "broadcast": "Starts a broadcast by name.\n\tAdd data to specify data to send with the broadcast",
        "getVar": "Gets the value of a variable by name.\n\tFirst argument is the variables name\n\tAdd a sprite name to specify a variable in a sprite.",
        "setVar": "Sets the value of a variable by name.\n\tFirst argument is the variables name\n\tSecond argument is the new value\n\tAdd a sprite name to specify a variable in a sprite.",
        "getList": "Gets the value of a list by name.\n\tReturns an array.\n\tFirst argument is the lists name\n\tAdd a sprite name to specify a list in a sprite.",
        "setList": "Sets the value of a list by name.\n\tFirst argument is the lists name\n\tSecond argument is the new value\n\tThe list will be set to the array specified.\n\tAdd a sprite name to specify a list in a sprite.",
        "top": "Scrolls to the top.",
        "bottom": "Scrolls to the bottom.",
        "enableDebugMode": "Enables debug mode.\n\tShould only be used if something went VERY VERY wrong!",
        "disableDebugMode": "Disables debug mode."
    };

    class debugging {
        constructor(vm, runtime) {
            this.runtime = runtime;
            this.vm = vm

            this.debugMode = false;

            this.console = document.body.appendChild(document.createElement("div"));
            this.console.style = 'display: none;'
                + 'position: absolute; left: 40px; top: 40px;'
                + 'resize: both; border-radius: 8px;'
                + 'box-shadow: 0px 0px 10px black; border: 1px solid rgba(0, 0, 0, 0.15);'
                + 'background: black; font-family: \'Trebuchet MS\', sans-serif;'
                + 'min-height: 3rem; min-width: 128px; width: 480px; height: 480px;'
                + 'overflow: hidden; z-index: 1000000;';

            this.consoleHeader = this.console.appendChild(document.createElement("div"));
            this.consoleHeader.style = 'width: 100%; height: 2rem;'
                + 'position: absolute; left: 0px; top: 0px;'
                + 'display: flex; flex-direction: column; align-items: center;'
                + 'justify-content: center; color: white; cursor: move;'
                + 'background: #333333; z-index: 1000001; user-select: none;';
            this.consoleHeader.innerHTML = '<p>Debugger</p>';

            this.consoleLogs = this.console.appendChild(document.createElement("div"));
            this.consoleLogs.style = 'width: 100%; height: calc(100% - 3rem);'
                + 'position: absolute; left: 0px; top: 2rem;'
                + 'color: white; cursor: text; overflow: auto;'
                + 'background: transparent; outline: unset !important;'
                + 'border: 0; margin: 0; padding: 0; font-family: \'Trebuchet MS\', sans-serif;'
                + 'display: flex; flex-direction: column; align-items: flex-start;'
                + 'z-index: 1000005; user-select: text;';

            this.consoleBar = this.console.appendChild(document.createElement("div"));
            this.consoleBar.style = 'width: 100%; height: 1rem;'
                + 'position: absolute; left: 0px; bottom: 0px;'
                + 'display: flex; flex-direction: row;'
                + 'color: white; cursor: text; background: black;'
                + 'z-index: 1000001; user-select: none;';

            this.consoleBarInput = this.consoleBar.appendChild(document.createElement("input"));
            this.consoleBarInput.style = 'width: calc(100% - 16px); height: 100%;'
                + 'position: absolute; left: 16px; top: 0px;'
                + 'border: 0; padding: 0; margin: 0; font-family: \'Trebuchet MS\', sans-serif;'
                + 'color: white; cursor: text; background: black;'
                + 'z-index: 1000003; user-select: none; outline: unset !important;';
            const consoleBarIndicator = this.consoleBar.appendChild(document.createElement("div"));
            consoleBarIndicator.style = 'width: 16px; height: 100%;'
                + 'position: absolute; left: 0px; top: 0px;'
                + 'color: white; cursor: text;'
                + 'z-index: 1000002; user-select: none;';
            consoleBarIndicator.innerHTML = '>';
            consoleBarIndicator.onclick = () => {
                this.consoleBarInput.focus();
            };
            // this.consoleLogs.onclick = () => {
            //     this.consoleBarInput.focus();
            // };

            this.consoleBarInput.onkeydown = (e) => {
                if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
                if (e.key.toLowerCase() !== "enter") return;
                const command = this.consoleBarInput.value;
                this.consoleBarInput.value = "";
                this._addLog(`> ${command}`, "opacity: 0.7;");
                let parsed = {};
                try {
                    parsed = this._parseCommand(command);
                } catch (err) {
                    this._addLog(`${err}`, "color: red;");
                    return;
                }
                console.log(parsed);
                this._runCommand(parsed);
            };

            // setup events for moving the console around
            let mouseDown = false;
            let clickDifferenceX = 0;
            let clickDifferenceY = 0;
            // let oldConsoleHeight = 480;
            this.consoleHeader.onmousedown = (e) => {
                // if (e.button === 2) {
                //     e.preventDefault();
                //     let newHeight = getComputedStyle(this.consoleHeader, null).height;
                //     if (this.console.style.height === newHeight) {
                //         newHeight = oldConsoleHeight;
                //     } else {
                //         oldConsoleHeight = this.console.style.height;
                //     }
                //     this.console.style.height = newHeight;
                //     return;
                // }
                if (e.button !== 0) return;
                mouseDown = true;
                e.preventDefault();
                const rect = this.console.getBoundingClientRect();
                clickDifferenceX = e.clientX - rect.left;
                clickDifferenceY = e.clientY - rect.top;
            };
            document.addEventListener('mousemove', (e) => {
                if (!mouseDown) {
                    return;
                }
                e.preventDefault();
                this.console.style.left = `${e.clientX - clickDifferenceX}px`;
                this.console.style.top = `${e.clientY - clickDifferenceY}px`;
            });
            document.addEventListener('mouseup', (e) => {
                if (!mouseDown) {
                    return;
                }
                mouseDown = false;
            });

            this._logs = [];
            this.commandSet = {};
            this.commandExplanations = {};
        }

        /**
         * @returns {object} metadata for this extension and its blocks.
         */
        getInfo() {
            return {
                id: 'debugging',
                name: 'Debugging',
                color1: '#878787',
                color2: '#757575',
                blocks: [
                    {
                        opcode: 'openDebugger',
                        text: 'open debugger',
                        blockType: BlockType.COMMAND
                    },
                    {
                        opcode: 'closeDebugger',
                        text: 'close debugger',
                        blockType: BlockType.COMMAND
                    },
                    '---',
                    {
                        opcode: 'debug',
                        text: 'debug [INFO]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            INFO: {
                                type: ArgumentType.STRING,
                                defaultValue: "Hello!"
                            }
                        }
                    },
                    {
                        opcode: 'log',
                        text: 'log [INFO]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            INFO: {
                                type: ArgumentType.STRING,
                                defaultValue: "Hello!"
                            }
                        }
                    },
                    {
                        opcode: 'warn',
                        text: 'warn [INFO]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            INFO: {
                                type: ArgumentType.STRING,
                                defaultValue: "Warning"
                            }
                        }
                    },
                    {
                        opcode: 'error',
                        text: 'error [INFO]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            INFO: {
                                type: ArgumentType.STRING,
                                defaultValue: "Error"
                            }
                        }
                    },
                ]
            };
        }

        _getTargetFromMenu(targetName) {
            if (targetName === "_all_") return undefined; // Scratch will default to all sprites
            if (targetName === "_myself_") return undefined;
            let target = Scratch.vm.runtime.getSpriteTargetByName(targetName);
            if (targetName === "_stage_") target = runtime.getTargetForStage();
            return target ? target : undefined;
          }
      
        _broadcast(name, target, data) {
            if (!name) return [];
            let startedThreads = [];
            target = this._getTargetFromMenu(target);
            if (data) this._addLog("Broadcasting " + name + " to " + target + " with data " + data, "color: dodgerblue;", true);
            if (!data) this._addLog("Broadcasting " + name + " to " + target + " with no data", "color: dodgerblue;", true);
            if (target === undefined) {
              // Means ALL Sprites
              startedThreads = [
                ...runtime.startHats("event_whenbroadcastreceived", { BROADCAST_OPTION: name })
              ];
            } else {
              const cloneTargets = target.sprite.clones;
              for (const clone of cloneTargets) {
                startedThreads = [
                  ...startedThreads,
                  ...runtime.startHats("event_whenbroadcastreceived", { BROADCAST_OPTION: name }, clone )
                ];
              }
            }
            if (data) startedThreads.forEach((thread) => (thread.receivedData = data));
            return startedThreads;
        }

        _addLog(log, style, debug) {
            const isDebug = debug || false;
            const canScroll = this.can_scroll()
            const logElement = this.consoleLogs.appendChild(document.createElement("p"));
            this._logs.push(log);
            logElement.style = 'white-space: break-spaces;';
            if (style) {
                logElement.style = `white-space: break-spaces; ${style}`;
            }
            if (isDebug) {
                logElement.className = "debug";
                if (this.debugMode === false) {
                    logElement.style.display = 'none';
                }
            }
            logElement.innerHTML = xmlEscape(log);
            if (canScroll) {
                this.consoleLogs.scrollBy(0, 1000000);
            }
        }
        _parseCommand(command) {
            this._addLog("Command entered", "color: dodgerblue;", true);
            const rawCommand = Cast.toString(command);
            this._addLog("Raw command: " + rawCommand, "color: dodgerblue;", true);
            this._addLog("Split raw command: " + JSON.stringify(rawCommand.split('')), "color: dodgerblue;", true);
            const data = {
                command: '',
                args: []
            };
            let chunk = '';
            let readingCommand = true;
            let isInString = false;
            let justExitedString = false;
            let idx = -1; // idx gets added to at the start since there a bunch of continue statemnets
            for (const letter of rawCommand.split('')) {
                idx++;
                this._addLog("index: " + idx, "color: dodgerblue;", true);
                if (readingCommand) {
                    this._addLog("Reading command", "color: dodgerblue;", true);
                    if (letter === ' ' || letter === '\t') {
                        if (chunk.length <= 0) {
                            throw new SyntaxError('No command before white-space');
                        }
                        this._addLog("Command: " + chunk, "color: dodgerblue;", true);
                        data.command = chunk;
                        chunk = '';
                        readingCommand = false;
                        continue;
                    }
                    chunk += letter;
                    this._addLog("chunk: " + chunk, "color: dodgerblue;", true);
                    continue;
                }
                // we are reading args
                this._addLog("Reading arguments", "color: dodgerblue;", true);
                if (!isInString) {
                    this._addLog("Not in string", "color: dodgerblue;", true);
                    if (letter !== '"') {
                        this._addLog("Character is not \"", "color: dodgerblue;", true);
                        if (letter === ' ' || letter === '\t') {
                            if (justExitedString === false) {
                                this._addLog("End of argument", "color: dodgerblue;", true);
                                data.args.push(chunk);
                            }
                            justExitedString === false
                            chunk = '';
                            continue;
                        }
                        chunk += letter;
                        this._addLog("chunk: " + chunk, "color: dodgerblue;", true);
                        continue;
                    } else {
                        if (chunk.length > 0) {
                            // ex: run thing"Hello!"
                            throw new SyntaxError("Cannot prefix string argument");
                        }
                        this._addLog("Entering string", "color: dodgerblue;", true);
                        isInString = true;
                        continue;
                    }
                }
                // we are inside of a string
                justExitedString === false
                this._addLog("Inside of string", "color: dodgerblue;", true);
                if (letter === '"' && !isEscapedQuote(rawCommand, idx)) {
                    this._addLog("End of string", "color: dodgerblue;", true);
                    isInString = false;
                    justExitedString = true;
                    data.args.push(JSON.parse(`"${chunk}"`));
                    chunk = '';
                } else {
                    chunk += letter;
                    this._addLog("chunk: " + chunk, "color: dodgerblue;", true);
                }
            }
            // reached end of the command
            if (isInString) throw new SyntaxError('String never terminates in command');
            if (readingCommand && chunk.length > 0) {
                this._addLog("Command: " + chunk, "color: dodgerblue;", true);
                data.command = chunk;
                readingCommand = false;
            } else if (chunk.length > 0) {
                this._addLog("End of argument", "color: dodgerblue;", true);
                data.args.push(chunk);
            }
            this._addLog("End of command", "color: dodgerblue;", true);
            this._addLog("Args: " + JSON.stringify(data.args), "color: dodgerblue;", true);
            return data;
        }
        _runCommand(parsedCommand) {
            if (!parsedCommand) return;
            if (!parsedCommand.command) return;
            const command = parsedCommand.command;
            const args = parsedCommand.args;
            this._addLog("Executing " + command + " with argument(s) " + JSON.stringify(args), "color: dodgerblue;", true);
            switch (command) {
                case 'help': {
                    if (args.length > 0) {
                        const command = args[0];
                        let explanation = "No description defined for this command.";
                        if (command in this.commandExplanations) {
                            explanation = this.commandExplanations[command];
                        } else if (command in CommandDescriptions) {
                            explanation = CommandDescriptions[command];
                        }
                        this._addLog(`- Command: ${command}\n${explanation}`);
                        break;
                    }
                    const commadnDescriptions = {
                        ...this.commandExplanations,
                        ...CommandDescriptions,
                    };
                    let log = "";
                    for (const commandName in commadnDescriptions) {
                        log += `${commandName} - ${commadnDescriptions[commandName]}\n`;
                    }
                    this._addLog(log);
                    break;
                }
                case 'exit':
                    this.closeDebugger();
                    break;
                case 'clear':
                    this.clear();
                    break;
                case 'start':
                    try {
                        this.vm.greenFlag()
                        console.log('Started project successfully');
                        this._addLog('Started project successfully');
                    } catch (e) {
                        this._addLog(e, "color: red;")
                        console.log('Failed to start project');
                        this._addLog('Failed to start project');
                    }
                    break;
                case 'stop':
                    try {
                        this.vm.stopAll()
                        console.log('Stopped project successfully');
                        this._addLog('Stopped project successfully');
                    } catch (e) {
                        this._addLog(e, "color: red;")
                        console.log('Failed to stop project');
                        this._addLog('Failed to stop project');
                    }
                    break;
                case 'pause':
                    try {
                        this.runtime.pause()
                        console.log('Paused project successfully');
                        this._addLog('Paused project successfully');
                    } catch (e) {
                        this._addLog(e, "color: red;")
                        console.log('Failed to pause project');
                        this._addLog('Failed to pause project');
                    }
                    break;
                case 'resume':
                    try {
                        this.runtime.play()
                        console.log('Resumed project successfully');
                        this._addLog('Resumed project successfully');
                    } catch (e) {
                        this._addLog(e, "color: red;")
                        console.log('Failed to resume project');
                        this._addLog('Failed to resume project');
                    }
                    break;
                case 'broadcast':
                    try {
                        const broadcast = Scratch.Cast.toString(args[0]);
                        if (!broadcast) {
                            throw new SyntaxError("No broadcast specified");
                        }
                        const data = Scratch.Cast.toString(args[1]);
                        this._broadcast(broadcast, '_all_', data)
                        console.log('Broadcasted ' + broadcast + ' successfully');
                        this._addLog('Broadcasted ' + broadcast + ' successfully');
                    } catch (e) {
                        this._addLog(e, "color: red;")
                        console.log('Failed to broadcast');
                        this._addLog('Failed to broadcast');
                    }
                    break;
                case 'getVar':
                    try {
                        let target = args[1] === undefined ? runtime.getTargetForStage() : runtime.getSpriteTargetByName(args[1]);
                        if (!target) {
                            throw new ReferenceError("Target \"" + args[1] + "\" is not defined")
                        }
                        const variable = target.lookupVariableByNameAndType(
                            Scratch.Cast.toString(args[0]),
                            ""
                        );
                        if (!variable) {
                            throw new ReferenceError("Variable \"" + args[0] + "\" is not defined")
                        }
                        let value = variable ? variable.value : "";
                        let name = variable ? variable.name : "";
                        console.log('Value of ' + name + ' is ' + value);
                        this._addLog('Value of ' + name + ' is ' + value);
                    } catch (e) {
                        this._addLog(e, "color: red;")
                        console.log('Failed to get variable');
                        this._addLog('Failed to get variable');
                    }
                    break;
                case 'setVar':
                    try {
                        let target = args[2] === undefined ? runtime.getTargetForStage() : runtime.getSpriteTargetByName(args[2]);
                        if (!target) {
                            throw new ReferenceError("Target \"" + args[2] + "\" is not defined")
                        }
                        const variable = target.lookupVariableByNameAndType(
                            Scratch.Cast.toString(args[0]),
                            ""
                        );
                        if (!variable) {
                            throw new ReferenceError("Variable \"" + args[0] + "\" is not defined")
                        }
                        variable.value = args[1];
                        if (variable.isCloud) {
                              util.runtime.ioDevices.cloud.requestUpdateVariable(
                                variable.name,
                                variable.value
                            );
                        }
                        console.log('Value of ' + variable.name + ' is now ' + variable.value);
                        this._addLog('Value of ' + variable.name + ' is now ' + variable.value);
                    } catch (e) {
                        this._addLog(e, "color: red;")
                        console.log('Failed to set variable');
                        this._addLog('Failed to set variable');
                    }
                    break;
                case 'getList':
                    try {
                        let target = args[1] === undefined ? runtime.getTargetForStage() : runtime.getSpriteTargetByName(args[1]);
                        if (!target) {
                            throw new ReferenceError("Target \"" + args[1] + "\" is not defined")
                        }
                        const variable = target.lookupVariableByNameAndType(
                            Scratch.Cast.toString(args[0]),
                            "list"
                        );
                        if (!variable) {
                            throw new ReferenceError("List \"" + args[0] + "\" is not defined")
                        }
                        let value = variable ? JSON.stringify(variable.value) : "";
                        let name = variable ? variable.name : "";
                        console.log('Value of ' + name + ' is ' + value);
                        this._addLog('Value of ' + name + ' is ' + value);
                    } catch (e) {
                        this._addLog(e, "color: red;")
                        console.log('Failed to get variable');
                        this._addLog('Failed to get variable');
                    }
                    break;
                case 'setList':
                    try {
                        let target = args[2] === undefined ? runtime.getTargetForStage() : runtime.getSpriteTargetByName(args[2]);
                        if (!target) {
                            throw new ReferenceError("Target \"" + args[2] + "\" is not defined")
                        }
                        const variable = target.lookupVariableByNameAndType(
                            Scratch.Cast.toString(args[0]),
                            "list"
                        );
                        if (!variable) {
                            throw new ReferenceError("List \"" + args[0] + "\" is not defined")
                        }
                        const array = validateArray(args[1]).array
                            .map(v => {
                                if (typeof v === 'object') return JSON.stringify(v);
                                return String(v);
                        });
                        variable.value = array;

                        console.log('Value of ' + variable.name + ' is now ' + JSON.stringify(variable.value));
                        this._addLog('Value of ' + variable.name + ' is now ' + JSON.stringify(variable.value));
                    } catch (e) {
                        this._addLog(e, "color: red;")
                        console.log('Failed to set variable');
                        this._addLog('Failed to set variable');
                    }
                    break;
                case 'top':
                    this.consoleLogs.scrollBy(0, -1000000);
                    break;
                case 'bottom':
                    this.consoleLogs.scrollBy(0, 1000000);
                    break;
                case 'enableDebugMode':
                    try {
                        this.showDebug();
                        console.log('Debug mode enabled');
                        this._addLog('Debug mode enabled');
                    } catch (e) {
                        this._addLog(e, "color: red;")
                        console.log('Failed to enable debug mode');
                        this._addLog('Failed to enable debug mode');
                    }
                    break;
                case 'disableDebugMode':
                    try {
                        this.hideDebug();
                        console.log('Debug mode disabled');
                        this._addLog('Debug mode disabled');
                    } catch (e) {
                        this._addLog(e, "color: red;")
                        console.log('Failed to disable debug mode');
                        this._addLog('Failed to disable debug mode');
                    }
                    break;
                default:
                    if (!(command in this.commandSet)) {
                        this._addLog(`Command "${command}" not found. Check "help" for command list.`, "color: red;");
                        break;
                    }
                    try {
                        this.commandSet[command](...args);
                    } catch (err) {
                        this._addLog(`Error: ${err}`, "color: red;");
                    }
                    break;
            }
        }
        _findBlockFromId(id, target) {
            if (!target) return;
            if (!target.blocks) return;
            if (!target.blocks._blocks) return;
            const block = target.blocks._blocks[id];
            return block;
        }

        clear() {
            this.consoleLogs.innerHTML = "";
        }

        showDebug() {
            this.debugMode = true;
            let paragraphs = this.console.getElementsByClassName("debug");
            for (const paragraph of paragraphs) {
                paragraph.style.display = '';
            }
        }

        hideDebug() {
            this.debugMode = false;
            let paragraphs = this.console.getElementsByClassName("debug");
            for (const paragraph of paragraphs) {
                paragraph.style.display = 'none';
            }
        }

        openDebugger() {
            this.console.style.display = '';
        }
        closeDebugger() {
            this.console.style.display = 'none';
        }

        debug(args) {
            const text = Cast.toString(args.INFO);
            console.log(text);
            this._addLog(text, "color: dodgerblue;", true);
        }
        log(args) {
            const text = Cast.toString(args.INFO);
            console.log(text);
            this._addLog(text);
        }
        warn(args) {
            const text = Cast.toString(args.INFO);
            console.warn(text);
            this._addLog(text, "color: yellow;");
        }
        error(args, util) {
            // create error stack
            const stack = [];
            const target = util.target;
            const thread = util.thread;
            if (thread.stackClick) {
                stack.push('clicked blocks');
            }
            const commandBlockId = thread.peekStack();
            const block = this._findBlockFromId(commandBlockId, target);
            if (block) {
                stack.push(`block ${block.opcode}`);
            } else {
                stack.push(`block ${commandBlockId}`);
            }
            const eventBlock = this._findBlockFromId(thread.topBlock, target);
            if (eventBlock) {
                stack.push(`event ${eventBlock.opcode}`);
            } else {
                stack.push(`event ${thread.topBlock}`);
            }
            stack.push(`sprite ${target.sprite.name}`);

            const text = `Error: ${Cast.toString(args.INFO)}`
                + `\n${stack.map(text => (`\tat ${text}`)).join("\n")}`;
            console.error(text);
            this._addLog(text, "color: red;");
        }
        can_scroll() {
            return Math.abs(this.consoleLogs.scrollHeight - this.consoleLogs.clientHeight - this.consoleLogs.scrollTop) <= 1;
        }
    }
    Scratch.extensions.register(new debugging(vm, runtime));
})(Scratch);