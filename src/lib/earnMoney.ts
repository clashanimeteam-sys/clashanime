export const EARN_MONEY_REWARD_USD = 2;
export const EARN_MONEY_REWARD_CENTS = 200;

export type EarnMoneyTaskType = "youtube" | "forum" | "blog";

export type EarnMoneySubmissionStatus = "pending" | "approved" | "rejected";

export const EARN_MONEY_TASK_TYPES: EarnMoneyTaskType[] = ["youtube", "forum", "blog"];

export function isEarnMoneyTaskType(value: string): value is EarnMoneyTaskType {
  return EARN_MONEY_TASK_TYPES.includes(value as EarnMoneyTaskType);
}
