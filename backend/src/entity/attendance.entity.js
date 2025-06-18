import { EntitySchema } from "typeorm";

const AttendanceSchema = new EntitySchema({
  name: "Attendance",
  tableName: "attendances",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    date: {
      type: "date",
      nullable: false,
    },
    checkInTime: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
    },
    latitude: {
      type: "float",
      nullable: true,
    },
    longitude: {
      type: "float",
      nullable: true,
    },
    ipAddress: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    status: {
      type: "varchar",
      length: 20,
      default: "present",
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      nullable: false,
    },
  },
});

export default AttendanceSchema;