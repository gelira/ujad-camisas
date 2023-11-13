import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'setores',
  timestamps: true,
})
export class Setor {
  @Prop()
  nome: string;

  @Prop([String])
  responsaveis: string[];

  @Prop(() => Date)
  createdAt: Date;

  @Prop(() => Date)
  updatedAt: Date;
}

export type SetorDocument = HydratedDocument<Setor>;

export const SetorSchema = SchemaFactory.createForClass(Setor);
