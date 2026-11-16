# 模擬考 3（進階 + 觀念，閉書）

> 範圍：ch1 + ch2 p.1–36（上到 Binary Search）｜建議時間：100 分鐘｜**閉書、計時**
> 演算法一律使用課堂講義的版本。

---

**1.（12 分）** True or false? Justify each answer (give $c, n_0$ if true; give a reason if false).
(a) $2^{n+1}=O(2^n)$
(b) $2^{2n}=O(2^n)$
(c) $n^2=O(2^n)$
(d) $n^3=O(n^2\lg n)$

**2.（10 分）**
(a) Show that $f(n)=\frac14(n-1)(n+8)=O(n^2)$.
(b) Algorithm A runs in $O(n^3)$ and algorithm B runs in $O(n)$. Must B always run faster than A? Explain.

**3.（15 分）** Given the sorted array 5, 10, 15, …, 75 (15 elements, step 5):
(a) Search for 35, 60, and 77 step by step.
(b) Draw the corresponding binary search tree.
(c) Compute the **exact** average number of comparisons for (i) successful searches, (ii) unsuccessful searches, (iii) all $2n+1$ cases together.
(d) Check (c)(iii) against the lecture formula $A(n)=\frac{1}{2n+1}\Big(\sum_{i=1}^{k}i\,2^{i-1}+k(n+1)\Big)$ with $k=\lfloor\lg n\rfloor+1$.

**4.（10 分）**
(a) Apply the straight insertion sort to 4, 6, 2, 7, 1, 5 step by step. Give the total numbers of comparisons and data movements.
(b) For $n=5$, write a best-case input and a worst-case input, and give the exact numbers of data movements for each.

**5.（15 分）** Analyze insertion sort by the **number of comparisons** instead of data movements.
(a) Give the exact number of comparisons in the best case and in the worst case.
(b) When $x_j$ is inserted into the sorted $x_1,\dots,x_{j-1}$, show that the expected number of comparisons is $\frac{j+1}{2}-\frac1j$. (Hint: if $x_j$ is the smallest, the loop stops because $i=0$, not because of a comparison.)
(c) Show that the average total number of comparisons is $\frac{(n-1)(n+4)}{4}-H_n+1=O(n^2)$.

**6.（10 分）** Arrange the following functions in increasing order of growth, and mark which are polynomial and which are exponential:
$$n\lg n,\quad 2^n,\quad n^3,\quad \lg n,\quad n!,\quad 1,\quad n^2,\quad n$$

**7.（13 分）** Let $n=15=2^4-1$.
(a) Compute the exact total number of comparisons over all successful searches, $\sum_{i=1}^{15}(\lfloor\lg i\rfloor+1)$.
(b) Compute the upper bound $n\lg n+(1-\frac1{\ln2})n+\lg n+\frac1{\ln2}$ for $n=15$ (to 2 decimal places), and check that (a) is below it.

**8.（15 分）** Let $W(n)$ be the worst-case number of comparisons of binary search on $n$ sorted elements.
(a) Explain why there are exactly $n+1$ different unsuccessful cases.
(b) Explain why $W(n)=1+W(\lfloor n/2\rfloor)$ for $n\ge1$, with $W(0)=0$.
(c) Prove by induction that $W(n)=\lfloor\lg n\rfloor+1$.

---

| 題 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 合計 |
|---|---|---|---|---|---|---|---|---|---|
| 配分 | 12 | 10 | 15 | 10 | 15 | 10 | 13 | 15 | 100 |
| 得分 | | | | | | | | | |
