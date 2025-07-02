import { EmptyCard, ScheduleCard } from "../model/type";

export function isEmpty(card: ScheduleCard): card is EmptyCard {
  return card.type === "empty";
}
