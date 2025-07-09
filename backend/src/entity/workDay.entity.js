import { EntitySchema } from "typeorm";

const WorkdaySchema = new EntitySchema({
  name: "Workday",
  tableName: "workdays",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    date: {
      type: "date",
      unique: true,
      nullable: false,
    },
    isWorkingDay: {
      type: "boolean",
      default: true,
      nullable: false,
    },
    payAmount: {
      type: "int",
      nullable: true, // Puede ser null si no es día laboral
    },
    comment: {
      type: "text",
      nullable: true,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_WORKDAY_DATE",
      columns: ["date"],
      unique: true,
    },
  ],
});

export default WorkdaySchema;
