import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Campo {
  @Prop()
  nome: string;

  @Prop(() => Date)
  createdAt: Date;

  @Prop(() => Date)
  updatedAt: Date;
}

export type CampoDocument = HydratedDocument<Campo>;

export const CampoSchema = SchemaFactory.createForClass(Campo);
