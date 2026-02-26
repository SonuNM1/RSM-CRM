import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    website: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "New",
        "Assigned",
        "RNR",
        "Answered",
        "Number NA",
        "Out of Service",
        "Can't Connect",
        "DNS",
        "Follow Up",
        "Interested",
        "Not Interested",
        "Qualified",
        "Converted",
        "Lost",
        "Trash",
      ],
      default: "New",
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    countryCode: String,
    phone: String,
    comments: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedAt: Date,
    // activities: [
    //     {
    //         status: {
    //             type: String,
    //             enum: LEAD_STATUSES
    //         },
    //         note: String,
    //         updatedBy: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: "User"
    //         },
    //         createdAt: {
    //             type: Date,
    //             default: Date.now
    //         }
    //     }
    // ]
  },
  { timestamps: true },
);

// Duplicate guard - prevents same wbesite + name ever being inserted twice

leadSchema.index({ website: 1, name: 1 }, { unique: true });

export default mongoose.model("Lead", leadSchema);
