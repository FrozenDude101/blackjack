class ResourceLoader {

    public static readonly RESOURCE_PATH = "/resources";

    private static groups: Map<string, Resource[]> = new Map();
    private static resources: Map<string, Resource> = new Map();

    public static loadImage(path: string, groupName: string = "default"): ImageResource {
        let cached = this.resources.get(path);
        if (cached) {
            assert(cached instanceof ImageResource);
            return cached;
        }

        let resource = new ImageResource(`${ResourceLoader.RESOURCE_PATH}/${path}`);
        this.resources.set(path, resource);

        let group = this.groups.get(groupName);
        if (!group) {
            group = [];
            this.groups.set(groupName, group);
        }
        group.push(resource);

        return resource;
    }
    public static loadSound(path: string, groupName: string = "default"): SoundResource {
        let cached = this.resources.get(path);
        if (cached) {
            assert(cached instanceof SoundResource);
            return cached;
        }

        let resource = new SoundResource(`${ResourceLoader.RESOURCE_PATH}/${path}`);
        this.resources.set(path, resource);

        let group = this.groups.get(groupName);
        if (!group) {
            group = [];
            this.groups.set(groupName, group);
        }
        group.push(resource);

        return resource;
    }

    public static isGroupReady(groupName: string): boolean {
        let group = this.groups.get(groupName);
        if (!group)
            throw `No group found with the ID '${groupName}'.`;
        return group.every(r => r.status === Resource.STATUS.READY);
    }
    public static isGroupError(groupName: string): boolean {
        let group = this.groups.get(groupName);
        if (!group)
            throw `No group found with the ID '${groupName}'.`;
        return group.some(r => r.status === Resource.STATUS.FAILED);
    }

    public static getGroupStatus(groupName: string): Resource.STATUS {
        let group = this.groups.get(groupName);
        if (!group)
            throw `No group found with the ID '${groupName}'.`;

        let status = Resource.STATUS.READY;
        for (let resource of group) {
            status = Math.max(status, resource.status);
        }
        return status;
    }
    public static getGroupHangup(groupName: string): string | undefined {
        let group = this.groups.get(groupName);
        if (!group)
            throw `No group found with the ID '${groupName}'.`;

        for (let resource of group) {
            if (resource.status === Resource.STATUS.LOADING)
                return resource.name;
        }
        return undefined;
    }
    public static getGroupReadyCount(groupName: string): number {
        let group = this.groups.get(groupName);
        if (!group)
            throw `No group found with the ID '${groupName}'.`;

        return group.filter(r => r.status === Resource.STATUS.READY).length;    
    }
    public static getGroupSize(groupName: string): number {
        let group = this.groups.get(groupName);
        if (!group)
            throw `No group found with the ID '${groupName}'.`;

        return group.length;
    }
    public static getGroupPercent(groupName: string): number {
        return this.getGroupSize(groupName) / this.getGroupReadyCount(groupName);
    }

}