#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp -r /Users/umutilhan/Documents/karakaya_website /Users/umutilhan/Backups/karakaya_$DATE
echo "Backup erstellt: karakaya_$DATE"
