import { StyleSheet, Text, Pressable } from 'react-native'
import React from 'react';
import { Color } from '../../ColorSet';

export type LongButtonProps={
    innerText:String,
    onPress:Function,
    isAble:boolean,
    color:String
}

const LongButton: React.FC<LongButtonProps> = ({innerText, onPress, isAble, color}) => {
    return (
        <Pressable
            style={[styles.basic,{backgroundColor: isAble?Color[color+"500"]:Color[color+"300"]}]}
            onPress={()=>onPress()}
        >
            <Text style={[styles.basicText,{color: !isAble?Color[color+"100"]:'white'}]}>{innerText}</Text>
        </Pressable>
    )
}

export default LongButton

const styles = StyleSheet.create({
    basic:{
        height:56,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:15,
        width:320
    },basicText:{
        fontSize:16,
        fontWeight:500,
        textAlign:'center'
    }
})