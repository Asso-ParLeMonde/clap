import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

import type { Video as VideoInterface } from "../../types/models/video.type";

import { Theme } from "./theme";

@Entity()
export class Video implements VideoInterface {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar", length: 250 })
  public videoUrl: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  public localPath: string | null;

  @Column({ type: "varchar", length: 250, nullable: true })
  public thumbnailUrl: string | null;

  @Column({ type: "varchar", length: 200 })
  public title: string;

  @Column()
  public duration: number;

  @ManyToOne(() => Theme)
  @JoinColumn({ name: "themeId" })
  public theme: Theme;

  @Column({ nullable: true })
  public themeId: number | null;
}
