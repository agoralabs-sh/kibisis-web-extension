// enums
import { ActionNameEnum } from '../enums';

// types
import type { IAction, TActionData } from '../types';

export default class Action<Data = TActionData> implements IAction<Data> {
  public data: Data;
  public hostname: string;
  public language: string;
  public name: ActionNameEnum;
  public website: string;

  constructor({ data, hostname, language, name, website }: IAction<Data>) {
    this.data = data;
    this.hostname = hostname;
    this.language = language;
    this.name = name;
    this.website = website;
  }
}
