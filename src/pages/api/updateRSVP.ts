import { prisma } from '../../prisma'

export default async (req, res) => {
  console.log(req.body)
  const { firstName, lastName, RSVP, RSVPOthersYes, RSVPOthersNo, RSVPDate } = req.body
  console.log(RSVP)
  try {
    const updateRSVP = await prisma.user.update({
      where: {
        fullName: {
          firstName: firstName,
          lastName: lastName,
        },
      },
      data: {
        RSVP: RSVP,
        RSVPOthersYes: RSVPOthersYes,
        RSVPOthersNo: RSVPOthersNo,
        RSVPDate: RSVPDate,
      },
    })
    res.status(200).json(updateRSVP)
  } catch (error) {
    res.status(400).json({ message: "Couldn't update RSVP" })
  }
}
