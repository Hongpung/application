// import React, { useState } from "react";
// import { View, StyleSheet, Text } from "react-native";
// import { OwnedSessionCard } from "@hongpung/src/entities/session/ui/OwnedSessionCard/OwnedSessionCard";
// import { Alert, Checkbox } from "@hongpung/src/common";
// import { LongButton } from "@hongpung/src/common";
// import { Color } from "@hongpung/src/common";
// import { CheckOutStepProps } from "@hongpung/src/features/session/checkOutRoom/model/types";
// import { StepProps } from "@hongpung/react-step-flow";

// type CheckOutConfirmProps = StepProps<CheckOutStepProps, "CheckOutConfirm">;

// export const CheckOutConfirmWidget: React.FC<CheckOutConfirmProps> = ({
//   stepProps: { session },
//   goTo,
// }) => {
//   const onNext = () => {
//     Alert.confirm("종료 알림", "연습실 이용을 종료합니다.", {
//       onConfirm: () => {
//         goTo("CheckOutDescription");
//       },
//     });
//   };
//   if (!session) return null;

//   return (
//     <View style={styles.container}>
//       <View style={styles.content}>
//         <OwnedSessionCard session={session} />
//         <View style={styles.sessionInfo}>
//           <Text
//             style={{
//               fontFamily: "NanumSquareNeo-Regular",
//               color: Color["grey700"],
//               fontSize: 18,
//               textAlign: "center",
//               lineHeight: 24,
//             }}
//           >
//             <Text
//               style={{
//                 fontFamily: "NanumSquareNeo-Bold",
//                 color: Color["blue500"],
//               }}
//             >
//               {session.title}
//             </Text>
//             {"의 이용을\n 지금 종료할까요?"}
//           </Text>
//         </View>
//       </View>
//       <View style={{ paddingHorizontal: 8, gap: 16 }}>
//         <LongButton
//           color="red"
//           innerContent="네, 종료할래요"
//           onPress={onNext}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     flex: 1,
//     backgroundColor: "#FFF",
//   },
//   content: {
//     paddingHorizontal: 16,
//     justifyContent: "center",
//     flex: 1,
//   },
//   sessionInfo: {
//     gap: 16,
//   },
//   checkboxContainer: {
//     paddingHorizontal: 28,
//   },
// });
