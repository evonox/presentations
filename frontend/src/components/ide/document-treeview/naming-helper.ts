import { FileKind } from "./model-mapping";


export class NamingHelper {

    static validateRegularName(filename: string) {
        return filename = filename.replaceAll(/[ \t]/g, "-");
    }
    
    static validateFileName(filename: string, fileKind: FileKind) {
        filename = this.validateRegularName(filename);
        const extension = "." + fileKind.toLocaleLowerCase();
        if(filename.endsWith(extension) === false) {
            filename += extension;
        }
        return filename;
    }
}