import { Service } from "typedi";

interface HolderData {
    [key: string]: any;
}

@Service()
export class SharedDataHolder {

    private data: HolderData = {};

    clear() {
        this.data = {};
    }

    setValue(key: string, value: any) {
        this.data[key] = value;
    }

    hasValue(key: string): boolean {
        return this.data[key] !== undefined;
    }

    getValue(key: string): any {
        return this.data[key];
    }

    removeValue(key: string) {
        this.data[key] = undefined;
    }
}
