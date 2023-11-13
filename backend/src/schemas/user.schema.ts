import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  nome: string;

  @Prop()
  email: string;

  @Prop()
  admin: boolean;

  @Prop(() => Date)
  createdAt: Date;

  @Prop(() => Date)
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
