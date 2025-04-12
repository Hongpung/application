import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { type Member } from "@hongpung/src/entities/member";
import Header from "@hongpung/src/common/ui/header/Header";
import ParticipatorList from "@hongpung/src/widgets/reservation/ui/ParticipatorList/ParticipatorList";

const ParticipatorListViewPage: React.FC<ReservationStackProps<'ReservationParticipatorsView'>> = ({ navigation, route }) => {

    const { participators: participatorData } = route.params
    const participators = (JSON.parse(participatorData) as Member[]).sort((a, b) => Number(a.enrollmentNumber) - Number(b.enrollmentNumber));

    return (
        <View style={styles.container}>
            <Header
                leftButton={'close'}
                HeaderName='참여 인원 목록'
            />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <ParticipatorList participators={participators} />
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
    },
    scrollContainer: {
        backgroundColor: "#fff",
    },
    listContainer: {
        flex: 1,
    },
    cardContainer: {
        marginVertical: 8,
        marginHorizontal: 24,
    },
});

export default ParticipatorListViewPage;
