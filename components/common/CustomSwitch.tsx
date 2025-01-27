import { Animated, View, StyleSheet, Pressable } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import { Color } from '../../ColorSet'
import { PanGestureHandler, State } from 'react-native-gesture-handler';

/**
 * must use GestureHandlerRootView
 * @param onChange
 * @param value 
 * @returns 
 */

const CustomSwitch: React.FC<{ onChange: (value: boolean) => void, value: boolean }> = ({ onChange, value }) => {
    const translateX = useRef(new Animated.Value(value ? 40 : 0)).current;
    const width = useRef(new Animated.Value(36)).current;
    const [isPressing, setPressing] = useState(false);


    const gestureHandler = useCallback(Animated.event(
        [{ nativeEvent: { translationX: translateX } },],
        { useNativeDriver: false }
    ), []);

    const onPressHandler = useCallback(() => {
        Animated.timing(translateX, {
            toValue: value ? -40 : 40,
            duration: 400,
            useNativeDriver: false,
        }).start(() => {
            onChange(!value);
        });
    }, [value])

    const stateChangeHandler = useCallback((event: any) => {

        const newState = event.nativeEvent.state;

        if (newState === State.ACTIVE) {
            setPressing(true);
            Animated.timing(width, {
                toValue: 44,
                duration: 200,
                useNativeDriver: false,
            }).start();
        } else {
            setPressing(false);
            Animated.timing(width, {
                toValue: 36,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }

        if (event.nativeEvent.oldState === State.ACTIVE) {
            const newX = event.nativeEvent.translationX;
            const threshold = value ? -16 : 16;

            if (newX <= threshold && value) {
                Animated.timing(translateX, {
                    toValue: -40,
                    duration: 300,
                    useNativeDriver: false,
                }).start(() => {
                    onChange(false);
                });
            } else if (newX > threshold && value) {
                if (newX >= -8)
                    Animated.sequence([Animated.timing(translateX, {
                        toValue: -8,
                        duration: 0,
                        useNativeDriver: false,
                    }), Animated.timing(translateX, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: false,
                    })])
                        .start(() => {
                            onChange(true);
                        });
                else Animated.timing(translateX, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                }).start(() => {
                    onChange(true);
                });
            } else if (newX >= threshold) {
                if (newX >= 32)
                    Animated.sequence([Animated.timing(translateX, {
                        toValue: 32,
                        duration: 0,
                        useNativeDriver: false,
                    }), Animated.timing(translateX, {
                        toValue: 40,
                        duration: 300,
                        useNativeDriver: false,
                    })])
                        .start(() => {
                            onChange(true);
                        });
                else
                    Animated.timing(translateX, {
                        toValue: 40,
                        duration: 300,
                        useNativeDriver: false,
                    }).start(() => {
                        onChange(true);
                    });
            } else if (newX < threshold) {
                Animated.timing(translateX, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                }).start(() => {
                    onChange(false);
                });
            }
        }
    }, [value]);

    return (
        <Pressable style={{ flexDirection: 'row' }} onPress={onPressHandler}>
            <View style={styles.switchContainer}>
                <View
                    style={[
                        styles.switchBackground,
                        { backgroundColor: value ? Color['blue400'] : Color['grey300'] },
                    ]}
                />
                    <Animated.View
                        style={[
                            styles.switchHandle,
                            { width },
                            isPressing ?
                                value ? {
                                    transform: [{
                                        translateX: translateX.interpolate({
                                            inputRange: [-32, 0],
                                            outputRange: [4, 32],
                                            extrapolate: 'clamp',
                                        })
                                    }],
                                } :
                                    {
                                        transform: [{
                                            translateX: translateX.interpolate({
                                                inputRange: [0, 32],
                                                outputRange: [4, 32],
                                                extrapolate: 'clamp',
                                            })
                                        }],
                                    } :
                                value ?
                                    {
                                        transform: [{
                                            translateX: translateX.interpolate({
                                                inputRange: [-40, 0],
                                                outputRange: [4, 40],
                                                extrapolate: 'clamp',
                                            })
                                        }],
                                    } :
                                    {
                                        transform: [{
                                            translateX: translateX.interpolate({
                                                inputRange: [0, 40],
                                                outputRange: [4, 40],
                                                extrapolate: 'clamp',
                                            })
                                        }],
                                    }
                        ]}
                    />
            </View>
        </Pressable>
    );
};


export default CustomSwitch

const styles = StyleSheet.create({
    switchContainer: {
        width: 80,
        height: 42,
        borderRadius: 20,
        justifyContent: 'center',
    },
    switchBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    switchHandle: {
        position: 'absolute',
        height: 36,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderColor: Color['grey200'],
        borderWidth: 1,
    },
});
