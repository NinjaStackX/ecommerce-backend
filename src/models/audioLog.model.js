import { model, Schema } from "mongoose";

const auditLogSchema = new Schema(
  {
    action: {
      type: String,
      enum: ["Create", "Read", "Update", "Delete"],
    },

    performedBy: { type: Schema.Types.ObjectId, ref: "User" },
    target: { type: Schema.Types.ObjectId, ref: "User" },
    meta: Object,
  },
  { timestamps: true }
);

export default model("AuditLog", auditLogSchema);
