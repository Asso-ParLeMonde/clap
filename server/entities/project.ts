import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";

import { Question } from "./question";
import { Scenario } from "./scenario";
import { Theme } from "./theme";
import { User } from "./user";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar", length: 200, nullable: true })
  public title: string;

  @CreateDateColumn()
  public date: Date;

  @ManyToOne(() => Theme)
  public theme: Theme;

  @ManyToOne(() => Scenario)
  public scenario: Scenario;

  @ManyToOne(() => User)
  public user: User;

  @OneToMany(() => Question, (question) => question.project)
  public questions: Question[];
}
