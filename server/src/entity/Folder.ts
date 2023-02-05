import { JsonIgnore, JsonProperty } from "jackson-js";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne } from "typeorm"
import { File } from "./File";

@Entity()
export class Folder extends BaseEntity {

    @PrimaryGeneratedColumn()
    @JsonProperty()
    id: number;

    @Column()
    @JsonProperty()
    name: string;

    @JsonProperty()
    parentId: number;
    
    @ManyToOne(() => Folder, f => f.children, {lazy: true})
    @JsonIgnore()
    parent: Folder;

    @OneToMany(() => Folder, f => f.parent, {lazy: true})
    @JsonIgnore()
    children: Folder[];

    @OneToMany(() => File, f => f.parent, {lazy: true})
    @JsonIgnore()
    files: File[];
}
