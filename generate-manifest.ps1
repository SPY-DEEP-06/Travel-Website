$imgList = [System.Collections.Generic.List[string]]::new()
$destHash = [ordered]@{}

$files = Get-ChildItem -Path "images/national", "images/international" -Recurse -File
foreach ($f in $files) {
    $norm = $f.FullName.Replace("\", "/")
    $idx = $norm.IndexOf("images/")
    if ($idx -ge 0) {
        $imgList.Add($norm.Substring($idx))
    }
}

$dirs = Get-ChildItem -Path "images/national", "images/international" -Directory
foreach ($d in $dirs) {
    $fn = $d.Name
    $subFiles = [System.Collections.Generic.List[string]]::new()
    $dfiles = Get-ChildItem -Path $d.FullName -Recurse -File
    foreach ($df in $dfiles) {
        $norm = $df.FullName.Replace("\", "/")
        $idx = $norm.IndexOf("images/")
        if ($idx -ge 0) {
            $subFiles.Add($norm.Substring($idx))
        }
    }
    $destHash[$fn] = $subFiles
}

$mediaObj = [ordered]@{
    images = $imgList
    destinations = $destHash
    videos = @()
}

$json = $mediaObj | ConvertTo-Json -Depth 5
$outContent = "window.ttcMedia = " + $json + ";"
[System.IO.File]::WriteAllText((Join-Path (Get-Location) "media-manifest.js"), $outContent, [System.Text.Encoding]::UTF8)
Write-Host "Updated media-manifest.js successfully with $($imgList.Count) images and $($destHash.Count) destination folders."
