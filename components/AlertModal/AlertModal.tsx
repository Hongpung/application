import React, { useState } from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import LongButton from '@hongpung/components/buttons/LongButton'

type AlertModalType = React.FC<{
    title: string
    content: string
    triggerNode: React.ReactElement
    initialVisible?: boolean
}> & {
    Title: typeof Title;
    Content: typeof Content;
    Button: typeof Button;
};

export const AlertModal: AlertModalType = ({ title, content, triggerNode, initialVisible = false }) => {

    const [isOpen, setOpen] = useState(initialVisible)

    return (
        <React.Fragment>
            <Pressable onPress={() => setOpen(true)} style={{ width: '100%' }}>
                {triggerNode}
            </Pressable>
            <Modal visible={isOpen} transparent>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center' }}>
                    <View style={{ marginHorizontal: 24, paddingVertical: 16, backgroundColor: '#FFF', display: 'flex', gap: 16, borderRadius: 20 }}>
                        <AlertModal.Title title={title}></AlertModal.Title>
                        <AlertModal.Content content={content} />
                        <AlertModal.Button onPress={() => setOpen(false)} />
                    </View></View>
            </Modal>
        </React.Fragment>

    )
}

interface TitleProps {
    title: string
}

const Title: React.FC<TitleProps> = ({ title }) => {

    return (
        <Text style={{
            paddingHorizontal: 24,
            paddingVertical: 8,
            width: '100%',
            fontFamily: 'NanumSquareNeo-Bold',
            fontSize: 16,
        }}>
            {title}
        </Text>
    )
}

interface ContentProps {
    content: string
}
const Content: React.FC<ContentProps> = ({ content }) => {

    return (
        <Text style={{
            width: '100%',
            fontFamily: 'NanumSquareNeo-Regular',
            textAlign: 'left',
            paddingHorizontal: 24,
            paddingVertical: 8,
            lineHeight: 20,
            fontSize: 14
        }}>
            {content}
        </Text>
    )
}

interface ButtonProps {
    onPress: () => void
}
const Button: React.FC<ButtonProps> = ({ onPress }) => {

    return (
        <>
            <LongButton color='blue' innerText='확인' isAble onPress={onPress} />
        </>
    )
}

AlertModal.Title = Title;
AlertModal.Content = Content;
AlertModal.Button = Button