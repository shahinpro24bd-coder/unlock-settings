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
- Keep the browser CMS adapter limited to the uploaded preview document; its session-only edits must never be presented as live authentication or live website saves.
- Verify editor credentials only in server routes using encrypted HTTP-only sessions; the preview adapter must not auto-authenticate visitors.
- Open the public home by default and keep public navigation separate from the authenticated *2.html editor copies.
- Host original uploaded media using asset-pointer URLs and keep editable legacy HTML/CSS/JS in public/website for the preview.
