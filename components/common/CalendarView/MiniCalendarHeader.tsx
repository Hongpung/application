import { Color } from "@hongpung/ColorSet";
import { Icons } from "@hongpung/src/common/components/icons/Icon";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useCalendar } from "./useCalendar.context";


const useMiniCalendarHeader = () => {

    const { setDate, calendarMonth, setMonth } = useCalendar()

    const incrementMonth = () => {
        const newDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
        setMonth(newDate);
        setDate(null);
    };

    const decrementMonth = () => {
        const newDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
        setMonth(newDate);
        setDate(null);
    };

    return { calendarMonth, incrementMonth, decrementMonth };
}

export const MiniCalendarHeader: React.FC = () => {

    const { calendarMonth, incrementMonth, decrementMonth } = useMiniCalendarHeader();

    return (
        <View style={{ width: '100%', flexShrink: 0 }}>
            <Text style={{ marginLeft: 32, marginBottom: 8, fontSize: 16, color: Color['grey400'], fontFamily: 'NanumSquareNeo-Bold' }}>
                {calendarMonth.getFullYear()}년
            </Text>
            <View style={styles.MonthRow}>
                <Pressable style={styles.MonthBtn}
                    onPress={decrementMonth} >
                    <Icons size={20} name='chevron-back' color={Color['blue500']} />
                </Pressable>
                <Text style={styles.MonthNumber}>
                    {calendarMonth.getMonth() + 1}월
                </Text>
                <Pressable style={styles.MonthBtn}
                    onPress={incrementMonth} >
                    <Icons size={20} name='chevron-forward' color={Color['blue500']} />
                </Pressable>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    MonthRow: {
        height: 24,
        marginHorizontal: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    MonthNumber: {
        width: 56,
        textAlign: 'center',
        fontSize: 20,
        marginHorizontal: 4,
        fontFamily: 'NanumSquareNeo-Bold',
        color: Color['grey700']
    },
    MonthBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
    },
})