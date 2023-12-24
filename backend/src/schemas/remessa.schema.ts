import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Remessa {
  @Prop()
  descricao: string;

  @Prop({ default: false })
  abertoManual: boolean;

  @Prop(() => Date)
  inicio: Date;

  @Prop(() => Date)
  final: Date;

  @Prop(() => Date)
  createdAt: Date;

  @Prop(() => Date)
  updatedAt: Date;
}

export type RemessaDocument = HydratedDocument<Remessa>;

export const RemessaSchema = SchemaFactory.createForClass(Remessa);
