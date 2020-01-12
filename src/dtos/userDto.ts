import { IsString, ValidateNested, IsOptional } from "class-validator";
import CreateAddressDto from "./addressDto";

class CreateUserDto {
  @IsString()
  public name: string;

  @IsString()
  public email: string;

  @IsString()
  public password: string;

  @IsOptional()
  @ValidateNested()
  public address: CreateAddressDto;
}

export default CreateUserDto;
