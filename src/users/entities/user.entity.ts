import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  full_name: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  aadhaar_hash: string;

  @Column({ type: 'text', nullable: true })
  pan_hash: string;

  @Column({ type: 'text', nullable: true })
  retina_scan_hash: string;

  @CreateDateColumn()
  created_at: Date;
}
