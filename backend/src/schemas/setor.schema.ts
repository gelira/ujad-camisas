import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Setor {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

export type SetorDocument = HydratedDocument<Setor>;

export const SetorSchema = SchemaFactory.createForClass(Setor);
