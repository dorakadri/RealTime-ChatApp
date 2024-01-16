import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateDto {

  @Field()
  fullname: string;

  @Field({nullable:true})
  avatarUrl?: string;
}
