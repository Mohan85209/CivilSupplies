# Claude Code — Setup & First Session

## 1. Install Claude Code

Claude Code is a CLI tool that lets you delegate coding tasks to Claude from your terminal.

**Prerequisites:** Node.js 18 or newer.

```bash
npm install -g @anthropic-ai/claude-code
```

Verify:
```bash
claude --version
```

First run will prompt you to log in with your Anthropic account.

> If anything in the install command above doesn't work, run `claude --help` or check the official docs at https://docs.claude.com — the install command can change.

## 2. Set up your project folder

```bash
# pick a location on your machine
mkdir -p ~/projects/civil-supplies
cd ~/projects/civil-supplies

# unzip the FastAPI starter you got earlier into this folder
unzip ~/Downloads/civil-supplies-backend.zip
# This gives you ./civil-supplies-backend/  — we'll restructure it in Prompt 1.

# drop the two handoff files at the root of the project
# (PROJECT_BRIEF.md and CLAUDE_CODE_PROMPTS.md)
mv ~/Downloads/PROJECT_BRIEF.md .
mv ~/Downloads/CLAUDE_CODE_PROMPTS.md .

ls
# should show: civil-supplies-backend/  PROJECT_BRIEF.md  CLAUDE_CODE_PROMPTS.md
```

## 3. Launch Claude Code

From inside `~/projects/civil-supplies`:

```bash
claude
```

This opens an interactive session in your terminal, with full access to your project folder. Claude Code can read files, edit them, run commands, and see the output.

## 4. Your first message — paste Prompt 0

Copy Prompt 0 from `CLAUDE_CODE_PROMPTS.md`:

```
Read PROJECT_BRIEF.md at the repo root. That file is the source of truth for this project — its tech stack, scope, design, endpoints, and coding standards. Acknowledge the brief in one sentence and tell me the current state of the repo (what folders exist, what's already built). Do not start coding yet.
```

Claude Code will read the brief and summarize it back to you. That confirms it has the full context.

## 5. Then go in order

Paste Prompt 1, let it run, review, then Prompt 2, and so on. **Don't skip prompts** — each builds on the previous one.

Between prompts you can ask follow-ups in the same session ("show me the diff", "run the tests again", "fix the build error from above"). Stay in one session per prompt; start a fresh session only when you're moving to a new prompt and want a clean slate.

## 6. Tips

- **Always commit between prompts.** Each prompt ends with a `git commit` instruction — let Claude Code do it. If anything goes wrong with the next prompt, you can `git reset --hard HEAD~1` and re-run.
- **Test locally as you go.** After Prompts 2, 3, 5, 8 especially — actually start the servers and click through the site. Bugs caught early are 10x cheaper.
- **If a prompt is too big and Claude Code is taking forever**, ask it to "do just the models and schemas first, then stop and let me review."
- **Watch your spend.** Claude Code uses API tokens. The full 10-prompt build will likely cost a few dollars — check your Anthropic Console usage.
- **Don't paste secrets** (real DB passwords, AWS keys, SMTP passwords) into the chat. Put them in `.env` and tell Claude Code "use the value from .env".

## 7. When you finish Prompt 9

You'll have a deployable system:
- `make up` runs the whole thing locally
- `./infra/scripts/` deploys it to AWS
- The Lambda + EventBridge digest emails you new enquiries every morning

That's the MVP. Future improvements (Prompt 10, SEO, analytics) are optional.

## 8. Cost-saving option

If you'd rather not use Claude Code's API directly, you can also:

- Paste each prompt into **Claude.ai chat** (this interface) and have Claude write the files
- Use **Cursor** or **Windsurf** IDE with your Anthropic API key
- Use **claude.ai's Code Execution and File Creation** for individual files

But Claude Code is the fastest path because it can run commands, see errors, and self-correct without you copying things back and forth.
