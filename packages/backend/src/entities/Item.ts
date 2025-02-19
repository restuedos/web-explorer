import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Item {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  type!: "folder" | "file";

  @Column({ nullable: true, type: "text" })
  content?: string;

  @ManyToOne(() => Item, (item: Item) => item.children, { nullable: true, onDelete: "CASCADE" })
  parent?: Item;

  @OneToMany(() => Item, (item: Item) => item.parent, { cascade: true })
  children?: Item[];
}
