import { assert } from "../types/assert.mjs";
import { Component } from "./component.mjs";


export class Game {
 
    private static components: Map<string, Component> = new Map();
    public static registerComponent(component: Component, id?: string): string {
        if (!id) id = component.constructor.name;

        if (this.components.has(id)) {
            let n = 0;
            while (this.components.has(`${id}-${n}`)) n += 1;
            id = `${id}-${n}`;
        }
        this.components.set(id, component);

        return id;
    }
    public static getComponent<T extends (abstract new (...args: any) => InstanceType<T>)>(t: T, id: string): InstanceType<T> {
        let component = this.components.get(id);
        if (!component)
            throw `No component exists with the ID '${id}'.`;
        assert(component instanceof t);
        return component;
    }
    public static deleteComponent(id: string) {
        this.components.delete(id);
    }

}