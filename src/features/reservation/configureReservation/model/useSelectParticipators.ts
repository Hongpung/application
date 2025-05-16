import { useCallback, useState } from 'react';

import { Member } from '@hongpung/src/entities/member';

export const useSelectParticipators = (initialParticipators: Member[]) => {

    const [newParticipators, setNewParticipators] = useState<Member[]>(initialParticipators);

    const toggleParticipator = useCallback((member: Member) => {
        if (newParticipators.some(participator => participator.memberId === member.memberId)) {
            setNewParticipators(prev => prev.filter(participator => participator.memberId !== member.memberId))
        } else {
            setNewParticipators(prev => [...prev, member])
        }
    }, [newParticipators])
    
    return {
        newParticipators,
        setNewParticipators,
        toggleParticipator
    };

};
