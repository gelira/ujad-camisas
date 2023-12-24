import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Camisa {
  @Prop()
  setorId: string;

  @Prop()
  remessaId: string;

  @Prop()
  nomePessoa: string;

  @Prop()
  modeloId: string;

  @Prop()
  modeloDescricao: string;

  @Prop()
  modeloValor: number;

  @Prop()
  totalPago: number;

  @Prop()
  tamanhoId: string;

  @Prop()
  tamanhoDescricao: string;

  @Prop(() => Date)
  createdAt: Date;

  @Prop(() => Date)
  updatedAt: Date;

  @Prop({
    type: () => Date,
    default: null,
  })
  deletedAt: Date | null;
}

export type CamisaDocument = HydratedDocument<Camisa>;

export const CamisaSchema = SchemaFactory.createForClass(Camisa);
