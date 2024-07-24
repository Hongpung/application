
import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { useNavigation } from "@react-navigation/native";
import { Color } from '../ColorSet';

type HeaderProps ={
    leftButton:string ,HeaderName?:string, RightButton?:string
}

const Header:React.FC<HeaderProps> = ({leftButton ,HeaderName, RightButton}) => {
    const navigation = useNavigation();

    return (
        <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', paddingHorizontal: 24 }}>
            <Pressable onPress={() => navigation.goBack()} style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 11, left: 22, width: 28, height: 28, marginRight: 10, backgroundColor: Color['grey300'] }}>
                <Text style={{ width: 24, height: 24, color: Color['blue500'], fontSize: 18, textAlign: 'center', textAlignVertical: 'center' }}>{leftButton}</Text>
            </Pressable>
            <Text style={{ color: Color['grey800'], fontSize: 20, fontWeight: 'bold' }}>{HeaderName}</Text>
        </View>
    );
};


export default Header;


const styles = StyleSheet.create({})