# Database Clear Scripts - Quick Reference

## 🚀 Quick Commands

```bash
# Development - Fast clear (no prompts)
npm run db:clear:quick

# Safe clear with backup
npm run db:clear:backup

# Clear with confirmation
npm run db:clear

# Clear specific collection
npm run db:clear:users
npm run db:clear:groups
npm run db:clear:transactions

# Clear all except settings
npm run db:clear:except-settings
```

## 📋 Script Comparison

| Script | Confirmation | Backup | Speed | Use Case |
|--------|-------------|--------|-------|----------|
| `quickClear.js` | ❌ No | ❌ No | ⚡ Fast | Development |
| `clearDatabase.js` | ✅ Yes | ❌ No | 🐢 Slow | Production-safe |
| `backupAndClear.js` | ❌ No | ✅ Yes | 🐌 Slowest | Data preservation |

## 🎯 When to Use Each Script

### quickClear.js
- ✅ Local development
- ✅ Testing
- ✅ Quick resets
- ❌ Never in production

### clearDatabase.js
- ✅ Production (with caution)
- ✅ Selective clearing
- ✅ When you need control
- ✅ Audit trail needed

### backupAndClear.js
- ✅ Development with data preservation
- ✅ Before major changes
- ✅ When you might need to restore
- ✅ Testing migrations

## 💡 Pro Tips

1. **Always backup production data externally** before clearing
2. **Use `--except=settings`** to preserve system configuration
3. **Check backups directory** after using backupAndClear.js
4. **Test scripts in development** before using in production
5. **Document why you're clearing** in your team chat/logs

## 🔥 Emergency Commands

```bash
# Quick clear everything NOW (development only!)
npm run db:clear:quick

# Clear with backup (safer)
npm run db:clear:backup

# Clear everything except settings
npm run db:clear:except-settings
```

## 📞 Need Help?

See the full [README.md](./README.md) for detailed documentation.
