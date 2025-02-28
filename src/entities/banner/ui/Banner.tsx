import React from 'react';
import { Pressable, Image } from 'react-native';

import { BannerDto } from '@hongpung/src/entities/banner';

interface BannerProps {
    banner: BannerDto;
    onBannerPress: (bannerUrl: string) => {}
}

const Banner: React.FC<BannerProps> = ({ banner, onBannerPress }) => {
    return (
        <Pressable style={{ flex: 1 }}
            onPress={() => banner.href && onBannerPress(banner.href)}>
            <Image src={banner.bannerImgUrl} style={{ height: 120, width: '100%', alignItems: 'center' }} resizeMode="cover" />
        </Pressable>
    );
};

export default Banner;