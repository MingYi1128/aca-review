# CLAUDE.md — 演算法期中複習室

> 給 AI 助手（Claude Code 等）閱讀。動手前先讀完本檔；新增內容時照「新增內容流程」做，不要自行發明結構。

## 1. 專案目的
「高等計算機演算法（Advanced Computer Algorithm）」的複習網站，三類內容：
1. **講義**（lecture）：整理課堂投影片與隨堂練習詳解。
2. **互動演練**（lab）：照講義虛擬碼逐步執行演算法的視覺化。
3. **模擬考**（exam）：題目頁（含計時器）＋解答頁（寫完才展開）。

讀者是準備考試的學生：重點是**精確、可默寫、與老師講義的版本一致**。

## 2. 技術約束
- 純靜態：HTML + CSS + 原生 JS，**不使用建置工具、框架、npm**。部署＝把整個資料夾放到任何靜態主機（GitHub Pages 亦可）。
- 內容與程式分離：所有講義／考題寫在 `content/` 的 Markdown，由 `assets/app.js` 依 `content/manifest.json` 載入渲染。**新增內容時不要改 `app.js`**。
- 數學公式用 `$...$`（行內）與 `$$...$$`（獨立行），由 MathJax 渲染；Markdown 由 marked 渲染（皆走 CDN，版本已固定）。
- 因為用 `fetch` 讀 Markdown，本機必須用 HTTP 伺服器：`python3 -m http.server 8000`，再開 `http://localhost:8000/`。

## 3. 目錄結構
```
index.html            單頁殼（hash 路由：#/、#/lecture/<id>、#/lab、#/exam/<id>）
assets/style.css      設計 token 與元件樣式
assets/app.js         路由、Markdown/數學渲染、講義頁與考試頁
assets/lab.js         互動演練（步進播放器、各演算法 frames）
content/manifest.json 站名、講義清單、模擬考清單（唯一的內容索引）
content/lectures/     講義 .md
content/exams/        模擬考題目 .md
content/exams/solutions/  對應解答 .md（檔名與題目相同）
templates/            新增內容用的 .md 範本
scripts/check.py      驗證 manifest 與題號對應
```

## 4. 命名規則
- id 與檔名：小寫英數與連字號，例如 `midterm-guide`、`exam4`；**id 唯一**，題目檔與解答檔同名。
- 模擬考依序 `exam0`（隨堂卷）、`exam1`、`exam2`…；新的接著編號，不重排舊的。
- 圖片（若有）放 `assets/img/`，檔名小寫連字號，Markdown 以相對路徑引用。

## 5. 內容格式規則
### 講義 `content/lectures/<id>.md`
- 第一行 `# 標題`；第二行 `>` 引用列出資料來源（章節＋頁碼）。
- 用 `##` 分大節（網頁自動由 `##` 產生頁首目錄，標題要短）；`###` 小節。
- 定義、公式標明教材頁碼（如 `（ch2 p.6）`）。與一般教科書不同的老師用法要用 ⚠️ 標註（例：little o）。
- 重點定義用粗體；證明結尾用 ∎；表格用 GFM 表格。

### 模擬考題目 `content/exams/<id>.md`
- 第一行 `# 模擬考 N（難度）`，接 `>` 引用列範圍與建議時間，`---` 分隔。
- 每題以 `**N.（X 分）**` 開頭，**題號從 1 連續遞增**；小題用 `(a)(b)`。
- 英文題目保持原文（老師出題為英文），公式用 `$...$`。總分 100。

### 解答 `content/exams/solutions/<id>.md`
- 第一行 `# 模擬考 N 解答`；每題一個 `## N.（X 分）`，題號必須與題目一一對應。
- 若解答刻意不逐題對應（例如引用講義章節），在檔內加 `<!-- check: skip-numbering (原因) -->` 讓 check 略過題號比對。
- 寫出完整推導（找出 $c$、$n_0$ 並證明等），不要只給答案；常見陷阱以 `>` 引用提醒。

## 6. 風格規則（沿用，勿隨意更動）
- 色彩只用 `style.css` `:root` 的 token（`--accent`、`--good`…），並保留 dark mode 覆寫；**不要在元件裡寫死色碼**。
- 字體：標題 Noto Serif TC、內文 Noto Sans TC、程式／數字 JetBrains Mono。
- 版面：單欄閱讀寬度 780px（`.read`），手機寬度不得出現橫向捲動（表格已包 `.tw`）。
- 互動元件需鍵盤可操作、有 `aria-label`，並尊重 `prefers-reduced-motion`。
- 語言：繁體中文，專有名詞保留英文（Big O、binary search）。

## 7. 新增內容流程
**新增模擬考**
1. 複製 `templates/exam.md` → `content/exams/examN.md`，`templates/exam-solution.md` → `content/exams/solutions/examN.md`。
2. 在 `content/manifest.json` 的 `exams` 加一筆：`{"id":"examN","title":"模擬考 N","tab":"模擬考 N","minutes":100,"file":"content/exams/examN.md","solution":"content/exams/solutions/examN.md"}`。
3. 執行 `python3 scripts/check.py`，必須顯示 `OK`。

**新增講義**：複製 `templates/lecture.md` → `content/lectures/<id>.md`，在 manifest 的 `lectures` 加 `{"id","title","tab","summary","file"}`。

**新增演算法視覺化**：只改 `assets/lab.js`——寫 `xxxFrames(arr)` 回傳 frames，在 `PRESETS`、`LEG`、`KINDS` 各加一項。計數方式必須與講義一致（例如插入排序把 `temp := x_j` 與 `x_{i+1} := temp` 算資料搬移）。

## 8. 完成前自我檢查（AI 必做）
1. `python3 scripts/check.py` 通過。
2. 起本機伺服器，實際開啟新頁面：公式有渲染、無 console 錯誤、手機寬度無橫向捲動。
3. 數學與演算法內容逐題核對，**不確定的地方明講，不要編造教材頁碼**。
4. 不要提交大型教材檔（PDF）；只放整理後的內容。
