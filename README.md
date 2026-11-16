# 演算法期中複習室

高等計算機演算法（Advanced Computer Algorithm）的講義、互動演練與模擬考網站。純靜態，內容由 Markdown 驅動。
**AI 協作規則見 [CLAUDE.md](CLAUDE.md)。**

## 本機預覽
```bash
python3 -m http.server 8000
```
開啟 http://localhost:8000/

## 新增內容
照 `CLAUDE.md` §7：複製 `templates/` 的範本、在 `content/manifest.json` 加一筆、執行 `python3 scripts/check.py`。

## 部署
整個資料夾即為網站根目錄，可用 GitHub Pages（Settings → Pages → Deploy from branch → `main` / root）。
