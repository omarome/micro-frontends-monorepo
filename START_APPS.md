# 🚀 Starting the Micro-Frontends Monorepo

## ⚠️ Important: Startup Order

Module Federation requires **remote apps to be running before host apps** can import their components.

### **Correct Startup Order:**

```
1. MRT Table App (Remote)  → Port 3003
2. Payment App (Remote)    → Port 3002  
3. Invoice App (Host)      → Port 3001  
4. Shell App (Host)        → Port 3000
```

---

## 📋 Step-by-Step Instructions

### **Option 1: Start All at Once (Recommended)**

```bash
cd /Users/omaral-mashhadanimac/Desktop/repos/micro-frontends-monorepo
pnpm start
```

This automatically starts all apps in parallel.

---

### **Option 2: Start Individually (For Debugging)**

#### **Step 1: Start Remote Apps First**

**Terminal 1 - MRT Table (Remote):**
```bash
cd /Users/omaral-mashhadanimac/Desktop/repos/micro-frontends-monorepo/apps/mrt_table_app
pnpm start
```

Wait for: `✔ webpack compiled successfully`

**Terminal 2 - Payment App (Remote):**
```bash
cd /Users/omaral-mashhadanimac/Desktop/repos/micro-frontends-monorepo/apps/payment_app
pnpm start
```

Wait for: `✔ webpack compiled successfully`

---

#### **Step 2: Start Host Apps**

**Terminal 3 - Invoice App (Host - consumes MRT Table):**
```bash
cd /Users/omaral-mashhadanimac/Desktop/repos/micro-frontends-monorepo/apps/invoice_app
pnpm start
```

**Terminal 4 - Shell App (Host - orchestrates all):**
```bash
cd /Users/omaral-mashhadanimac/Desktop/repos/micro-frontends-monorepo/apps/shell_app
pnpm start
```

---

## 🔧 Troubleshooting

### **Error: "Can't resolve 'mrt_table_app/TableComponent'"**

**Cause:** Invoice App is trying to load MRT Table, but it's not running yet.

**Solution:**
1. Stop all running apps (`Ctrl+C` in each terminal)
2. Start MRT Table App first (Terminal 1)
3. Wait for it to compile successfully
4. Then start Invoice App

---

### **Error: Module Federation errors**

**Solution: Clear cache and restart**

```bash
# Stop all apps (Ctrl+C in each terminal)

# Clean all build artifacts
cd /Users/omaral-mashhadanimac/Desktop/repos/micro-frontends-monorepo
rm -rf apps/*/dist
rm -rf apps/*/node_modules/.cache

# Restart in correct order:
# 1. mrt_table_app
# 2. payment_app  
# 3. invoice_app
# 4. shell_app
```

---

### **Backend API (Optional)**

If you need the backend for invoice data:

**Terminal 5 - Backend:**
```bash
cd /Users/omaral-mashhadanimac/Desktop/repos/micro-frontends-monorepo/backend
npm start
```

Port: `http://localhost:4000`

---

## ✅ Verify Everything is Running

After starting all apps, check:

- ✅ MRT Table: http://localhost:3003
- ✅ Payment App: http://localhost:3002
- ✅ Invoice App: http://localhost:3001
- ✅ Shell App: http://localhost:3000
- ✅ Backend API: http://localhost:4000

---

## 🎯 Quick Reference

| App | Port | Type | Depends On |
|-----|------|------|------------|
| MRT Table | 3003 | Remote | - |
| Payment | 3002 | Remote | - |
| Invoice | 3001 | Host | MRT Table |
| Shell | 3000 | Host | All remotes |
| Backend | 4000 | API | - |

---

## 💡 Pro Tips

1. **Always start remotes before hosts**
2. **Use `pnpm start` from root** for parallel startup
3. **Check console for "webpack compiled successfully"** before moving to next app
4. **If errors persist**, clear cache and restart all apps
5. **Remote apps must be running** for hosts to import their components

---

*Last updated: October 2025*

