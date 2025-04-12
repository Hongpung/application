import React, { useRef, useEffect } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Icons } from '@hongpung/src/common/ui/icons/Icons';
import { Color } from '@src/common';
import { styles } from '../styles';


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

const SearchBar: React.FC<SearchBarProps> = ({
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
        <View style={styles.searchBarContainer}>
            <View style={styles.searchBar}>
                <TextInput
                    ref={searchInputRef}
                    onChangeText={value => debounceKeyword(value)}
                    style={styles.searchInput}
                />

                <Pressable
                    style={styles.searchCloseButton}
                    onPress={() => {
                        setSearchBarVisible(false);
                        setFindOptions(prev => ({ ...prev, username: '' }));
                    }}
                >
                    <Icons size={24} name={'close-circle'} color={Color['grey300']} />
                    
                </Pressable>
            </View>
        </View>
    );
};

export default SearchBar;
