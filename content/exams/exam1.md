# 模擬考 1（基礎題型，可對照講義作答）

> 範圍：ch1 + ch2 p.1–36（上到 Binary Search）｜建議時間：100 分鐘
> 這份可以開講義寫，目標是**熟悉每種題型的標準寫法**。
> 演算法一律使用課堂講義的版本。

---

**1.（10 分）**
(a) Give the definition of big O function.
(b) Show that $f(n)=3n^3-5n^2+2n+7=O(n^3)$. Find the constants $c$ and $n_0$ and prove them.

**2.（10 分）** Let $H_n=1+\frac12+\frac13+\dots+\frac1n$. Show that $H_n=O(\lg n)$ by finding and proving the constants $c$ and $n_0$.

**3.（10 分）**
(a) Give the definitions of polynomial algorithms and exponential algorithms.
(b) Classify each time complexity below as polynomial or exponential, and explain briefly:
 (i) $n^2\lg n$  (ii) $1.01^n$  (iii) $n^{100}$  (iv) $n!$  (v) $2^{\lg n}$

**4.（15 分）** Apply the straight insertion sort to the sequence 8, 3, 6, 1, 7, 2 step by step. For each step, give the number of comparisons and the number of data movements (count `temp := x_j` and `x_{i+1} := temp` as data movements, as in the lecture notes). Give the totals.

**5.（15 分）** Given the sorted array 2, 4, 6, 8, 10, 12, 14, 16, 18, 20:
(a) Apply binary search to search for 14, 5, and 21 step by step (show $i, m, j$ in each step).
(b) Draw the corresponding binary search tree.
(c) What are the maximum numbers of comparisons for a successful and an unsuccessful search? Verify the result with $\lfloor\lg n\rfloor+1$.

**6.（15 分）** Given the sorted array 2, 5, 8, 12, 16, 23, 38, 56, 72 ($n=9$):
(a) Search for 23, 1, and 60 step by step.
(b) Construct the corresponding binary search tree and number the nodes level by level (root = 1).
(c) Compute the total number of comparisons over all 9 successful searches, and check that it equals $\sum_{i=1}^{9}(\lfloor\lg i\rfloor+1)$.
(d) Compute the total number of comparisons over all unsuccessful searches, and check that it is at most $(\lfloor\lg n\rfloor+1)(n+1)$.

**7.（15 分）** Show that the total number of comparisons required for all successful binary searches in a sorted array of $n$ elements, $(\lfloor\lg1\rfloor+1)+(\lfloor\lg2\rfloor+1)+\dots+(\lfloor\lg n\rfloor+1)$, is at most $n\lg n+(1-\frac{1}{\ln2})n+\lg n+\frac1{\ln2}$.

**8.（10 分）** Count the number of steps $T(n)$ of the following function (count each statement execution and each loop test as one step), and show that $T(n)=O(n)$.
```
float Sum(float *A, const int n) {
    float s = 0;
    for (int i = 0; i < n; i++)
        s += A[i];
    return s;
}
```

---

| 題 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 合計 |
|---|---|---|---|---|---|---|---|---|---|
| 配分 | 10 | 10 | 10 | 15 | 15 | 15 | 15 | 10 | 100 |
| 得分 | | | | | | | | | |
