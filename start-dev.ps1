Set-Location "C:\Users\Devendraprasad\Downloads\One-Piece-main\One-Piece-main"
$logFile = Join-Path $PWD ".next\dev-server-output.txt"
npm run dev 2>&1 | Out-File $logFile
