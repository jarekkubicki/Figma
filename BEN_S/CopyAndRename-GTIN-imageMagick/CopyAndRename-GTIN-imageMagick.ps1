$Folder = "C:\Users\kubic\Downloads\mars_test"
$ptPattern = '_PT0([1-8])'

# zbierz tylko JPG/JPEG z folderu (bez Recurse)
$files = Get-ChildItem -LiteralPath $Folder -File |
         Where-Object { $_.Extension -in ('.jpg','.jpeg','.JPG','.JPEG') }

# jeśli chcesz przetwarzać tylko nazwy z _PT01.._PT08:
$files = $files | Where-Object { $_.BaseName -imatch $ptPattern }

"Znaleziono plików do przeróbki: {0}" -f $files.Count
if ($files.Count -eq 0) { return }

foreach ($f in $files) {
    $base = $f.BaseName

    # --- NADPISZ JPG: 3000x3000 @ 300 DPI ---
    $tmpJ = Join-Path $Folder ("__tmp_" + [System.IO.Path]::GetRandomFileName() + ".jpg")
    magick $f.FullName `
        -resize 3000x3000^ -gravity center -extent 3000x3000 `
        -units PixelsPerInch -density 300 `
        -colorspace sRGB -strip -quality 92 `
        $tmpJ
    Move-Item -Force $tmpJ $f.FullName

    # --- TIF: 5000x5000 @ 300 DPI + rename _PT0x -> _T6x ---
    $tifName = ($base -ireplace $ptPattern, '_T6$1') + ".tif"
    $tifPath = Join-Path $Folder $tifName
    $tmpT = Join-Path $Folder ("__tmp_" + [System.IO.Path]::GetRandomFileName() + ".tif")
    magick $f.FullName `
        -resize 5000x5000^ -gravity center -extent 5000x5000 `
        -units PixelsPerInch -density 300 `
        -colorspace sRGB -strip -compress LZW `
        $tmpT
    Move-Item -Force $tmpT $tifPath
}
"Gotowe ✅  (JPG nadpisane; TIF utworzone z nazwą _T6x)"
