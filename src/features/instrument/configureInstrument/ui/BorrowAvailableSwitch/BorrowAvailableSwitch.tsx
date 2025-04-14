import { View, Text, StyleSheet } from 'react-native'
import { Switch } from '@hongpung/src/common'
import { Instrument } from '@hongpung/src/entities/instrument'

interface BorrowAvailableSwitchProps {
    instrument: Instrument
    setInstrument: React.Dispatch<React.SetStateAction<Instrument>>
}

export const BorrowAvailableSwitch:React.FC<BorrowAvailableSwitchProps> = ({ instrument, setInstrument }: BorrowAvailableSwitchProps) => {
    return (
        <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>대여 가능 여부</Text>
            <Switch
                value={instrument.borrowAvailable}
                onChange={(value) => setInstrument(prev => ({ ...prev, borrowAvailable: value }))}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    switchLabel: {
        fontSize: 16,
        color: '#333',
    },
}) 