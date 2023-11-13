import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'responsaveis',
  timestamps: true,
})
export class Responsavel {
  @Prop()
  nome: string;

  @Prop()
  email: string;

  @Prop(() => Date)
  createdAt: Date;

  @Prop(() => Date)
  updatedAt: Date;
}

export type ResponsavelDocument = HydratedDocument<Responsavel>;

export const ResponsavelSchema = SchemaFactory.createForClass(Responsavel);
