import { clubNames, Selector } from "@hongpung/src/common"
import { Pressable, StyleSheet, View } from "react-native"
import { ClubSelectorLabel } from "./ClubSelectorLabel"


interface ClubSelectorProps {
    label: string
    value: string | null
    onChange: React.Dispatch<string>,
    isErrored: boolean
    errorText: string
    dropDownVisible: boolean
    setDropDownVisible: React.Dispatch<boolean>,
}


export const ClubSelector: React.FC<ClubSelectorProps> = ({
    label,
    value,
    onChange,
    isErrored,
    dropDownVisible,
    errorText,
    setDropDownVisible
}) => {

    const handleSelect = (newValue: string) => {
        onChange(newValue);
        setDropDownVisible(false);
    };

    return (
        <View style={styles.container}>
            <Selector
                label={label}
                onChange={handleSelect}
                value={value}
                options={clubNames}
                visible={dropDownVisible}
                setVisible={setDropDownVisible}
                trigger={Pressable}
                color="green"
            >
                <ClubSelectorLabel
                    label={label}
                    value={value}
                    isErrored={isErrored}
                    errorText={errorText}
                    onPress={() => setDropDownVisible(!dropDownVisible)}
                >
                    {value || label}
                </ClubSelectorLabel>
            </Selector>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    }
})
