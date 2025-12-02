import EventEmitter from "@/utils/EventEmitter";
import { useEffect, useMemo } from "react";

export const useTagInputEvents = (
    setStateAPI: {
        addTag: (tags: string[], tag: string) => void;
        setActiveSuggestion: (index: number) => void;
        setShowSuggestions: (show: boolean) => void;
        removeTag: (tags: string[], index: number) => void;
    },
) => {
    const eventEmitter = useMemo(() => new EventEmitter(), []);

    useEffect(() => {
      eventEmitter.on('Enter', (payload) => {
          if (payload.inputValue.trim()) {
              if (payload.activeSuggestion >= 0 && payload.suggestions[payload.activeSuggestion]) {
                  setStateAPI.addTag(payload.tags, payload.suggestions[payload.activeSuggestion].name);
              } else {
                  setStateAPI.addTag(payload.tags, payload.inputValue);
              }
          }
      });

      eventEmitter.on('ArrowDown', (payload) => {
          setStateAPI.setActiveSuggestion(Math.min(payload.activeSuggestion + 1, payload.suggestions.length - 1));
      });

      eventEmitter.on('ArrowUp', (payload) => {
          setStateAPI.setActiveSuggestion(Math.max(payload.activeSuggestion - 1, -1));
      });

      eventEmitter.on('Escape', () => {
          setStateAPI.setShowSuggestions(false);
          setStateAPI.setActiveSuggestion(-1);
      });

      eventEmitter.on('Backspace', (payload) => {
          if (payload.inputValue === '' && payload.tags.length > 0) {
              setStateAPI.removeTag(payload.tags, payload.tags.length - 1);
          }
      });

      return () => {
          eventEmitter.removeAllListeners();
      };
    }, []);

    return eventEmitter;
}
