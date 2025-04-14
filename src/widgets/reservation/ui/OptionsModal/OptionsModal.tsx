import React from 'react';
import { Keyboard, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ShortButton } from '@hongpung/src/common/ui/buttons';
import { Color } from '@src/common';
import { clubNames } from '@hongpung/src/entities/club';

interface OptionsModalProps {
  visible: boolean;
  selectedClubs: string[];
  setClubsOption: React.Dispatch<React.SetStateAction<ClubName[]>>;
  selectedEnrollmentNumberRange: { startNumber?: string; endNumber?: string };
  setEnrollmentNumberRange: React.Dispatch<React.SetStateAction<{ startNumber?: string; endNumber?: string }>>;
  onClose: () => void;
  onApply: () => void;
}

const OptionsModal: React.FC<OptionsModalProps> = ({
  visible,
  selectedClubs,
  setClubsOption,
  selectedEnrollmentNumberRange,
  setEnrollmentNumberRange,
  onClose,
  onApply,
}) => {

  return (
    <Modal visible={visible} transparent>
      <Pressable style={styles.overlay} onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>옵션</Text>

            <Text style={styles.sectionTitle}>동아리</Text>
            <View style={styles.clubContainer}>
              <Pressable
                style={[styles.clubBox, selectedClubs.length === 0 && styles.selectedBox]}
                onPress={() => setClubsOption([])}>
                <Text style={[styles.clubText, selectedClubs.length === 0 && styles.selectedText]}>전체</Text>
              </Pressable>
              {clubNames.filter(club => club != '기타').map(club => {
                const isSelectedClub = selectedClubs.includes(club);

                return (
                  <Pressable
                    key={club}
                    style={[styles.clubBox, isSelectedClub && { borderColor: Color['blue500'], backgroundColor: Color['blue100'] }]}
                    onPress={() => {

                      if (!isSelectedClub && selectedClubs.length == 3) {
                        setClubsOption([])
                        return;
                      }

                      if (isSelectedClub)
                        setClubsOption(prev => prev.filter(sclub => sclub != club))
                      else
                        setClubsOption(prev => ([...prev, club]))

                    }}>
                    <Text style={[styles.clubText, isSelectedClub ? { color: Color['blue500'] } : { color: Color['grey600'] }]}>{club}</Text>
                  </Pressable>
                )
              })}
            </View>

            <Text style={styles.sectionTitle}>학번</Text>
            <View style={styles.enrollmentContainer}>
              <TextInput
                keyboardType="numeric"
                style={styles.input}
                value={selectedEnrollmentNumberRange.startNumber}
                onChangeText={(value) =>
                  setEnrollmentNumberRange((prev) => ({ ...prev, startNumber: value }))
                }
                placeholder="시작 학번"
              />
              <Text style={styles.rangeText}>~</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.input}
                value={selectedEnrollmentNumberRange.endNumber}
                onChangeText={(value) =>
                  setEnrollmentNumberRange((prev) => ({ ...prev, endNumber: value }))
                }
                placeholder="끝 학번"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <ShortButton color="blue" isFilled={false} innerContent="초기화" onPress={onClose} />
            <ShortButton color="blue" isFilled innerContent="적용" onPress={onApply} />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContainer: {
    marginHorizontal: 24,
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 10,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'NanumSquareNeo-Bold',
    fontSize: 16,
    color: Color['grey700'],
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'NanumSquareNeo-Bold',
    fontSize: 16,
    color: Color['grey700'],
    marginVertical: 8,
  },
  clubContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  clubBox: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Color['grey200'],
  },
  selectedBox: {
    borderColor: Color['blue500'],
    backgroundColor: Color['blue100'],
  },
  clubText: {
    fontFamily: 'NanumSquareNeo-Regular',
    color: Color['grey600'],
  },
  selectedText: {
    color: Color['blue500'],
  },
  enrollmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: Color['grey200'],
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: Color['grey100'],
  },
  rangeText: {
    fontFamily: 'NanumSquareNeo-Regular',
    fontSize: 16,
    color: Color['grey600'],
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
});

export default OptionsModal;