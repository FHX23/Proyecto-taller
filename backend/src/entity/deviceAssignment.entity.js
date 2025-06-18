import { EntitySchema } from "typeorm";

const DeviceAssignmentSchema = new EntitySchema({
  name: "DeviceAssignment",
  tableName: "device_assignments",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    deviceToken: {
      type: "varchar",
      length: 255,
      nullable: false,
      unique: true,
    },
    user_id: {
      type: "int",
      nullable: false,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_id",
      },
      nullable: false,
      onDelete: "CASCADE",
    },
  },
  indices: [
    {
      name: "IDX_DEVICE_TOKEN",
      columns: ["deviceToken"],
      unique: true,
    },
    {
      name: "IDX_DEVICE_USER_ID",
      columns: ["user_id"],
      unique: false,
    },
  ],
});

export default DeviceAssignmentSchema;
