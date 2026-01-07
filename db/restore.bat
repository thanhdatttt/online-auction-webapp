@echo off
echo === RESTORE AUCTIONDB ===

mongorestore ^
  --uri="mongodb://localhost:27017" ^
  --db auctiondb ^
  --drop ^
  dump\auctiondb

echo === DONE ===
pause
