import React, { useState } from "react";

// ─── Company Data ──────────────────────────────────────────────────────────────
const COMPANIES = {
  amazon: { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com", bg: "#FF9900" },
  google: { name: "Google", logo: "https://logo.clearbit.com/google.com", bg: "#4285F4" },
  microsoft: { name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com", bg: "#00A4EF" },
  adobe: { name: "Adobe", logo: "https://logo.clearbit.com/adobe.com", bg: "#FF0000" },
  meta: { name: "Meta", logo: "https://logo.clearbit.com/meta.com", bg: "#0866FF" },
  uber: { name: "Uber", logo: "https://logo.clearbit.com/uber.com", bg: "#1B1919" },
  netflix: { name: "Netflix", logo: "https://logo.clearbit.com/netflix.com", bg: "#E50914" },
  apple: { name: "Apple", logo: "https://logo.clearbit.com/apple.com", bg: "#555" },
  flipkart: { name: "Flipkart", logo: "https://logo.clearbit.com/flipkart.com", bg: "#2874F0" },
  paytm: { name: "Paytm", logo: "https://logo.clearbit.com/paytm.com", bg: "#00BAF2" },
  goldman: { name: "Goldman Sachs", logo: "https://logo.clearbit.com/goldmansachs.com", bg: "#6699CC" },
  oracle: { name: "Oracle", logo: "https://logo.clearbit.com/oracle.com", bg: "#F80000" },
  salesforce: { name: "Salesforce", logo: "https://logo.clearbit.com/salesforce.com", bg: "#00A1E0" },
  atlassian: { name: "Atlassian", logo: "https://logo.clearbit.com/atlassian.com", bg: "#0052CC" },
  intuit: { name: "Intuit", logo: "https://logo.clearbit.com/intuit.com", bg: "#236CEA" },
  walmart: { name: "Walmart", logo: "https://logo.clearbit.com/walmart.com", bg: "#0071CE" },
  twitter: { name: "Twitter", logo: "https://logo.clearbit.com/twitter.com", bg: "#1DA1F2" },
  deshaw: { name: "DE Shaw", logo: "https://logo.clearbit.com/deshaw.com", bg: "#003366" },
  bloomberg: { name: "Bloomberg", logo: "https://logo.clearbit.com/bloomberg.com", bg: "#F26122" },
};

const c = (...keys) => keys.map(k => COMPANIES[k]).filter(Boolean);

// ─── DSA Topics ────────────────────────────────────────────────────────────────
const DSA_TOPICS = [
  {
    id: 1, day: 1, title: "Array (Part 1)",
    problems: [
      { id: 1, title: "Majority Element", difficulty: "Easy", time: 30, companies: c("amazon", "google") },
      { id: 2, title: "Repeat & Missing Number", difficulty: "Easy", time: 30, companies: c("amazon") },
      { id: 3, title: "Merge 2 Sorted Arrays Without Extra Space", difficulty: "Easy", time: 30, companies: c("adobe", "google", "microsoft", "amazon", "flipkart") },
      { id: 4, title: "Single Number", difficulty: "Easy", time: 30, companies: c("meta", "apple", "google", "microsoft", "amazon") },
      { id: 5, title: "Stock Buy & Sell", difficulty: "Easy", time: 30, companies: c("paytm", "microsoft", "walmart", "amazon", "google") },
      { id: 6, title: "Pow (x^n)", difficulty: "Medium", time: 45, companies: c("google", "microsoft", "amazon") },
    ],
  },
  {
    id: 2, day: 2, title: "Array (Part 2)",
    problems: [
      { id: 7, title: "Count Inversions", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google", "adobe") },
      { id: 8, title: "Search in Rotated Sorted Array", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google", "uber") },
      { id: 9, title: "3 Sum", difficulty: "Medium", time: 45, companies: c("amazon", "google", "microsoft", "adobe", "oracle") },
      { id: 10, title: "4 Sum", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "adobe") },
      { id: 11, title: "Largest Subarray with 0 Sum", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google") },
      { id: 12, title: "Count Subarrays with Given XOR", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft") },
    ],
  },
  {
    id: 3, day: 3, title: "Array (Part 3)",
    problems: [
      { id: 13, title: "Find the Duplicate Element", difficulty: "Medium", time: 45, companies: c("amazon", "google", "microsoft", "oracle") },
      { id: 14, title: "Reverse Pairs", difficulty: "Hard", time: 60, companies: c("amazon", "google", "atlassian") },
      { id: 15, title: "Maximum Product Subarray", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google", "adobe", "flipkart") },
      { id: 16, title: "Merge Overlapping Subintervals", difficulty: "Medium", time: 45, companies: c("google", "amazon", "microsoft", "uber", "meta") },
      { id: 17, title: "Merge Two Sorted Arrays Without Extra Space", difficulty: "Hard", time: 60, companies: c("microsoft", "amazon", "google") },
    ],
  },
  {
    id: 4, day: 4, title: "Array (Part 4)",
    problems: [
      { id: 18, title: "2 Sum Problem", difficulty: "Easy", time: 30, companies: c("amazon", "google", "microsoft", "adobe", "uber", "meta") },
      { id: 19, title: "Sort an Array of 0s, 1s, and 2s", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft", "google", "adobe") },
      { id: 20, title: "Pascal's Triangle", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft", "oracle") },
      { id: 21, title: "Kadane's Algorithm", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google", "adobe", "oracle", "flipkart") },
      { id: 22, title: "Next Permutation", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google") },
    ],
  },
  {
    id: 5, day: 5, title: "Array (Part 5)",
    problems: [
      { id: 23, title: "Median of Two Sorted Arrays", difficulty: "Hard", time: 60, companies: c("amazon", "google", "microsoft", "uber", "adobe") },
      { id: 24, title: "Count of Smaller Numbers After Self", difficulty: "Hard", time: 60, companies: c("amazon", "google") },
      { id: 25, title: "Max Sum Rectangle", difficulty: "Hard", time: 60, companies: c("amazon", "microsoft", "google") },
      { id: 26, title: "Jump Game", difficulty: "Medium", time: 45, companies: c("amazon", "google", "microsoft", "uber") },
    ],
  },
  {
    id: 6, day: 6, title: "Strings (Part 1)",
    problems: [
      { id: 27, title: "Reverse Words in a String", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft", "google", "adobe") },
      { id: 28, title: "Longest Palindromic Substring", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google", "uber", "flipkart") },
      { id: 29, title: "Roman to Integer", difficulty: "Easy", time: 30, companies: c("amazon", "google", "microsoft", "oracle") },
      { id: 30, title: "Implement Atoi", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "uber") },
      { id: 31, title: "Longest Common Prefix", difficulty: "Easy", time: 30, companies: c("amazon", "google", "microsoft", "oracle") },
      { id: 32, title: "Valid Anagram", difficulty: "Easy", time: 30, companies: c("amazon", "google", "microsoft") },
    ],
  },
  {
    id: 7, day: 7, title: "Strings (Part 2)",
    problems: [
      { id: 33, title: "Count and Say", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google") },
      { id: 34, title: "Compare Version Numbers", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft") },
      { id: 35, title: "Rabin Karp Algorithm", difficulty: "Medium", time: 45, companies: c("google", "amazon") },
      { id: 36, title: "KMP Algorithm", difficulty: "Hard", time: 60, companies: c("google", "microsoft", "amazon") },
      { id: 37, title: "Minimum Window Substring", difficulty: "Hard", time: 60, companies: c("amazon", "google", "microsoft", "uber", "meta") },
    ],
  },
  {
    id: 8, day: 8, title: "Binary Search",
    problems: [
      { id: 38, title: "N-th Root of a Number using Binary Search", difficulty: "Medium", time: 45, companies: c("amazon", "google") },
      { id: 39, title: "Matrix Median", difficulty: "Hard", time: 60, companies: c("amazon", "microsoft") },
      { id: 40, title: "Single Element in Sorted Array", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft", "google") },
      { id: 41, title: "Search in Rotated & Sorted Array", difficulty: "Medium", time: 45, companies: c("amazon", "google", "microsoft", "uber", "meta") },
      { id: 42, title: "Median of Two Sorted Arrays", difficulty: "Hard", time: 60, companies: c("amazon", "google", "microsoft", "adobe") },
      { id: 43, title: "K-th Element of Two Sorted Arrays", difficulty: "Hard", time: 60, companies: c("amazon", "google") },
    ],
  },
  {
    id: 9, day: 9, title: "Recursion & Backtracking (Part 1)",
    problems: [
      { id: 44, title: "Subset Sum I", difficulty: "Medium", time: 45, companies: c("amazon", "google", "microsoft") },
      { id: 45, title: "Subset Sum II", difficulty: "Medium", time: 45, companies: c("amazon", "google") },
      { id: 46, title: "Combination Sum-1", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google", "adobe") },
      { id: 47, title: "Combination Sum-2", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft") },
      { id: 48, title: "Palindrome Partitioning", difficulty: "Hard", time: 60, companies: c("amazon", "microsoft", "google") },
      { id: 49, title: "K-th Permutation Sequence", difficulty: "Hard", time: 60, companies: c("amazon", "google") },
    ],
  },
  {
    id: 10, day: 10, title: "Recursion & Backtracking (Part 2)",
    problems: [
      { id: 50, title: "N Queens Problem", difficulty: "Hard", time: 60, companies: c("amazon", "google", "microsoft") },
      { id: 51, title: "Sudoku Solver", difficulty: "Hard", time: 60, companies: c("amazon", "google", "microsoft", "uber") },
      { id: 52, title: "Rat in a Maze", difficulty: "Medium", time: 45, companies: c("amazon", "google", "microsoft") },
      { id: 53, title: "Word Break (Print All Ways)", difficulty: "Hard", time: 60, companies: c("amazon", "google", "microsoft") },
    ],
  },
  {
    id: 11, day: 11, title: "Linked List (Part 1)",
    problems: [
      { id: 54, title: "Reverse a Linked List", difficulty: "Easy", time: 30, companies: c("amazon", "google", "microsoft", "adobe", "meta") },
      { id: 55, title: "Middle of Linked List", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft", "google") },
      { id: 56, title: "Merge Two Sorted Linked Lists", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft", "google", "adobe") },
      { id: 57, title: "Remove N-th Node from the Back", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google") },
      { id: 58, title: "Delete a Given Node in a Linked List", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft", "google", "adobe") },
      { id: 59, title: "Add Two Numbers", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google", "uber") },
    ],
  },
  {
    id: 12, day: 12, title: "Linked List (Part 2)",
    problems: [
      { id: 60, title: "Intersection of Two Linked Lists", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft", "google", "oracle") },
      { id: 61, title: "Detect a Cycle in a Linked List", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft", "google", "uber") },
      { id: 62, title: "Reverse Linked List in K Groups", difficulty: "Hard", time: 60, companies: c("amazon", "microsoft", "google") },
      { id: 63, title: "Check if Linked List is Palindrome", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "meta") },
      { id: 64, title: "Find Starting Point of Loop/Cycle", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft") },
      { id: 65, title: "Flattening of Linked List", difficulty: "Hard", time: 60, companies: c("amazon", "adobe") },
    ],
  },
  {
    id: 13, day: 13, title: "Linked List (Part 3) & Arrays",
    problems: [
      { id: 66, title: "Rotate a Linked List", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google") },
      { id: 67, title: "Clone a Linked List with Random Pointer", difficulty: "Hard", time: 60, companies: c("amazon", "microsoft", "google", "adobe") },
      { id: 68, title: "Trapping Rainwater", difficulty: "Hard", time: 60, companies: c("amazon", "google", "microsoft", "uber", "meta", "adobe") },
      { id: 69, title: "Remove Duplicate from Sorted Array", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft", "google") },
    ],
  },
  {
    id: 14, day: 14, title: "Stacks & Queues (Part 1)",
    problems: [
      { id: 70, title: "Valid Parentheses", difficulty: "Easy", time: 30, companies: c("amazon", "google", "microsoft", "meta", "oracle") },
      { id: 71, title: "Next Smaller Element", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google") },
      { id: 72, title: "Sort a Stack", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft") },
      { id: 73, title: "Next Greater Element II", difficulty: "Medium", time: 45, companies: c("amazon", "google") },
      { id: 74, title: "Implement Stack using Queues", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft", "google") },
    ],
  },
  {
    id: 15, day: 15, title: "Stacks & Queues (Part 2)",
    problems: [
      { id: 75, title: "Largest Rectangle in Histogram", difficulty: "Hard", time: 60, companies: c("amazon", "google", "microsoft", "uber") },
      { id: 76, title: "Maximal Rectangle", difficulty: "Hard", time: 60, companies: c("amazon", "google") },
      { id: 77, title: "Sliding Window Maximum", difficulty: "Hard", time: 60, companies: c("amazon", "google", "microsoft", "uber") },
      { id: 78, title: "Min Stack", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google") },
      { id: 79, title: "LRU Cache", difficulty: "Medium", time: 45, companies: c("amazon", "google", "microsoft", "uber", "meta", "oracle") },
    ],
  },
  {
    id: 16, day: 16, title: "Binary Trees (Part 1)",
    problems: [
      { id: 80, title: "Inorder Traversal", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft", "google") },
      { id: 81, title: "Preorder Traversal", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft") },
      { id: 82, title: "Postorder Traversal", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft") },
      { id: 83, title: "Level Order Traversal / BFS", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google", "adobe") },
      { id: 84, title: "Height of a Binary Tree", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft", "google") },
      { id: 85, title: "Check if Binary Tree is Balanced", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google") },
    ],
  },
  {
    id: 17, day: 17, title: "Binary Trees (Part 2)",
    problems: [
      { id: 86, title: "Binary Tree Maximum Path Sum", difficulty: "Hard", time: 60, companies: c("amazon", "google", "microsoft", "uber", "meta") },
      { id: 87, title: "Spiral/Zigzag Order Traversal", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "adobe") },
      { id: 88, title: "Boundary Traversal", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft") },
      { id: 89, title: "Vertical Order Traversal", difficulty: "Hard", time: 60, companies: c("amazon", "microsoft", "google") },
      { id: 90, title: "Top View of Binary Tree", difficulty: "Medium", time: 45, companies: c("amazon", "flipkart") },
      { id: 91, title: "Bottom View of Binary Tree", difficulty: "Medium", time: 45, companies: c("amazon", "flipkart") },
    ],
  },
  {
    id: 18, day: 18, title: "Binary Trees (Part 3)",
    problems: [
      { id: 92, title: "Left / Right View of Binary Tree", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google") },
      { id: 93, title: "Symmetric Binary Tree", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft", "bloomberg") },
      { id: 94, title: "LCA in Binary Tree", difficulty: "Medium", time: 45, companies: c("amazon", "google", "microsoft", "meta") },
      { id: 95, title: "Path to Given Node", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft") },
    ],
  },
  {
    id: 19, day: 19, title: "Binary Trees (Part 4)",
    problems: [
      { id: 96, title: "Construct BT from Inorder & Preorder", difficulty: "Hard", time: 60, companies: c("amazon", "microsoft", "google") },
      { id: 97, title: "Construct BT from Inorder & Postorder", difficulty: "Hard", time: 60, companies: c("amazon", "microsoft") },
      { id: 98, title: "Serialize and Deserialize a Binary Tree", difficulty: "Hard", time: 60, companies: c("google", "amazon", "microsoft", "uber") },
      { id: 99, title: "Morris Inorder Traversal", difficulty: "Hard", time: 60, companies: c("amazon", "microsoft") },
      { id: 100, title: "Flatten Binary Tree to Linked List", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "uber") },
    ],
  },
  {
    id: 20, day: 20, title: "Binary Search Tree (Part 1)",
    problems: [
      { id: 101, title: "Search in a BST", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft") },
      { id: 102, title: "Convert Sorted Array to BST", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft") },
      { id: 103, title: "Construct BST from Preorder", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft") },
      { id: 104, title: "Check if BST", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "apple") },
      { id: 105, title: "LCA of BST", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft", "google") },
    ],
  },
  {
    id: 21, day: 21, title: "Binary Search Tree (Part 2)",
    problems: [
      { id: 106, title: "Floor and Ceil in BST", difficulty: "Medium", time: 45, companies: c("amazon", "google") },
      { id: 107, title: "Insert in BST", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft") },
      { id: 108, title: "Delete in BST", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft") },
      { id: 109, title: "Kth Smallest Element in BST", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft", "google", "uber") },
      { id: 110, title: "Two Sum in BST", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft", "google") },
      { id: 111, title: "Recover BST", difficulty: "Hard", time: 60, companies: c("amazon", "microsoft") },
    ],
  },
  {
    id: 22, day: 22, title: "Binary Search Tree (Part 3)",
    problems: [
      { id: 112, title: "Largest BST in BT", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft") },
      { id: 113, title: "BST Iterator", difficulty: "Medium", time: 45, companies: c("amazon", "google", "meta") },
      { id: 114, title: "Serialize / Deserialize BST", difficulty: "Hard", time: 60, companies: c("amazon", "google") },
    ],
  },
  {
    id: 23, day: 23, title: "Heaps & Priority Queue",
    problems: [
      { id: 115, title: "Kth Largest Element in an Array", difficulty: "Medium", time: 45, companies: c("amazon", "google", "microsoft", "uber", "meta") },
      { id: 116, title: "Maximum Sum Combinations", difficulty: "Medium", time: 45, companies: c("amazon") },
      { id: 117, title: "Find Median from Data Stream", difficulty: "Hard", time: 60, companies: c("amazon", "google", "microsoft") },
      { id: 118, title: "K Most Frequent Elements", difficulty: "Medium", time: 45, companies: c("amazon", "google", "microsoft") },
      { id: 119, title: "Merge K Sorted Lists", difficulty: "Hard", time: 60, companies: c("amazon", "google", "microsoft", "uber") },
      { id: 120, title: "Top K Frequent Words", difficulty: "Medium", time: 45, companies: c("amazon", "google") },
    ],
  },
  {
    id: 24, day: 24, title: "Tries",
    problems: [
      { id: 121, title: "Implement Trie I", difficulty: "Medium", time: 45, companies: c("amazon", "google", "microsoft") },
      { id: 122, title: "Implement Trie II (Map Based)", difficulty: "Medium", time: 45, companies: c("amazon", "google") },
      { id: 123, title: "Longest String with All Prefixes", difficulty: "Medium", time: 45, companies: c("google") },
      { id: 124, title: "Number of Distinct Substrings", difficulty: "Hard", time: 60, companies: c("amazon", "google") },
      { id: 125, title: "Maximum XOR of Two Numbers in an Array", difficulty: "Hard", time: 60, companies: c("amazon", "google", "microsoft") },
    ],
  },
  {
    id: 25, day: 25, title: "Graphs (Part 1) — BFS / DFS",
    problems: [
      { id: 126, title: "BFS of Graph", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft", "google") },
      { id: 127, title: "DFS of Graph", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft", "google") },
      { id: 128, title: "Number of Provinces / Connected Components", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google") },
      { id: 129, title: "Rotten Oranges", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google") },
      { id: 130, title: "Flood Fill", difficulty: "Easy", time: 30, companies: c("amazon", "google") },
      { id: 131, title: "0-1 Matrix", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google") },
    ],
  },
  {
    id: 26, day: 26, title: "Graphs (Part 2) — Topological Sort",
    problems: [
      { id: 132, title: "Topological Sort (DFS)", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft") },
      { id: 133, title: "Topological Sort (Kahn's Algorithm)", difficulty: "Medium", time: 45, companies: c("amazon", "google") },
      { id: 134, title: "Detect Cycle in Undirected Graph", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google") },
      { id: 135, title: "Detect Cycle in Directed Graph", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft") },
      { id: 136, title: "Find Eventual Safe Nodes", difficulty: "Medium", time: 45, companies: c("amazon", "google") },
      { id: 137, title: "Course Schedule I & II", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google", "uber") },
    ],
  },
  {
    id: 27, day: 27, title: "Graphs (Part 3) — Shortest Paths",
    problems: [
      { id: 138, title: "Dijkstra's Algorithm", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google", "uber") },
      { id: 139, title: "Bellman Ford Algorithm", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft") },
      { id: 140, title: "Floyd Warshall Algorithm", difficulty: "Medium", time: 45, companies: c("amazon", "google") },
      { id: 141, title: "Prim's Algorithm (MST)", difficulty: "Medium", time: 45, companies: c("amazon", "google", "microsoft") },
      { id: 142, title: "Disjoint Set / Union Find", difficulty: "Medium", time: 45, companies: c("amazon", "google", "microsoft") },
      { id: 143, title: "Kruskal's Algorithm (MST)", difficulty: "Medium", time: 45, companies: c("amazon", "google") },
    ],
  },
  {
    id: 28, day: 28, title: "Graphs (Part 4) — Problems",
    problems: [
      { id: 144, title: "Number of Islands", difficulty: "Medium", time: 45, companies: c("amazon", "google", "microsoft", "uber", "bloomberg") },
      { id: 145, title: "Bipartite Graph", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft") },
      { id: 146, title: "Word Ladder", difficulty: "Hard", time: 60, companies: c("amazon", "google", "microsoft") },
      { id: 147, title: "Alien Dictionary", difficulty: "Hard", time: 60, companies: c("amazon", "google", "microsoft", "uber") },
      { id: 148, title: "Critical Connections in a Network", difficulty: "Hard", time: 60, companies: c("amazon", "google") },
    ],
  },
  {
    id: 29, day: 29, title: "Dynamic Programming (Part 1) — 1D DP",
    problems: [
      { id: 149, title: "Climbing Stairs", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft", "google", "uber") },
      { id: 150, title: "Frog Jump", difficulty: "Medium", time: 45, companies: c("amazon") },
      { id: 151, title: "House Robber", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google") },
      { id: 152, title: "House Robber II", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft") },
      { id: 153, title: "Fibonacci Number", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft") },
      { id: 154, title: "Min Cost Climbing Stairs", difficulty: "Easy", time: 30, companies: c("amazon", "google") },
    ],
  },
  {
    id: 30, day: 30, title: "Dynamic Programming (Part 2) — 2D DP",
    problems: [
      { id: 155, title: "Grid Unique Paths", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google", "uber") },
      { id: 156, title: "Minimum Path Sum", difficulty: "Medium", time: 45, companies: c("amazon", "google", "microsoft") },
      { id: 157, title: "Triangle", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft") },
      { id: 158, title: "Cherry Pickup", difficulty: "Hard", time: 60, companies: c("amazon", "google") },
    ],
  },
  {
    id: 31, day: 31, title: "Dynamic Programming (Part 3) — DP on Subsequences",
    problems: [
      { id: 159, title: "Subset Sum Equal To Target", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft") },
      { id: 160, title: "0-1 Knapsack", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google", "flipkart") },
      { id: 161, title: "Coin Change", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google", "uber", "flipkart") },
      { id: 162, title: "Longest Common Subsequence", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google", "adobe") },
      { id: 163, title: "Longest Increasing Subsequence", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google", "oracle") },
      { id: 164, title: "Edit Distance", difficulty: "Hard", time: 60, companies: c("amazon", "google", "microsoft") },
    ],
  },
  {
    id: 32, day: 32, title: "Dynamic Programming (Part 4) — Advanced DP",
    problems: [
      { id: 165, title: "Burst Balloons", difficulty: "Hard", time: 60, companies: c("amazon", "google") },
      { id: 166, title: "Matrix Chain Multiplication", difficulty: "Hard", time: 60, companies: c("amazon", "microsoft") },
      { id: 167, title: "Egg Drop Problem", difficulty: "Hard", time: 60, companies: c("amazon", "google", "microsoft") },
      { id: 168, title: "Buy and Sell Stock with Cooldown", difficulty: "Medium", time: 45, companies: c("amazon", "google") },
    ],
  },
  {
    id: 33, day: 33, title: "Greedy Algorithms",
    problems: [
      { id: 169, title: "N Meetings in One Room", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft") },
      { id: 170, title: "Minimum Platforms Required for a Station", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google") },
      { id: 171, title: "Job Scheduling Problem", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft") },
      { id: 172, title: "Fractional Knapsack Problem", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft") },
      { id: 173, title: "Minimum Number of Coins", difficulty: "Easy", time: 30, companies: c("amazon") },
      { id: 174, title: "Assign Cookies", difficulty: "Easy", time: 30, companies: c("amazon", "google") },
    ],
  },
  {
    id: 34, day: 34, title: "Miscellaneous",
    problems: [
      { id: 175, title: "Rotate Image", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google", "uber") },
      { id: 176, title: "Spiral Matrix", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google") },
      { id: 177, title: "Word Search", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft", "google") },
      { id: 178, title: "Gas Station", difficulty: "Medium", time: 45, companies: c("amazon", "google") },
      { id: 179, title: "Find Missing and Repeating Numbers", difficulty: "Medium", time: 45, companies: c("amazon", "microsoft") },
      { id: 180, title: "Count Pairs with Given Sum", difficulty: "Easy", time: 30, companies: c("amazon", "microsoft", "flipkart") },
    ],
  },
];

// ─── LeetCode URL helper ─────────────────────────────────────────────────────
function toLeetCodeUrl(title) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")   // remove special chars
    .trim()
    .replace(/\s+/g, "-");           // spaces → hyphens
  return `https://leetcode.com/problems/${slug}/`;
}

// ─── Difficulty Badge ──────────────────────────────────────────────────────────
function DiffBadge({ level }) {
  const map = {
    Easy: "bg-green-100 text-green-700 border border-green-200",
    Medium: "bg-orange-100 text-orange-600 border border-orange-200",
    Hard: "bg-red-100 text-red-600 border border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${map[level]}`}>
      {level}
    </span>
  );
}

// ─── Company Badges ───────────────────────────────────────────────────────────
function CompanyLogos({ companies }) {
  const MAX = 2;
  const visible = companies.slice(0, MAX);
  const extra = companies.length - MAX;

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {visible.map((co) => (
        <div
          key={co.name}
          title={co.name}
          className="inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full border border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all cursor-default group"
        >
          <div
            className="w-[14px] h-[14px] rounded-full overflow-hidden flex-shrink-0"
            style={{ background: co.bg }}
          >
            <img
              src={co.logo}
              alt={co.name}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>
          <span className="text-[11px] font-medium text-gray-600 group-hover:text-gray-900 whitespace-nowrap leading-none">
            {co.name}
          </span>
        </div>
      ))}
      {extra > 0 && (
        <div
          className="inline-flex items-center px-2 py-[3px] rounded-full border border-dashed border-gray-300 bg-white text-[11px] font-medium text-gray-400 cursor-default whitespace-nowrap"
          title={companies.slice(MAX).map((c) => c.name).join(", ")}
        >
          +{extra} more
        </div>
      )}
    </div>
  );
}

// ─── Icon Buttons ──────────────────────────────────────────────────────────────
function IconBtn({ title, children, color = "hover:text-[#aaa]" }) {
  return (
    <a
      href="#"
      title={title}
      onClick={e => e.preventDefault()}
      className={`inline-flex items-center justify-content-center w-9 h-9 rounded-full bg-gray-100 border border-gray-200 text-gray-400 ${color} hover:border-gray-300 transition-all duration-150 mx-auto`}
    >
      {children}
    </a>
  );
}

// ─── Topic Row ─────────────────────────────────────────────────────────────────
function TopicRow({ topic }) {
  const [open, setOpen] = useState(topic.day === 1);
  const [solved, setSolved] = useState(new Set());

  const toggleSolved = (id) =>
    setSolved(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white hover:border-gray-300 transition-colors shadow-sm">
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-orange-50 transition-colors text-left"
      >
        <span className="text-orange-500 font-semibold text-base tracking-tight">
          Day {topic.day} : {topic.title}
        </span>
        <span className="flex items-center gap-3 text-sm text-gray-400 font-medium">
          {solved.size}/{topic.problems.length}
          <span
            className="text-base text-gray-400 inline-block transition-transform duration-300"
            style={{ transform: open ? "rotate(0deg)" : "rotate(180deg)" }}
          >
            ⌃
          </span>
        </span>
      </button>

      {/* Problems Table */}
      {open && (
        <div className="overflow-x-auto border-t border-gray-100">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="w-10 px-4 py-2 text-left"></th>
                <th className="px-4 py-2 text-left min-w-[200px]">Problem</th>
                <th className="w-16 px-4 py-2 text-center">Article</th>
                <th className="w-16 px-4 py-2 text-center">Youtube</th>
                <th className="w-16 px-4 py-2 text-center">Practice</th>
                <th className="w-24 px-4 py-2 text-left">Level</th>
                <th className="w-28 px-4 py-2 text-left">Timer</th>
                <th className="min-w-[200px] px-4 py-2 text-left">Company</th>
              </tr>
            </thead>
            <tbody>
              {topic.problems.map((p) => (
                <tr
                  key={p.id}
                  className={`border-t border-gray-100 hover:bg-gray-50 transition-colors ${solved.has(p.id) ? "opacity-40" : ""}`}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleSolved(p.id)}
                      className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all ${solved.has(p.id) ? "bg-orange-500 border-orange-500" : "border-gray-300 hover:border-orange-400"}`}
                    >
                      {solved.has(p.id) && (
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                          <path d="M2 8l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </td>
                  {/* Title */}
                  <td className="px-4 py-3">
                    <a
                      href={toLeetCodeUrl(p.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-orange-500 transition-colors leading-relaxed font-medium hover:underline underline-offset-2"
                    >
                      {p.title}
                    </a>
                  </td>
                  {/* Article */}
                  <td className="px-4 py-3 text-center">
                    <IconBtn title="Article">
                      <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </IconBtn>
                  </td>
                  {/* YouTube */}
                  <td className="px-4 py-3 text-center">
                    <IconBtn title="YouTube" color="hover:text-[#ff4343]">
                      <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                        <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="1.8" />
                        <polygon points="10,9 10,15 16,12" fill="currentColor" />
                      </svg>
                    </IconBtn>
                  </td>
                  {/* Practice */}
                  <td className="px-4 py-3 text-center">
                    <IconBtn title="Practice" color="hover:text-[#61bd6d]">
                      <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                        <path d="M8 9L4 12l4 3M16 9l4 3-4 3M14 6l-4 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </IconBtn>
                  </td>
                  {/* Level */}
                  <td className="px-4 py-3">
                    <DiffBadge level={p.difficulty} />
                  </td>
                  {/* Timer */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-400 text-xs">{p.time} Min</span>
                      <div className="flex gap-1 text-sm">
                        <span title="Start timer" className="cursor-pointer hover:scale-110 transition-transform">⏱</span>
                        <span title="Lock" className="cursor-pointer hover:scale-110 transition-transform">🔒</span>
                      </div>
                    </div>
                  </td>
                  {/* Company */}
                  <td className="px-4 py-3">
                    <CompanyLogos companies={p.companies} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
const Test = () => {
  const [search, setSearch] = useState("");
  const [filterDiff, setFilterDiff] = useState("All");

  const totalProblems = DSA_TOPICS.reduce((a, t) => a + t.problems.length, 0);

  const filtered = DSA_TOPICS.map(topic => ({
    ...topic,
    problems: topic.problems.filter(p => {
      const matchSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.companies.some(co => co.name.toLowerCase().includes(search.toLowerCase()));
      const matchDiff = filterDiff === "All" || p.difficulty === filterDiff;
      return matchSearch && matchDiff;
    }),
  })).filter(t => t.problems.length > 0);

  return (
    <div
      className="min-h-screen pb-20 bg-white"
      style={{ color: "#1a1a1a", fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}
    >
      {/* ── Header ── */}
      <div
        className="border-b border-gray-200 px-6 py-5"
        style={{
          background: "linear-gradient(135deg,#fff8f6 0%,#fff 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* subtle grid bg */}
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.03) 1px,transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="max-w-5xl mx-auto flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg text-white"
              style={{ background: "linear-gradient(135deg,#ff4f3d,#ff8c42)", boxShadow: "0 4px 20px rgba(255,79,61,0.4)" }}
            >
              DSA
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-none tracking-tight">DSA Sheet</h1>
              <p className="text-xs text-gray-400 mt-1">{totalProblems} problems across {DSA_TOPICS.length} topics</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div className="text-right">
              <div className="text-lg font-bold text-orange-500">0</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Day Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="max-w-5xl mx-auto px-6 py-5 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" width="17" height="17">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search question, company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "#f9fafb", border: "1px solid #e5e7eb",
              color: "#111827", boxSizing: "border-box",
            }}
            onFocus={e => { e.target.style.borderColor = "#f97316"; e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.1)"; }}
            onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {/* Difficulty Filters */}
        <div className="flex gap-2 flex-wrap">
          {["All", "Easy", "Medium", "Hard"].map(d => {
            const activeColors = {
              Easy: "border-green-500 text-green-600 bg-green-50",
              Medium: "border-orange-400 text-orange-500 bg-orange-50",
              Hard: "border-red-400 text-red-500 bg-red-50",
              All: "border-orange-400 text-orange-500 bg-orange-50",
            };
            const isActive = filterDiff === d;
            return (
              <button
                key={d}
                onClick={() => setFilterDiff(d)}
                className={`px-4 py-2 rounded-lg border text-xs font-semibold transition-all ${isActive ? activeColors[d] : "border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 bg-white"}`}
              >
                {d}
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="flex gap-4 ml-auto text-xs text-gray-400">
          <span><span className="text-green-600 font-semibold">Easy</span> · {DSA_TOPICS.flatMap(t => t.problems).filter(p => p.difficulty === "Easy").length}</span>
          <span><span className="text-orange-500 font-semibold">Med</span> · {DSA_TOPICS.flatMap(t => t.problems).filter(p => p.difficulty === "Medium").length}</span>
          <span><span className="text-red-500 font-semibold">Hard</span> · {DSA_TOPICS.flatMap(t => t.problems).filter(p => p.difficulty === "Hard").length}</span>
        </div>
      </div>

      {/* ── Topics ── */}
      <div className="max-w-5xl mx-auto px-6 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <div className="text-lg font-medium text-gray-500">No problems found</div>
            <div className="text-sm mt-1">Try a different search term or filter</div>
          </div>
        ) : (
          filtered.map(topic => <TopicRow key={topic.id} topic={topic} />)
        )}
      </div>
    </div>
  );
};

export default Test;
