import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Modelo {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

export type ModeloDocument = HydratedDocument<Modelo>;

export const ModeloSchema = SchemaFactory.createForClass(Modelo);
