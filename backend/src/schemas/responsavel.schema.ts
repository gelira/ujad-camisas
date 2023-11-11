import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Responsavel {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

export type ResponsavelDocument = HydratedDocument<Responsavel>;

export const ResponsavelSchema = SchemaFactory.createForClass(Responsavel);
