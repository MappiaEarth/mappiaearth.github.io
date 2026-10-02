/**
 * node script/post-images.js [name ...]
 *
 * The sizes the pages use of a card picture, from _img/posts/<name>.png (or .jpg) - for pictures
 * the gulp "img" task (gulp-responsive, which needs the native sharp module) does not make here:
 *
 *   assets/img/posts/<name>.jpg             hero of the example page, 1600 px wide
 *   assets/img/posts/<name>_thumb.jpg       card, 535 px
 *   assets/img/posts/<name>_thumb@2x.jpg    card on high-density screens, 1070 px
 *   assets/img/posts/<name>_placehold.jpg   lazy-loading placeholder, 230 px
 *
 * Every size is cut from the top of the picture, centred across, to the cards' shape (1.95:1) -
 * headless Chrome leaves a blank strip at the bottom of its screenshots. Only pictures
 * newer than their outputs are encoded, unless names are given. Uses Windows' System.Drawing
 * through PowerShell (the same as script/example-images.js).
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const SITE = path.join(__dirname, "..");
const SOURCE_DIR = path.join(SITE, "_img", "posts");
const OUTPUT_DIR = path.join(SITE, "assets", "img", "posts");
const ASPECT = 853 / 436; // the shape of the existing card pictures
const SIZES = [["", 1600], ["_thumb", 535], ["_thumb@2x", 1070], ["_placehold", 230]];

const wanted = process.argv.slice(2);
const jobs = fs.readdirSync(SOURCE_DIR)
    .filter((name) => /\.(png|jpg)$/i.test(name))
    .map((name) => ({ name: name.replace(/\.(png|jpg)$/i, ""), source: path.join(SOURCE_DIR, name) }))
    .filter((job) => wanted.length ? wanted.includes(job.name) : SIZES.some(([suffix]) => {
        const output = path.join(OUTPUT_DIR, `${job.name}${suffix}.jpg`);
        return !fs.existsSync(output) || fs.statSync(output).mtimeMs < fs.statSync(job.source).mtimeMs;
    }));

if (jobs.length === 0) {
    console.log("No card picture to encode.");
    process.exit(0);
}

const script = `
Add-Type -AssemblyName System.Drawing
$jobs = '${JSON.stringify(jobs).replace(/'/g, "''")}' | ConvertFrom-Json
$sizes = '${JSON.stringify(SIZES)}' | ConvertFrom-Json
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 82L
foreach ($job in $jobs) {
    $source = [System.Drawing.Image]::FromFile($job.source)
    $width = $source.Width; $height = [int]($width / ${ASPECT})
    if ($height -gt $source.Height) { $height = $source.Height; $width = [int]($height * ${ASPECT}) }
    $area = New-Object System.Drawing.Rectangle ([int](($source.Width - $width) / 2)), 0, $width, $height
    foreach ($size in $sizes) {
        $outWidth = [Math]::Min([int]$size[1], $width); $outHeight = [int]($outWidth / ${ASPECT})
        $bitmap = New-Object System.Drawing.Bitmap $outWidth, $outHeight
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.DrawImage($source, (New-Object System.Drawing.Rectangle 0, 0, $outWidth, $outHeight), $area, [System.Drawing.GraphicsUnit]::Pixel)
        $bitmap.Save((Join-Path '${OUTPUT_DIR.replace(/'/g, "''")}' ($job.name + $size[0] + '.jpg')), $codec, $params)
        $graphics.Dispose(); $bitmap.Dispose()
    }
    $source.Dispose()
    Write-Output ("  " + $job.name)
}
`;
console.log(`Encoding ${jobs.length} card picture(s) into ${path.relative(SITE, OUTPUT_DIR)}:`);
const result = spawnSync("powershell", ["-NoProfile", "-Command", script], { stdio: "inherit" });
process.exitCode = result.status || 0;
