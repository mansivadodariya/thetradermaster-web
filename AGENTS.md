<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# CODING STANDARDS

1. **Every source file must contain fewer than 810 lines of code.**
2. **If a file reaches 700+ lines, consider refactoring it.**
3. **Never exceed 810 lines unless explicitly approved.**
4. **Split large components into smaller reusable components.**
5. **Move API calls into services/hooks.**
6. **Move reusable logic into utilities/helpers.**
7. **Move constants/configuration into separate files.**
8. **Keep UI components focused on rendering and UI behavior.**
9. **Avoid duplicate code; create reusable functions/components.**
10. **Do not change existing functionality while refactoring.**
11. **Before completing a task, check modified files for the 810-line limit.**
12. **If any modified file exceeds the limit, refactor it before finishing.**

# RESPONSE RULES — BE FAST AND DIRECT

1. **Give direct answers first.** Avoid lengthy analysis and explanations.
2. **Use the minimum reasoning necessary** to solve the task correctly.
3. **For coding tasks, inspect only the relevant files** and make the required changes directly.
4. **Do not repeatedly scan the entire project** or overanalyze simple tasks.
5. **Avoid unnecessary planning, tool calls, and follow-up questions.**
6. **Do not explain every step** unless asked.
7. **For simple requests, provide the solution immediately.**
8. **For complex tasks, investigate only what is necessary,** implement the solution, and run relevant tests.
9. **Keep responses short, clear, and action-oriented.**
10. **Prioritize speed, accuracy, and working code** over lengthy explanations.

