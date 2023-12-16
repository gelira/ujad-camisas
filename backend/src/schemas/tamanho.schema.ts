import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Tamanho {
  @Prop()
  descricao: string;

  @Prop()
  order: number;

  @Prop(() => Date)
  createdAt: Date;

  @Prop(() => Date)
  updatedAt: Date;
}

export type TamanhoDocument = HydratedDocument<Tamanho>;

export const TamanhoSchema = SchemaFactory.createForClass(Tamanho);
