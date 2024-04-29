import { DurationType } from "../enums";

function calculateEndDate(
  startDate: Date,
  duration: number,
  durationType: DurationType
): Date {
  let endDate: Date;

  switch (durationType) {
    case DurationType.Days:
      endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);
      break;
    case DurationType.Weeks:
      endDate = new Date(
        startDate.getTime() + duration * 7 * 24 * 60 * 60 * 1000
      );
      break;
    case DurationType.Months:
      endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + duration);
      break;
    default:
      throw new Error("Invalid duration type");
  }

  return endDate;
}

export { calculateEndDate };
