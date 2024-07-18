class ScriptLoader {

    private static readonly SCRIPT_DIRECTORY = "scripts";

    private static cwd: string[] = [];
    private static scriptsToLoad: string[] = [];

    public static cd(directories: string) {
        for (let directory of directories.split("/")) {
            switch (directory) {
                case "":
                    this.cwd = [];
                    break;
                case ".":
                    break;
                case "..":
                    this.cwd.pop();
                    break;
                default:
                    this.cwd.push(directory);
            }
        }
    }

    public static load(...scripts: string[]): void {
        if (typeof scripts === "string")
            scripts = [scripts];

        this.scriptsToLoad.push(...scripts.map(s => `${this.SCRIPT_DIRECTORY}/${this.cwd.join("/")}/${s}.js`));
    }

    public static run() {
        let scriptPath = ScriptLoader.scriptsToLoad.shift();
        if (!scriptPath)
            return;

        let scriptElement = document.createElement("script");
        scriptElement.onload = ScriptLoader.run;
        scriptElement.src = scriptPath;
        document.head.appendChild(scriptElement);
    }

}

ScriptLoader.cd("/the-pixel-engine");
ScriptLoader.load("type-utils");
ScriptLoader.cd("/the-pixel-engine/maths");
ScriptLoader.load("nTuple", "matrix3x3", "vector3", "vector2", "anchor", "transform");
ScriptLoader.cd("/the-pixel-engine/resources");
ScriptLoader.load("resourceLoader", "resource");
ScriptLoader.cd("/the-pixel-engine/components");
ScriptLoader.load("component", "singletonComponent", "game", "sprite", "mouseTrigger", "timer", "sound", "button");

ScriptLoader.cd("/poker");
ScriptLoader.load("cardSprite", "card", "deck", "hand", "blackjack", "main");

ScriptLoader.run();