import { StyleSheet, View, Image, Dimensions, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header';
import { Color } from '../../ColorSet';

const { width, height } = Dimensions.get('window');

const ChatMediaViewerScreen: React.FC<{ route: any }> = ({ route }) => {
    const { images, selectedImgId }: { images: { user: string, id: string, uri: string, originHeight: number, originWidth: number }[], selectedImgId: string } = route.params;

    const [selectedIndex, setSelectIndex] = useState(0);
    const [image, setImage] = useState<{ user: string, id: string, uri: string, originHeight: number, originWidth: number } | null>(null);

    useEffect(() => {
        const index = images.findIndex(image => image.id == selectedImgId);
        applyIndex(index);
    }, [])

    const applyIndex = async (index: number) => {
        setSelectIndex(index);
        setImage(images[selectedIndex])
    }

    useEffect(() => {
        setImage(images[selectedIndex])
    }, [selectedIndex])
    return (
        <View style={{ flex: 1 }}>
            <Header leftButton='X' HeaderName={image?.user} />
            <View style={styles.container}>
                {image &&
                    <Image
                        source={{ uri: image.uri }}
                        style={{
                            width: width, // 화면의 너비에 맞춤
                            height: (image.originHeight / image.originWidth) * width, // 비율에 따라 높이 조정
                        }}
                    />}
                <View
                    style={{ position: 'absolute', bottom: 4 }}
                >
                    <FlatList
                        horizontal
                        data={images}
                        renderItem={({ item, index }) => {
                            return (
                                <Pressable
                                    key={item.id+item.user}
                                    onPress={() => {
                                        applyIndex(index);
                                    }}>
                                    <Image
                                        source={{ uri: item.uri }}
                                        style={[{
                                            width: 75, // 화면의 너비에 맞춤
                                            height: 75, // 비율에 따라 높이 조정
                                        }, item == image && { borderWidth: 4, borderColor: Color['blue400'] }]}></Image>
                                </Pressable>)
                        }}
                        ItemSeparatorComponent={() => <View style={{ width: 4 }} />}
                    />
                </View>
            </View>
        </View>

    );
};


export default ChatMediaViewerScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});