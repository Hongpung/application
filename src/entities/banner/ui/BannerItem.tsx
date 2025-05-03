import React from 'react';
import { Pressable } from 'react-native';
import { Image } from 'expo-image'

import { Banner } from '../model/type'

interface BannerItemProps {
    banner: Banner;
    onBannerPress: (bannerUrl: string) => void
}

const BannerItem: React.FC<BannerItemProps> = (props) => {

    const { banner, onBannerPress } = props

    return (
        <Pressable style={{ flex: 1 }}
            onPress={() => banner.href && onBannerPress(banner.href)}>
            <Image source={banner.bannerImgUrl} style={{ height: 120, width: '100%', alignItems: 'center' }} contentFit="cover" cachePolicy="memory-disk" />
        </Pressable>
    );
};

export { BannerItem };