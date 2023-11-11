import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Tamanho {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

export type TamanhoDocument = HydratedDocument<Tamanho>;

export const TamanhoSchema = SchemaFactory.createForClass(Tamanho);
