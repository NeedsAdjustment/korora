import { useState } from 'react'
import classNames from 'classnames'
import { motion } from 'motion/react'
import { siteConfig } from '@/lib/config'
import { useUpdateGift } from '@/lib/queries'
import type { Gift } from '@/shared/types'

const currency = new Intl.NumberFormat('en-NZ', {
  style: 'currency',
  currency: 'NZD',
  maximumFractionDigits: 0,
})

export default function GiftsTab({ gifts }: { gifts: Gift[] }) {
  const updateGift = useUpdateGift()
  const [error, setError] = useState<string | null>(null)

  const toggleGift = (gift: Gift) => {
    setError(null)
    updateGift.mutate(
      { id: gift.id, reserved: !gift.reservedByMe },
      {
        onError: (mutationError) => {
          setError(mutationError instanceof Error ? mutationError.message : 'Could not update the gift.')
        },
      },
    )
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center items-center max-w-[700px] w-[85vw] min-w-[296px] bg-base-200 text-accent rounded-2xl"
    >
      <div className="font-medium text-xl text-center tracking-wide p-10">
        <span className="text-neutral">Your presence at our wedding is more than enough!</span>
        <br />
        <br />
        If you'd like to help us celebrate with a gift, we've set up a few funds to help us get started in our new life together:
        <div className="flex flex-col place-items-center py-10 md:flex-row">
          <div className="grid h-32 min-w-[60%] w-64 card bg-base-300 rounded-box place-items-center md:flex-1 md:min-w-0">
            <p className="text-neutral h-1">home & living</p>
            <p className="text-sm">
              {siteConfig.fund}-<span className="text-secondary">003</span> <br />
              Joshua Soong
            </p>
          </div>
          <div className="divider before:bg-accent after:bg-accent md:divider-horizontal" />
          <div className="grid h-32 min-w-[60%] w-64 card bg-base-300 rounded-box place-items-center md:flex-1 md:min-w-0">
            <p className="text-neutral h-1">honeymoon</p>
            <p className="text-sm">
              {siteConfig.fund}-<span className="text-secondary">004</span> <br />
              Joshua Soong
            </p>
          </div>
        </div>
        {gifts.length > 0 && (
          <div className="mb-8">
            <p className="mb-4 text-base sm:text-lg text-neutral">Or pick something from our registry:</p>
            <ul className="space-y-3 text-left">
              {gifts.map((gift) => {
                const pending = updateGift.isPending && updateGift.variables?.id === gift.id

                return (
                  <li
                    key={gift.id}
                    className="flex flex-col gap-3 rounded-box bg-base-300 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-medium text-neutral">{gift.name}</p>
                      <p className="text-sm text-neutral/70">{currency.format(gift.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {gift.link && (
                        <a
                          className="btn btn-ghost btn-sm font-display"
                          href={gift.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      )}
                      <button
                        type="button"
                        className={classNames(
                          'btn btn-sm font-display',
                          gift.reservedByMe ? 'btn-ghost' : 'btn-secondary',
                        )}
                        disabled={(gift.reserved && !gift.reservedByMe) || pending}
                        onClick={() => toggleGift(gift)}
                      >
                        {pending && <span className="loading loading-infinity loading-xs" />}
                        {!pending && (gift.reservedByMe ? 'Release' : gift.reserved ? 'Reserved' : 'Reserve')}
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
            {error && (
              <div className="mt-4 flex justify-center">
                <div className="badge badge-error font-light h-auto whitespace-normal py-2 text-center">{error}</div>
              </div>
            )}
          </div>
        )}
        We'll also have a <span className="text-secondary">wishing well</span> and table set up at the wedding if you'd like to give us a card or gift in person.
      </div>
    </motion.div>
  )
}
