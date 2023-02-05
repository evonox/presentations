import { JsonIgnore, JsonProperty } from "jackson-js";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm"
import { Presentation } from "./Presentation";

export enum AssetKind { ImageAsset = 0, SoundAsset = 1 }

@Entity()
export class Asset extends BaseEntity {

    @PrimaryGeneratedColumn()
    @JsonProperty()
    id: number;

    @Column()
    @JsonProperty()
    name: string;

    @Column()
    @JsonProperty()
    assetType: AssetKind;

    @Column({nullable: true, type: "longblob", select: false})
    @JsonIgnore()
    binaryContent: Buffer;

    @ManyToOne(() => Presentation, p => p.assets, {lazy: true})
    @JsonIgnore()
    presentation: Presentation;
}
