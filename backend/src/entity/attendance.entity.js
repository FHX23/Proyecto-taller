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
    user_id: {
      type: "int",
      nullable: false,
    },
    workday_id: {
      type: "int",
      nullable: false,
    },
    device_id: {
      type: "int",
      nullable: false,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "user_id" },
      onDelete: "CASCADE",
    },
    workday: {
      type: "many-to-one",
      target: "Workday",
      joinColumn: { name: "workday_id" },
      onDelete: "CASCADE",
    },
    device: {
      type: "many-to-one",
      target: "DeviceAssignment",
      joinColumn: { name: "device_id" },
      onDelete: "CASCADE",
    },
  },
  indices: [
    {
      name: "IDX_ATTENDANCE_UNIQUE",
      columns: ["user_id", "workday_id"],
      unique: true,
    },
  ],
});

export default AttendanceSchema;