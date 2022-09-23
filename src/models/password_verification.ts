import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('passwordVerification')
export class PasswordVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  code: number;

  @Column({ comment: 'Expires in x seconds' })
  expiresIn: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
