import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, VideoClue, ImageClue, AudioClue, Answer } from '../backend';
import { ExternalBlob } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUploadVideoClue() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoBlob: ExternalBlob) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadVideoClue(videoBlob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoClues'] });
    },
  });
}

export function useUploadImageClue() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageBlob: ExternalBlob) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadImageClue(imageBlob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imageClues'] });
    },
  });
}

export function useUploadAudioClue() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (audioBlob: ExternalBlob) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadAudioClue(audioBlob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audioClues'] });
    },
  });
}

export function useGenerateAnswer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ imageClueIds, riddleText }: { imageClueIds: bigint[]; riddleText: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.generateAnswer(imageClueIds, riddleText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['answers'] });
    },
  });
}

export function useGetVideoClue(clueId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<VideoClue | null>({
    queryKey: ['videoClue', clueId?.toString()],
    queryFn: async () => {
      if (!actor || !clueId) return null;
      return actor.getVideoClue(clueId);
    },
    enabled: !!actor && !actorFetching && clueId !== null,
  });
}

export function useGetImageClue(clueId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ImageClue | null>({
    queryKey: ['imageClue', clueId?.toString()],
    queryFn: async () => {
      if (!actor || !clueId) return null;
      return actor.getImageClue(clueId);
    },
    enabled: !!actor && !actorFetching && clueId !== null,
  });
}

export function useGetAudioClue(clueId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AudioClue | null>({
    queryKey: ['audioClue', clueId?.toString()],
    queryFn: async () => {
      if (!actor || !clueId) return null;
      return actor.getAudioClue(clueId);
    },
    enabled: !!actor && !actorFetching && clueId !== null,
  });
}

export function useGetAnswer(answerId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Answer | null>({
    queryKey: ['answer', answerId?.toString()],
    queryFn: async () => {
      if (!actor || !answerId) return null;
      return actor.getAnswer(answerId);
    },
    enabled: !!actor && !actorFetching && answerId !== null,
  });
}
