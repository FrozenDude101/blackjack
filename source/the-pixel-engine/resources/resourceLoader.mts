import { assert } from "../types/assert.mjs";
import { ImageResource, Resource } from "./resource.mjs";

export class ResourceLoader {

    public static readonly BASE_PATH = "resources/";

    private static resources: Map<string, Resource> = new Map();

    public static registerResource(resource: Resource, id: string) {
        if (this.resources.has(id)) throw `A resource already exists with the ID ${id}`;
        this.resources.set(id, resource);
    }

    public static loadImage(path: string): ImageResource {
        let resource = this.resources.get(path);
        if (resource) {
            assert(resource instanceof ImageResource);
            return resource;
        }
        return new ImageResource(path).load();
    }
    
}