# Unneeded Files List

This document lists files that can be safely removed or are redundant.

## Documentation Files (Redundant/Review Only)

These are review documents created during development. They can be removed if you want to keep only the main README:

1. **`CODE_REVIEW.md`** - Initial code review document
   - **Status**: Redundant (covered in FINAL_REVIEW.md)
   - **Action**: Can be deleted if FINAL_REVIEW.md is kept

2. **`FINAL_REVIEW.md`** - Final comprehensive review
   - **Status**: Review document (useful for reference)
   - **Action**: Keep for reference, or delete if not needed

3. **`FRONTEND_REVIEW.md`** - Frontend-specific review
   - **Status**: Review document (useful for reference)
   - **Action**: Keep for reference, or delete if not needed

4. **`ROUTES_REVIEW.md`** - API routes documentation
   - **Status**: Review document (useful for reference)
   - **Action**: Keep for reference, or delete if not needed

5. **`backend/src/__tests__/README.md`** - Test documentation
   - **Status**: Useful documentation for developers
   - **Action**: **KEEP** - This is helpful for understanding tests

## Default/Unused Assets

6. **`frontend/public/vite.svg`** - Default Vite logo
   - **Status**: Used as favicon in index.html
   - **Action**: **KEEP** - Currently used as favicon (can be replaced with custom icon if desired)

## Source Data File

7. **`מטלת בית ארכיון שמות רחובות (1).csv`** - Original CSV data file
   - **Status**: Source data (1218 records)
   - **Action**: **KEEP** - This is the source data file needed for loading into Elasticsearch
   - **Note**: Already loaded into Elasticsearch, but keep for reference/reloading

## Build Artifacts (Should be in .gitignore)

These should already be ignored by .gitignore, but check if they exist:

- `node_modules/` - Dependencies (should be in .gitignore ✅)
- `dist/` - Build output (should be in .gitignore ✅)
- `build/` - Build output (should be in .gitignore ✅)
- `coverage/` - Test coverage (should be in .gitignore)
- `*.log` - Log files (should be in .gitignore ✅)
- `.env` - Environment variables (should be in .gitignore ✅)

## Recommended Actions

### Safe to Delete (Review Documents)
If you want to clean up review documents and keep only essential documentation:

```bash
# Delete redundant review documents (optional)
rm CODE_REVIEW.md
rm FINAL_REVIEW.md
rm FRONTEND_REVIEW.md
rm ROUTES_REVIEW.md
```

### Optional Replacements
```bash
# Replace default Vite logo with custom favicon (optional)
# Keep vite.svg or replace with custom icon
```

### Must Keep
- ✅ `README.md` - Main project documentation
- ✅ `backend/src/__tests__/README.md` - Test documentation
- ✅ `מטלת בית ארכיון שמות רחובות (1).csv` - Source data file
- ✅ All source code files
- ✅ Configuration files (package.json, tsconfig.json, etc.)
- ✅ `.env.example` files

## Summary

**Total potentially unneeded files**: 4
- 4 review documentation files (optional to keep - useful for reference)

**Files to definitely keep**:
- All source code
- README.md
- Test documentation
- CSV source file
- Configuration files

