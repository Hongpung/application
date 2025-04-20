import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { LongButton } from "../buttons/LongButton";

type AlertButtonType = React.FC<{
  title: string;
  content: string;
  triggerNode: React.ReactElement;
  initialVisible?: boolean;
}> & {
  Title: typeof Title;
  Content: typeof Content;
  Button: typeof Button;
};

export const AlertButton: AlertButtonType = ({
  title,
  content,
  triggerNode,
  initialVisible = false,
}) => {
  const [isOpen, setOpen] = useState(initialVisible);

  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={{ width: "100%" }}>
        {triggerNode}
      </Pressable>
      <Modal visible={isOpen} transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.2)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              marginHorizontal: 24,
              paddingVertical: 16,
              backgroundColor: "#FFF",
              display: "flex",
              gap: 16,
              borderRadius: 20,
            }}
          >
            <AlertButton.Title title={title}></AlertButton.Title>
            <AlertButton.Content content={content} />
            <AlertButton.Button onPress={() => setOpen(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
};

interface TitleProps {
  title: string;
}

const Title: React.FC<TitleProps> = ({ title }) => {
  return (
    <Text
      style={{
        paddingHorizontal: 24,
        paddingVertical: 8,
        width: "100%",
        fontFamily: "NanumSquareNeo-Bold",
        fontSize: 16,
      }}
    >
      {title}
    </Text>
  );
};

interface ContentProps {
  content: string;
}
const Content: React.FC<ContentProps> = ({ content }) => {
  return (
    <Text
      style={{
        width: "100%",
        fontFamily: "NanumSquareNeo-Regular",
        textAlign: "left",
        paddingHorizontal: 24,
        paddingVertical: 8,
        lineHeight: 20,
        fontSize: 14,
      }}
    >
      {content}
    </Text>
  );
};

interface ButtonProps {
  onPress: () => void;
}
const Button: React.FC<ButtonProps> = ({ onPress }) => {
  return (
    <>
      <LongButton color="blue" innerContent="확인" isAble onPress={onPress} />
    </>
  );
};

AlertButton.Title = Title;
AlertButton.Content = Content;
AlertButton.Button = Button;
