# 模擬考 2（標準難度，閉書）

> 範圍：ch1 + ch2 p.1–36（上到 Binary Search）｜建議時間：100 分鐘｜**閉書、計時**
> 演算法一律使用課堂講義的版本。

---

**1.（10 分）**
(a) Show that $5n^4-2n^3+9n-1=O(n^4)$.
(b) Is $5n^4=O(n^3)$? Prove your answer.

**2.（8 分）** Show that $\lg(n!)=O(n\lg n)$. Find the constants $c$ and $n_0$.

**3.（17 分）**
(a) Apply the straight insertion sort to the sequence 9, 7, 5, 3, 1 step by step. Count the total number of comparisons and the total number of data movements.
(b) Which case (best / worst / average) is this input? Check your count in (a) against the formula for that case.
(c) Derive the average number of data movements of insertion sort for $n$ elements, and show that it is $O(n^2)$.

**4.（15 分）** Given the sorted array 3, 8, 11, 15, 19, 22, 27, 31, 36, 40, 44, 50 ($n=12$):
(a) Apply binary search to search for 31, 2, and 45 step by step.
(b) Construct the corresponding binary search tree and number the nodes level by level (root = 1, left to right).
(c) Using your numbering, verify that the element numbered $i$ needs $\lfloor\lg i\rfloor+1$ comparisons for $i=1, 5, 10, 12$.
(d) Give one worst-case example for a successful search and one for an unsuccessful search.

**5.（15 分）** For binary search on a sorted array of $n$ elements:
(a) Show that the total number of comparisons over all unsuccessful searches is at most $n\lg n+n+\lg n+1$.
(b) Given that the total number of comparisons over all successful searches is at most $n\lg n+(1-\frac1{\ln2})n+\lg n+\frac1{\ln2}$, show that the average-case time complexity of binary search is $O(\lg n)$. Give $c$ and $n_0$.

**6.（15 分）** Given the sorted array 4, 9, 15, 21, 30, 36, 42 ($n=7=2^3-1$):
(a) Search for 30, 5, and 42 step by step.
(b) Draw the binary search tree. Why is every unsuccessful search exactly 3 comparisons here?
(c) Compute the exact average number of comparisons over all $2n+1=15$ cases (7 successful + 8 unsuccessful).

**7.（20 分）** Assume $n=2^k-1$ (so the binary search tree is full with $k$ levels).
(a) Show that $\sum_{i=1}^{k} i\,2^{i-1}=2^k(k-1)+1$.
(b) Using (a), show that the average number of comparisons of binary search over all $2n+1$ cases is
$$A(n)=\frac{1}{2n+1}\Big((k-1)2^k+1+k(2^k)\Big)$$
and conclude that $A(n)=O(\lg n)$.

---

| 題 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 合計 |
|---|---|---|---|---|---|---|---|---|
| 配分 | 10 | 8 | 17 | 15 | 15 | 15 | 20 | 100 |
| 得分 | | | | | | | | |
