import { CalendarView } from './MiniCalendarView';
import { MiniCalendarBody } from './MiniCalendarBody';
import { MiniCalendarHeader } from './MiniCalendarHeader';
import { SessionLogList } from './SessionLogList';

type MiniCalendarType = typeof CalendarView & {
  Body: typeof MiniCalendarBody;
  Header: typeof MiniCalendarHeader;
  SessionLogList: typeof SessionLogList;
};

const CompoundMiniCalendarView = CalendarView as MiniCalendarType;

CompoundMiniCalendarView.Header = MiniCalendarHeader;
CompoundMiniCalendarView.Body = MiniCalendarBody;
CompoundMiniCalendarView.SessionLogList = SessionLogList;

export default CompoundMiniCalendarView;
