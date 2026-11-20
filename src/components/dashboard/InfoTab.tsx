import { motion } from 'motion/react'
import { siteConfig } from '@/lib/config'
import type { DashboardUser } from '@/shared/types'

export default function InfoTab({ user }: { user: DashboardUser }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col max-w-[700px] w-[85vw] min-w-[296px] bg-base-200 text-accent rounded-2xl"
    >
      <div className="join join-vertical w-full">
        <div className="collapse collapse-arrow join-item border border-base-100">
          <input type="radio" name="info" defaultChecked />
          <div className="collapse-title text-xl font-medium">Format</div>
          <div className="collapse-content">
            <p className="text-center text-sm sm:text-base text-neutral">
              Ceremony → Refreshments →{' '}
              <span className="whitespace-nowrap">
                Cake & Coffee → Photos{user.dinner && <span className="text-secondary"> → Dinner</span>}
              </span>{' '}
            </p>
          </div>
        </div>
        <div className="collapse collapse-arrow join-item border border-base-100">
          <input type="radio" name="info" />
          <div className="collapse-title text-xl font-medium">Alcohol</div>
          <div className="collapse-content">
            <p className="text-sm sm:text-base text-neutral">
              We're having an alcohol-free wedding! Non-alcoholic refreshments will be available after the ceremony.
            </p>
          </div>
        </div>
        <div className="collapse collapse-arrow join-item border border-base-100">
          <input type="radio" name="info" />
          <div className="collapse-title text-xl font-medium">Children</div>
          <div className="collapse-content">
            <p className="text-sm sm:text-base text-neutral">
              Unfortunately, due to guest number restrictions, we are only able to extend this invite to the children of close family.
            </p>
          </div>
        </div>
        <div className="collapse collapse-arrow join-item border border-base-100">
          <input type="radio" name="info" />
          <div className="collapse-title text-xl font-medium">Dress Code</div>
          <div className="collapse-content">
            <p className="text-sm sm:text-base text-neutral">Semi-formal/Cocktail 🍸</p>
          </div>
        </div>
        {user.dinner && (
          <div className="collapse collapse-arrow join-item border border-base-100">
            <input type="radio" name="info" />
            <div className="collapse-title text-xl font-medium text-secondary">Dinner</div>
            <div className="collapse-content">
              <p className="text-center md:text-left text-sm sm:text-base text-neutral">
                You're invited to our exclusive <span className="whitespace-nowrap">family-&-friends reception dinner!</span>
                <br />
                <b>6:30pm in The Barn @ {siteConfig.venue}</b>
                <br />
                Please let us know if you have any dietary requirements.
              </p>
            </div>
          </div>
        )}
        <div className="collapse collapse-arrow join-item border border-base-100">
          <input type="radio" name="info" />
          <div className="collapse-title text-xl font-medium">Contact</div>
          <div className="collapse-content">
            <div className="text-sm sm:text-base text-neutral">
              Just DM one of us (
              <div className="tooltip" data-tip="josh">
                <a
                  className="link link-primary"
                  href={siteConfig.facebookLinks[0] ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  face
                </a>
              </div>
              •
              <div className="tooltip" data-tip="em">
                <a
                  className="link link-primary"
                  href={siteConfig.facebookLinks[1] ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  book
                </a>
              </div>{' '}
              or{' '}
              <div className="tooltip" data-tip="josh">
                <a
                  className="link link-primary"
                  href={siteConfig.instagramLinks[0] ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  insta
                </a>
              </div>
              •
              <div className="tooltip" data-tip="em">
                <a
                  className="link link-primary"
                  href={siteConfig.instagramLinks[1] ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  gram
                </a>
              </div>
              ), or{' '}
              <div className="tooltip" data-tip={siteConfig.email}>
                <a className="link link-primary" href={'mailto:' + siteConfig.email} target="_blank" rel="noopener noreferrer">
                  email
                </a>
              </div>{' '}
              here.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
