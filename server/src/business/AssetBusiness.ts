import { checkResource } from "../common/exceptions";
import { Asset, AssetKind } from "../entity/Asset";
import { Presentation } from "../entity/Presentation";
import { Service } from "typedi";

@Service()
export class AssetBusiness {

    async fetchImages(presentationId: number): Promise<Asset[]> {
        const presentation = checkResource(await Presentation.findOneBy({id: presentationId}));
        return await Asset.createQueryBuilder().where({assetType: AssetKind.ImageAsset, presentation}).getMany();
    }

    async fetchSounds(presentationId: number): Promise<Asset[]> {
        const presentation = checkResource(await Presentation.findOneBy({id: presentationId}));
        return await Asset.createQueryBuilder().where({assetType: AssetKind.SoundAsset, presentation}).getMany();
    }

    async getAssetById(assetId: number): Promise<Asset> {
        const asset = checkResource(await Asset.findOneBy({id: assetId}));
        return asset;
    }

    async getAssetContent(assetId: number): Promise<Buffer> {
        const asset = checkResource(
                await Asset.createQueryBuilder().select().addSelect("Asset.binaryContent")
                    .where({id: assetId}).getOne()
        );
        return asset.binaryContent;
    }

    async uploadImage(presentationId: number, name: string, content: Buffer): Promise<number> {
        return await this.saveAsset(presentationId, name, AssetKind.ImageAsset, content);
    }

    async uploadSound(presentationId: number, name: string, content: Buffer): Promise<number> {
        return await this.saveAsset(presentationId, name, AssetKind.SoundAsset, content);
    }

    async renameAsset(assetId: number, name: string): Promise<void> {
        const asset = checkResource(await Asset.findOneBy({id: assetId}));
        asset.name = name;
        await asset.save();
    }

    private async saveAsset(presentationId: number, name: string, assetType: AssetKind, content: Buffer) {
        const presentation = checkResource(await Presentation.findOneBy({id: presentationId}));
        
        let asset = new Asset();
        asset.name = name;
        asset.assetType = assetType;
        asset.binaryContent = content;
        asset.presentation = presentation;
        asset = await asset.save();

        return asset.id;
    }

    async deleteAsset(assetId: number): Promise<void> {
        const asset = checkResource(await Asset.findOneBy({id: assetId}));
        await asset.remove();        
    }
}
