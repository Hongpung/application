import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { OwnedSessionCard } from '@hongpung/src/entities/session/ui/OwnedSessionCard/OwnedSessionCard';
import { Checkbox } from '@hongpung/src/common';
import { LongButton } from '@hongpung/src/common';
import { Color } from '@hongpung/src/common';
import { Session, ThisSessionState } from '@hongpung/src/entities/session';
import { useAtomValue } from 'jotai';

interface CheckOutConfirmWidgetProps {
  session: Session;
  onNext: () => void;
}

export const CheckOutConfirmWidget: React.FC<CheckOutConfirmWidgetProps> = ({
  onNext,
}) => {

  const  session  = useAtomValue(ThisSessionState);
  const [isAgree, setIsAgree] = useState(false);

  if (!session) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <OwnedSessionCard session={session} />
        <View style={styles.sessionInfo}>
          <View style={styles.checkboxContainer}>
            <Checkbox
              isChecked={isAgree}
              innerText="남은시간을 반납하여, 연습실 이용을 종료합니다."
              onCheck={setIsAgree}
            />
          </View>
          <LongButton
            color="red"
            innerContent="네, 종료할래요"
            isAble={isAgree}
            onPress={onNext}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sessionInfo: {
    marginTop: 24,
    gap: 16,
  },
  checkboxContainer: {
    marginBottom: 8,
  },
}); 