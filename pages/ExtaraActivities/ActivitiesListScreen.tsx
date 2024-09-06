import { FlatList, StyleSheet, Text, View, ScrollView, Pressable, Dimensions } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Color } from '../../ColorSet'

const { width } = Dimensions.get(`window`);

const Calendar: React.FC<{ onClickDate: (date: Date) => void, calendarDate?: Date }> = ({ onClickDate, calendarDate }) => {

  const [calendarMonth, setMonth] = useState(calendarDate ?? new Date())
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

  const today = new Date();

  const prevDays = (day: number) => {
    if (day == 0) return 6;
    return day - 1;
  }
  useEffect(() => {
    calendarDate && setMonth(calendarDate)
  }, [calendarDate])

  useLayoutEffect(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysArray = [];
    for (let i = 0; i < prevDays(firstDayOfMonth.getDay()); i++) {
      daysArray.push(0);
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      daysArray.push(i);
    }

    while (daysArray.length % 7 !== 0) {
      daysArray.push(0);
    }


    setDaysInMonth(daysArray);
  }, [calendarMonth]);


  const incrementMonth = () => {
    const newDate = new Date(calendarMonth);
    newDate.setMonth(calendarMonth.getMonth() + 1);
    setMonth(newDate);
  };

  const decrementMonth = () => {
    const newDate = new Date(calendarMonth);
    newDate.setMonth(calendarMonth.getMonth() - 1);
    setMonth(newDate);
  };

  const renderWeeks = () => {
    const weeks: any[] = [];
    let days: any[] = [];

    daysInMonth.forEach((day, index) => {
      if (day == 0) days.push(<View style={{ width: 32, height: 32 }} />)
      else {
        days.push(
          <Pressable key={`date-${day}`}
            style={{ height: 60, width: 32, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: (day == today.getDate()) && (calendarMonth.getMonth() == today.getMonth()) ? Color['blue100'] : 'transparent', borderRadius: 5 }}
            onPress={() => onClickDate(new Date(`${calendarMonth.getFullYear()}-${calendarMonth.getMonth() + 1}-${day}`))}
          >
            <Text style={[styles.CalendarText, (day == today.getDate()) && (calendarMonth.getMonth() == today.getMonth()) ? { color: Color['blue600'] } : null]}>{day}</Text>
            <View style={{ marginHorizontal: 2, height: 16, flexDirection: 'row', marginTop: 4, width:24, justifyContent:'space-evenly' }}>
              {day % (12 - today.getDay()) == 0 && <View style={{ height: 6, backgroundColor: Color['grey300'], width: 6, borderRadius: 5, marginTop: 2 }} />}
              {day % (12- today.getDay()) == 0 && <View style={{ height: 6, backgroundColor: Color['red400'], width: 6, borderRadius: 5, marginTop: 2 }} />}
            </View>
            {day % 8 == 0 && <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey300'], marginTop: 2 }}>+3</Text>}
          </Pressable>
        );
      }

      if ((index + 1) % 7 === 0) {
        weeks.push(
          <View key={'day-' + index} style={{ flexDirection: 'row', marginHorizontal: 32, justifyContent: 'space-around' }}>
            {days}
          </View>
        );
        weeks.push(<View key={`space-${index}`} style={{ height: 8 }} />);
        days = [];
      }
    });

    return weeks;
  };


  return (
    <View>
      <Text style={{ textAlign: 'center', fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>{`${calendarMonth.getFullYear()}년`}</Text>
      <View style={{ height: 8 }} />
      <View style={styles.MonthRow}>
        <Pressable style={styles.MonthBtn}
          onPress={decrementMonth} />
        <Text style={styles.MonthNumber}>
          {`${calendarMonth.getMonth() + 1}월`}
        </Text>
        <Pressable style={styles.MonthBtn}
          onPress={incrementMonth} />
      </View>
      <View style={{ height: 32 }} />
      <View>
        <View style={{ flexDirection: 'row', marginHorizontal: 32, justifyContent: 'space-around' }}>
          <Text style={styles.DayText}>월</Text>
          <Text style={styles.DayText}>화</Text>
          <Text style={styles.DayText}>수</Text>
          <Text style={styles.DayText}>목</Text>
          <Text style={styles.DayText}>금</Text>
          <Text style={styles.DayText}>토</Text>
          <Text style={styles.DayText}>일</Text>
        </View>
        <View style={{ height: 20 }} />
        {renderWeeks()}
        <View style={{ height: 8 }} />
      </View>
    </View>
  );
}

const ActivitiesList: React.FC<{ ActivitiesList: any[] }> = ({ ActivitiesList }) => {

  return (<ScrollView
    showsVerticalScrollIndicator={false}>
    {[1, 2, 3, 4].map(() => (<View>
      <View style={{ flexDirection: 'row', marginHorizontal: 24, marginVertical:12, alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 18, color: Color['grey700'] }}>{`모여서 악기쳐요`}</Text>
        <Text style={{ fontFamily: 'NanumSquareNeo-Light', fontSize: 14, color: Color['grey400'] }}>{`더 알아보기 >`}</Text>
      </View>
      <FlatList
        contentContainerStyle={{ marginVertical: 12 }}
        data={[1, 2, 3, 4]}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={() => (<View style={{ width: 24 }} />)}
        ListFooterComponent={() => (<View style={{ width: 24 }} />)}
        ItemSeparatorComponent={() => (<View style={{ width: 12 }} />)}
        renderItem={({ item }: { item: any }) => (
          <View style={{ width: 136, height: 160, borderWidth: 1, borderColor: Color['grey100'], borderRadius: 5 }}>

          </View>
        )}
      />
    </View>))}
  </ScrollView>)
}

const ActivitiesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {

  const [calendarView, setCalendarView] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <View style={{
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 24
      }}>
        <Pressable onPress={() => navigation.goBack()}
          style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 11, left: 22, width: 28, height: 28, backgroundColor: Color['grey300'] }}
        >
          <Text style={{
            fontFamily: "NanumSquareNeo-Bold",
            height: 24,
            color: Color['blue500'],
            fontSize: 18,
            textAlign: 'right',
            textAlignVertical: 'center'
          }}>{'<-'}</Text>
        </Pressable>
        <Pressable style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => setCalendarView(!calendarView)}>
          <Text style={{
            fontFamily: "NanumSquareNeo-Bold",
            color: Color['grey800'],
            fontSize: 20,
            marginRight: 8
          }}>{'활동 조회'}</Text>
          <View style={{ width: 24, height: 24, backgroundColor: calendarView ? Color['grey200'] : Color['blue200'] }} />
        </Pressable>
        <Pressable onPress={() => { }} style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 11, right: 22, height: 28, backgroundColor: Color['grey300'] }}>
          <Text style={{
            fontFamily: "NanumSquareNeo-Bold",
            height: 24,
            color: Color['blue500'],
            fontSize: 18,
            textAlign: 'right',
            textAlignVertical: 'center'
          }}>{`추가`}</Text>
        </Pressable>
      </View>
      {calendarView ?
        <View style={{ marginTop: 128 }}><Calendar onClickDate={(date) => { console.log(date) }} calendarDate={new Date()} /></View> : <ActivitiesList ActivitiesList={[]} />}
    </View >
  )
}

export default ActivitiesScreen

const styles = StyleSheet.create({
  MonthRow: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  MonthNumber: {
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: 4,
    fontFamily: 'NanumSquareNeo-Bold',
    color: Color['grey700']
  },
  MonthBtn: {
    width: 28,
    height: 28,
    backgroundColor: Color['blue500']
  },
  DayText: {
    width: 28,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'NanumSquareNeo-Bold',
    color: Color['grey500'],
  },
  CalendarText: {
    width: 28,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'NanumSquareNeo-Bold',
    color: Color['grey400'],
    marginVertical: 2,
  }
})