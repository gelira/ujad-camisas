import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Modelo {
  @Prop()
  descricao: string;

  @Prop()
  valor: number;

  @Prop(() => Date)
  createdAt: Date;

  @Prop(() => Date)
  updatedAt: Date;
}

export type ModeloDocument = HydratedDocument<Modelo>;

export const ModeloSchema = SchemaFactory.createForClass(Modelo);
