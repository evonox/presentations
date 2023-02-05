import { JsonIgnore, JsonProperty } from "jackson-js";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from "typeorm"
import { Folder } from "./Folder";

@Entity()
export class Template extends BaseEntity {

    @PrimaryGeneratedColumn()
    @JsonProperty()
    id: number;

    @Column()
    @JsonProperty()
    name: string;

    @OneToOne(() => Folder, {lazy: true})
    @JoinColumn()
    @JsonIgnore()
    rootFolder: Folder;
}
