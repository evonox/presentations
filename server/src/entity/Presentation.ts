import { JsonIgnore, JsonProperty } from "jackson-js";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne } from "typeorm"
import { Asset } from "./Asset";
import { Template } from "./Template";

@Entity()
export class Presentation extends BaseEntity {

    @PrimaryGeneratedColumn()
    @JsonProperty()
    id: number;

    @Column()
    @JsonProperty()
    name: string;

    @ManyToOne(() => Template, {nullable: true, lazy: true})
    @JsonIgnore()
    template: Template;

    @OneToMany(() => Asset, a => a.presentation, {lazy: true})
    @JsonIgnore()
    assets: Asset[];
}
