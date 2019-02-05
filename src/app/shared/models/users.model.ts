import {Deserializable} from './deserializable.model';

export class UsersModel implements Deserializable {
  id: number | string;
  name:  string;
  slackId: string;
  phoneNo: string;
  email: string;
  defaultDestinationId: string;
  createdAt: Date | string;
  updatedAt: Date | string;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
