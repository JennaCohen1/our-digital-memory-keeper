#!/bin/bash
echo "=== Repo Status Check ==="
git fetch origin
git status
echo ""
echo "=== Latest Remote Commit ==="
git log origin/main -1 --format="%H %s %ai"
