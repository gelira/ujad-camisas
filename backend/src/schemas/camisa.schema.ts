import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Camisa {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

export type CamisaDocument = HydratedDocument<Camisa>;

export const CamisaSchema = SchemaFactory.createForClass(Camisa);
