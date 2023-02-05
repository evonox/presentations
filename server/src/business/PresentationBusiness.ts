import { Presentation } from "../entity/Presentation";
import { Service, Inject } from "typedi";
import { checkResource } from "../common/exceptions";
import { Transactional } from "../common/decorators";
import { AssetBusiness } from "./AssetBusiness";

@Service()
export class PresentationBusiness {

    @Inject(() => AssetBusiness)
    private assetBusiness: AssetBusiness;

    async fetchAllPresentations(): Promise<Presentation[]> {
        return await Presentation.createQueryBuilder().getMany()
    }

    async getPresentationById(id: number): Promise<Presentation> {
        const presentation = checkResource(await Presentation.findOneBy({id: id}));
        return presentation;
    }

    async createPresentation(name: string): Promise<number> {
        let presentation = new Presentation();
        presentation.name = name;
        presentation = await presentation.save();
        return presentation.id;
    }

    async renamePresentation(id: number, name: string): Promise<void> {
        const presentation = checkResource(await Presentation.findOneBy({id: id}));
        presentation.name = name;
        await presentation.save();
    }

    @Transactional
    async deletePresentation(id: number): Promise<void> {
        const presentation = checkResource(await Presentation.findOneBy({id: id}));

        const assets = await presentation.assets;
        for(const asset of assets) {
            await this.assetBusiness.deleteAsset(asset.id);
        }
        await presentation.remove();
    }
}
