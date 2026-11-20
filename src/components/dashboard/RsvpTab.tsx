import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import classNames from 'classnames'
import { motion } from 'motion/react'
import { useForm, useWatch } from 'react-hook-form'
import { useSaveRsvp } from '@/lib/queries'
import { rsvpFormSchema, type RsvpFormValues } from '@/shared/schemas'
import type { DashboardUser } from '@/shared/types'

export default function RsvpTab({ user }: { user: DashboardUser }) {
  const saveRsvp = useSaveRsvp()
  const [editing, setEditing] = useState(false)
  const [othersRsvp, setOthersRsvp] = useState(
    Boolean(user.rsvp.othersAttending || user.rsvp.othersNotAttending),
  )
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: {
      attending: user.rsvp.attending === null ? '' : String(user.rsvp.attending),
      othersAttending: user.rsvp.othersAttending ?? '',
      othersNotAttending: user.rsvp.othersNotAttending ?? '',
    },
  })

  const attending = useWatch({ control, name: 'attending' })
  const hasSelected = attending === 'true' || attending === 'false'
  const hasRsvp = user.rsvp.attending !== null
  const showForm = !hasRsvp || editing

  const onSubmit = handleSubmit(async (values) => {
    setError(null)

    try {
      await saveRsvp.mutateAsync({
        attending: values.attending === 'true',
        othersAttending: othersRsvp ? values.othersAttending : null,
        othersNotAttending: othersRsvp ? values.othersNotAttending : null,
      })
      setEditing(false)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not save your RSVP.')
    }
  })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col max-w-[700px] w-[85vw] min-w-[296px] py-8 bg-base-200 text-accent rounded-2xl"
    >
      {!showForm ? (
        <>
          <p
            className={classNames(
              'mx-5 mb-5 justify-center font-medium text-xl text-center tracking-wide',
              !user.rsvp.othersAttending && !user.rsvp.othersNotAttending && 'mb-0',
            )}
          >
            {user.rsvp.attending ? 'Thank you for RSVPing!' : 'Thank you for letting us know!'}
          </p>
          <div className="flex justify-center">
            <button
              type="button"
              className="btn btn-secondary btn-sm mt-2 font-display font-bold tracking-wider"
              onClick={() => setEditing(true)}
            >
              Update RSVP
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={onSubmit} autoComplete="off" className="flex flex-1 items-center justify-center">
          <motion.div layout className="flex flex-col">
            <div className="flex flex-row items-center gap-2 sm:gap-3 w-[75vw] max-w-[575px] min-w-[270px] mb-3">
              <p>1.</p>
              <select
                {...register('attending')}
                className="select rsvp-select grow"
                aria-invalid={errors.attending ? true : undefined}
              >
                <option value="" disabled className={classNames(hasSelected && 'hidden')}>
                  Confirm your attendance
                </option>
                <option value="true">I&apos;ll be there!</option>
                <option value="false">I won&apos;t be able to make it.</option>
              </select>
            </div>
            {errors.attending?.message && (
              <div className="flex justify-center mb-3">
                <div className="badge badge-error font-light">{errors.attending.message}</div>
              </div>
            )}
            <div
              className={classNames(
                'flex flex-row gap-2 sm:gap-3 w-[75vw] max-w-[575px] min-w-[270px] mb-3',
                !hasSelected && 'hidden',
              )}
            >
              <p className="leading-[40px] md:leading-[48px]">2.</p>
              <div className="flex-col w-full">
                <div className="flex-row label rsvp-others-label cursor-pointer mb-3">
                  <span className="label-text text-xs sm:text-sm md:text-base">I'm RSVPing on behalf of others</span>
                  <input
                    type="checkbox"
                    checked={othersRsvp}
                    className="checkbox ml-auto text-accent md:checkbox-xl"
                    onChange={(event) => setOthersRsvp(event.target.checked)}
                  />
                </div>
                <div className={classNames('flex flex-row items-center gap-2 sm:gap-3 mb-3', !othersRsvp && 'hidden')}>
                  <p>✓</p>
                  <input
                    {...register('othersAttending')}
                    className="input rsvp-input grow"
                    type="text"
                    placeholder="Who is attending?"
                  />
                </div>
                <div className={classNames('flex flex-row items-center gap-2 sm:gap-3 mb-3', !othersRsvp && 'hidden')}>
                  <p>✗</p>
                  <input
                    {...register('othersNotAttending')}
                    className="input rsvp-input grow"
                    type="text"
                    placeholder="Who is not attending?"
                  />
                </div>
              </div>
            </div>
            <button
              className={classNames(
                'btn btn-secondary mt-2 font-display font-bold tracking-wider',
                !hasSelected && 'hidden',
              )}
              type="submit"
              disabled={saveRsvp.isPending}
            >
              {(saveRsvp.isPending && <span className="loading loading-infinity loading-sm"></span>) || 'RSVP'}
            </button>
            {error && (
              <div className="flex justify-center mt-2">
                <div className="badge badge-error font-light h-auto whitespace-normal py-2 text-center">{error}</div>
              </div>
            )}
          </motion.div>
        </form>
      )}
    </motion.div>
  )
}
