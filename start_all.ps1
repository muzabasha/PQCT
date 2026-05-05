# Start Backend
Start-Process -NoNewWindow -FilePath "powershell.exe" -ArgumentList "-Command `"cd backend; .\venv\Scripts\activate; uvicorn main:app --host 0.0.0.0 --port 8000 --reload`""

# Start Frontend
Start-Process -NoNewWindow -FilePath "powershell.exe" -ArgumentList "-Command `"cd frontend; npm run dev`""

Write-Host "Backend starting on http://localhost:8000"
Write-Host "Frontend starting on http://localhost:3000"
