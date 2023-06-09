import { prisma } from '../../prisma'

export default async (req, res) => {
  try {
    const reserveGift = await prisma.gift.update({
      where: {
        id: req.body,
      },
      data: {
        userId: req.body,
      },
    })
    res.status(200).json(reserveGift)
  } catch (error) {
    res.status(400).json({ message: "Couldn't reserve gift" })
  }
}
