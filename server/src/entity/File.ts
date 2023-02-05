import { JsonIgnore, JsonProperty } from "jackson-js";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne } from "typeorm"
import { Folder } from "./Folder";

@Entity()
export class File extends BaseEntity {

    @PrimaryGeneratedColumn()
    @JsonProperty()
    id: number;

    @Column()
    @JsonProperty()
    name: string;

    @JsonProperty()
    parentId: number;    
    
    @Column()
    @JsonProperty()
    isBinary: boolean;

    @ManyToOne(() => Folder, f => f.files, {lazy: true})
    @JsonIgnore()
    parent: Folder;

    @Column({nullable: true, type: "text", select: false})
    @JsonIgnore()
    textContent: string;

    @Column({nullable: true, type: "longblob", select: false})
    @JsonIgnore()
    binaryContent: Buffer;
}
