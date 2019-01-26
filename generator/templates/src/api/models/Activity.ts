import { Model } from "@vuex-orm/core";

export default class Activity extends Model {
  static entity = "activity";

  static primaryKey = "_id";

  static fieldsKeys() {
    return Object.keys(this.fields());
  }

  static fields() {
    return {
      _id: Model.increment(),
      applicant: Model.string("John"),
      occurenceDate: Model.string("2018-10-30"),
      content: Model.string("Meeting"),
      currentDate: Model.string("2018-10-30"),
      startTime: Model.string("12:00"),
      endTime: Model.string("12:00"),
      reportDate: Model.string("2018-10-30"),
      reportContent: Model.string("Discussion"),
      instructionDate: Model.string("2018-10-30"),
      instruction: Model.string("Read"),
      priority: Model.string("HIGH"),
    };
  }
}
