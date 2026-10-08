<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Render the uploaded legacy website inside an isolated iframe at the index route to preserve its original CSS, scripts, and appearance without replacing TanStack Start.
- The legacy CMS adapter (public/website/preview-session.js) maps /api/public/cms/* calls to Lovable Cloud REST/RPC with the publishable key, so static hosts like Vercel need no server code or env keys.
- Verify editor credentials and session tokens only inside SECURITY DEFINER database functions; credential and session tables stay without client grants, and only cms_content is publicly readable.
- Open the public home by default and keep public navigation separate from the authenticated *2.html editor copies.
- Host original uploaded media using asset-pointer URLs and keep editable legacy HTML/CSS/JS in public/website for the preview.
- Preserve asset-pointer URLs on Vercel with an external rewrite to the verified public asset origin; Vercel does not provide the platform's asset-serving path itself.
- Derive the root favicon from the original website brand mark and remove the template favicon so browser tabs and direct favicon requests never use template branding.
