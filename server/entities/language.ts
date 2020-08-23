import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import type { Language as LanguageInterface } from "../../types/language.type";

@Entity()
export class Language implements LanguageInterface {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar", length: 30 })
  public label: string;

  @Column({ type: "varchar", length: 2 })
  public value: string;
}
