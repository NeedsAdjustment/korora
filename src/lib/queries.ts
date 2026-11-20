import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from './api'
import type { RsvpInput } from '@/shared/schemas'
import type { GiftsResponse, MeResponse, Rsvp } from '@/shared/types'

export const queryKeys = {
  me: ['me'] as const,
  gifts: ['gifts'] as const,
}

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => apiRequest<MeResponse>('/api/me'),
    retry: false,
  })
}

export function useGifts() {
  return useQuery({
    queryKey: queryKeys.gifts,
    queryFn: () => apiRequest<GiftsResponse>('/api/gifts'),
    retry: false,
  })
}

export function useSaveRsvp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: RsvpInput) =>
      apiRequest<{ rsvp: Rsvp }>('/api/rsvp', {
        method: 'PUT',
        body: input,
      }),
    onSuccess: ({ rsvp }) => {
      queryClient.setQueryData<MeResponse>(queryKeys.me, (current) =>
        current ? { user: { ...current.user, rsvp } } : current,
      )
    },
  })
}

export function useUpdateGift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reserved }: { id: string; reserved: boolean }) =>
      apiRequest<{ gift: { id: string; reserved: boolean; reservedByMe: boolean } }>(
        `/api/gifts/${encodeURIComponent(id)}`,
        {
          method: 'PATCH',
          body: { reserved },
        },
      ),
    onSuccess: ({ gift }) => {
      queryClient.setQueryData<GiftsResponse>(queryKeys.gifts, (current) =>
        current
          ? {
              gifts: current.gifts.map((item) =>
                item.id === gift.id
                  ? {
                      ...item,
                      reserved: gift.reserved,
                      reservedByMe: gift.reservedByMe,
                    }
                  : item,
              ),
            }
          : current,
      )
    },
  })
}
