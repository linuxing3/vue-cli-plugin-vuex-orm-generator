import { Model } from "@vuex-orm/core";

export default class Activity extends Model {
  static entity = "user";

  static primaryKey = "id";

  static fieldsKeys() {
    return Object.keys(this.fields());
  }

  static fields() {
    return {
      id: Model.increment(),
      username: Model.string("Daniel"),
      email: Model.string("daniel@gmail.com"),
      password: Model.string("123456"),
    };
  }
}
