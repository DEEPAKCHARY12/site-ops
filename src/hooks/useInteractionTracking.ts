import { useCallback } from 'react';
import { interactionApi } from '../utils/api';

export const useInteractionTracking = () => {
    const trackInteraction = useCallback((elementId: string, actionType: string, metadata?: any) => {
        interactionApi.logInteraction({
            element_id: elementId,
            action_type: actionType,
            metadata_json: metadata ? JSON.stringify(metadata) : undefined,
        });
    }, []);

    return { trackInteraction };
};
