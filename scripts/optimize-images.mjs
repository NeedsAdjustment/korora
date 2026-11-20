import { mkdir, readdir, rename, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const imagesDir = path.join(root, 'public', 'images')
const outputFile = path.join(root, 'src', 'data', 'gallery.json')
const maxDimension = 2400
const quality = 82
const skipBelowBytes = 2.5 * 1024 * 1024

const files = (await readdir(imagesDir))
  .filter((file) => /\.(jpe?g)$/i.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

if (files.length === 0) {
  console.error('No JPEG images found in public/images')
  process.exit(1)
}

await mkdir(path.dirname(outputFile), { recursive: true })

const gallery = []
let originalBytes = 0
let optimizedBytes = 0

for (const file of files) {
  const fullPath = path.join(imagesDir, file)
  const before = await stat(fullPath)
  originalBytes += before.size

  const metadata = await sharp(fullPath).metadata()
  const needsResize =
    (metadata.width ?? 0) > maxDimension || (metadata.height ?? 0) > maxDimension
  const needsCompression = before.size > skipBelowBytes

  let outputPath = fullPath

  if (needsResize || needsCompression) {
    const tempPath = `${fullPath}.tmp`
    const pipeline = sharp(fullPath)
      .rotate()
      .resize({
        width: maxDimension,
        height: maxDimension,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality, mozjpeg: true, progressive: true })

    await pipeline.toFile(tempPath)
    await rename(tempPath, fullPath)
    outputPath = fullPath
  }

  const after = await stat(outputPath)
  optimizedBytes += after.size

  const outputMetadata = await sharp(outputPath).metadata()
  const blurBuffer = await sharp(outputPath)
    .resize({ width: 24, withoutEnlargement: true })
    .jpeg({ quality: 45 })
    .toBuffer()

  gallery.push({
    src: `/images/${file}`,
    width: outputMetadata.width,
    height: outputMetadata.height,
    blurDataURL: `data:image/jpeg;base64,${blurBuffer.toString('base64')}`,
  })

  const saved = Math.max(0, before.size - after.size)
  console.log(
    `${file}: ${(before.size / 1024 / 1024).toFixed(1)} MB -> ${(after.size / 1024 / 1024).toFixed(1)} MB (saved ${(saved / 1024 / 1024).toFixed(1)} MB)`,
  )
}

await writeFile(outputFile, `${JSON.stringify(gallery, null, 2)}\n`, 'utf8')

console.log(
  `\nWrote ${gallery.length} entries to ${path.relative(root, outputFile)}. Total ${(originalBytes / 1024 / 1024).toFixed(1)} MB -> ${(optimizedBytes / 1024 / 1024).toFixed(1)} MB.`,
)
