/*

Extension started by JeremyGamer13
Continued by SCsupercraft

I (SCsupercraft) added pretty much all commands but exit and help, I also added the debug block, debug mode, the protected stuff and most of the other stuff

You can find the original below
https://github.com/PenguinMod/PenguinMod-Vm/blob/develop/src/extensions/jg_debugging/index.js

You can always find the most up-to date version of my version of this extension below
https://github.com/SCsupercraft/projectloader/blob/main/common%20assets/Debugging.js
And the licence here
https://github.com/SCsupercraft/projectloader/blob/main/LICENSE

Contributors / Helpers

0znzw - Helped with when command entered block - https://github.com/surv-is-a-dev/gallery/blob/main/site/extensions/0znzw/tests/runHats%20and%20check%20count.js

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

    const menuIconURI = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxNjkuNzM5NDciIGhlaWdodD0iMTY5LjczOTQ3IiB2aWV3Qm94PSIwLDAsMTY5LjczOTQ3LDE2OS43Mzk0NyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE1NS4xMzAyNiwtOTUuMTMwMjYpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMzA2LjQ1NjI2LDEwOC4wMDU3NWM5LjIwNDI1LDAgMTYuNjE0MDgsNy40MDk4MSAxNi42MTQwOCwxNi42MTQwN3YxMTAuNzYwNDhjMCw5LjIwNDI1IC03LjQwOTgyLDE2LjYxNDA3IC0xNi42MTQwOCwxNi42MTQwN2gtMTMyLjkxMjQ5Yy05LjIwNDI1LDAgLTE2LjYxNDA3LC03LjQwOTgyIC0xNi42MTQwNywtMTYuNjE0MDd2LTExMC43NjA0OGMwLC05LjIwNDI2IDcuNDA5ODIsLTE2LjYxNDA3IDE2LjYxNDA3LC0xNi42MTQwN3pNMTY4LjAwNTc1LDEyNC42MTk3OHYxMTAuNzYwNDhjLTAuMDAyOTgsMS40Njk2NSAwLjU3OTU5LDIuODc5OTYgMS42MTg4MSwzLjkxOTE3YzEuMDM5MjIsMS4wMzkyMiAyLjQ0OTUyLDEuNjIxNzkgMy45MTkxNywxLjYxODgxaDEzMi45MTI1YzMuMDY4MDMsMCA1LjUzODA2LC0yLjQ2OTk1IDUuNTM4MDYsLTUuNTM4MDZ2LTExMC43NjA0OGMwLC0zLjA2ODAzIC0yLjQ2OTk1LC01LjUzODA3IC01LjUzODA2LC01LjUzODA3aC0xMzIuOTEyNWMtMy4wNjgwMywwIC01LjUzODA2LDIuNDY5OTUgLTUuNTM4MDYsNS41MzgwN3oiIGZpbGw9IiM1NzVlNzUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjQiLz48cGF0aCBkPSJNMTg5LjIzODU2LDE1Mi4zMDk5NGw0MS41MzUxOCwyNy42OTAwOGwtNDEuNTM1MTgsMjcuNjkwMDhNMjQ0LjYxODc2LDIwNy42OTAxOGg0Ni4xNDI3OSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiM4ZjhmOGYiIHN0cm9rZS13aWR0aD0iNyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iNCIvPjxwYXRoIGQ9Ik0xNTUuMTMwMjYsMjY0Ljg2OTc0di0xNjkuNzM5NDdoMTY5LjczOTQ3djE2OS43Mzk0N3oiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjo4NC44Njk3MzcwNjE0OTE5Nzo4NC44Njk3MzcwNjE0OTIxLS0+";
    const buttonSRC = "https://raw.githubusercontent.com/SCsupercraft/projectloader/main/common%20assets/debugger%20icon.svg";

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

    class Default {
        constructor() {
            this.CommandDescriptions = {
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
                "disableDebugMode": "Disables debug mode.",
                "downloadLogs": "Downloads the logs to your computer as a file named \"project.log\".\n\tFirst argument is whether or not to include debug level logs"
            };
            this.Colors = {
                "debug": '#1e90ff',
                "log": '#ffffff',
                "warning": '#ffff00',
                "error": '#ff0000',
                "fatalError": '#ff0000',
                "breakpoint": '#5f9ea0',
                "succeededTest": '#3cb371',
                "failedTest": '#dc143c',
                "inputText": '#ffffff',
                "headerText": '#ffffff',
                "background": "#000000",
                "header": "#333333"
            };
        }
    }

    const runHats = (opcode) => {
        // https://github.com/surv-is-a-dev/gallery/blob/main/site/extensions/0znzw/tests/runHats%20and%20check%20count.js
        const threads = [];
        for (const target of vm.runtime.targets) {
          Object.values(target.blocks._blocks).filter(block => block.opcode === opcode).forEach(block => {
            threads.push(vm.runtime._pushThread(block.id, target, { stackClick: false }));
          });
        }
        return threads;
    };

    // Taken from turbowarp's file extension
    const downloadURL = (url, file) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = file;
        document.body.appendChild(link);
        link.click();
        link.remove();
    };
    
    // Taken from turbowarp's file extension
    const downloadBlob = (blob, file) => {
        const url = URL.createObjectURL(blob);
        downloadURL(url, file);
        // Some old browsers process Blob URLs asynchronously
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
    };

    class debugging {
        _classWrap(class_) {
            return `[class^="${class_}"]`;
        }
        _getSelectors() {
            const scControlsBar = this._classWrap('sc-controls-bar');
            const selectors = {};
            selectors.greenFlag = (this.isPackaged() ? this._classWrap('control-button green-flag-button') : this._classWrap('green-flag_green-flag'));
            selectors.allContainer = (this.isPackaged() ? scControlsBar : this._classWrap('stage-header_stage-header-wrapper'));
            selectors.controlContainer = (this.isPackaged() ? `${scControlsBar} div:nth-child(1)` : this._classWrap('controls_controls-container'));
            selectors.resizeContainer = (this.isPackaged() ? `${scControlsBar} div:nth-child(2)` : this._classWrap('stage-header_stage-size-row'));
            return selectors;
        }
        _appendChild(element, position) {
            position = position ?? this.controlBar.length - 1;
            this.controlBar[position].after(element);
            this._updateButtons();
        }
        _updateButtons() {
            this.controlBar = Array.from(this.controlContainer.childNodes).filter(/** @argument {HTMLElement} node */(node) => node.style.display !== 'none');
        }
        hasBtn({ NAME }) {
            NAME = Cast.toString(NAME);
            return this.buttons[NAME] !== undefined;
        }
        newBtnUrl(args) {
            const NAME = Cast.toString(args.NAME);
            if (this.hasBtn({ NAME })) return '';
            const HOVER = Cast.toString(args.HOVER);
            const URL = Cast.toString(args.URL);
            const button = document.createElement('img');
            button.loading = 'lazy';
            button.title = HOVER;
            button.alt = HOVER;
            button.draggable = false;
            button.classList.add(this.greenFlag.classList[0]);
            button.src = URL;
            button.setAttribute('data-sa-shared-space-order', '0');
            this.buttons[NAME] = button;
            this._appendChild(this.buttons[NAME]);
            button.onclick = () => {
                this.openDebugger()
            };
            this.buttonCount++;
        }
        removeBtn({ NAME }) {
            NAME = Cast.toString(NAME);
            if (!this.hasBtn({ NAME })) return '';
            this.buttons[NAME].remove();
            this.buttons[NAME] = undefined;
            this.buttonCount--;
        }

        constructor(vm, runtime) {
            this.runtime = runtime;
            this.vm = vm

            this.version = '1.4.0'
            this.debuggerShown = false;

            this.Default = new Default();
            this.colors = this.Default.Colors;
            this.CommandDescriptions = this.Default.CommandDescriptions;
            this.disabledCommands = [];
            this.protectedVariables = [];
            this.protectedLists = [];
            this.protectedSprites = [];
            this.protectedBroadcasts = [];

            this.logFile = "";
            this.debugFile = "";

            this.debugMode = false;
            this.initialized = false;

            this.selectors = undefined;
            /** @type {HTMLElement} */
            this.greenFlag = undefined;
            /** @type {HTMLElement} */
            this.allContainer = undefined;
            /** @type {HTMLElement} */
            this.controlContainer = undefined;
            /** @type {HTMLElement} */
            this.resizeContainer = undefined;
            this.controlBar = undefined;
            this.buttons = undefined;

            this.console = document.body.appendChild(document.createElement("div"));
            this.console.style = 'display: none;'
                + 'position: absolute; left: 40px; top: 40px;'
                + 'resize: both; border-radius: 8px;'
                + 'box-shadow: 0px 0px 10px black; border: 1px solid rgba(0, 0, 0, 0.15);'
                + `background: ${this.colors.background}; font-family: \'Trebuchet MS\', sans-serif;` // background: black;
                + 'min-height: 3rem; min-width: 128px; width: 480px; height: 480px;'
                + 'overflow: hidden; z-index: 1000000;';

            this.consoleHeader = this.console.appendChild(document.createElement("div"));
            this.consoleHeader.style = 'width: 100%; height: 2rem;'
                + 'position: absolute; left: 0px; top: 0px;'
                + 'display: flex; flex-direction: column; align-items: center;'
                + `justify-content: center; ${this.colors.headerText}: white; cursor: move;` // color: white;
                + `background: ${this.colors.header}; z-index: 1000001; user-select: none;`; // background: #333333;
            this.consoleHeader.innerHTML = `<p>Debugger - Version ${this.version}</p>`;

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
                + 'color: white; cursor: text; background: inherit;' // background: black;
                + 'z-index: 1000001; user-select: none;';

            this.consoleBarInput = this.consoleBar.appendChild(document.createElement("input"));
            this.consoleBarInput.style = 'width: calc(100% - 16px); height: 100%;'
                + 'position: absolute; left: 16px; top: 0px;'
                + 'border: 0; padding: 0; margin: 0; font-family: \'Trebuchet MS\', sans-serif;'
                + `color: ${this.colors.inputText}; cursor: text; background: inherit;`  // color: white; background: black;
                + 'z-index: 1000003; user-select: none; outline: unset !important;';
            this.consoleBarIndicator = this.consoleBar.appendChild(document.createElement("div"));
            this.consoleBarIndicator.style = 'width: 16px; height: 100%;'
                + 'position: absolute; left: 0px; top: 0px;'
                + `color: ${this.colors.inputText}; cursor: text;` // color: white;
                + 'z-index: 1000002; user-select: none;';
            this.consoleBarIndicator.innerHTML = '>';
            this.consoleBarIndicator.onclick = () => {
                this.consoleBarInput.focus();
            };
            // this.consoleLogs.onclick = () => {
            //     this.consoleBarInput.focus();
            // };

            this.consoleBarInput.onkeydown = async (e) => {
                if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
                if (e.key.toLowerCase() !== "enter") return;
                const command = this.consoleBarInput.value;
                this.consoleBarInput.value = "";
                this._addLog(`> ${command}`, "opacity: 0.7;");
                this.logFile += `> ${command}` + "\n";
                this.debugFile += `> ${command}` + "\n";
                let parsed = {};
                try {
                    parsed = this._parseCommand(command);
                } catch (err) {
                    this._addLog(`${err}`, "color: red;");
                    return;
                }
                console.log(parsed);
                await this._runCommand(parsed);
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

            this.runtime.on('EXTENSION_REMOVED', () => {
                if (vm.extensionManager.isExtensionLoaded('debugging') === false) {
                    this.removeBtn({"NAME":"Open debugger"});
                    this.closeDebugger();
                }
            })

            this.runtime.on('BEFORE_EXECUTE', () => {
                if (this.initialized === false) {
                    setTimeout(function() {
                        this.initializeExtension();
                        this.initialized = true
                    }.bind(this), 10)
                }
            })

            this.runtime.on('PROJECT_LOADED', () => {

                this.Default = new Default();
                this.colors = this.Default.Colors;
                this.CommandDescriptions = this.Default.CommandDescriptions
                this.disabledCommands = [];
                this.protectedVariables = [];
                this.protectedLists = [];
                this.protectedSprites = [];

                this.logFile = "";
                this.debugFile = "";
                this.clear()
                this.consoleBarInput.style.color = this.colors.inputText;
                this.consoleBarIndicator.style.color = this.colors.inputText;
                this.consoleHeader.style.color = this.colors.headerText;
                this.consoleHeader.style.background = this.colors.header;
                this.console.style.background = this.colors.background;

                if (this.initialized === false) {
                    setTimeout(function() {
                        this.initializeExtension();
                        this.initialized = true
                    }.bind(this), 10)
                }
            })

        }

        initializeExtension() {
            this.selectors = this._getSelectors();
            /** @type {HTMLElement} */
            this.greenFlag = document.querySelector(this.selectors.greenFlag);
            /** @type {HTMLElement} */
            this.allContainer = document.querySelector(this.selectors.allContainer);
            if (!this.isPackaged()) this.allContainer = this.allContainer.parentElement;
            /** @type {HTMLElement} */
            this.controlContainer = document.querySelector(this.selectors.controlContainer);
            /** @type {HTMLElement} */
            this.resizeContainer = document.querySelector(this.selectors.resizeContainer);
            this.controlBar = [];
            if (!this.greenFlag || !this.allContainer || !this.controlContainer || !this.resizeContainer) {
                throw new Error("Failed to find all elements")
            }
            this._updateButtons();
            this.buttons = {};
            this.controlBar[0].before(document.createElement('span'));
            this._updateButtons();
            this.newBtnUrl({"NAME":"Open debugger","HOVER":"Opens the debugger","URL":buttonSRC})

            const logElement = document.createElement('div');
            let message = `<h1>Debugger</h1><h3>Version ${this.version}</h3><br>Originally by <a href="https://github.com/JeremyGamer13" target="_blank" style="text-decoration: none;">JeremyGamer13</a> and continued by <a href="https://github.com/SCsupercraft" target="_blank" style="text-decoration: none;">SCsupercraft</a>.<br><br> <p>Use the help command for information on how to use the debugger.<p><br>`;
            let inner = `<div style="display: flex; justify-content: space-between; direction: ltr;"><span style="flex-grow: 1; text-align: left;">${message}</span></div>`;
            logElement.innerHTML = inner;

            this.consoleLogs.appendChild(logElement);

            // Here we modify "console.error" so that the debugger can log the errors
            // I learnt how to do this from looking at SharkPools Runtime Events extension
            const er = console.error;
            console.error = function (...args) {
                const errorToLog = typeof args[0] == "object" ? Cast.toString(args[0]["message"]) : (Cast.toString(args) || "Unknown Error")
                if (!errorToLog.includes("at block debugging_error") && !errorToLog.includes("at block debugging_fatalError")) {
                    this._addLog("Uncaught Error: " + errorToLog, `color: ${this.colors.error};`); // color: red;          
                    this.logFile += "UNCAUGHT ERROR " + errorToLog + "\n";
                    this.debugFile += "UNCAUGHT ERROR " + errorToLog + "\n";
                }
                return er.apply(this, args);
            }.bind(this)
        }

        isPackaged() {
            return typeof scaffolding !== "undefined";
        }

        /**
         * @returns {object} metadata for this extension and its blocks.
         */
        getInfo() {
            return {
                id: 'debugging',
                name: 'Debugger',
                color1: '#878787',
                color2: '#757575',
                menuIconURI: menuIconURI,
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
                    {
                        opcode: 'isDebuggerShown',
                        text: 'is debugger shown?',
                        blockType: BlockType.BOOLEAN
                    },
                    {
                        opcode: 'debuggerVersion',
                        text: 'version',
                        blockType: BlockType.REPORTER
                    },
                    "---",
                    {
                        opcode: 'sendInput',
                        text: 'send [COMMAND] to debugger and [LOG]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            COMMAND: {
                              type: ArgumentType.STRING,
                              defaultValue: 'getVar \"my variable\"'
                            },
                            LOG: {
                                type: ArgumentType.STRING,
                                menu: 'LOG'
                            }
                        }
                    },
                    {
                        text: 'Logging',
                        blockType: BlockType.LABEL
                    },
                    {
                        opcode: 'breakPoint',
                        text: 'breakpoint',
                        blockType: BlockType.COMMAND
                    },
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
                    {
                        opcode: 'fatalError',
                        text: 'fatal error [INFO]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            INFO: {
                                type: ArgumentType.STRING,
                                defaultValue: "Fatal Error"
                            }
                        }
                    },
                    "---",
                    {
                        opcode: 'logStage',
                        text: 'log stage',
                        blockType: BlockType.COMMAND
                    },
                    {
                        opcode: 'logImage',
                        text: 'log image [IMAGE]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            IMAGE: {
                                type: ArgumentType.STRING,
                                defaultValue: "Insert URL or Data URI here"
                            }
                        }
                    },
                    {
                        text: 'Markers',
                        blockType: BlockType.LABEL
                    },
                    {
                        opcode: 'cloneMarker',
                        text: 'mark this clone as [MARK]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            MARK: {
                                type: ArgumentType.STRING,
                                defaultValue: "Clone 1"
                            }
                        }
                    },
                    {
                        opcode: 'marker',
                        text: 'mark this thread as [MARK]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            MARK: {
                                type: ArgumentType.STRING,
                                defaultValue: "Script 1"
                            }
                        }
                    },
                    {
                        opcode: 'pointer',
                        text: 'mark below as point [POINT]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            POINT: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        text: 'Tests',
                        blockType: BlockType.LABEL
                    },
                    {
                        opcode: 'test',
                        text: 'run test [TEST] called [TEST_NAME]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            TEST: {
                                type: ArgumentType.BOOLEAN
                            },
                            TEST_NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: 'Test Name'
                            }
                        }
                    },
                    {
                        opcode: 'testAndIf',
                        text: "run test [TEST] called [TEST_NAME] and if test succeeded",
                        blockType: Scratch.BlockType.CONDITIONAL,
                        branchCount: 1,
                        arguments: {
                            TEST: {
                                type: ArgumentType.BOOLEAN
                            },
                            TEST_NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: 'Test Name'
                            }
                        }
                    },
                    {
                        opcode: 'testAndIfElse',
                        text: ["run test [TEST] called [TEST_NAME] and if test succeeded", "else"],
                        blockType: Scratch.BlockType.CONDITIONAL,
                        branchCount: 2,
                        arguments: {
                            TEST: {
                                type: ArgumentType.BOOLEAN
                            },
                            TEST_NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: 'Test Name'
                            }
                        }
                    },
                    "---",
                    {
                        opcode: 'testAndReturn',
                        text: 'run test [TEST] called [TEST_NAME]',
                        blockType: BlockType.BOOLEAN,
                        arguments: {
                            TEST: {
                                type: ArgumentType.BOOLEAN
                            },
                            TEST_NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: 'Test Name'
                            }
                        }
                    },
                    {
                        text: 'Commands',
                        blockType: BlockType.LABEL
                    },
                    {
                        opcode: 'whenCommandEntered',
                        text: 'when command [COMMAND] entered',
                        blockType: BlockType.HAT,
                        isEdgeActivated: false,
                        arguments: {
                          COMMAND: {
                            type: ArgumentType.STRING,
                            defaultValue: 'myCustomCommand'
                          }
                        }
                    },
                    {
                        opcode: 'commandArguments',
                        text: 'command arguments',
                        blockType: BlockType.REPORTER,
                        disableMonitor: true
                    },
                    "---",
                    {
                        opcode: 'setHelp',
                        text: 'set explanation of [COMMAND] to [EXPLANATION]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            COMMAND: {
                              type: ArgumentType.STRING,
                              defaultValue: 'myCustomCommand'
                            },
                            EXPLANATION: {
                                type: ArgumentType.STRING,
                                defaultValue: 'My first custom command!'
                            }
                        }
                    },
                    {
                        opcode: 'removeHelp',
                        text: 'remove explanation of [COMMAND]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            COMMAND: {
                              type: ArgumentType.STRING,
                              defaultValue: 'myCustomCommand'
                            }
                        }
                    },
                    {
                        opcode: 'resetHelp',
                        text: 'reset explanations',
                        blockType: BlockType.COMMAND
                    },
                    "---",
                    {
                        opcode: 'setCommandEnabled',
                        text: '[ENABLED] [COMMAND] command',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            ENABLED: {
                                type: ArgumentType.STRING,
                                menu: 'ENABLED_MENU'
                            },
                            COMMAND: {
                              type: ArgumentType.STRING,
                              defaultValue: 'myCustomCommand'
                            }
                        }
                    },
                    {
                        opcode: 'isCommandEnabled',
                        text: 'is [COMMAND] command enabled?',
                        blockType: BlockType.BOOLEAN,
                        arguments: {
                            COMMAND: {
                              type: ArgumentType.STRING,
                              defaultValue: 'myCustomCommand'
                            }
                        }
                    },
                    {
                        text: 'Protection',
                        blockType: BlockType.LABEL
                    },
                    {
                        opcode: 'protect',
                        text: 'protect [PROTECTION_TYPE] [VARIABLE]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            PROTECTION_TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'PROTECTION_TYPES'
                            },
                            VARIABLE: {
                              type: ArgumentType.STRING,
                              defaultValue: 'my variable'
                            }
                        }
                    },
                    {
                        opcode: 'unprotect',
                        text: 'unprotect [PROTECTION_TYPE] [VARIABLE]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            PROTECTION_TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'PROTECTION_TYPES'
                            },
                            VARIABLE: {
                              type: ArgumentType.STRING,
                              defaultValue: 'my variable'
                            }
                        }
                    },
                    {
                        opcode: 'isProtected',
                        text: 'is [PROTECTION_TYPE] [VARIABLE] protected?',
                        blockType: BlockType.BOOLEAN,
                        arguments: {
                            PROTECTION_TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'PROTECTION_TYPES'
                            },
                            VARIABLE: {
                              type: ArgumentType.STRING,
                              defaultValue: 'my variable'
                            }
                        }
                    },
                    {
                        text: 'Styling',
                        blockType: BlockType.LABEL
                    },
                    {
                        opcode: 'resetColors',
                        text: 'reset colors',
                        blockType: BlockType.COMMAND
                    },
                    {
                        opcode: 'setColorOf',
                        text: 'set color of [STYLE_TYPE] to [COLOR]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            STYLE_TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'STYLE_TYPE'
                            },
                            COLOR: {
                                type: ArgumentType.COLOR,
                                defaultValue: '#ff0000'
                            }
                        }
                    },
                    {
                        opcode: 'getColorOf',
                        text: 'color of [STYLE_TYPE]',
                        blockType: BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            STYLE_TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'STYLE_TYPE'
                            }
                        }
                    }
                ],
                menus: {
                    ENABLED_MENU: {
                        acceptReporters: true,
                        items: [
                            "Enable",
                            "Disable"
                        ]
                    },
                    PROTECTION_TYPES: {
                        acceptReporters: false,
                        items: [
                            "Variable",
                            "List",
                            "Sprite",
                            "Broadcast"
                        ]
                    },
                    LOG: {
                        acceptReporters: false,
                        items: [
                            {
                                text: "log",
                                value: "true"
                            },
                            {
                                text: "don't log",
                                value: "false"
                            }
                        ]
                    },
                    STYLE_TYPE: {
                        acceptReporters: true,
                        items: [
                            "debug",
                            "log",
                            "warning",
                            "error",
                            "fatal error",
                            "breakpoint",
                            "succeeded test",
                            "failed test",
                            "input text",
                            "header text",
                            "header",
                            "background"
                        ]
                    }
                }
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
            if (data) this._addLog("Broadcasting " + name + " to " + target + " with data " + data, `color: ${this.colors.debug};`, true); // color: dodgerblue;
            if (!data) this._addLog("Broadcasting " + name + " to " + target + " with no data", `color: ${this.colors.debug};`, true); // color: dodgerblue;
            if (data) this.debugFile += "DEBUG Broadcasting " + name + " to " + target + " with data " + data + "\n";
            if (!data) this.debugFile += "DEBUG Broadcasting " + name + " to " + target + " with no data" + "\n";
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
            const canScroll = this.canScroll()
            const logElement = this.consoleLogs.appendChild(document.createElement("p"));
            this._logs.push(log);
            logElement.style = 'white-space: break-spaces;';
            if (style) {
                logElement.style = `white-space: break-spaces; ${style}`;
            }
            if (this.isPackaged()) {
                logElement.style.margin = '3px';
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
        _addImgLog(imageSRC, style) {
            const canScroll = this.canScroll()
            console.log(canScroll);
            const imageElement = this.consoleLogs.appendChild(document.createElement("img"));
            imageElement.src = imageSRC;
            if (style) {
                imageElement.style = style;
            }
            if (canScroll) {
                // Without the timeout it will scroll down before the image is loaded
                setTimeout(function () {
                    this.consoleLogs.scrollBy(0, 1000000);
                }.bind(this), 1)
            }
        }
        _parseCommand(command) {
            this._addLog("Command entered", `color: ${this.colors.debug};`, true); // color: dodgerblue;
            const rawCommand = Cast.toString(command);
            this._addLog("Raw command: " + rawCommand, `color: ${this.colors.debug};`, true); // color: dodgerblue;
            this._addLog("Split raw command: " + JSON.stringify(rawCommand.split('')), `color: ${this.colors.debug};`, true); // color: dodgerblue;
            this.debugFile += "DEBUG Command entered" + "\n";
            this.debugFile += "DEBUG Raw command: " + rawCommand + "\n";
            this.debugFile += "DEBUG Split raw command: " + JSON.stringify(rawCommand.split('')) + "\n";
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
                this._addLog("index: " + idx, `color: ${this.colors.debug};`, true); // color: dodgerblue;
                this.debugFile += "DEBUG index: " + idx + "\n";
                if (readingCommand) {
                    this._addLog("Reading command", `color: ${this.colors.debug};`, true); // color: dodgerblue;
                    this.debugFile += "DEBUG Reading command" + "\n";
                    if (letter === ' ' || letter === '\t') {
                        if (chunk.length <= 0) {
                            throw new SyntaxError('No command before white-space');
                        }
                        this._addLog("Command: " + chunk, `color: ${this.colors.debug};`, true); // color: dodgerblue;
                        this.debugFile += "DEBUG Command: " + chunk + "\n";
                        data.command = chunk;
                        chunk = '';
                        readingCommand = false;
                        continue;
                    }
                    chunk += letter;
                    this._addLog("chunk: " + chunk, `color: ${this.colors.debug};`, true); // color: dodgerblue;
                    this.debugFile += "DEBUG chunk: " + chunk + "\n";
                    continue;
                }
                // we are reading args
                this._addLog("Reading arguments", `color: ${this.colors.debug};`, true); // color: dodgerblue;
                this.debugFile += "DEBUG Reading arguments" + "\n";
                if (!isInString) {
                    this._addLog("Not in string", `color: ${this.colors.debug};`, true); // color: dodgerblue;
                    this.debugFile += "DEBUG Not in string" + "\n";
                    if (letter !== '"') {
                        this._addLog("Character is not \"", `color: ${this.colors.debug};`, true); // color: dodgerblue;
                        this.debugFile += "DEBUG Character is not \"" + "\n";
                        if (letter === ' ' || letter === '\t') {
                            if (justExitedString === false) {
                                this._addLog("End of argument", `color: ${this.colors.debug};`, true); // color: dodgerblue;
                                this.debugFile += "DEBUG End of argument" + "\n";
                                data.args.push(chunk);
                            }
                            justExitedString === false
                            chunk = '';
                            continue;
                        }
                        chunk += letter;
                        this._addLog("chunk: " + chunk, `color: ${this.colors.debug};`, true); // color: dodgerblue;
                        this.debugFile += "DEBUG chunk: " + chunk + "\n";
                        continue;
                    } else {
                        if (chunk.length > 0) {
                            // ex: run thing"Hello!"
                            throw new SyntaxError("Cannot prefix string argument");
                        }
                        this._addLog("Entering string", `color: ${this.colors.debug};`, true); // color: dodgerblue;
                        this.debugFile += "DEBUG Entering string" + "\n";
                        isInString = true;
                        continue;
                    }
                }
                // we are inside of a string
                justExitedString === false
                this._addLog("Inside of string", `color: ${this.colors.debug};`, true); // color: dodgerblue;
                this.debugFile += "DEBUG Inside of string" + "\n";
                if (letter === '"' && !isEscapedQuote(rawCommand, idx)) {
                    this._addLog("End of string", `color: ${this.colors.debug};`, true); // color: dodgerblue;
                    this.debugFile += "DEBUG End of string" + "\n";
                    isInString = false;
                    justExitedString = true;
                    data.args.push(JSON.parse(`"${chunk}"`));
                    chunk = '';
                } else {
                    chunk += letter;
                    this._addLog("chunk: " + chunk, `color: ${this.colors.debug};`, true); // color: dodgerblue;
                    this.debugFile += "DEBUG chunk: " + chunk + "\n";
                }
            }
            // reached end of the command
            if (isInString) throw new SyntaxError('String never terminates in command');
            if (readingCommand && chunk.length > 0) {
                this._addLog("Command: " + chunk, `color: ${this.colors.debug};`, true); // color: dodgerblue;
                this.debugFile += "DEBUG Command: " + chunk + "\n";
                data.command = chunk;
                readingCommand = false;
            } else if (chunk.length > 0) {
                this._addLog("End of argument", `color: ${this.colors.debug};`, true); // color: dodgerblue;
                this.debugFile += "DEBUG End of argument" + "\n";
                data.args.push(chunk);
            }
            this._addLog("End of command", `color: ${this.colors.debug};`, true); // color: dodgerblue;
            this._addLog("Args: " + JSON.stringify(data.args), `color: ${this.colors.debug};`, true); // color: dodgerblue;
            this.debugFile += "DEBUG End of command" + "\n";
            this.debugFile += "DEBUG Args: " + JSON.stringify(data.args) + "\n";
            return data;
        }
        async _runCommand(parsedCommand) {
            if (!parsedCommand) return;
            if (!parsedCommand.command) return;
            const command = parsedCommand.command;
            const args = parsedCommand.args;

            if (!this.isCommandEnabled({COMMAND: command})) {
                this._addLog("This command has been disabled by the project!", `color: ${this.colors.warning};`); // color: yellow;
                this.logFile += "WARN This command has been disabled by the project!" + "\n";
                this.debugFile += "WARN This command has been disabled by the project!" + "\n";
                return;
            }

            this._addLog("Executing " + command + " with argument(s) " + JSON.stringify(args), `color: ${this.colors.debug};`, true); // color: dodgerblue;
            this.debugFile += "DEBUG " + "Executing " + command + " with argument(s) " + JSON.stringify(args) + "\n";

            let customCommandExists = await this.runWhenCommandEntered({COMMAND: command, ARGS: args});

            switch (command) {
                case 'help': {
                    if (args.length > 0) {
                        const command = args[0];
                        let explanation = "No description defined for this command.";
                        if (command in this.commandExplanations) {
                            explanation = this.commandExplanations[command];
                        } else if (command in this.CommandDescriptions) {
                            explanation = this.CommandDescriptions[command];
                        }
                        this._addLog(`- Command: ${command}\n${explanation}`);
                        this.logFile += "INFO " + `- Command: ${command}\n${explanation}` + "\n";
                        this.debugFile += "INFO " + `- Command: ${command}\n${explanation}` + "\n";
                        break;
                    }
                    const commadnDescriptions = {
                        ...this.commandExplanations,
                        ...this.CommandDescriptions,
                    };
                    let log = "";
                    for (const commandName in commadnDescriptions) {
                        log += `${commandName} - ${commadnDescriptions[commandName]}\n`;
                    }
                    this._addLog(log, `color: ${this.colors.log};`); // color: white
                    this.logFile += "INFO " + log + "\n";
                    this.debugFile += "INFO " + log + "\n";
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
                        this._addLog('Started project successfully', `color: ${this.colors.log};`); // color: white;
                        this.logFile += "INFO Started project successfully" + "\n";
                        this.debugFile += "INFO Started project successfully" + "\n";
                    } catch (e) {
                        this._addLog(e, `color: ${this.colors.error};`) // color: red;
                        console.log('Failed to start project');
                        this._addLog('Failed to start project', `color: ${this.colors.log};`); // color: white;
                        this.logFile += "ERROR " + Cast.toString(e); + "\n";
                        this.logFile += "INFO Failed to start project"; + "\n";
                        this.debugFile += "ERROR " + Cast.toString(e); + "\n";
                        this.debugFile += "INFO Failed to start project"; + "\n";
                    }
                    break;
                case 'stop':
                    try {
                        this.vm.stopAll()
                        console.log('Stopped project successfully');
                        this._addLog('Stopped project successfully', `color: ${this.colors.log};`); // color: white;
                        this.logFile += "INFO Stopped project successfully" + "\n";
                        this.debugFile += "INFO Stopped project successfully" + "\n";
                    } catch (e) {
                        this._addLog(e, `color: ${this.colors.error};`) // color: red;
                        console.log('Failed to stop project');
                        this._addLog('Failed to stop project', `color: ${this.colors.log};`); // color: white;
                        this.logFile += "ERROR " + Cast.toString(e); + "\n";
                        this.logFile += "INFO Failed to stop project"; + "\n";
                        this.debugFile += "ERROR " + Cast.toString(e); + "\n";
                        this.debugFile += "INFO Failed to stop project"; + "\n";
                    }
                    break;
                case 'pause':
                    try {
                        this.runtime.pause()
                        console.log('Paused project successfully');
                        this._addLog('Paused project successfully', `color: ${this.colors.log};`); // color: white;
                        this.logFile += "INFO Paused project successfully" + "\n";
                        this.debugFile += "INFO Paused project successfully" + "\n";
                    } catch (e) {
                        this._addLog(e, `color: ${this.colors.error};`) // color: red;
                        console.log('Failed to pause project');
                        this._addLog('Failed to pause project', `color: ${this.colors.log};`); // color: white;
                        this.logFile += "ERROR " + Cast.toString(e) + "\n";
                        this.logFile += "INFO Failed to pause project" + "\n";
                        this.debugFile += "ERROR " + Cast.toString(e) + "\n";
                        this.debugFile += "INFO Failed to pause project" + "\n";
                    }
                    break;
                case 'resume':
                    try {
                        this.runtime.play()
                        console.log('Resumed project successfully');
                        this._addLog('Resumed project successfully', `color: ${this.colors.log};`); // color: white;
                        this.logFile += "INFO Resumed project successfully" + "\n";
                        this.debugFile += "INFO Resumed project successfully" + "\n";
                    } catch (e) {
                        this._addLog(e, "color: red;", `color: ${this.colors.error};`) // color: red;
                        console.log('Failed to resume project');
                        this._addLog('Failed to resume project', `color: ${this.colors.log};`); // color: white;
                        this.logFile += "ERROR " + Cast.toString(e) + "\n";
                        this.logFile += "INFO Failed to resume project" + "\n";
                        this.debugFile += "ERROR " + Cast.toString(e) + "\n";
                        this.debugFile += "INFO Failed to resume project" + "\n";
                    }
                    break;
                case 'broadcast':
                    try {
                        const broadcast = Scratch.Cast.toString(args[0]);
                        if (!broadcast) {
                            throw new SyntaxError("No broadcast specified");
                        }
                        if (this.isProtected({VARIABLE: args[0],PROTECTION_TYPE: "Broadcast"})) {
                            this._addLog("This broadcast is protected!", `color: ${this.colors.warning};`); // color: yellow;
                            this.logFile += "WARN This broadcast is protected!" + "\n";
                            this.debugFile += "WARN This broadcast is protected!" + "\n";
                            break;
                        }
                        const data = Scratch.Cast.toString(args[1]);
                        this._broadcast(broadcast, '_all_', data)
                        console.log('Broadcasted ' + broadcast + ' successfully');
                        this._addLog('Broadcasted ' + broadcast + ' successfully', `color: ${this.colors.log};`); // color: white;
                        this.logFile += "INFO Broadcasted " + broadcast + ' successfully' + "\n";
                        this.debugFile += "INFO Broadcasted " + broadcast + ' successfully' + "\n";
                    } catch (e) {
                        this._addLog(e, `color: ${this.colors.error};`) // color: red;
                        console.log('Failed to broadcast');
                        this._addLog('Failed to broadcast', `color: ${this.colors.log};`); // color: white;
                        this.logFile += "ERROR " + Cast.toString(e) + "\n";
                        this.logFile += "INFO Failed to broadcast" + "\n";
                        this.debugFile += "ERROR " + Cast.toString(e) + "\n";
                        this.debugFile += "INFO Failed to broadcast" + "\n";
                    }
                    break;
                case 'getVar':
                    try {
                        if (this.isProtected({VARIABLE: args[1],PROTECTION_TYPE: "Sprite"})) {
                            this._addLog("This sprite is protected!", `color: ${this.colors.warning};`); // color: yellow;
                            this.logFile += "WARN This sprite is protected!" + "\n";
                            this.debugFile += "WARN This sprite is protected!" + "\n";
                            break;
                        }
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
                        if (this.isProtected({VARIABLE: args[0],PROTECTION_TYPE: "Variable"})) {
                            this._addLog("This variable is protected!", `color: ${this.colors.warning};`); // color: yellow;
                            this.logFile += "WARN This variable is protected!" + "\n";
                            this.debugFile += "WARN This variable is protected!" + "\n";
                            break;
                        }
                        let value = variable ? variable.value : "";
                        let name = variable ? variable.name : "";
                        console.log('Value of ' + name + ' is ' + value);
                        this._addLog('Value of ' + name + ' is ' + value, `color: ${this.colors.log};`); // color: white;
                        this.logFile += "INFO Value of " + name + ' is ' + value + "\n";
                        this.debugFile += "INFO Value of " + name + ' is ' + value + "\n";
                    } catch (e) {
                        this._addLog(e, `color: ${this.colors.error};`) // color: red;
                        console.log('Failed to get variable');
                        this._addLog('Failed to get variable', `color: ${this.colors.log};`); // color: white;
                        this.logFile += "ERROR " + Cast.toString(e) + "\n";
                        this.logFile += "INFO Failed to get variable" + "\n";
                        this.debugFile += "ERROR " + Cast.toString(e) + "\n";
                        this.debugFile += "INFO Failed to get variable" + "\n";
                    }
                    break;
                case 'setVar':
                    try {
                        if (this.isProtected({VARIABLE: args[2],PROTECTION_TYPE: "Sprite"})) {
                            this._addLog("This sprite is protected!", `color: ${this.colors.warning};`); // color: yellow;
                            this.logFile += "WARN This sprite is protected!" + "\n";
                            this.debugFile += "WARN This sprite is protected!" + "\n";
                            break;
                        }
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
                        if (this.isProtected({VARIABLE: args[0],PROTECTION_TYPE: "Variable"})) {
                            this._addLog("This variable is protected!", `color: ${this.colors.warning};`); // color: yellow;
                            this.logFile += "WARN This variable is protected!" + "\n";
                            this.debugFile += "WARN This variable is protected!" + "\n";
                            break;
                        }
                        variable.value = args[1];
                        if (variable.isCloud) {
                              util.runtime.ioDevices.cloud.requestUpdateVariable(
                                variable.name,
                                variable.value
                            );
                        }
                        console.log('Value of ' + variable.name + ' is now ' + variable.value);
                        this._addLog('Value of ' + variable.name + ' is now ' + variable.value, `color: ${this.colors.log};`); // color: white;
                        this.logFile += "INFO Value of " + variable.name + ' is now ' + variable.value + "\n";
                        this.debugFile += "INFO Value of " + variable.name + ' is now ' + variable.value + "\n";
                    } catch (e) {
                        this._addLog(e, `color: ${this.colors.error};`) // color: red;
                        console.log('Failed to set variable');
                        this._addLog('Failed to set variable', `color: ${this.colors.log};`); // color: white;
                        this.logFile += "ERROR " + Cast.toString(e) + "\n";
                        this.logFile += "INFO Failed to set variable" + "\n";
                        this.debugFile += "ERROR " + Cast.toString(e) + "\n";
                        this.debugFile += "INFO Failed to set variable" + "\n";
                    }
                    break;
                case 'getList':
                    try {
                        if (this.isProtected({VARIABLE: args[1],PROTECTION_TYPE: "Sprite"})) {
                            this._addLog("This sprite is protected!", `color: ${this.colors.warning};`); // color: yellow;
                            this.logFile += "WARN This sprite is protected!" + "\n";
                            this.debugFile += "WARN This sprite is protected!" + "\n";
                            break;
                        }
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
                        if (this.isProtected({VARIABLE: args[0],PROTECTION_TYPE: "List"})) {
                            this._addLog("This list is protected!", `color: ${this.colors.warning};`); // color: yellow;
                            this.logFile += "WARN This list is protected!" + "\n";
                            this.debugFile += "WARN This list is protected!" + "\n";
                            break;
                        }
                        let value = variable ? JSON.stringify(variable.value) : "";
                        let name = variable ? variable.name : "";
                        console.log('Value of ' + name + ' is ' + value);
                        this._addLog('Value of ' + name + ' is ' + value, `color: ${this.colors.log};`); // color: white;
                        this.logFile += "INFO Value of " + name + ' is ' + value + "\n";
                        this.debugFile += "INFO Value of " + name + ' is ' + value + "\n";
                    } catch (e) {
                        this._addLog(e, `color: ${this.colors.error};`) // color: red;
                        console.log('Failed to get list');
                        this._addLog('Failed to get list', `color: ${this.colors.log};`); // color: white;
                        this.logFile += "ERROR " + Cast.toString(e) + "\n";
                        this.logFile += "INFO Failed to get list" + "\n";
                        this.debugFile += "ERROR " + Cast.toString(e) + "\n";
                        this.debugFile += "INFO Failed to get list" + "\n";
                    }
                    break;
                case 'setList':
                    try {
                        if (this.isProtected({VARIABLE: args[2],PROTECTION_TYPE: "Sprite"})) {
                            this._addLog("This sprite is protected!", `color: ${this.colors.warning};`); // color: yellow;
                            this.logFile += "WARN This sprite is protected!" + "\n";
                            this.debugFile += "WARN This sprite is protected!" + "\n";
                            break;
                        }
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
                        if (this.isProtected({VARIABLE: args[0],PROTECTION_TYPE: "List"})) {
                            this._addLog("This list is protected!", `color: ${this.colors.warning};`); // color: yellow;
                            this.logFile += "WARN This list is protected!" + "\n";
                            this.debugFile += "WARN This list is protected!" + "\n";
                            break;
                        }

                        const data = args[1]

                        const array = JSON.parse(data.replaceAll("'", '"'));
                        if (!Array.isArray(array)) {
                            throw new SyntaxError("Invalid array")
                        }

                        const safeArray = array.map((i) => {
                            if (typeof i === "object") return JSON.stringify(i);
                            return i;
                        });
                        
                        variable.value = safeArray;

                        console.log('Value of ' + variable.name + ' is now ' + JSON.stringify(variable.value));
                        this._addLog('Value of ' + variable.name + ' is now ' + JSON.stringify(variable.value), `color: ${this.colors.log};`); // color: white;
                        this.logFile += 'INFO Value of ' + variable.name + ' is now ' + JSON.stringify(variable.value) + "\n";
                    } catch (e) {
                        this._addLog(e, `color: ${this.colors.error};`) // color: red;
                        console.log('Failed to set list');
                        this._addLog('Failed to set list', `color: ${this.colors.log};`); // color: white;
                        this.logFile += "ERROR " + Cast.toString(e) + "\n";
                        this.logFile += "INFO Failed to set list" + "\n";
                        this.debugFile += "ERROR " + Cast.toString(e) + "\n";
                        this.debugFile += "INFO Failed to set list" + "\n";
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
                        this._addLog('Debug mode enabled', `color: ${this.colors.log};`); // color: white;
                        this.logFile += "INFO Debug mode enabled" + "\n";
                        this.debugFile += "INFO Debug mode enabled" + "\n";
                    } catch (e) {
                        this._addLog(e, `color: ${this.colors.error};`) // color: red;
                        console.log('Failed to enable debug mode');
                        this._addLog('Failed to enable debug mode', `color: ${this.colors.log};`); // color: white;
                        this.logFile += "ERROR " + Cast.toString(e) + "\n";
                        this.logFile += "INFO Failed to enable debug mode" + "\n";
                        this.debugFile += "ERROR " + Cast.toString(e) + "\n";
                        this.debugFile += "INFO Failed to enable debug mode" + "\n";
                    }
                    break;
                case 'disableDebugMode':
                    try {
                        this.hideDebug();
                        console.log('Debug mode disabled');
                        this._addLog('Debug mode disabled', `color: ${this.colors.log};`); // color: white;
                        this.logFile += "INFO Debug mode disabled" + "\n";
                        this.debugFile += "INFO Debug mode disabled" + "\n";
                    } catch (e) {
                        this._addLog(e, `color: ${this.colors.error};`) // color: red;
                        console.log('Failed to disable debug mode');
                        this._addLog('Failed to disable debug mode', `color: ${this.colors.log};`); // color: white;
                        this.logFile += "ERROR " + Cast.toString(e) + "\n";
                        this.logFile += "INFO Failed to disable debug mode" + "\n";
                        this.debugFile += "ERROR " + Cast.toString(e) + "\n";
                        this.debugFile += "INFO Failed to disable debug mode" + "\n";
                    }
                    break;
                case 'downloadLogs':
                    const file = args[0] === "true" ? this.debugFile : this.logFile
                    downloadBlob(
                        new Blob([file]),
                        'project.log'
                    );
                    break;
                default:
                    if (!customCommandExists) {
                        if (!(command in this.commandSet)) {
                            this._addLog(`Command "${command}" not found. Check "help" for command list.`, `color: ${this.colors.error};`); // color: red;
                            this.logFile += `INFO Command "${command}" not found. Check "help" for command list.` + "\n";
                            break;
                        }
                        try {
                            this.commandSet[command](...args);
                        } catch (err) {
                            this._addLog(`Error: ${err}`, `color: ${this.colors.error};`); // color: red;
                            this.logFile += `ERROR ${err}` + "\n";
                        }
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

        commandArguments(args, util) {
            if (!util.thread.commandData) {return JSON.stringify([])}
            const commandArguments = util.thread.commandData.ARGS;
            return commandArguments ? JSON.stringify(commandArguments) : JSON.stringify([]);
        }

        whenCommandEntered({COMMAND}, util) {
            const thread = util.thread;
            
            if (thread.stackClick) {
                return true
            }

            if (!thread.commandData || thread.commandData.COMMAND !== COMMAND) {
                thread._reject();
                return false;
            }
            thread._resolve();
            return true
        }

        async runWhenCommandEntered(args) {
            const hatsMatch = await new Promise((resolve) => {
              const hats = new Set(runHats('debugging_whenCommandEntered'));
              if (hats.size == 0) resolve([]);
              const intersection = [];
              hats.forEach(thread => {
                thread._reject = () => {
                  thread.status = 4;
                  hats.delete(thread);
                  if (hats.size == 0) resolve(intersection);
                };
                thread._resolve = () => {
                  hats.delete(thread);
                  intersection.push(thread);
                  if (hats.size == 0) resolve(intersection);
                };
                thread.commandData = args;
              });
            });
            if (hatsMatch.length == 0) {
                console.log('No custom commands found.')
                return false
            } else {
                console.log('Custom commands found.')
                return true
            };
        }

        cloneMarker({MARK}, util) {
            const clone = util.target;
            if (!this.isClone(clone)) throw new Error("The main sprite can not be marked!")
            if (clone.marker) throw new Error("Clone has already been marked!")
            clone.marker = Scratch.Cast.toString(MARK);
        }

        marker({MARK}, util) {
            const thread = util.thread
            if (thread.marker) throw new Error("Thread has already been marked!")
            thread.marker = Scratch.Cast.toString(MARK);
        }

        pointer({POINT}, util) {
            const thread = util.thread
            if (!thread.marker) throw new Error("Thread needs to be marked before a pointer can be created.")
            thread.pointer = Scratch.Cast.toNumber(POINT);
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
            this.debuggerShown = true;
        }
        closeDebugger() {
            this.console.style.display = 'none';
            this.debuggerShown = false;
        }

        isDebuggerShown() {
            return this.debuggerShown;
        }
        debuggerVersion() {
            return this.version;
        }

        sendInput({COMMAND, LOG}) {
            const command = Cast.toString(COMMAND)
            const addLog = Cast.toString(LOG)
            if (addLog.toLowerCase() === 'true') {
                this._addLog(`PROJECT > ${command}`, "opacity: 0.7;");
                this.logFile += `PROJECT > ${command}` + "\n";
                this.debugFile += `PROJECT > ${command}` + "\n";
            }
            let parsed = {};
            try {
                parsed = this._parseCommand(command);
            } catch (err) {
                this._addLog(`${err}`, "color: red;");
                return;
            }
            console.log(parsed);
            (async (THIS, parsed) => await THIS._runCommand(parsed))(this, parsed);
        }

        debug({INFO}) {
            const text = Cast.toString(INFO);
            console.log(text);
            this._addLog(text, `color: ${this.colors.debug};`, true); // color: dodgerblue;
            this.debugFile += "DEBUG " + text + "\n";
        }
        log({INFO}) {
            const text = Cast.toString(INFO);
            console.log(text);
            this._addLog(text, `color: ${this.colors.log};`); // color: white;
            this.logFile += "INFO " + text + "\n";
            this.debugFile += "INFO " + text + "\n";
        }
        warn({INFO}) {
            const text = Cast.toString(INFO);
            console.warn(text);
            this._addLog(text, `color: ${this.colors.warning};`); // color: yellow;
            this.logFile += "WARN " + text + "\n";
            this.debugFile += "WARN " + text + "\n";
        }
        error({INFO}, util) {
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
            if (target.marker) {
                stack.push(`clone marked as ${target.marker}`);
            } else if (!this.isClone(target)) {
                stack.push(`main sprite`);
            } else {
                stack.push(`unmarked clone`)
            }
            if (thread.marker) {
                stack.push(`script marked as ${thread.marker}`);
            }
            if (thread.pointer) {
                stack.push(`point ${thread.pointer}`);
            }

            const text = `Error: ${Cast.toString(INFO)}`
                + `\n${stack.map(text => (`\tat ${text}`)).join("\n")}`;
            console.error(text);
            this._addLog(text, `color: ${this.colors.error};`); // color: red;
            this.logFile += "ERROR " + text + "\n";
            this.debugFile += "ERROR " + text + "\n";
        }

        fatalError({INFO}, util) {
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
            if (target.marker) {
                stack.push(`clone marked as ${target.marker}`);
            } else if (!this.isClone(target)) {
                stack.push(`main sprite`);
            } else {
                stack.push(`unmarked clone`)
            }
            if (thread.marker) {
                stack.push(`script marked as ${thread.marker}`);
            }
            if (thread.pointer) {
                stack.push(`point ${thread.pointer}`);
            }

            const text = `Fatal Error: ${Cast.toString(INFO)}`
                + `\n${stack.map(text => (`\tat ${text}`)).join("\n")}`;
            console.error(text);
            this._addLog(text, `color: ${this.colors.fatalError};`); // color: red;
            this.logFile += "FATAL " + text + "\n";
            this.debugFile += "FATAL " + text + "\n";
            this.openDebugger()
            this.vm.stopAll()
        }
        breakPoint() {
            this.openDebugger()
            this._addLog('The project has paused itself, use the resume command to unpause the project.', `color: ${this.colors.breakpoint};`); // color: cadetblue;
            this.runtime.pause()
        }

        logStage() {
            new Promise((resolve) => {
                vm.runtime.renderer.requestSnapshot((uri) => {
                    resolve(uri);
                });
            }).then((base64ImageData) => {
                this._addImgLog(base64ImageData, 'border-radius: 10px; width: 150px; margin: 10px;')
            });
        }
        logImage({IMAGE}) {
            const image = Cast.toString(IMAGE);
            this._addImgLog(image, 'border-radius: 10px; width: 150px; margin: 10px;')
        }

        test({TEST,TEST_NAME}) {
            if (TEST) {
                this._addLog(`Test: ${TEST_NAME} succeeded`, `color: ${this.colors.succeededTest};`) // color: mediumseagreen;
            } else {
                this._addLog(`Test: ${TEST_NAME} failed`, `color: ${this.colors.failedTest};`) // color: crimson;
            }
        }

        testAndReturn({TEST,TEST_NAME}) {
            if (TEST) {
                this._addLog(`Test: ${TEST_NAME} succeeded`, `color: ${this.colors.succeededTest};`) // color: mediumseagreen;
            } else {
                this._addLog(`Test: ${TEST_NAME} failed`, `color: ${this.colors.failedTest};`) // color: crimson;
            }
            return TEST;
        }

        testAndIf({TEST,TEST_NAME}, util) {
            if (TEST) {
                this._addLog(`Test: ${TEST_NAME} succeeded`, `color: ${this.colors.succeededTest};`) // color: mediumseagreen;
                util.startBranch(1, false);
            } else {
                this._addLog(`Test: ${TEST_NAME} failed`, `color: ${this.colors.failedTest};`) // color: crimson;
            }
        }

        testAndIfElse({TEST,TEST_NAME}, util) {
            if (TEST) {
                this._addLog(`Test: ${TEST_NAME} succeeded`, `color: ${this.colors.succeededTest};`) // color: mediumseagreen;
                util.startBranch(1, false);
            } else {
                this._addLog(`Test: ${TEST_NAME} failed`, `color: ${this.colors.failedTest};`) // color: crimson;
                util.startBranch(2, false);
            }
        }

        resetHelp() {
            this.Default = new Default();
            this.CommandDescriptions = this.Default.CommandDescriptions;
        }
        setHelp({COMMAND, EXPLANATION}) {
            this.CommandDescriptions[Cast.toString(COMMAND)] = Cast.toString(EXPLANATION);
        }
        removeHelp({COMMAND}) {
            delete this.CommandDescriptions[Cast.toString(COMMAND)];
        }

        setCommandEnabled({COMMAND,ENABLED}) {
            let commandEnabled = this.isCommandEnabled({COMMAND: COMMAND})
            if (Cast.toString(ENABLED).toLowerCase() === "enable" && !commandEnabled) {
                this.disabledCommands.splice(this.disabledCommands.indexOf(Cast.toString(COMMAND)), 1);
            } else if (Cast.toString(ENABLED).toLowerCase() === "disable" && commandEnabled) {
                this.disabledCommands.push(Cast.toString(COMMAND))
            }
        }
        isCommandEnabled({COMMAND}) {
            return !this.disabledCommands.includes(Cast.toString(COMMAND));
        }

        protect({PROTECTION_TYPE,VARIABLE}) {
            let variableProtected = this.isProtected({VARIABLE: VARIABLE, PROTECTION_TYPE: PROTECTION_TYPE})
            if (!variableProtected) {
                let target = undefined
                let variable = undefined
                switch(PROTECTION_TYPE) {
                    case 'Variable':
                        target = runtime.getTargetForStage()
                        variable = target.lookupVariableByNameAndType(
                            Scratch.Cast.toString(VARIABLE),
                            ""
                        );
                        if (!variable) {
                            throw new ReferenceError("Variable \"" + VARIABLE + "\" is not defined")
                        }
                        this.protectedVariables.push(Cast.toString(VARIABLE))
                        break;
                    case 'List':
                        target = runtime.getTargetForStage()
                        variable = target.lookupVariableByNameAndType(
                            Scratch.Cast.toString(VARIABLE),
                            "list"
                        );
                        if (!variable) {
                            throw new ReferenceError("List \"" + VARIABLE + "\" is not defined")
                        }
                        this.protectedLists.push(Cast.toString(VARIABLE))
                        break;
                    case 'Sprite':
                        target = runtime.getSpriteTargetByName(Cast.toString(VARIABLE));
                        if (!target) {
                            throw new ReferenceError("Sprite \"" + VARIABLE + "\" is not defined")
                        }
                        this.protectedSprites.push(Cast.toString(VARIABLE))
                        break;
                    case 'Broadcast':
                        this.protectedBroadcasts.push(Cast.toString(VARIABLE))
                        break;
                    default:
                        throw new Error("Invalid PROTECTION_TYPE");
                }
            }
        }
        unprotect({PROTECTION_TYPE,VARIABLE}) {
            let variableProtected = this.isProtected({VARIABLE: VARIABLE, PROTECTION_TYPE: PROTECTION_TYPE})
            if (variableProtected) {
                switch(PROTECTION_TYPE) {
                    case 'Variable':
                        this.protectedVariables.splice(this.protectedVariables.indexOf(Cast.toString(VARIABLE)), 1);
                        break;
                    case 'List':
                        this.protectedLists.splice(this.protectedLists.indexOf(Cast.toString(VARIABLE)), 1);
                        break;
                    case 'Sprite':
                        this.protectedSprites.splice(this.protectedSprites.indexOf(Cast.toString(VARIABLE)), 1);
                        break;
                    case 'Broadcast':
                        this.protectedBroadcasts.splice(this.protectedBroadcasts.indexOf(Cast.toString(VARIABLE)), 1);
                        break;
                    default:
                        throw new Error("Invalid PROTECTION_TYPE");
                }
            }
        }
        isProtected({PROTECTION_TYPE,VARIABLE}) {
            switch(PROTECTION_TYPE) {
                case 'Variable':
                    return this.protectedVariables.includes(Cast.toString(VARIABLE));
                case 'List':
                    return this.protectedLists.includes(Cast.toString(VARIABLE));
                case 'Sprite':
                    return this.protectedSprites.includes(Cast.toString(VARIABLE));
                case 'Broadcast':
                    return this.protectedBroadcasts.includes(Cast.toString(VARIABLE));
                default:
                    throw new Error("Invalid PROTECTION_TYPE");
            }
        }

        resetColors() {
            this.Default = new Default();
            this.colors = this.Default.Colors;
            this.consoleBarInput.style.color = this.colors.inputText;
            this.consoleBarIndicator.style.color = this.colors.inputText;
            this.consoleHeader.style.color = this.colors.headerText;
            this.consoleHeader.style.background = this.colors.header;
            this.console.style.background = this.colors.background;
        }

        setColorOf({STYLE_TYPE,COLOR}) {
            switch(Cast.toString(STYLE_TYPE).toLowerCase()) {
                case "debug":
                    this.colors.debug = COLOR;
                    break;
                case "log":
                    this.colors.log = COLOR;
                    break;
                case "warning":
                    this.colors.warning = COLOR;
                    break;
                case "error":
                    this.colors.error = COLOR;
                    break;
                case "fatal error":
                    this.colors.fatalError = COLOR;
                    break;
                case "breakpoint":
                    this.colors.breakpoint = COLOR;
                    break;
                case "succeeded test":
                    this.colors.succeededTest = COLOR;
                    break;
                case "failed test":
                    this.colors.failedTest = COLOR;
                    break;
                case "input text":
                    this.colors.inputText = COLOR;
                    this.consoleBarInput.style.color = this.colors.inputText;
                    this.consoleBarIndicator.style.color = this.colors.inputText;
                    break;
                case "header text":
                    this.colors.headerText = COLOR;
                    this.consoleHeader.style.color = this.colors.headerText;
                    break;
                case "header":
                    this.colors.header = COLOR;
                    this.consoleHeader.style.background = this.colors.header;
                    break;
                case "background":
                    this.colors.background = COLOR;
                    this.console.style.background = this.colors.background;
                    break;
            }
        }

        getColorOf({STYLE_TYPE}) {
            switch(Cast.toString(STYLE_TYPE).toLowerCase()) {
                case "debug":
                    return this.colors.debug
                case "log":
                    return this.colors.log
                case "warning":
                    return this.colors.warning
                case "error":
                    return this.colors.error
                case "fatal error":
                    return this.colors.fatalError
                case "breakpoint":
                    return this.colors.breakpoint
                case "succeeded test":
                    return this.colors.succeededTest
                case "failed test":
                    return this.colors.failedTest
                case "input text":
                    return this.colors.inputText
                case "header text":
                    return this.colors.headerText
                case "header":
                    return this.colors.header
                case "background":
                    return this.colors.background
            }
        }

        isClone(clone) {
            return !clone.isOriginal;
        }

        canScroll() {
            return Math.abs(this.consoleLogs.scrollHeight - this.consoleLogs.clientHeight - this.consoleLogs.scrollTop) <= 1;
        }
    }
    Scratch.extensions.register(new debugging(vm, runtime));
})(Scratch);