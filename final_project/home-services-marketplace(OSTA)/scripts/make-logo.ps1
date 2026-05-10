Add-Type -AssemblyName System.Drawing

function New-OstaLogo {
  param(
    [string]$OutPath,
    [int]$Size = 512,
    [bool]$IncludeText = $true
  )

  $bmp = New-Object System.Drawing.Bitmap $Size, $Size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.PixelOffsetMode = 'HighQuality'
  $g.TextRenderingHint = 'AntiAliasGridFit'
  $g.Clear([System.Drawing.Color]::Transparent)

  $navy   = [System.Drawing.Color]::FromArgb(255, 30, 58, 95)
  $orange = [System.Drawing.Color]::FromArgb(255, 249, 115, 22)
  $white  = [System.Drawing.Color]::White
  $black  = [System.Drawing.Color]::FromArgb(255, 13, 17, 23)

  $navyBrush   = New-Object System.Drawing.SolidBrush $navy
  $orangeBrush = New-Object System.Drawing.SolidBrush $orange
  $whiteBrush  = New-Object System.Drawing.SolidBrush $white
  $blackBrush  = New-Object System.Drawing.SolidBrush $black
  $navyPen     = New-Object System.Drawing.Pen $navy, ($Size / 50.0)

  $scale = $Size / 512.0

  # Coordinates in 512-space then scaled
  $cx = 256.0 * $scale
  $cy = 200.0 * $scale
  if (-not $IncludeText) { $cy = 256.0 * $scale }

  $rOuter = 175.0 * $scale
  $rInner = 145.0 * $scale
  $teeth  = 12

  # Build gear polygon (alternating outer/inner)
  $pts = New-Object System.Collections.ArrayList
  $steps = $teeth * 2
  for ($i = 0; $i -lt $steps; $i++) {
    $ang = ($i / [double]$steps) * 2 * [Math]::PI - [Math]::PI / 2
    $r = if ($i % 2 -eq 0) { $rOuter } else { $rInner }
    $px = $cx + $r * [Math]::Cos($ang)
    $py = $cy + $r * [Math]::Sin($ang)
    [void]$pts.Add((New-Object System.Drawing.PointF([float]$px, [float]$py)))
  }
  $g.FillPolygon($navyBrush, $pts.ToArray())

  # White hole
  $hole = 105.0 * $scale
  $g.FillEllipse($whiteBrush, [float]($cx - $hole), [float]($cy - $hole), [float]($hole * 2), [float]($hole * 2))
  $g.DrawEllipse($navyPen, [float]($cx - $hole), [float]($cy - $hole), [float]($hole * 2), [float]($hole * 2))

  # Orange house
  $hw = 70.0 * $scale
  $hh = 90.0 * $scale
  $hroof = 60.0 * $scale
  $housePts = @(
    (New-Object System.Drawing.PointF([float]($cx - $hw), [float]($cy + 30 * $scale))),
    (New-Object System.Drawing.PointF([float]($cx),       [float]($cy - $hroof))),
    (New-Object System.Drawing.PointF([float]($cx + $hw), [float]($cy + 30 * $scale))),
    (New-Object System.Drawing.PointF([float]($cx + $hw), [float]($cy + 75 * $scale))),
    (New-Object System.Drawing.PointF([float]($cx - $hw), [float]($cy + 75 * $scale)))
  )
  $g.FillPolygon($orangeBrush, $housePts)

  # Navy door
  $g.FillRectangle($navyBrush,
    [float]($cx - 22 * $scale),
    [float]($cy + 25 * $scale),
    [float](44 * $scale),
    [float](50 * $scale))

  if ($IncludeText) {
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center

    $titleFont = New-Object System.Drawing.Font("Arial Black", [float](78 * $scale), [System.Drawing.FontStyle]::Bold)
    $g.DrawString("OSTA", $titleFont, $navyBrush, [float]$cx, [float](400 * $scale), $sf)

    $tagFont = New-Object System.Drawing.Font("Arial", [float](18 * $scale), [System.Drawing.FontStyle]::Regular)
    $g.DrawString("Home Services", $tagFont, $blackBrush, [float]$cx, [float](482 * $scale), $sf)

    $titleFont.Dispose()
    $tagFont.Dispose()
  }

  $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()

  Write-Output ("Wrote: {0} ({1} bytes)" -f $OutPath, ((Get-Item $OutPath).Length))
}

$root = Split-Path -Parent $PSScriptRoot
if (-not $root) { $root = Resolve-Path "$PSScriptRoot\.." }
$publicDir = Join-Path $root "public"

New-OstaLogo -OutPath (Join-Path $publicDir "logo.png")      -Size 512 -IncludeText $true
New-OstaLogo -OutPath (Join-Path $publicDir "logo-mark.png") -Size 256 -IncludeText $false
