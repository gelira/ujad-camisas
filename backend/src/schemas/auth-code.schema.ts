import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class AuthCode {
  @Prop()
  userId: string;

  @Prop()
  code: string;

  @Prop()
  active: boolean;

  @Prop(() => Date)
  expiredAt: Date;

  @Prop(() => Date)
  createdAt: Date;

  @Prop(() => Date)
  updatedAt: Date;
}

export type AuthCodeDocument = HydratedDocument<AuthCode>;

export const AuthCodeSchema = SchemaFactory.createForClass(AuthCode);
