import { Service } from "typedi";

@Service()
export class PresentationBuilder {

    async buildPresentation(presentationId: number): Promise<boolean> {
        throw new Error("NOT IMPLEMENTED");
    }
}
