import { compare, hash } from 'bcrypt';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  attributeId: string;

  newPassword?: string;

  @BeforeInsert()
  async hashPassWord() {
    this.password = await hash(this.password, 10);
  }

  @BeforeUpdate()
  async hashNewPassWord() {
    if (!!this.newPassword) {
      this.password = await hash(this.newPassword, 10);
    }

    delete this.newPassword;
  }

  comparePassword(passwordAttempt: string) {
    return compare(passwordAttempt, this.password);
  }
}
