import { useState } from 'react';
import { debounce } from 'lodash';
import { clubIdsMap } from '@hongpung/src/entities/club';

export type FindOptions = {
    username: string;
    club: ClubName[];
    enrollmentNumberRange: {
        startNumber?: string;
        endNumber?: string;
    };
};

export const useParticipatorsFilters = () => {
    const [findOptions, setFindOptions] = useState<FindOptions>({ username: '', club: [], enrollmentNumberRange: {} });
    const [descendingOrder, setDescendingOrder] = useState(true);
    const [selectedClubs, setClubsOption] = useState<ClubName[]>([]);
    const [selectedEnrollmentNumberRange, setEnrollmentNumberRange] = useState<{ startNumber?: string, endNumber?: string }>({});

    const debounceKeyword = debounce((value: string) => {
        setFindOptions(prev => ({ ...prev, username: value }));
    }, 800);

    const handleApplyFilters = () => {
        setFindOptions((prev) => ({
            ...prev,
            club: selectedClubs,
            enrollmentNumberRange: selectedEnrollmentNumberRange,
        }));
    };

    const handleResetFilters = () => {
        setFindOptions((prev) => ({ ...prev, club: [], enrollmentNumberRange: {} }));
        setClubsOption([]);
        setEnrollmentNumberRange({});
    };

    const filterParams = {
        clubId: findOptions.club.filter(club => club !== '기타').map(club => clubIdsMap[club]) as number[],
        keyword: findOptions.username,
    };

    return {
        findOptions,
        setFindOptions,
        descendingOrder,
        setDescendingOrder,
        selectedClubs,
        setClubsOption,
        selectedEnrollmentNumberRange,
        setEnrollmentNumberRange,
        debounceKeyword,
        handleApplyFilters,
        handleResetFilters,
        filterParams,
    };
};
