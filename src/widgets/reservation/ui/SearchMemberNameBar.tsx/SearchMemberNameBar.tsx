import React, { useRef, useEffect } from 'react';
import { Pressable, TextInput, View, StyleSheet } from 'react-native';
import { Color, Icons } from '@hongpung/src/common';


type FindOptions = {
    username: string;
    club: ClubName[];
    enrollmentNumberRange: {
        startNumber?: string;
        endNumber?: string;
    };
};

interface SearchBarProps {
    searchBarVisible: boolean;
    setSearchBarVisible: (value: boolean) => void;
    setFindOptions: React.Dispatch<React.SetStateAction<FindOptions>>;
    debounceKeyword: (value: string) => void;
}

const SearchMemberNameBar: React.FC<SearchBarProps> = ({
    searchBarVisible,
    setSearchBarVisible,
    setFindOptions,
    debounceKeyword,
}) => {
    const searchInputRef = useRef<TextInput | null>(null);

    useEffect(() => {
        if (searchBarVisible) {
            searchInputRef.current?.focus();
        }
    }, [searchBarVisible]);

    if (!searchBarVisible) return null;

    return (
        <View style={styles.container}>
            <View style={styles.searchBox}>
                <TextInput
                    ref={searchInputRef}
                    onChangeText={value => { debounceKeyword(value); }}
                    style={styles.input}
                >
                </TextInput>
                <Pressable style={styles.closeButton}
                    onPress={() => { setSearchBarVisible(false); setFindOptions(prev => ({ ...prev, username: '' })) }}>
                    <Icons size={24} name={'close-circle'} color={Color['grey300']} />
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color['grey100'],
        paddingHorizontal: 24,
        paddingVertical: 8,
    },
    searchBox: {
        backgroundColor: '#fff',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        paddingHorizontal: 12,
        fontSize: 16,
        height: 32,
        flex: 1,
    },
    closeButton: {
        height: 36,
        width: 36,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SearchMemberNameBar;
