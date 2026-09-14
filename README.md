# Anna Poutanen — personal site

A plain, dark, single-page site. Live at
[anna-poutanen.github.io](https://anna-poutanen.github.io).

Two files, no build step, no JavaScript, no dependencies:

```
index.html   all the content
style.css    ~100 lines of styling
```

Edit the content directly in `index.html`. Colours and width live in the
`:root` block at the top of `style.css`.

To add a photo, put it in `images/` and uncomment the `<img class="photo">`
line at the top of the header in `index.html`.

Open `index.html` directly, or run `python3 -m http.server 8000` — note that
the simple server won't serve `404.html`, so deep links like
`localhost:8000/projects` only work once deployed.
