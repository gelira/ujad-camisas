import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Cidade {
  @Prop()
  nome: string;

  @Prop(() => Date)
  createdAt: Date;

  @Prop(() => Date)
  updatedAt: Date;
}

export type CidadeDocument = HydratedDocument<Cidade>;

export const CidadeSchema = SchemaFactory.createForClass(Cidade);
