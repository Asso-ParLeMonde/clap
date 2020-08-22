import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar", length: 30 })
  public label: string;

  @Column({ type: "varchar", length: 2 })
  public value: string;
}
