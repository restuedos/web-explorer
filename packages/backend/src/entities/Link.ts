import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Link {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  link!: string;

  @Column()
  shortenedId!: string;

  @Column()
  shortenedLink!: string;
}
