Add-Type -AssemblyName System.Drawing

function New-Hero {
    param(
        [string]$Out,
        [int[]]$Bg,
        [int[]]$Ac,
        [string]$Lbl,
        [string]$Pat
    )

    $w = 1200
    $h = 630
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background: dark diagonal gradient
    $pt1 = New-Object System.Drawing.PointF([float]0, [float]0)
    $pt2 = New-Object System.Drawing.PointF([float]$w, [float]$h)
    $c1 = [System.Drawing.Color]::FromArgb(255, [int]([Math]::Max(0, $Bg[0] * 0.5)), [int]([Math]::Max(0, $Bg[1] * 0.5)), [int]([Math]::Max(0, $Bg[2] * 0.5)))
    $c2 = [System.Drawing.Color]::FromArgb(255, $Bg[0], $Bg[1], $Bg[2])
    $bgBr = New-Object System.Drawing.Drawing2D.LinearGradientBrush($pt1, $pt2, $c1, $c2)
    $g.FillRectangle($bgBr, [float]0, [float]0, [float]$w, [float]$h)
    $bgBr.Dispose()

    # Accent glow on right side (radial simulation via concentric ellipses)
    for ($i = 5; $i -ge 1; $i--) {
        $r = 65 * $i
        $cx = $w - 210
        $cy = $h / 2
        $alpha = [int](18 * (6 - $i))
        $eb = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($alpha, $Ac[0], $Ac[1], $Ac[2]))
        $g.FillEllipse($eb, [float]($cx - $r), [float]($cy - $r), [float]($r * 2), [float]($r * 2))
        $eb.Dispose()
    }

    # Shape brushes
    $sb = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, $Ac[0], $Ac[1], $Ac[2]))
    $sp = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(55, $Ac[0], $Ac[1], $Ac[2]), [float]1.5)

    switch ($Pat) {
        "circles" {
            $items = @(
                @(900, 200, 200),
                @(1055, 308, 168),
                @(790, 362, 140),
                @(998, 456, 110),
                @(866, 516, 90)
            )
            foreach ($it in $items) {
                $r2 = [float]$it[2]
                $x  = [float]($it[0] - $it[2] / 2)
                $y  = [float]($it[1] - $it[2] / 2)
                $g.FillEllipse($sb, $x, $y, $r2, $r2)
                $g.DrawEllipse($sp, $x, $y, $r2, $r2)
            }
        }
        "grid" {
            for ($row = 0; $row -lt 6; $row++) {
                for ($col = 0; $col -lt 5; $col++) {
                    $px = [float](752 + $col * 88)
                    $py = [float](68 + $row * 85)
                    $g.FillRectangle($sb, $px, $py, [float]68, [float]60)
                    $g.DrawRectangle($sp, $px, $py, [float]68, [float]60)
                }
            }
        }
        "bars" {
            $hs = @(168, 278, 196, 338, 150, 294, 220)
            for ($i = 0; $i -lt 7; $i++) {
                $px = [float](758 + $i * 64)
                $bh = [float]$hs[$i]
                $py = [float]($h - 72 - $hs[$i])
                $g.FillRectangle($sb, $px, $py, [float]44, $bh)
                $g.DrawRectangle($sp, $px, $py, [float]44, $bh)
            }
        }
        "lines" {
            $lp = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(44, $Ac[0], $Ac[1], $Ac[2]), [float]3)
            for ($i = 0; $i -lt 13; $i++) {
                $sx = [float](695 + $i * 48)
                $g.DrawLine($lp, $sx, [float]0, $sx + [float]190, [float]$h)
            }
            $lp.Dispose()
        }
        "dots" {
            $nodes = @(
                @(822, 148), @(952, 198), @(1062, 144),
                @(902, 290), @(1112, 310),
                @(802, 402), @(972, 432), @(1078, 476),
                @(852, 542), @(1002, 557)
            )
            $cp = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(36, $Ac[0], $Ac[1], $Ac[2]), [float]1.5)
            for ($i = 0; $i -lt $nodes.Count; $i++) {
                for ($j = $i + 1; $j -lt $nodes.Count; $j++) {
                    $dx = [Math]::Abs($nodes[$i][0] - $nodes[$j][0])
                    $dy = [Math]::Abs($nodes[$i][1] - $nodes[$j][1])
                    if ($dx -lt 225 -and $dy -lt 225) {
                        $g.DrawLine($cp, [float]$nodes[$i][0], [float]$nodes[$i][1], [float]$nodes[$j][0], [float]$nodes[$j][1])
                    }
                }
            }
            $cp.Dispose()
            foreach ($n in $nodes) {
                $g.FillEllipse($sb, [float]($n[0] - 15), [float]($n[1] - 15), [float]30, [float]30)
                $g.DrawEllipse($sp, [float]($n[0] - 15), [float]($n[1] - 15), [float]30, [float]30)
            }
        }
        "cards" {
            $cp2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(62, $Ac[0], $Ac[1], $Ac[2]), [float]1.5)
            $ib  = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(42, 255, 255, 255))
            $cardPos = @(
                @(778, 88),  @(838, 145), @(778, 210), @(838, 268),
                @(778, 332), @(838, 390), @(778, 452), @(838, 508)
            )
            foreach ($p in $cardPos) {
                $g.FillRectangle($sb,  [float]$p[0], [float]$p[1], [float]344, [float]50)
                $g.DrawRectangle($cp2, [float]$p[0], [float]$p[1], [float]344, [float]50)
                $g.FillRectangle($ib,  [float]($p[0] + 10), [float]($p[1] + 13), [float]74, [float]7)
                $g.FillRectangle($ib,  [float]($p[0] + 10), [float]($p[1] + 31), [float]130, [float]5)
            }
            $cp2.Dispose()
            $ib.Dispose()
        }
        "twocircles" {
            $sb2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(32, $Ac[0], $Ac[1], $Ac[2]))
            $g.FillEllipse($sb2, [float]732, [float]108, [float]310, [float]310)
            $g.DrawEllipse($sp,  [float]732, [float]108, [float]310, [float]310)
            $g.FillEllipse($sb2, [float]876, [float]202, [float]302, [float]302)
            $g.DrawEllipse($sp,  [float]876, [float]202, [float]302, [float]302)
            $sb2.Dispose()
        }
        "screens" {
            $sp3 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(62, $Ac[0], $Ac[1], $Ac[2]), [float]1.5)
            $screenPos = @(
                @(782, 58),  @(822, 132), @(762, 212),
                @(818, 288), @(772, 366), @(822, 442), @(776, 512)
            )
            foreach ($p in $screenPos) {
                $g.FillRectangle($sb,  [float]$p[0], [float]$p[1], [float]374, [float]53)
                $g.DrawRectangle($sp3, [float]$p[0], [float]$p[1], [float]374, [float]53)
            }
            $sp3.Dispose()
        }
    }

    $sb.Dispose()
    $sp.Dispose()

    # Subtle grid overlay
    $gp = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(9, 255, 255, 255), [float]0.5)
    for ($x = 0; $x -lt $w; $x += 40) { $g.DrawLine($gp, [float]$x, [float]0, [float]$x, [float]$h) }
    for ($y = 0; $y -lt $h; $y += 40) { $g.DrawLine($gp, [float]0, [float]$y, [float]$w, [float]$y) }
    $gp.Dispose()

    # Left vignette (darker reading zone)
    $vpt1 = New-Object System.Drawing.PointF([float]0, [float]0)
    $vpt2 = New-Object System.Drawing.PointF([float]570, [float]0)
    $vb = New-Object System.Drawing.Drawing2D.LinearGradientBrush($vpt1, $vpt2, [System.Drawing.Color]::FromArgb(70, 0, 0, 0), [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
    $g.FillRectangle($vb, [float]0, [float]0, [float]570, [float]$h)
    $vb.Dispose()

    # Top accent bar
    $apt1 = New-Object System.Drawing.PointF([float]0, [float]0)
    $apt2 = New-Object System.Drawing.PointF([float]$w, [float]0)
    $a1 = [System.Drawing.Color]::FromArgb(255, $Ac[0], $Ac[1], $Ac[2])
    $a2 = [System.Drawing.Color]::FromArgb(255, [Math]::Min(255, $Ac[0] + 45), [Math]::Min(255, $Ac[1] + 35), [Math]::Min(255, $Ac[2] + 75))
    $ab = New-Object System.Drawing.Drawing2D.LinearGradientBrush($apt1, $apt2, $a1, $a2)
    $g.FillRectangle($ab, [float]0, [float]0, [float]$w, [float]7)
    $ab.Dispose()

    # Wordmark bottom-left
    $f1 = New-Object System.Drawing.Font("Segoe UI", [float]12, [System.Drawing.FontStyle]::Bold)
    $f2 = New-Object System.Drawing.Font("Segoe UI", [float]9,  [System.Drawing.FontStyle]::Regular)
    $wb = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(208, 255, 255, 255))
    $gb = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(128, 255, 255, 255))
    $g.DrawString("CIN NOVA", $f1, $wb, [float]48, [float]($h - 72))
    $g.DrawString($Lbl.ToUpper(), $f2, $gb, [float]48, [float]($h - 47))
    $f1.Dispose(); $f2.Dispose(); $wb.Dispose(); $gb.Dispose()

    # Save JPEG quality 88
    $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $ep  = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]88)
    $bmp.Save($Out, $enc, $ep)
    $ep.Dispose(); $g.Dispose(); $bmp.Dispose()
    Write-Host "Created: $(Split-Path $Out -Leaf)"
}

# ID 1 — How AI Is Transforming Education
New-Hero "d:\CinNovaWebSite\public\images\education\ai-transforming-education-classroom.jpg" @(49,27,90) @(139,92,246) "Education Technology" "circles"

# ID 2 — The Hidden Infrastructure Behind ChatGPT and AI
New-Hero "d:\CinNovaWebSite\public\images\ai\chatgpt-infrastructure-data-center.jpg" @(15,38,120) @(59,130,246) "Artificial Intelligence" "grid"

# ID 3 — Why Data Centers Are Becoming the New Gold Rush
New-Hero "d:\CinNovaWebSite\public\images\datacenters\data-center-gold-rush-facility.jpg" @(10,62,78) @(8,180,220) "Data Centers" "grid"

# ID 4 — The Companies Building the AI Economy
New-Hero "d:\CinNovaWebSite\public\images\ai\ai-economy-companies-tech-stack.jpg" @(26,38,130) @(80,90,235) "Artificial Intelligence" "bars"

# ID 5 — Can America's Power Grid Handle AI?
New-Hero "d:\CinNovaWebSite\public\images\datacenters\power-grid-ai-electricity-demand.jpg" @(100,40,5) @(245,158,11) "Data Centers & Power" "lines"

# ID 6 — The Rise of AI Tutors and Personalized Learning
New-Hero "d:\CinNovaWebSite\public\images\education\ai-tutor-personalized-learning-dashboard.jpg" @(37,20,75) @(124,58,237) "Education Technology" "cards"

# ID 7 — How AI Is Changing Real Estate Investing
New-Hero "d:\CinNovaWebSite\public\images\real-estate\ai-real-estate-investing-deal-analysis.jpg" @(5,50,40) @(16,185,129) "Real Estate Technology" "bars"

# ID 8 — AI in Construction and Engineering
New-Hero "d:\CinNovaWebSite\public\images\construction\ai-construction-engineering-jobsite.jpg" @(100,35,5) @(234,88,12) "Construction Technology" "lines"

# ID 9 — Robotics and Automation in 2026
New-Hero "d:\CinNovaWebSite\public\images\robotics\robotics-automation-warehouse-2026.jpg" @(22,32,50) @(100,116,139) "Robotics & Automation" "grid"

# ID 10 — The Technology Trends That Will Shape the Next Decade
New-Hero "d:\CinNovaWebSite\public\images\future-tech\technology-trends-next-decade-overview.jpg" @(25,22,70) @(99,102,241) "Future Technology" "dots"

# ID 11 — Why AI Tutors Are Not Replacing Teachers
New-Hero "d:\CinNovaWebSite\public\images\education\ai-tutor-teacher-classroom-partnership.jpg" @(55,7,95) @(168,85,247) "Education Technology" "twocircles"

# ID 12 — The Science Behind Spaced Repetition and Learning
New-Hero "d:\CinNovaWebSite\public\images\education\spaced-repetition-flashcard-study-schedule.jpg" @(28,22,80) @(99,102,241) "Education Technology" "cards"

# ID 13 — How Students Can Study Smarter With AI
New-Hero "d:\CinNovaWebSite\public\images\education\student-studying-smarter-ai-tools.jpg" @(22,32,100) @(79,70,229) "Education Technology" "dots"

# ID 14 — The Future of Online Education Platforms
New-Hero "d:\CinNovaWebSite\public\images\education\online-education-platform-adaptive-learning.jpg" @(40,10,85) @(139,92,246) "Education Technology" "screens"

# ID 15 — How StudyNest Is Reimagining Learning
New-Hero "d:\CinNovaWebSite\public\images\education\studynest-connected-learning-workspace.jpg" @(18,25,75) @(79,70,229) "Education Technology" "dots"

Write-Host "All 15 hero images generated."
